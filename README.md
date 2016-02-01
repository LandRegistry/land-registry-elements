# land-registry-elements
[![Build Status](https://travis-ci.org/LandRegistry/land-registry-elements.svg)](https://travis-ci.org/LandRegistry/land-registry-elements)

Initially this repo will comprise production ready HTML, CSS and JavaScript for the DRV beta. The eventual goal however is for this to be a central location for all tested, production ready UI patterns suitable for use in any public facing Land Registry products. It builds upon and extends the foundations set out in https://github.com/alphagov/govuk_elements as well as providing new UI patterns as required.

A demo is available at: [http://land-registry-elements.herokuapp.com/](http://land-registry-elements.herokuapp.com/)

## Roadmap:

### MVP
- Add in the rest of the base gov uk elements and ensure parity with the govuk version
- Build out any new elements from the DRV prototype
- Browserify setup for element JS if any is required (I think it will be)
- Assemble example pages for the pages in the DRV prototype
- Manual cross browser testing
- Concatenate stylesheet output?

### Technical debt
- Refactor server.js to reduce code duplication
  - Abstract out the template rendering (Most of the duplication lives here)
  - Split the server routes out into separeate files? (File has got too long...)

### Documentation
- Write usage guidelines
  - Add example of how to run the build from an external project without grunt
- Write contribution guidelines

### Nice to haves
- Fix build with npm3 (And get it tested alongside npm2 in TravisCI)
- JSHint in the test suite
- Automated visual regression testing
- Automated accessibility testing
- Write up results of user testing against any components where this has been carried out

### Possibles?
- Expose grunt plugin and write example for people wishing to pull the assets in via a Gruntfile?

## Usage

Usage notes to follow

A tarball of built out assets can be downloaded from [http://land-registry-elements.herokuapp.com/build](http://land-registry-elements.herokuapp.com/build)
(Note: This may take a moment to spin up if the heroku instance has gone to sleep)


## Contributing to this repository

Guidelines to follow
