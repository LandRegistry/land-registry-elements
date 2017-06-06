document.addEventListener('DOMContentLoaded', function() {

  window.listOfErrorsForCucumberTests = []
  window.PubSub.subscribe("clientside-form-validation.invalid", function(msg, data) {
    window.listOfErrorsForCucumberTests = data.errors
  })

  window.listOfIndividualErrorsForCucumberTests = []
  window.PubSub.subscribe("clientside-form-validation.error", function(msg, data) {
    window.listOfIndividualErrorsForCucumberTests.push(data.error)
  })

});
