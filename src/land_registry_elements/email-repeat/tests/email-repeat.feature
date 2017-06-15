@email-repeat
Feature: Email repeat

Background:
  Given I am viewing the pattern library index page
  And I navigate to the email repeat demo page

Scenario: Email repeat not displayed by default
  Given I have not filled out the email field
  Then I do not see an email repeat hint

Scenario: Email repeat
  Given I have filled out the email field
  When I observe the repeated email
  Then I see my email address as I typed it

Scenario: Email repeat with second email
  Given I have filled out the email field
  And I delete the email
  And I fill out the email field with another email
  When I observe the repeated email
  Then I see my email address as I typed it

Scenario: Email repeat - deleting email
  Given I have filled out the email field
  When I delete the email
  Then I do not see an email repeat hint
