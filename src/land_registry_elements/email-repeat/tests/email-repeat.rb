Given(/^I navigate to the email repeat demo page$/) do
  click_link('email-repeat/demo')
end

Given(/^I have not filled out the email field$/) do
  # Nothing to do
end

Then(/^I do not see an email repeat hint$/) do
  assert_no_selector('.email-hint', :text => 'Please ensure your email address is displayed correctly below')
  assert_no_selector('.email-hint', :text => @email)
end

Given(/^I have filled out the email field$/) do
  @email = 'foo@bar.com'
  fill_in('email', :with => @email)
end

When(/^I observe the repeated email$/) do
  # Nothing to do
end

Then(/^I see my email address as I typed it$/) do
  assert_selector('.email-hint', :text => 'Please ensure your email address is displayed correctly below')
  assert_selector('.email-hint', :text => @email)
end

When(/^I delete the email$/) do
  fill_in('email', :with => '')
end

When(/^I fill out the email field with another email$/) do
  @email = 'rawr@foo.com'
  fill_in('email', :with => @email)
end
