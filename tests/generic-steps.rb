Given(/^I am viewing the pattern library index page$/) do
  visit($APP_URL)
end

When(/^I refresh the page$/) do
  visit(current_url)
end
