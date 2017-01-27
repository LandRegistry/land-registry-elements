'use strict';

var extend = require('extend');

/**
 * PropertyMap
 */
function PropertyMap(element, config) {

  var options = {
    osmUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    leaflet: {
      continuousWorld: true,
      worldCopyJump: false,
      minZoom: 5,
      maxZoom: 19,

      // controls
      dragging: false,
      touchZoom: false,
      doubleClickZoom: false,
      scrollWheelZoom: false,
      boxZoom: false,
      keyboard: false,
      tap: false,
      zoomControl: true,
      attributionControl: true,
    },

    polygonOptions: {
      style: {
        fillcolor: 'blue',
        fillOpacity: 0.5,
        opacity: 0
      }
    },

    // Projection
    projection: {
      name: 'EPSG:27700',
      def: '+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +towgs84=370.396,-108.938,435.682,0,0,0,0 +units=m +no_defs',
      resolutions: [2500, 1000, 500, 200, 100, 50, 25, 10, 5, 2.5, 1],
      bounds: [
        [1300000,0],
        [700000,0]
      ]
    },

    polygon: false,
    marker: false
  };

  extend(options, config);

  // Private variables
  var map;

  /**
   * Set everything up
   */
  function create() {

    // Bail out if we don't have the proper element to act upon
    if (!element) {
      return;
    }

    new L.Proj.CRS(options.projection.name, options.projection.def,
      {
        resolutions: options.projection.resolutions,
        bounds: L.bounds.apply(null, options.projection.bounds)
      }
    );

    // set up the map
    map = new L.Map(element, options.leaflet);

    // create the tile layer with correct attribution
    var osm = new L.TileLayer(options.osmUrl, {
      attribution: options.attribution
    });
    map.addLayer(osm);

    //Add a scale control to the map
    L.control.scale().addTo(map);

    // Work out the bounds of the polygon
    var indexGeoJson = L.Proj.geoJson(options.data, options.polygonOptions);
    var bounds = indexGeoJson.getBounds();

    if (options.polygon) {
      indexGeoJson.addTo(map);
    }

    if (options.marker) {
      L.marker(bounds.getCenter()).addTo(map);
    }

    map.fitBounds(bounds, {
      maxZoom: 18,
      animate: false,
      padding: [10,10]
    });

  }

  /**
   * Tear everything down again
   */
  function destroy() {
  }

  var self = {
    create: create,
    destroy: destroy
  };

  return self;

}

module.exports = PropertyMap;
