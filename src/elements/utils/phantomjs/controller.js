var events = {
  fonts: false,
  leaflet: false
};


// Wait for webfonts to load
PubSub.subscribe('webfonts.active', function() {
  events.fonts = true;
});


// Poll to see if Leaflet maps have loaded yet
// This doesn't expose an event so we have to manually wait and hope
// If leaflet ever exposes an event this could be refactored and the tests
// sped up significantly
//
// Commented out as maps have been disabled in phantomjs due to problems
// with the visual regression tests
//
// var hasMap = (document.querySelectorAll('.map').length > 0);
// setTimeout(function() {
//   events.leaflet = true;
// }, (hasMap ? 10000 : 0))


// Wait for window load event
window.addEventListener('load', function() {

  // Poll to see whether things have loaded yet
  var poll = setInterval(function() {

    // If things haven't loaded yet, go round again
    if(!(events.fonts /*&& events.leaflet*/)) {
      return;
    }

    // Once things have loaded, stop polling
    clearInterval(poll);

    // And tell phantom to get on with it
    if (typeof window.callPhantom === 'function') {
      document.body.classList.add('phantom-js-test-rendering');
      window.callPhantom('takeShot');
    }

  }, 100);

});
