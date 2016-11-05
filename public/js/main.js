$(function() {
	$("#map").css({
		height: $("body").height() * 0.9
	});

	L.mapbox.accessToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpbG10dnA3NzY3OTZ0dmtwejN2ZnUycjYifQ.1W5oTOnWXQ9R1w8u3Oo1yA';

	var map = L.mapbox.map('map', 'mapbox.dark').setView([38.05, -84.5], 12);

	var libraries = {
	  type: 'FeatureCollection',
	  features: [
	    { type: 'Feature', properties: { Name: 'Village Branch', Address: '2185 Versailles Rd' }, geometry: { type: 'Point', coordinates: [-84.548369, 38.047876] } },
	    { type: 'Feature', properties: { Name: 'Northside Branch', ADDRESS: '1733 Russell Cave Rd' }, geometry: { type: 'Point', coordinates: [-84.47135, 38.079734] } },
	    { type: 'Feature', properties: { Name: 'Central Library', ADDRESS: '140 E Main St' }, geometry: { type: 'Point', coordinates: [-84.496894, 38.045459] } },
	    { type: 'Feature', properties: { Name: 'Beaumont Branch', Address: '3080 Fieldstone Way' }, geometry: { type: 'Point', coordinates: [-84.557948, 38.012502] } },
	    { type: 'Feature', properties: { Name: 'Tates Creek Branch', Address: '3628 Walden Dr' }, geometry: { type: 'Point', coordinates: [-84.498679, 37.979598] } },
	    { type: 'Feature', properties: { Name: 'Eagle Creek Branch', Address: '101 N Eagle Creek Dr' }, geometry: { type: 'Point', coordinates: [-84.442219, 37.999437] } }
	  ]
	};

	// Add marker color, symbol, and size to library GeoJSON
	for (var j = 0; j < libraries.features.length; j++) {
		libraries.features[j].properties['marker-color'] = '#4169E1';
		libraries.features[j].properties['marker-symbol'] = 'rail';
		libraries.features[j].properties['marker-size'] = 'small';
	}

	var libraryLayer = L.mapbox.featureLayer(libraries).addTo(map);
	map.fitBounds(libraryLayer.getBounds());
});
