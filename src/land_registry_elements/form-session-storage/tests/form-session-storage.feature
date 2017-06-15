@form-session-storage
Feature: Email repeat

Background:
  Given I am viewing the pattern library index page

Scenario: Values transmitted from the set page to the get page
  Given I navigate to the form session storage (set) demo page
  And I have filled out the session storage set field
  When I continue to the form session storage (get) demo page
  Then I see the value in the session storage (get) field
  And I see the value in the session storage (get+set) field
  And I do not see the value in the standard field (no session storage)

Scenario: Values entered into the get + set field update the get field
  Given I navigate to the form session storage (get) demo page
  And I have filled out the session storage (get+set) field
  When I refresh the page
  Then I see the value in the session storage (get) field
  And I see the value in the session storage (get+set) field
  And I do not see the value in the standard field (no session storage)
