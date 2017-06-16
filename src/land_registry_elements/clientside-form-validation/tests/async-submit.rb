Given(/^I navigate to the clientside form validation async submit demo page$/) do
  click_link('clientside-form-validation/async-submit')
end

Given(/^I have filled out the async submit form$/) do
  fill_in('Full name', :with => 'Foo')
end

Then(/^I am asked to wait while the form submits$/) do
  assert_text('Waiting for async thing', :count => 5)
end

Then(/^the form eventually submits$/) do
  # Once the page reloads after submitting, all the async messages will have gone
  assert_no_selector('p', :text => 'Waiting for async thing')
end
