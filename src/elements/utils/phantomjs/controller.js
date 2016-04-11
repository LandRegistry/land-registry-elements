// Hook into the PhantomJS test runner and instruct it to take a screenshot on load
// If PhantomJS isn't present this will have no effect
if (typeof window.callPhantom === 'function') {
  window.addEventListener('load', function() {
    // Poll to establish whether webfonts have loaded yet
    var count = 0;

    var poll = setInterval(function() {
      count++;

      if(document.documentElement.classList.contains('wf-loading') && count < 100) {
        return;
      }

      clearInterval(poll);

      // Wait for things like Leaflet to load if they're present
      var hasMap = (document.querySelectorAll('.map').length > 0);

      setTimeout(function() {
        window.callPhantom('takeShot');
      }, (hasMap ? 10000 : 0))

    }, 100);
  });
}
