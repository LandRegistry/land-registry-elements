@split-detail
Feature: Split detail

Background:
  Given I am viewing the pattern library index page
  And I navigate to the split detail demo page

Scenario: Text not visible inside the split detail element by default
  Given I have not opened the split detail element
  When I look for the text inside the split detail element
  Then I can't see the text inside the split detail element

Scenario: Text visible when opening the split detail
  Given I have not opened the split detail element
  When I click the split detail trigger
  Then I see the text inside the split detail element
