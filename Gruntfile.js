var clean_dist = require('./build/tasks/clean_dist');
var copy = require('./build/tasks/copy');
var sass = require('./build/tasks/sass');

module.exports = function(grunt) {

  require('time-grunt')(grunt);
  require('jit-grunt')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    watch: {
      scripts: {
        files: 'src/elements/**/*.scss',
        tasks: ['sass'],
        options: {
          interrupt: true,
        }
      }
    }
  });

  grunt.registerTask('clean_dist', function() {
    var done = this.async();
    clean_dist()
      .then(done)
      .catch(function(err) {
        console.log(err)
      });
  });

  grunt.registerTask('copy_govuk_assets', function() {
    var done = this.async();

    copy.govUkTemplateAssets()
      .then(copy.govUkToolkitAssets)
      .then(done)
      .catch(function(err) {
        console.log(err)
      });
  });

  grunt.registerTask('sass', function() {
    var done = this.async();
    sass()
      .then(done)
      .catch(function(err) {
        console.log(err)
      });
  });

  grunt.registerTask('server', function() {
    require('./build/server');
  });


  grunt.registerTask('build', ['clean_dist', 'copy_govuk_assets', 'sass']);

  grunt.registerTask('serve', ['build', 'server', 'watch']);

  grunt.registerTask('default', ['build']);

};
