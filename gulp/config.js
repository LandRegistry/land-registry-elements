module.exports = {
  'applicationPath': './demo/demo',
  'sourcePath': './demo/demo/assets/src',
  'destinationPath': './demo/demo/assets/dist',
  'sassPath': 'scss/*.scss',
  'localhost': 'localhost:8080',
  'lintingPaths': false,
  'sassIncludePaths': [
    process.env.NODE_PATH,
    'node_modules'
  ],
}
