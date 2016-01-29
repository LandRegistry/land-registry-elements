# land-registry-elements
[![Build Status](https://travis-ci.org/LandRegistry/land-registry-elements.svg)](https://travis-ci.org/LandRegistry/land-registry-elements)

Initially this repo will comprise production ready HTML, CSS and JavaScript for the DRV beta. The eventual goal however is for this to be a central location for all tested, production ready UI patterns suitable for use in any public facing Land Registry products. It builds upon and extends the foundations set out in https://github.com/alphagov/govuk_elements as well as providing new UI patterns as required.

A demo is available at: [http://land-registry-elements.herokuapp.com/](http://land-registry-elements.herokuapp.com/)

## Roadmap:

- TravisCI setup
- Check build with different versions of node using Travis (Potential for breakage with versions of node that come with npm3 - need to check this)
- Add in the rest of the base gov uk elements and ensure parity with the govuk version
- Browserify setup for element JS
- JSHint in the test suite
- Build out any new elements from the DRV prototype
- Assemble example pages for the pages in the DRV prototype
- Manual cross browser testing
- Automated visual regression testing
- Automated accessibility testing
- Automated HTML validation
- Write usage guidelines
  - Add example of how to run the build from an external project without grunt
- Write contribution guidelines
- Write up results of user testing against any components where this has been carried out

### Possibles?
- Expose grunt plugin and write example for people wishing to pull the assets in via a Gruntfile?

## Usage

Usage notes to follow

A tarball of built out assets can be downloaded from [http://land-registry-elements.herokuapp.com/build](http://land-registry-elements.herokuapp.com/build)
(Note: This may take a moment to spin up if the heroku instance has gone to sleep)


## Contributing to this repository

Guidelines to follow
