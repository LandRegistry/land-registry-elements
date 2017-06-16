@double-click-prevention
Feature: Double click prevention

Background:
  Given I am viewing the pattern library index page

Scenario: Clicking on a double click protected button
  Given I navigate to the double click prevention demo page
  When I click on a double click prevented button
  Then I am told to "Please wait"
  And the button is disabled
