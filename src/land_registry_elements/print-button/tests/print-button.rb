Given(/^I navigate to the print button demo page$/) do
  click_link('print-button/demo')
  execute_script('window.hasThePagePrintedYet = false')
end

When(/^I click the print button$/) do

  execute_script('window.print = function() { window.hasThePagePrintedYet = true }')

  first('button', :text => 'Print this page').click
end

Then(/^the print method is called$/) do
  expect(evaluate_script('window.hasThePagePrintedYet')).to be true
end
