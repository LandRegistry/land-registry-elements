var clean_dist = require('./build/tasks/clean_dist');
var copy_govuk_template_assets = require('./build/tasks/copy_govuk_template_assets');
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
    clean_dist().then(done);
  });

  grunt.registerTask('copy_govuk_template_assets', function() {
    var done = this.async();
    copy_govuk_template_assets().then(done);
  });

  grunt.registerTask('sass', function() {
    var done = this.async();
    sass().then(done);
  });

  grunt.registerTask('server', function() {
    require('./build/server');
  });


  grunt.registerTask('build', ['clean_dist', 'copy_govuk_template_assets', 'sass']);

  grunt.registerTask('serve', ['build', 'server', 'watch']);

  grunt.registerTask('default', ['build']);

};
