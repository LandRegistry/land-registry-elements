@print-button
Feature: Print button

Background:
  Given I am viewing the pattern library index page

Scenario: Clicking the print button
  Given I navigate to the print button demo page
  When I click the print button
  Then the print method is called

