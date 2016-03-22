var yfm = require('yfm');
var yaml = require('js-yaml');
var glob = require('glob');
var path = require('path');
var fs = require('fs');
var DepGraph = require('dependency-graph').DepGraph;
var _ = require('lodash');
var pkg_up = require('pkg-up');

var cache = {
  getComponents: {
    expiry: 0
  },
  getComponentsTree: {
    expiry: 0
  }
};

/**
 * Function to return config and data for a single component
 * @param {String} component The component ID to fetch
 * @return {Promise} Promise which resolves with the component data
 */
function getComponent(componentId) {
  return new Promise(function(resolve, reject) {

    var componentPath = path.join(path.dirname(pkg_up.sync(__dirname)), 'src', componentId);

    var component = yaml.safeLoad(fs.readFileSync(path.join(componentPath, 'info.yaml'), 'utf8'));

    component.path = componentPath;

    component.id = componentId;

    if(fs.existsSync(path.join(componentPath, 'template.hbs'))) {
      component.template = fs.readFileSync(path.join(componentPath, 'template.hbs'), 'utf8');
    }

    var readmePath = path.join(componentPath, 'README.md');
    if(fs.existsSync(readmePath)) {
      component.readme = fs.readFileSync(readmePath, 'utf8');
    }

    component.variants = {};

    // Register component demo variants
    glob(path.join(componentPath, 'demos/*.hbs'), function(er, files) {
      files.forEach(function(demoFilename) {

        var variantHTML = fs.readFileSync(demoFilename, 'utf8');
        var variantData = yfm(variantHTML);

        var variantName = path.basename(demoFilename, path.extname(demoFilename));
        // variantName = variantName.replace('/', '-');

        component.variants[variantName] = {
          name: variantData.context.title ? variantData.context.title : variantName,
          href: '/components/' + component.id + '/' + variantName,
          content: variantData.content,
          context: variantData.context
        };
      });

      if(er) {
        reject(er);
      } else {
        resolve(component);
      }
    });
  });
}

/**
 * Function to return config and data for all enabled components
 * @param config Config object indicating which components to include in the build
 * @return {Promise} Promise which resolves with all the component data
 */
function getComponents(config) {

  if(typeof config === 'undefined') {
    config = {
      cache: true,
      components: true,
      moduleDir: '.'
    };
  }

  if(!config.cache || cache.getComponents.expiry < Date.now()) {

    return new Promise(function(resolve, reject) {
      glob(path.join(config.moduleDir, 'src/**/info.yaml'), function (er, files) {

        var queue = [];

        files.forEach(function(filename) {
          queue.push(getComponent(path.dirname(filename).replace(path.join(config.moduleDir, 'src/'), '')));
        });

        if(er) {
          reject(er);
        } else {
          Promise.all(queue)
            .then(function(components) {
              return filterComponents(components, config);
            })
            .then(function(components) {
              if(config.cache) {
                cache.getComponents.components = components;
                cache.getComponents.expiry = Date.now() + 5000;
              }

              return components;
            })
            .then(resolve)
            .catch(function(err) {
              reject(err);
            });
        }

      });
    });

  } else {

    return new Promise(function(resolve, reject) {
      resolve(cache.getComponents.components);
    });

  }
}

/**
 * Function to get a component's dependencies. Is called recursively
 * @return {Promise} Promise which resolves with the component data
 */
function resolveComponentDependencies(component, graph, components) {
  return new Promise(function(resolve, reject) {

    var promises = [];

    // Add dependencies
    if(component.dependencies) {
      component.dependencies.forEach(function(dependency) {

        // If the component depends on something that isn't yet in the
        // build then we need to add it
        if(!graph.hasNode(dependency)) {
          graph.addNode(dependency);

          promises.push(new Promise(function(resolve, reject) {
            getComponent(dependency)
              .then(function(component) {
                resolve(component);
              })
              .catch(function(err) {
                reject(err);
              });
          }));
        }

        graph.addDependency(component.id, dependency);
      })
    }

    Promise.all(promises)
      .then(function(deps) {
        var resolveDeps = [];

        deps.forEach(function(dep) {
          components.push(dep);
          resolveDeps.push(resolveComponentDependencies(dep, graph, components));
        });

        return Promise.all(resolveDeps);
      })
      .then(function() {
        resolve(components);
      })
      .catch(function(err) {
        reject(err);
      });
  });
}

/**
 * Function to filter components as requested in the config
 * @param config Config object indicating which components to include in the build
 * @return {Promise} Promise which resolves with all the component data
 */
function filterComponents(components, config) {
  return new Promise(function(resolve, reject) {

    var filteredComponents = components.filter(function(component) {

      // If the config says to blindly let every component through, then do so
      if(config.components === true) {
        return true;
      }

      return (config.components.indexOf(component.id) !== -1);
    });

    if(filteredComponents.length > 0) {
      resolve(filteredComponents);
    } else {
      reject(new Error('No components specified'));
    }
  });
}

/**
 * Function to return component config in dependency tree order
 * Useful for things like sass compilation
 * @param config Config object indicating which components to include in the build
 * @return {Promise} Promise which resolves with all the component data
 */
function getComponentsTree(config) {
  if(!config.cache || cache.getComponentsTree.expiry < Date.now()) {

    return new Promise(function(resolve, reject) {

      var graph = new DepGraph();

      getComponents(config)
        .then(function(components) {

          // Initial pass adding the components to the graph
          // Has to be done first as you can't add dependencies to components that
          // don't yet exist
          components.forEach(function(component) {
            graph.addNode(component.id);
          });

          return components;
        })
        .then(function(components) {
          var promises = [];

          components.forEach(function(component) {
            promises.push(resolveComponentDependencies(component, graph, components));
          });

          return Promise.all(promises);
        })
        .then(function(components) {
          var componentGraph = graph.overallOrder();

          console.log('Running build with', componentGraph);

          if(config.cache) {
            cache.getComponentsTree.components = componentGraph;
            cache.getComponentsTree.expiry = Date.now() + 5000;
          }

          resolve(componentGraph);
        })
        .catch(function(err) {
          reject(err);
        });
    });

  } else {

    return new Promise(function(resolve, reject) {
      resolve(cache.getComponentsTree.components);
    });
  }
}

function populateTree(componentsTree) {
  var promises = [];

  componentsTree.forEach(function(componentId) {
    promises.push(getComponent(componentId));
  });

  return Promise.all(promises);
}

module.exports = {
  getComponent: getComponent,
  getComponents: getComponents,
  getComponentsTree: getComponentsTree,
  populateTree: populateTree
};


