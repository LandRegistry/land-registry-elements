const path = require('path')

module.exports = (gulp, config) => {
  const govukTemplateJinjaPath = path.dirname(require.resolve('govuk_template_jinja/README.md'))
  const govukFrontendToolkitPath = path.dirname(require.resolve('govuk_frontend_toolkit/README.md'))
  const govukElementsSassPath = path.dirname(require.resolve('govuk-elements-sass/README.md'))

  gulp.task('copyGovTemplate', () =>
    gulp
      .src(path.join(govukTemplateJinjaPath, 'views/layouts/**'))
      .pipe(gulp.dest(path.join(config.applicationPath, 'templates/vendor')))
  )

  gulp.task('copyGovTemplateAssets', () =>
    gulp
      .src(path.join(govukTemplateJinjaPath, 'assets/**'))
      .pipe(gulp.dest(config.destinationPath))
  )

  gulp.task('copyGovToolkitImages', () =>
    gulp
      .src(path.join(govukFrontendToolkitPath, 'images/**'))
      .pipe(gulp.dest(path.join(config.destinationPath, 'images')))
  )

  gulp.task('copyGovElements', () =>
    gulp
      .src([
        path.join(govukElementsSassPath, 'public/sass/**'),
        path.join(govukFrontendToolkitPath, 'stylesheets/**')
      ])
      .pipe(
        gulp.dest(path.join(config.sourcePath, 'scss/vendor/govuk-elements'))
      )
  )

  gulp.task(
    'copyGov',
    gulp.parallel([
      'copyGovTemplate',
      'copyGovTemplateAssets',
      'copyGovElements',
      'copyGovToolkitImages'
    ])
  )
}
