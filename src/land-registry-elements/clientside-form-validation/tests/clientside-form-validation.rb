When(/^I submit the form$/) do
  click_button('Submit')
end

Given(/^I navigate to the clientside form validation demo page$/) do
  click_link('clientside-form-validation/demo')
end

Given(/^I have not entered any information into the form$/) do
  # Nothing to do here...
end

Then(/^I am shown a list of form errors$/) do
  find('.error-summary li [data-target=full_name]', :text => 'Full name is required')
  find('.error-summary li [data-target=ni]', :text => 'National insurance number is required')
  find('.error-summary li [data-target=select_field]', :text => 'Please select an option')
  find('.error-summary li [data-target=checkbox]', :text => 'Please tick the box')
  find('.error-summary li [data-target=checkboxes_field]', :text => 'Please select an option')
  find('.error-summary li [data-target=radio_field]', :text => 'Please select an option')
  find('.error-summary li [data-target=password]', :text => 'Password is required')
  find('.error-summary li [data-target=password_retype]', :text => 'Please repeat your new password')
end

Given(/^I am subscribing to the clientside form validation pubsub messages$/) do
  script = <<-SCRIPT
            (function() {
              window.listOfErrorsForCucumberTests = []
              window.PubSub.subscribe("clientside-form-validation.invalid", function(msg, data) {
                window.listOfErrorsForCucumberTests = data.errors
              })
            })()
            SCRIPT

  execute_script(script)
end

Then(/^a pubsub event fires with a list of the form errors$/) do
  errors = evaluate_script('window.listOfErrorsForCucumberTests')

  expected_errors = [
    {"message"=>"Full name is required", "name"=>"full_name"},
    {"message"=>"National insurance number is required", "name"=>"ni"},
    {"message"=>"Please select an option", "name"=>"select_field"},
    {"message"=>"Please tick the box", "name"=>"checkbox"},
    {"message"=>"Please select an option", "name"=>"checkboxes_field"},
    {"message"=>"Please select an option", "name"=>"radio_field"},
    {"message"=>"Password is required", "name"=>"password"},
    {"message"=>"Please repeat your new password", "name"=>"password_retype"}
  ]

  expect(errors).to eq(expected_errors)
end

Given(/^I am focused on the first form field$/) do
  pending # Write code here that turns the phrase above into concrete actions
end

When(/^I focus away from the form$/) do
  pending # Write code here that turns the phrase above into concrete actions
end

Then(/^I am not shown any inline form errors$/) do
  pending # Write code here that turns the phrase above into concrete actions
end

Given(/^I enter text into the field, and delete it again$/) do
  pending # Write code here that turns the phrase above into concrete actions
end

When(/^I tab into the second form field$/) do
  pending # Write code here that turns the phrase above into concrete actions
end

Then(/^I am shown a required field message inline$/) do
  pending # Write code here that turns the phrase above into concrete actions
end

Then(/^a pubsub event fires with the single form error$/) do
  pending # Write code here that turns the phrase above into concrete actions
end

Given(/^I have entered a password$/) do
  pending # Write code here that turns the phrase above into concrete actions
end

Then(/^I the form submits$/) do
  pending # Write code here that turns the phrase above into concrete actions
end

Given(/^I enter a different password into the second box$/) do
  pending # Write code here that turns the phrase above into concrete actions
end

Then(/^I am informed that my passwords don't match$/) do
  pending # Write code here that turns the phrase above into concrete actions
end

When(/^I enter the same password into the second box$/) do
  pending # Write code here that turns the phrase above into concrete actions
end

Given(/^I have filled out the form$/) do
  pending # Write code here that turns the phrase above into concrete actions
end

Then(/^I am shown a server side error$/) do
  pending # Write code here that turns the phrase above into concrete actions
end

When(/^I empty out the first name field$/) do
  pending # Write code here that turns the phrase above into concrete actions
end

Then(/^I am shown a list of form errors including the server side error$/) do
  pending # Write code here that turns the phrase above into concrete actions
end

Then(/^the form submits$/) do
  pending # Write code here that turns the phrase above into concrete actions
end
