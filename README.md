# land-registry-elements
[![Build Status](https://travis-ci.org/LandRegistry/land-registry-elements.svg)](https://travis-ci.org/LandRegistry/land-registry-elements)

Initially this repo will comprise production ready HTML, CSS and JavaScript for the DRV beta. The wider goal however is for this to be a central location for all tested, production ready UI patterns suitable for use in any public facing Land Registry products. It builds upon and extends the foundations set out in https://github.com/alphagov/govuk_elements as well as providing new UI patterns as required.

A demo is available at: [http://land-registry-elements.herokuapp.com/](http://land-registry-elements.herokuapp.com/)
(Note: This may take a moment to spin up if the heroku instance has gone to sleep)

## If you want to:
* Get some assets for your application - head to the [Usage](#usage) section of this document.
* Contribute new UI components to this library - read the [project goals](#goals) and then head to the [contributing to this repository](#contributing-to-this-repository) section.

--------------------------------------------------------------------------------

## Goals
Why does this repository exist?

### To encourage re-use
Too often, projects reinvent UI patterns in similar yet inconsistent ways. By locating these patterns in a central location we aim to encourage re-use and consistency across Land Registry applications.

### To encourage modularity
The patterns in this library are built in a modular way such that including a pattern in your application should not change the rendering of other patterns. Future development should adhere to this principle (See [Visual regression tests](#visual-regression-tests))

### To engender confidence
The patterns in this library have been cross browser tested (As per the [Browser support](#browser-support) section and in many cases have been through user testing (For example, as part of the DRV user testing). This library should be seen as a trustworthy source of CSS and JS for use in your application.

--------------------------------------------------------------------------------

## Usage

The Land Registry elements repository is a "Living style guide". This means that it should be seen as the central reference point for your application's frontend assets. There are a range of ways you can achieve this (very approximately in order of difficulty):

### Via Grunt.js
Example to follow

### Via Gulp.js
Example to follow

### As a Node.JS module
Example to follow

### Make a GET request to the pattern library application
By ticking the components you require on the index page, you will be provided with a URL to which you can make a GET request in your applications build pipeline. You can manually download a build (Using the buttons on the homepage) and commit it to your repository if necessary but you are encouraged to automate this wherever possible. See [Running the pattern library](#running-the-pattern-library) for more information on running the pattern library yourself. Alternatively you can make GET requests to the heroku demo directly but this is perhaps not recommended as it adds a dependency on an external service to your build script.

### Bypass the pattern library's build scripts entirely!
The pattern library comes with a set of build scripts that will build out CSS and JS from the component folders in the repository by working out what is required based on the dependencies of each component (See [Defining a component](#defining-a-component) for more details). However if this is too prescriptive for your needs then you can sidestep this. At the end of the day, the patterns are simply defined as SCSS files on disk - you can simply `@import` them into your application's SCSS file if this better suits your needs. The caveat is that you would need to define the custom importers as found in the sass render module at [build/tasks/sass.js](build/tasks/sass.js) (As documented at [https://github.com/sass/node-sass#importer--v200---experimental](https://github.com/sass/node-sass#importer--v200---experimental)). These are required in order to fetch the govuk sass files from the `node_modules` folder. This option is potentially more complex than the other options so should probably be considered as a last resort - It is listed as an option for completeness and to clarify that the build scripts in this repository are _complementary to_ and not _necessary for_ the UI patterns contained herein.

--------------------------------------------------------------------------------

## Running the pattern library
The pattern library can be started with the command `npm start`. This will start a webserver running on `localhost:3000` where you can view the pattern library. You can then make GET requests to `localhost:3000/build` as per the [instructions here](make-a-get-request-to-the-pattern-library-application)

### Requirements
* Node.js 4.x
(_Note: Node.JS 5 is currently not supported due to issues with the way the `node_modules` folder is structured in npm 3_)

### Requirements to run the test suite
* [mocha](https://www.npmjs.com/package/mocha), installed globally
* [GraphicsMagick](http://www.graphicsmagick.org/)

--------------------------------------------------------------------------------

## Contributing to this repository

In order to work on the pattern library it is recommended that you install nodemon (`npm install -g nodemon`) and use the command `npm run dev` to run the application instead of `npm start`. This will watch for changes to .scss and .js etc and re-run the build immediately instead of requiring you to manually restart the server constantly.

### Guidelines to follow
When building new UI components you should always bear the [goals](#goals) in mind such that new work is as reusable, stable and modular as possible.

### Where are all the things?
The directory structure of the pattern library is as follows:

* `/.tmp`
Used by the build scripts as a temporary place to write things to disk.
* `/build`
Contains all the build scripts and the development server. Most work on new components should not need to alter this folder
* `/src`
The main folder containing component's and their stylesheets, JavaScript etc. **This is the main folder in which most work on new components should take place**
* `/test`
Contains the main test suite. Components should not specify tests in here but should instead specify them in the component's folder. See "[defining new tests](#defining-new-tests)" for more details

### Defining a new component

### Tests
#### Running the test suite
#### Defining new tests
#### Visual regression tests


--------------------------------------------------------------------------------

## Roadmap:

### Doing
- Slim down typography demos etc.
### MVP

- Do I need to build the login form?
- What things can we update on webseal
  - Can I ship my clientside validation?
  - Can we edit 403 pages etc?
- Investigate whether we can expose our assets using sass-eyeglass (https://github.com/sass-eyeglass/eyeglass)

### Questions
- The h1 on the search results page is also the form label. Is this ok?!

### Issues
- HTML prettifier is breaking the typography demo markup by inserting extra spaces?

### Test phase 2
- Manual cross browser testing (Browserstack)
- Fixing anything from the above ^

### Documentation
- Write usage guidelines
  - Add example of how to include the assets in an application
    - with grunt
    - with gulp
    - as a node module
    - via a get request
- Write contribution guidelines
- Fully document the structure of a component folder and info.yaml

--------------------------------------------------------------------------------

### Non MVP todos
- Investigate why webshot sometimes outputs minor variations and git thinks they've changed (PNG headers?)
- When ticking components on the homepage, output the necessary URL to generate the build to make it easier for users who are using the pattern library via GET requests
- Testplan generator? I.e. take a list of pages and browsers and put together a list for you to complete
- Concat and minify stylesheet output
- Is there a simpler way we can expose the build output for people to include in their application's sass. I.e. so that any mixins from the gov uk stuff is included in the application rather than just the built out css.
- Visual regression testing at mobile breakpoints
- Fix build with npm3 (And get it tested alongside npm2 in TravisCI)
- Make sure any pattern documentation is in README.md files and not in the demos
- Write more comprehensive test suite for the clientside validation checking that it matches the spec set out by gov uk
- Browsersync
- Exclude image assets that are not referenced in the css to keep the build output clean
- Write up results of user testing against any components where this has been carried out
- Convert CSS to BEM?
- Split out gov uk JS and include it into the core component with browserify?
- Migrate to nunjucks (Super low importance)

--------------------------------------------------------------------------------

## Browser support
Browser support based on https://www.gov.uk/service-manual/user-centred-design/browsers-and-devices.html

Two distinct levels of support are given and denoted next to each browser: ‘compliant’ or ‘functional’. Compliant means that the service should look as good in this browser as in other modern browsers. Functional means that while it might not look perfect the service is still usable. In both cases the user should be able to access the information they need or complete their service.

### Desktop devices

| Operating system | Browser                           | Support level  |
| ---------------- | --------------------------------- | -------------- |
| Windows          | Internet Explorer 7               | Functional     |
|                  | Internet Explorer 8+              | Compliant      |
|                  | Edge (latest version)             | Compliant      |
|                  | Google Chrome (latest version)    | Compliant      |
|                  | Mozilla Firefox (latest version)  | Compliant      |
| Mac              | OS X  Safari 8+                   | Compliant      |
|                  | Google Chrome (latest version)    | Compliant      |
|                  | Mozilla Firefox (latest version)  | Compliant      |

### Small screen devices

| Operating system  | Version           | Support    |
| ----------------- | ----------------- | ---------- |
| iOS 7+            | Mobile Safari     | Compliant  |
| Android 2.3.x     | Android Browser   | Functional |
| Android 4.x       | Google Chrome     | Compliant  |
|                   | Android Browser   | Compliant  |
| Windows Phone 8.1 | Internet Explorer | Compliant  |
