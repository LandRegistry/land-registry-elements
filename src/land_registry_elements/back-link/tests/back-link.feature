@back-link
Feature: JavaScript enabled backlinks

Scenario: Back link
  Given I am viewing the pattern library index page
  When I navigate to the back link demo page
  And I click the history based back link
  Then I am taken back to the pattern library index page
