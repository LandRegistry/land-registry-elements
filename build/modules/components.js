var yfm = require('yfm');
var yaml = require('js-yaml');
var glob = require('glob');
var path = require('path');
var fs = require('fs');
var DepGraph = require('dependency-graph').DepGraph;

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
function getComponent(componentPath) {
  return new Promise(function(resolve, reject) {

    var component = yaml.safeLoad(fs.readFileSync(path.join(componentPath, 'info.yaml'), 'utf8'));

    component.path = componentPath;

    component.id = componentPath.replace('src/', '');

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
        reject(er)
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

  if(cache.getComponents.expiry < Date.now()) {

    if(typeof config === 'undefined') {
      config = {
        components: true
      };
    }

    return new Promise(function(resolve, reject) {
      glob('src/**/info.yaml', function (er, files) {

        var queue = [];

        files.forEach(function(filename) {
          queue.push(getComponent(path.dirname(filename)));
        });

        if(er) {
          reject(er);
        } else {
          Promise.all(queue)
            .then(function(components) {
              return filterComponents(components, config);
            })
            .then(function(components) {
              // console.log(components);
              cache.getComponents.components = components;
              cache.getComponents.expiry = Date.now() + 5000;
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
 * Function to filter components as requested in the config
 * @param config Config object indicating which components to include in the build
 * @return {Promise} Promise which resolves with all the component data
 */
function filterComponents(components, config) {
  return new Promise(function(resolve, reject) {

    // Loop backwards because we're splicing items out of the array
    var filteredComponents = components.filter(function(component) {

      // If the config says to blindly let every component through, then do so
      if(config.components === true) {
        return true;
      }

      // If a component's category isn't specified, exclude the entire thing
      if(typeof config.components[component.categories.primary] === 'undefined') {
        return false;
      }

      // If the component's entire primary category is included, let it through
      if(config.components[component.categories.primary] === true) {
        return true;
      }

      // Else if more detailed config is given, check the secondary category
      if(config.components[component.categories.primary][component.categories.secondary] === true) {
        return true;
      }

      // If we've fallen through to here, the component has not been specified in the build, so we nuke it
      return false;
    });

    if(filterComponents.length > 0) {
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
  if(cache.getComponentsTree.expiry < Date.now()) {

    return new Promise(function(resolve, reject) {

      getComponents(config)
        .then(function(components) {
          var graph = new DepGraph();

          // Initial pass adding the components to the graph
          // Has to be done first as you can't add dependencies to components that
          // don't yet exist
          components.forEach(function(component) {
            graph.addNode(component.id);
          });

          // Add dependencies
          components.forEach(function(component) {
            if(component.dependencies) {
              component.dependencies.forEach(function(dependency) {
                graph.addDependency(component.id, dependency);
              })
            }
          });

          cache.getComponentsTree.components = graph.overallOrder();
          cache.getComponentsTree.expiry = Date.now() + 5000;

          resolve(cache.getComponentsTree.components);
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

module.exports = {
  getComponent: getComponent,
  getComponents: getComponents,
  getComponentsTree: getComponentsTree
};


