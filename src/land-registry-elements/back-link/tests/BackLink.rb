Given(/^I am viewing the pattern library index page$/) do
  visit('http://localhost:9900')
end

When(/^I navigate to the back link demo page$/) do
  click_link('back-link/demo')
end

When(/^I click the history based back link$/) do
  find('[data-back-link]').click
end

Then(/^I am taken back to the pattern library index page$/) do
  assert_text('Land Registry Elements: Index')
end
