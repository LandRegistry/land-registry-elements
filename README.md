# land-registry-elements
[![Build Status](https://travis-ci.org/LandRegistry/land-registry-elements.svg)](https://travis-ci.org/LandRegistry/land-registry-elements)

Initially this repo will comprise production ready HTML, CSS and JavaScript for the DRV beta. The eventual goal however is for this to be a central location for all tested, production ready UI patterns suitable for use in any public facing Land Registry products. It builds upon and extends the foundations set out in https://github.com/alphagov/govuk_elements as well as providing new UI patterns as required.

A demo is available at: [http://land-registry-elements.herokuapp.com/](http://land-registry-elements.herokuapp.com/)

## Roadmap:

### Doing
- Build download button should build to a different folder!

### MVP
- Minify JS output
  - browserify-incremental necessitates the use of full paths in the built output - really we need to suppress this for all but the local build
- Concat and minify stylesheet output
- Favicons / apple touch icons etc
- Split out LeafletJS into a different bundle as it's huge and we don't need it on every page.
- Review ARIA roles

### Questions and issues
- When using form validation with no error summaries such as the consumer rights act tickbox - where does the keyboard focus go to? Gov uk slack suggests having a visually hidden error summary that screenreaders will read?
- What is our browser support?
- Colour contrast tests are failing on gov uk elements (Phase banner and highlight box). I have modified the colours so that they no longer fail - check this with a designer and see what they think? Andy Porter?
- There is a constrained width applied to `.vat-receipt` so that it doesn't stretch too wide on phablets - is this a more general pattern?

### Test phase
- Review latest version of prototype and make sure we're up to date. Draw a line under it here! This will be what we put on prod (Aside from minor tweaks etc)
- Manual cross browser testing (Browserstack)
- Fixing anything from the above ^

### Documentation
- Write usage guidelines
  - Add example of how to include the assets in an application
- Write contribution guidelines

--------------------------------------------------------------------------------

### Non MVP todos
- Configurable build
  - Exclude examples css from the relevant builds
  - Download configurable build via GET parameters
  - Form to select components and pipe into above build?
- Make the visual regression testing less punishing to contributors - need to ensure we strike the right balance and don't put up barriers to contributing
- Visual regression testing at mobile breakpoints
- HTML beautfication for those that might view source
- Fix build with npm3 (And get it tested alongside npm2 in TravisCI)
- per component tests in each component's folder
- Get basics like breadcrumbs and main element into a parent template
- Make sure any pattern documentation is in README.md files and not in the demos
- Test suite for the clientside validation checking that it matches the spec set out by gov uk
- Thumbnail renderings on the index page?
- Consider pulling out the template from the govuk_template_mustache module instead of using it verbatim thereby allowing us to clean it up a little, and split the pieces like the footer out into partials.
- Browsersync
- Exclude image assets that are not referenced in the css to keep the build output clean
- http://eslint.org/ and https://www.npmjs.com/package/eslint-plugin-cross-browser-compatibility-check
- Write up results of user testing against any components where this has been carried out
- Convert CSS to BEM?
- Split out gov uk JS and include it into the core component with browserify?
- Migrate to nunjucks (Super low importance)

--------------------------------------------------------------------------------

## Usage

Usage notes to follow

A tarball of built out assets can be downloaded from [http://land-registry-elements.herokuapp.com/build](http://land-registry-elements.herokuapp.com/build)
(Note: This may take a moment to spin up if the heroku instance has gone to sleep)

## Contributing to this repository

Guidelines to follow
Document use of nodemon for development
