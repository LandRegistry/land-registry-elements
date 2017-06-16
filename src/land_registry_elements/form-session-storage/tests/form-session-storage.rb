Given(/^I navigate to the form session storage \(set\) demo page$/) do
  click_link('form-session-storage/set')
end

When(/^I navigate to the form session storage \(get\) demo page$/) do
  click_link('form-session-storage/get')
end

Given(/^I have filled out the session storage set field$/) do
  @value = 'Setting a value'
  fill_in('set', :with => @value)
end

Given(/^I have filled out the session storage \(get\+set\) field$/) do
  @value = 'Setting another value'
  fill_in('get-set', :with => @value)
end

Then(/^I see the value in the session storage \(get\) field$/) do
  field = find('#get')
  expect(field.value).to eq(@value)
end

Then(/^I see the value in the session storage \(get\+set\) field$/) do
  field = find('#get-set')
  expect(field.value).to eq(@value)
end

Then(/^I do not see the value in the standard field \(no session storage\)$/) do
  field = find('#not-a-getter')
  expect(field.value).not_to eq(@value)
end

When(/^I continue to the form session storage \(get\) demo page$/) do
  click_link('getting')
end


