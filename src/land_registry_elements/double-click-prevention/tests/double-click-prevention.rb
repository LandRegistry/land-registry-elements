Given(/^I navigate to the double click prevention demo page$/) do
  click_link('double-click-prevention/demo')
end

When(/^I click on a double click prevented button$/) do
  fill_in('foo', :with => 'Hello')
  @button = find(:css, '#button-1')
  @button.click
end

Then(/^I am told to "Please wait"$/) do
  expect(@button[:value]).to eq('Please wait…')
end

Then(/^the button is disabled$/) do
  expect(@button[:disabled]).to eq(true)
end
