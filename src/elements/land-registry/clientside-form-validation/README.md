Clientside form validation logic provided by https://validatejs.org/

**Note: This is _not_ a substitute for server side form validation which should be implemented following these guidelines: [Errors and validation](/components/elements/govuk/forms/errors)**

Rules can be supplied to the validator following the pattern on the validate.js documentation. The validation rules should be defined as JSON within a `<script type="application/json" id="example_form_validation">` element and the `<form>` tag itself should be linked to this script tag with the `data-clientside-validation="example_form_validation"` (Note how the value of this attribute matches the ID of the JSON script tag)

`validate` is exposed as a global so custom validators can be added as per [https://validatejs.org/#custom-validator](https://validatejs.org/#custom-validator) if required. These can then be referenced in your form's validation config.
