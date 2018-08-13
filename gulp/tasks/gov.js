const path = require('path')
const es = require('event-stream')
const filter = require('gulp-filter')

module.exports = (gulp, config) => {
  const govukTemplatePath = path.dirname(require.resolve('govuk-frontend/README.md'))

  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
  }

  gulp.task('copyGovTemplates', () => {
    // Blacklist some templates that contain nunjucks that cannot be automatically
    // ported to jinja at this time.
    const blacklistedTemplates = filter([
      '**',
      '!**/components/checkboxes/**',
      '!**/components/date-input/**',
      '!**/components/error-message/**',
      '!**/components/error-summary/**',
      '!**/components/fieldset/**',
      '!**/components/file-upload/**',
      '!**/components/input/**',
      '!**/components/radios/**',
      '!**/components/select/**',
      '!**/components/textarea/**',
    ])

    return gulp
      .src(path.join(govukTemplatePath, '**/*.njk'))
      .pipe(blacklistedTemplates)
      .pipe(es.map(function(file, cb) {
        var contents = file.contents.toString()

        // Rename file
        file.path = file.path.replace('.njk', '.html')

        // Simple conversions from nunjucks/js to jinja/python
        contents = contents.replace(/true/g, 'True')
        contents = contents.replace(/false/g, 'False')
        contents = contents.replace(/\.njk/g, '.html')

        // Quoting dict keys, because nunjucks doesn't require them but jinja does
        contents = contents.replace(/^([ ]*)([^ '"#\r\n:]+?)\s*:/gm, "$1'$2':")

        // Gov template uses .items, which is a reserved word in python
        contents = contents.replace(/\.items/g, "['items']")

        // No such thing as elseif - it's elif in Python
        contents = contents.replace(/elseif/g, "elif")

        // Python doesn't like inline ifs that don't have elses
        // See phase banner for example
        contents = contents.replace(/\b(.+) if \1(?! else)/g, "$1 if $1 else ''")

        // Concatenating loop index onto strings doesn't work implicitly in Python
        // Jinja has a specific operator for doing this
        contents = contents.replace(/\+ loop.index/, '~ loop.index')

        // Hardcoded replacements for deeply nested dict access, which requires
        // more protection in Python than it does in JS
        // replacements = {
        //   'params.hint.classes': '(params.hint.classes if params.hint and params.hint.classes)',
        //   'item.hint.text': '(item.hint.text if item.hint and item.hint.text)',
        //   'item.hint.html': '(item.hint.html if item.hint and item.hint.html)',
        //   'item.label.attributes': '(item.label.attributes if item.label and item.label.attributes)',
        //   "(' ' + item.label.classes if item.label.classes else '')": "(' ' + item.label.classes if item.classes and item.label.classes else '')"
        // }
        // Object.keys(replacements).forEach(key =>
        //   contents = contents.replace(new RegExp(escapeRegExp(key), 'g'), replacements[key])
        // )

        // Resolve paths to the templates as jinja does not support relative paths as nunjucks does
        contents = contents.replace(/\.\.\//g, 'app/vendor/.govuk-frontend/' + path.relative(govukTemplatePath, path.dirname(path.resolve(file.path, '..'))) + '/')
        contents = contents.replace(/\.\//g, 'app/vendor/.govuk-frontend/' + path.relative(govukTemplatePath, path.dirname(file.path)) + '/')

        file.contents = Buffer.from(contents, 'utf8')
        cb(null, file)
      }))

      .pipe(gulp.dest(path.join(config.applicationPath, 'templates/vendor/.govuk-frontend')))
    }
  )

  gulp.task('copyGovAssets', () =>
    gulp
      .src(path.join(govukTemplatePath, 'assets/**/*.*'))
      .pipe(gulp.dest(path.join(config.destinationPath, '.govuk-frontend')))
  )

  gulp.task(
    'copyGov',
    gulp.parallel([
      'copyGovTemplates',
      'copyGovAssets'
    ])
  )
}
