$(function() {
	$("#map").css({
		height: $("body").height() * 0.9
	});

	L.mapbox.accessToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpbG10dnA3NzY3OTZ0dmtwejN2ZnUycjYifQ.1W5oTOnWXQ9R1w8u3Oo1yA';

	var map = L.mapbox.map('map', 'mapbox.dark').setView([38.05, -84.5], 12);

	var stations = [ { name: 'test', latlng: { lat: 55, lng: -3 } } ];

	var stationLayer = directions.map(function(pairRoute) {
		return {
			type: "Feature",
	        properties: {},
	        geometry: {
	            type: "LineString",
           		coordinates: [ # todo list of lng-lat points here]
           	}
        };
	});
	

	var libraries = {
	  type: 'FeatureCollection',
	  features: stations.map(function(station) {
	  	return { type: 'Feature', properties: { title: station.name }, geometry: { type: 'Point', coordinates: [station.latlng.lng, station.latlng.lat] } };
	  })
	};

	// Add marker color, symbol, and size to library GeoJSON
	for (var j = 0; j < libraries.features.length; j++) {
		libraries.features[j].properties['marker-color'] = '#4169E1';
		libraries.features[j].properties['marker-symbol'] = 'rail';
		libraries.features[j].properties['marker-size'] = 'small';
	}

	var libraryLayer = L.mapbox.featureLayer(libraries).addTo(map);
	map.fitBounds(libraryLayer.getBounds());
	map.on('click', function(e) { console.log("click ", e.latlng); });
});
