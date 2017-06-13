Given(/^I navigate to the split detail demo page$/) do
  click_link('split-detail/demo')
end

Given(/^I have not opened the split detail element$/) do
  # Don't do anything!
end

When(/^I look for the text inside the split detail element$/) do
  # This test is weird :-/
end

Then(/^I can't see the text inside the split detail element$/) do
  assert_no_text('This text is inside the split detail contents')
end

When(/^I click the split detail trigger$/) do
  click_link("What's this?")
end

Then(/^I see the text inside the split detail element$/) do
  assert_text('This text is inside the split detail contents')
end
