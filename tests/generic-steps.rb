Given(/^I am viewing the pattern library index page$/) do
  visit('http://localhost:9900')
end

When(/^I refresh the page$/) do
  visit(current_url)
end
