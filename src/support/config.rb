require 'capybara/cucumber'
require 'capybara/poltergeist'
require 'rspec/expectations'

include Capybara::DSL

Capybara.default_driver = :poltergeist
Capybara.javascript_driver = :poltergeist
Capybara.default_max_wait_time = 15

Capybara.register_driver :poltergeist do |app|
    Capybara::Poltergeist::Driver.new(
      app,
      inspector: true,
      timeout: 240,
      js_errors: true,
      phantomjs_options: [
        '--ignore-ssl-errors=yes',
        '--local-to-remote-url-access=yes',
        '--ssl-protocol=any'
      ],
      extensions: [
        'src/support/poltergeist-extensions/clientside-form-validation-pubsub.js',
      ]
    )
end
