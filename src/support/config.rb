require 'capybara/cucumber'
require 'capybara/poltergeist'
require 'rspec/expectations'

include Capybara::DSL

Capybara.default_driver = :poltergeist
Capybara.javascript_driver = :poltergeist
Capybara.default_max_wait_time = 15
