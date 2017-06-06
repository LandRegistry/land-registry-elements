@clientside-form-validation
Feature: Clientside form validation

Background:
  Given I am viewing the pattern library index page
  And I navigate to the clientside form validation demo page

Scenario: Submitting an empty form
  Given I have not entered any information into the form
  When I submit the form
  Then I am shown a list of form errors
  And a pubsub event fires with a list of the form errors

Scenario: No inline form validation when blurring a clean field
  Given I am focused on the first form field
  When I focus away from the form
  Then I am not shown any inline form errors

Scenario: Inline form validation when blurring a dirty field
  Given I am focused on the first form field
  And I enter text into the field, and delete it again
  When I tab into the second form field
  Then I am shown a required field message inline
  And a pubsub event fires with the single form error

Scenario: Password fields validation - matching
  Given I have entered a password
  And I enter the same password into the second box
  When I submit the form
  Then I the form submits

Scenario: Password fields validation - not matching
  Given I have entered a password
  And I enter a different password into the second box
  When I focus away from the form
  Then I am informed that my passwords don't match
  When I enter the same password into the second box
  And I submit the form
  Then I the form submits
