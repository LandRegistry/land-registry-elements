$init_script_run = false

Before do |scenario|
  unless $init_script_run
    $init_script_run = true

    FileUtils.rm_rf(Dir.glob('test-screenshots/*'))
  end
end

After do |scenario|
  if scenario.failed?
    p "Scenario failed, screenshot generated."
    time = Time.now.strftime('%Y_%m_%d_%H_%M_%S_')
    name_of_scenario = time + scenario.name.gsub(/\s+/, "_").gsub("/","_")
    save_screenshot("test-screenshots/#{name_of_scenario}.png", full: true)
  end
end
