# land-registry-elements
[![Build Status](https://travis-ci.org/LandRegistry/land-registry-elements.svg)](https://travis-ci.org/LandRegistry/land-registry-elements)

Initially this repo will comprise production ready HTML, CSS and JavaScript for the DRV beta. The eventual goal however is for this to be a central location for all tested, production ready UI patterns suitable for use in any public facing Land Registry products. It builds upon and extends the foundations set out in https://github.com/alphagov/govuk_elements as well as providing new UI patterns as required.

A demo is available at: [http://land-registry-elements.herokuapp.com/](http://land-registry-elements.herokuapp.com/)

## Roadmap:

### MVP
- Add in the rest of the base gov uk elements and ensure parity with the govuk version
- Configurable build
  - Exclude examples css from the relevant builds
  - Download configurable build via GET parameters
  - Form to select components and pipe into above build?
- Build out any new elements from the DRV prototype
- Assemble example pages for the pages in the DRV prototype
- Manual cross browser testing
- Concatenate stylesheet output?
- Get http://pa11y.org/ into the travis build
- Migrate to nunjucks
- Cache component generation
- Pre compile list of testing urls
- Cookie message

### Misc todos
- Make sure any pattern documentation is in README.md files and not in the demos

### Patterns to build
- LeafletJS map?
- 404, 403 etc error pages

### Govuk patterns to document
- .panel-indent
- Crumbtrail
- Populated footer

### Issues
- Investigate why grunt serve's sass task doesnt work properly
- Sort out what each build contains (config-wise)
- Additional gov.uk examples need building out (Assuming we want to replicate the whole thing - or do we just link through to the real one?)
- Now that pages are first class components, we need a way of separating them out on the index page
- Sort out indentation of code snippets (See )

### Considerations
- There is a constrained width applied to `.vat-receipt` so that it doesn't stretch too wide on phablets - is this a more general pattern?
- Browser support?
- Use of jQuery?
- Do we really need to replicate the gov uk pattern demos? Maybe they should just be simplified versions of them, and link to the original for the advice - thereby avoiding maintenance for us
- Note to self - make sure map gets printed in right column of summary page (As it does on the proto by virtue of a hack)
- Make sure build can cope if you specify a build with a component excluded but another component then depends upon it
- Colour contrast tests are failing on gov uk elements (Phase banner and highlight box). What do we do about this, if anything?

### Technical debt
- The gov uk base template doesn't include the <main id="content" role="main"> element - would be nice to include this at our end so that we don't need to repeat it in every demo
- Abstract out the renderPage.js code into a template file

### Documentation
- Write usage guidelines
  - Add example of how to run the build from an external project without grunt
- Write contribution guidelines

### Nice to haves
- Exclude image assets that are not referenced in the css to keep the build output clean
- Fix build with npm3 (And get it tested alongside npm2 in TravisCI)
- http://eslint.org/ and https://www.npmjs.com/package/eslint-plugin-cross-browser-compatibility-check
- Automated visual regression testing
- Automated accessibility testing
- Write up results of user testing against any components where this has been carried out
- Find the sticky sidebar pattern and include it?
- Any other gov uk patterns we'd like to include?

### Possibles?
- Expose grunt plugin and write example for people wishing to pull the assets in via a Gruntfile?

## Usage

Usage notes to follow

A tarball of built out assets can be downloaded from [http://land-registry-elements.herokuapp.com/build](http://land-registry-elements.herokuapp.com/build)
(Note: This may take a moment to spin up if the heroku instance has gone to sleep)

## Contributing to this repository


Guidelines to follow
