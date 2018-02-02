# land-registry-elements
[![Build Status](https://travis-ci.org/LandRegistry/land-registry-elements.svg?branch=master)](https://travis-ci.org/LandRegistry/land-registry-elements)

Land Registry Elements is a central repository of production-ready and tested UI components (Both in the cross-browser sense, but also with users). It builds upon and extends the foundations set out in https://github.com/alphagov/govuk_elements as well as providing new UI patterns as required.

A demo is available at: [http://land-registry-elements.herokuapp.com/](http://land-registry-elements.herokuapp.com/)
(Note: This may take a moment to spin up if the heroku instance has gone to sleep)

It can be installed into your application in order to provide the necessary CSS and JS to build the components from the library. In addition, Python applications can use the Jinja2 templates to easily render the correct HTML for each component.

-------------------------------------------------------------------------------

## Usage

The Land Registry elements repository is a "Living style guide". This means that it should be seen as the central reference point for your application's frontend assets. It is directly installed as an application dependency rather than merely being a supplementary piece of documentation.

For Land Registry developers, please see the `gadget-govuk-ui` reference application for an example of an application consuming `govuk-elements` and `land-registry-elements` to provide both CSS/JS as well as Jinja2 templates.

### Integrating the SCSS/JS into your application

The [land-registry-elements-examples](https://github.com/LandRegistry/land-registry-elements-examples) repository contains a minimal example of how to build the assets. This uses [https://github.com/LandRegistry/land-registry-gulp-tasks](land-registry-gulp-tasks) to compile the CSS and JS.

### Integrating the Jinja2 templates into your application

Firstly, install land registry elements as a dependency using a URL in the following form:

`https://github.com/LandRegistry/land-registry-elements/archive/v2.1.1.zip`

In order to use these templates, you need to configure your Flask app to load templates from sources other than your app. This is done with the following snippet:

```
app.jinja_loader = PrefixLoader({
    'app': PackageLoader('your_main_frontend_app_here'),
    'land_registry_elements': PackageLoader('land_registry_elements'),
})
```

This will mean that templates from your main app will now be available on the `app` prefix. For example, `{% extends "layout.html" %}` would have to become `{% extends "app/layout.html" %}`. Templates from this repository would be used like `{% from 'land_registry_elements/address/template.html' import address_simple %}`


--------------------------------------------------------------------------------

### Running the pattern library demos
The pattern library is a Python/Flask app. In order to run the demos you will need Python 3.x. To run it, simply execute `run.sh`

### Running the test suite
The test suite is written in Ruby and uses Cucumber + Capybara. It is run on every commit and every pull request by TravisCI. It is not possible to merge pull requests without a passing test suite.

It can be run locally by executing `run_tests.sh`

--------------------------------------------------------------------------------

## Contributing to this repository

### Where are all the things?
The directory structure of the pattern library is as follows:

- `/demo` - This directory contains a Python/Flask application used to demo the components
- `/fragments` - Contains a docker compose fragment.
- `/node_modules` - Node.JS modules installation directory. This should not be committed into the repository
- `/src/incubation_area` - Contains components that are under development and should not be used in your application without careful consideration. If you do, please investigate _why_ the component is in this folder and whether it could be promoted to a trusted component.
- `/src/land_registry_elements` - The main folder where components live.
- `/src/utils` - For anything that doesn't fit what might be considered a "component". For example, browser polyfills.
- `/tests` - Supporting files for the test suite.

### CSS authoring guidelines

CSS (And the corresponding HTML classes) should follow a BEM structure (See https://css-tricks.com/bem-101/ for a primer). TL;DR - BEM is a CSS naming convention designed to "encourage" modularity and avoid the pitfalls of working on CSS at scale caused by the naturally "global" nature of everything in CSS.

### JavaScript authoring guidelines

JavaScript is linted using StandardJS which is intentionally unconfigurable. It is gaining wide adoption, including in GDS which allows us to ensure we are writing JavaScript in a style similar to others.

Modules should be written in ES6 module format unless they themselves need to depend on CommonJS libraries, in which case CommonJS format is acceptable. ES6 is the preferred format however - the concession to CommonJS is due to a limitation of module bundlers not allowing us to write ES6 modules which depend on CommonJS.

### Tests

All components that include JavaScript functionality should include tests. Components that are only HTML and/or CSS do not need a test suite.

Tests are written using Gherkin / Cucumber / Capybara. It is not for this documention to explain how this is done, apart from the following regarding structure:

The `/tests` folder contains global supporting files for Capybara and Cucumber. The actual `.feature` and step definition files live alongside the component's code in folders such as `/src/land_registry_elements/back-link/tests`. This allows us to get the full benefit of the Gherkin syntax - namely that it helps us to document the behaviour of the component in-situ.

--------------------------------------------------------------------------------

## Browser support
Browser support based on https://www.gov.uk/service-manual/user-centred-design/browsers-and-devices.html
