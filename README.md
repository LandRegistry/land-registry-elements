# land-registry-elements
[![Build Status](https://travis-ci.org/LandRegistry/land-registry-elements.svg?branch=master)](https://travis-ci.org/LandRegistry/land-registry-elements)

Initially this repo will comprise production ready HTML, CSS and JavaScript for the Find property information beta. The wider goal however is for this to be a central location for all tested, production ready UI patterns suitable for use in any public facing Land Registry products. It builds upon and extends the foundations set out in https://github.com/alphagov/govuk_elements as well as providing new UI patterns as required.

A demo is available at: [http://land-registry-elements.herokuapp.com/](http://land-registry-elements.herokuapp.com/)
(Note: This may take a moment to spin up if the heroku instance has gone to sleep)

## I want to

### Get some CSS & JS for my application
* Head to the [Usage](#usage) section

### Contribute new components to this library
* Read the [project goals](#goals)
* Read [contributing to this repository](#contributing-to-this-repository)

--------------------------------------------------------------------------------

## Goals
Why does this repository exist?

### To encourage re-use
Too often, projects reinvent UI patterns in similar yet inconsistent ways. By locating these patterns in a central location we aim to encourage re-use and consistency across Land Registry applications.

### To encourage modularity
The patterns in this library are built in a modular way such that including a pattern in your application should not change the rendering of other patterns. Future development should adhere to this principle (See [Visual regression tests](#visual-regression-tests))

### To engender confidence
The patterns in this library have been cross browser tested (As per the [Browser support](#browser-support) section and in many cases have been through user testing (For example, as part of the Find property information user testing). This library should be seen as a trustworthy source of CSS and JS for use in your application.

--------------------------------------------------------------------------------

## Usage

The Land Registry elements repository is a "Living style guide". This means that it should be seen as the central reference point for your application's frontend assets. There are a range of ways you can achieve this and these are all documented in the [land-registry-elements-examples](https://github.com/LandRegistry/land-registry-elements-examples) repository.

--------------------------------------------------------------------------------

## Running the pattern library
The pattern library can be started with the command `npm start`. (Make sure to navigate to the folder where you have checked out this repository and `npm install` first) This will start a webserver running on `localhost:3000` where you can view the pattern library.

### Requirements
* Node.js 6.x (If you currently use Node.js 4 for gov uk things, using a version manager such as [nvm](https://github.com/creationix/nvm) would be recommended to easily switch between versions)

### Requirements to run the test suite
* [mocha](https://www.npmjs.com/package/mocha), installed globally
* [GraphicsMagick](http://www.graphicsmagick.org/)

--------------------------------------------------------------------------------

## Contributing to this repository

In order to work on the pattern library it is recommended that you install supervisor (`npm install -g supervisor`) and use the command `npm run dev` to run the application instead of `npm start`. This will watch for changes to .scss and .js etc and re-run the build immediately instead of requiring you to manually restart the server constantly. You may also wish to develop locally rather than in a vagrant box so that rebuilds occur more quickly.

### Guidelines to follow
When building new UI components you should always bear the [goals](#goals) in mind such that new work is as reusable, stable and modular as possible.

### Where are all the things?
The directory structure of the pattern library is as follows:

* `/.tmp`
Used by the build scripts as a temporary place to write things to disk.
* `/build`
Contains all the build scripts and the development server. Most work on new components should not need to alter this folder
* `/src`
The main folder containing components and their stylesheets, JavaScript etc. **This is the main folder in which most work on new components should take place**
* `/test`
Contains the main test suite. Components should not specify tests in here but should instead specify them in the component's folder. See "[defining new tests](#defining-new-tests)" for more details

### Defining a new component

A component's machine name is defined by the path relative to the `src` directory, for example the form validation component's machine name is `elements/land-registry/clientside-form-validation`

There are a few base files which come together to make up a component. These are as follows:

#### `info.yaml`
This file defines various pieces of information about the component. Without this file the component will not be available to include in a build. The following "worst case" info.yaml documents the available configuration options:

```
name: My component

# These categories are only used to group the component on the index page.
# They are required, but do not affect the built output
categories:
  primary: Land registry
  secondary: Utilities

# Use dependencies to indicate which components should also be included in a build
# alongside this one. Amongst other things this is used to automatically
# construct the SASS @import statements
dependencies:
  - elements/govuk/core
  - elements/land-registry/teaser-register
  - elements/land-registry/language-switcher

# This is an array of directory copy operations which can be useful for copying
# assets from the component's directory into the output folder. For example, the
# favicon component contains a folder of images which it copies to the dist folder
# It is important to note that the `from` folder is relative to the component
# and the `to` folder is relative to the build output folder.
copy:
  -
    from: 'images'
    to: 'assets/images'
  -
    from: '../../../../node_modules/leaflet/dist/images'
    to: 'assets/images/leaflet'

# This option allows any JavaScript defined by this component to be built to a
# separate output bundle. For example, the LeafletJS component exports a very
# large JavaScript file which should only be included on pages that absolutely
# require it. Therefore it is useful to split it out into a separate bundle.
# If this is not defined, the component's JS will be lumped into the main bundle.
js-bundle: my-js-bundle
```

#### `style.scss`
This is the main stylesheet entry point for the component. It will be automatically included in the built output. You can `@import` and suchlike from within this file if you need to split your component's css across multiple files. (Although if you have that much css in a single component you might consider whether it truly is a single component or whether it should be split up!)

#### `controller.js`
Similarly to style.scss, this is the main entry point for JavaScript. Any JS written in this file will get included in the built output. JavaScript is built using Browserify so these files are crucially _not_ executed in the global scope. (I.e. variables declared here will not be available on the `Window`). This file should be kept lightweight and devoid of logic. Logic and behaviour should be encapsulated in separate files and `require()`d as a CommonJS module (just like Node.JS). The controller's job is then to simply apply these modules to DOM elements. The [back link](src/elements/land-registry/back-link) component is a simple example of this (Observe the split between `controller.js` and `BackLink.js`). The idea is to split up your code into reusable chunks / modules and to avoid "spaghetti" code.

#### `README.md`
This should be used for any component specific documentation. It can be rendered on the component's demo pages (See below) as `{{#markdown}}{{component.readme}}{{/markdown}}`.

#### `build.js`
If a component defines this file it will be run at build time and can be used to perform any build tasks that are unique to this component. For example, performing weird and wonderful copy operations.

#### `template.hbs`
This is a handlebars file which represents the canonical rendering for the component. It is available in handlebars as `{{> elements/land-registry/my-component }}` (I.e. using the full machine name). Data can be applied to it using the handlebars `{{#with}}` block helpers in the demo

#### `demos/*.hbs`
All handlebars files in this directory will be rendered as demos on the index page. If no demos are defined, the component will not appear on the index page (Although it will still be available to be used a a dependency in other components).

Each demo should define some yaml frontmatter as follows:

```
---
title: Title of your demo here
---
```

This title will be used on the index page as the title of the demo. Additional frontmatter can be added to this block and used by the demo. For example:

```
---
title: Simple frontmatter demo
foo:
  -
    my-value: Foo
  -
    my-value: Bar
  -
    my-value: Wibble
---

{{#each foo}}
  {{> elements/land-registry/my-component }}
{{#each}}
```

And then in you component's `template.hbs` you might render out `{{my-value}}`. This particular example would render 3 variants of your component with each of the values.

#### `tests/*.js`
Any `.js` files in this directory will be included in the `npm test` script and run by TravisCI. This should be used to test anything component specific rather than putting your tests in the main tests folder in the root.

See [clientside-validation](elements/land-registry/clientside-validation/tests/clientside-validation.js) for an example of a component specific test.

### Tests
To run the test suite, type `npm test` on the command line. In order to do so, you will need to `npm install -g mocha eslint`

Tests are run with [mocha](http://mochajs.org/). Some useful available modules include:
* [should.js](https://github.com/tj/should.js)
* [superagent](https://github.com/visionmedia/superagent)
* [supertest](https://github.com/visionmedia/supertest)
* [webdriverio](https://github.com/webdriverio/webdriverio) and [selenium-standalone](https://github.com/vvo/selenium-standalone)

#### Defining new tests
New tests can be defined by adding a new file to the `/tests` directory or to the `tests` directory in your component.

#### Visual regression tests

Visual regression tests are built into the TravisCI pipeline such that if work on a pull request changes the rendering of any existing pages then Travis will exist with a failure. If this happens you can review the diff renderings in `tests/fixtures/visual-regression/diff-renderings` and investigate what differences may have occured.

It is worth noting that when creating new pages, the absence of a reference rendering will cause the tests to fail!

Either way, when updating existing components, or adding new components, you will need to download the updated reference renderings from the S3 bucket.

*IMPORTANT*: After you have updated the reference renderings and committed the results, you should review the changes in the diff display of your github pull request. It would be all too easy to simply update the reference renderings with breaking changes to existing components and simply ignore them - monitoring these renderings requires a human element!


--------------------------------------------------------------------------------

## Todos

- Consider use of alert role to announce client side validation errors https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_alert_role
- Aria roles on the split detail component


--------------------------------------------------------------------------------

## Browser support
Browser support based on https://www.gov.uk/service-manual/user-centred-design/browsers-and-devices.html

Two distinct levels of support are given and denoted next to each browser: ‘compliant’ or ‘functional’. Compliant means that the service should look as good in this browser as in other modern browsers. Functional means that while it might not look perfect the service is still usable. In both cases the user should be able to access the information they need or complete their journey.

### Desktop devices

| Operating system | Browser                           | Support level  |
| ---------------- | --------------------------------- | -------------- |
| Windows          | Internet Explorer 8               | Functional     |
|                  | Internet Explorer 9+              | Compliant      |
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
