require 'capybara/cucumber'
require 'capybara/poltergeist'

include Capybara::DSL

Capybara.default_driver = :poltergeist
Capybara.javascript_driver = :poltergeist
