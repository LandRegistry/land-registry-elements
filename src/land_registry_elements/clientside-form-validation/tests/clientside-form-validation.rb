When(/^I submit the form$/) do
  click_button('Submit')
end

Given(/^I navigate to the clientside form validation demo page$/) do
  click_link('clientside-form-validation/demo')
end

Given(/^I have not entered any information into the form$/) do
  @expected_errors = [
    {"message"=>"Full name is required", "name"=>"full_name"},
    {"message"=>"National insurance number is required", "name"=>"ni"},
    {"message"=>"Please select an option", "name"=>"select_field"},
    {"message"=>"Please tick the box", "name"=>"checkbox"},
    {"message"=>"Please select an option", "name"=>"checkboxes_field"},
    {"message"=>"Please select an option", "name"=>"radio_field"},
    {"message"=>"Password is required", "name"=>"password"},
    {"message"=>"Please repeat your new password", "name"=>"password_retype"}
  ]
end

Then(/^I am shown a list of form errors$/) do
  @expected_errors.each do |error|
    find('.error-summary li', :text => error['message'], :minimum => 1)
  end

  errors = []

  begin
    Timeout.timeout(Capybara.default_max_wait_time) do
      loop do
        errors = evaluate_script('window.listOfErrorsForCucumberTests')
        break if errors == @expected_errors
      end
    end
  rescue Timeout::Error => e
    fail "Clientside form validation Pubsub message not found. Expected #{errors} to equal #{@expected_errors}"
  end
end

Then(/^I am shown a list of form errors linking to their respective fields$/) do
  @expected_errors.each do |error|
    find(".error-summary li [data-target='#{error['name']}']", :text => error['message'])
  end

  errors = []

  begin
    Timeout.timeout(Capybara.default_max_wait_time) do
      loop do
        errors = evaluate_script('window.listOfErrorsForCucumberTests')
        break if errors == @expected_errors
      end
    end
  rescue Timeout::Error => e
    fail "Clientside form validation Pubsub message not found. Expected #{errors} to equal #{@expected_errors}"
  end
end

Given(/^I am focused on the first form field$/) do
  find_field('full_name').trigger('focus')
end

When(/^I focus away from the form$/) do
  find('body').trigger('focus')
end

Then(/^I am not shown any form errors$/) do
  assert_no_selector('.error-message')
  assert_no_selector('.form-group-error')
end

Given(/^I enter text into the field, and delete it again$/) do
  fill_in('full_name', :with => 'Hello')
  fill_in('full_name', :with => '')
end

When(/^I tab into the second form field$/) do
  find_field('ni').trigger('focus')
end

Then(/^I am shown a required field message inline$/) do
  assert_text('Full name is required')

  errors = []
  expected_errors = [
    {"message"=>"Full name is required", "name"=>"full_name"}
  ]

  begin
    Timeout.timeout(Capybara.default_max_wait_time) do
      loop do
        errors = evaluate_script('window.listOfIndividualErrorsForCucumberTests')
        break if errors == expected_errors
      end
    end
  rescue Timeout::Error => e
    fail 'Clientside form validation Pubsub message not found'
  end
end

Given(/^I have entered a password$/) do
  fill_in('password', :with => 'password12')
end

Given(/^I enter a different password into the second box$/) do
  fill_in('password_retype', :with => 'password13')
end

Then(/^I am informed that my passwords don't match$/) do
  assert_selector('.error-message', :text => 'Please ensure both password fields match')
end

When(/^I enter the same password into the second box$/) do
  fill_in('password_retype', :with => 'password12')
end

Given(/^I have filled out the form$/) do
  fill_in('Full name', :with => 'John Smith')
  fill_in('National Insurance number', :with => 'National insurance number')
  select('One', :from => 'select_field')
  find('label[for="checkbox"]').click
  find('label[for="checkboxes_field-0"]').click
  find('label[for="radio_field-1"]').click
  fill_in('Create a password', :with => 'password12')
  fill_in('Re-type your password', :with => 'password12')
end

Given(/^I have entered my name incorrectly$/) do
  fill_in('Full name', :with => 'Rawr')
end

Then(/^I am shown a server side error$/) do
  assert_selector('.error-summary li', :text => 'Example serverside error - type "John Smith" into this field to suppress it')

  expected_errors = [
    {"message"=>"Example serverside error - type \"John Smith\" into this field to suppress it", "name"=>"serverside"}
  ]

  errors = []

  begin
    Timeout.timeout(Capybara.default_max_wait_time) do
      loop do
        errors = evaluate_script('window.listOfIndividualErrorsForCucumberTests')
        break if errors == expected_errors
      end
    end
  rescue Timeout::Error => e
    fail "Clientside form validation Pubsub message not found. Expected #{errors} to equal #{expected_errors}"
  end
end

When(/^I empty out the first name field$/) do
  fill_in('full_name', :with => '')

  @expected_errors = [
    {"message"=>"Full name is required", "name"=>"full_name"},
    {"message"=>"Password is required", "name"=>"password"},
    {"message"=>"Please repeat your new password", "name"=>"password_retype"}
  ]
end

Then(/^the form submits$/) do
  assert_text('Success!')
end

When(/^I click on the full name error message$/) do
  find('a[data-target="full_name"]').trigger('click')
end

Then(/^the full name field receives focus$/) do
  expect(page.evaluate_script('document.activeElement.id')).to eq('full_name')
end
