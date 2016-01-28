var glob = require('glob');
var path = require('path');
var fs = require('fs');
var yfm = require('yfm');

/**
 * Helper function to get the pages
 * @return {Promise} Promise which resolves with the array of pages
 */
function getPages() {
  return new Promise(function(resolve, reject) {
    var pages = {};

    glob('src/pages/**/info.yaml', function (er, files) {
      files.forEach(function(filename) {
        var name =  path.dirname(path.relative('src/pages', filename));

        var pageHTML = fs.readFileSync(path.join(path.dirname(filename), 'template.hbs'), 'utf8');
        var pageData = yfm(pageHTML);

        pages[name]  = {
          name: pageData.context.title ? pageData.context.title : name,
          href: '/page/' + name,
          content: pageData.content,
          context: pageData.context
        };
      });

      if(er) {
        reject(er);
      } else {
        resolve(pages);
      }

    });
  });
}

module.exports = {
  getPages: getPages
}
