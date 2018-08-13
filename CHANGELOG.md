# Changelog

## Unreleased

Breaking changes:

- Updating to new govuk design system

  Moving across to the new single govuk-frontend repository instead of the old kits

  To migrate you need to: 
    - Update your markup to use the new govuk spacing classes. The spacing component in land-registry-elements has been removed.
    - Switch to the gov back link if you were using the one from here (Which has been removed)
    - $landregistry-elements-images-path sass variable added
    - `lre-` class prefix added to namespace components in the same way as `gov-` is used in the new design system.
    - Print button has been removed. Bring the styles into your service if you need to continue using it.

  ([PR #152](https://github.com/LandRegistry/land-registry-elements/pull/152))
