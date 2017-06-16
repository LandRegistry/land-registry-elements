@clientside-form-validation
@clientside-form-validation-async-submit
Feature: Clientside form validation - async submit

Background:
  Given I am viewing the pattern library index page
  And I navigate to the clientside form validation async submit demo page

Scenario: Submitting an empty form
  Given I have filled out the async submit form
  When I submit the form
  Then I am asked to wait while the form submits
  And the form eventually submits
