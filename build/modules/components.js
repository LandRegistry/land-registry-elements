var yfm = require('yfm');
var yaml = require('js-yaml');
var glob = require('glob');
var path = require('path');
var fs = require('fs');
var DepGraph = require('dependency-graph').DepGraph;

/**
 * Function to return config and data for a single component
 * @param {String} component The component ID to fetch
 * @return {Promise} Promise which resolves with the component data
 */
function getComponent(name) {
  return new Promise(function(resolve, reject) {

    var componentPath = path.join('src/elements', name);

    var component = yaml.safeLoad(fs.readFileSync(path.join(componentPath, 'info.yaml'), 'utf8'));

    component.id = name;

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

        component.variants[variantName] = {
          name: variantData.context.title ? variantData.context.title : variantName,
          href: '/components/' + name + '/' + variantName,
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
 * @return {Promise} Promise which resolves with all the component data
 */
function getComponents() {
  return new Promise(function(resolve, reject) {
    glob('src/elements/**/info.yaml', function (er, files) {

      var queue = [];

      files.forEach(function(filename) {
        var name = path.dirname(path.relative('src/elements', filename));
        queue.push(getComponent(name));
      });

      if(er) {
        reject(er)
      } else {
        Promise.all(queue).then(resolve);
      }

    });
  });
}

/**
 * Function to return component config in dependency tree order
 * Useful for things like sass compilation
 * @return {Promise} Promise which resolves with all the component data
 */
function getComponentsTree() {
  return new Promise(function(resolve, reject) {

    getComponents()
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

        resolve(graph.overallOrder());
      })
      .catch(function(e) {
        reject(e);
      });
  });
}

module.exports = {
  getComponent: getComponent,
  getComponents: getComponents,
  getComponentsTree: getComponentsTree
};


