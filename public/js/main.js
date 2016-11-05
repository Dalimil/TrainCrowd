"use strict";

$(function() {
	$("#map").css({
		height: $("body").height() * 0.9
	});

	L.mapbox.accessToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpbG10dnA3NzY3OTZ0dmtwejN2ZnUycjYifQ.1W5oTOnWXQ9R1w8u3Oo1yA';

	var map = L.mapbox.map('map', 'mapbox.dark').setView([38.05, -84.5], 12);

	var stations = [
		{"station":"Wandle Park","lat":51.3734186,"lon":-0.1133771},
		{"station":"Elmers End","lat":51.398893,"lon":-0.0434499},
		{"station":"Fieldway","lat":51.3509582,"lon":-0.0262749},
		{"station":"Beckenham Junction","lat":51.4109587,"lon":-0.0258908},
		{"station":"Harrington Road","lat":51.4940189,"lon":-0.1767215},
		{"station":"Lebanon Road","lat":51.3752033,"lon":-0.0871687},
		{"station":"Waddon Marsh","lat":51.37708,"lon":-0.11799},
		{"station":"Therapia Lane","lat":51.3851641,"lon":-0.1341829},
		{"station":"Blackhorse Lane","lat":51.593055,"lon":-0.0400472},
		{"station":"East Croydon","lat":51.3765523,"lon":-0.0929099},
		{"station":"Phipps Bridge","lat":51.4064584,"lon":-0.1827476},
		{"station":"Belgrave Walk","lat":51.4026649,"lon":-0.1772746},
		{"station":"Dundonald Road","lat":51.4163199,"lon":-0.2098365},
		{"station":"Beddington Lane","lat":51.389338,"lon":-0.1418383},
		{"station":"Wellesley Road","lat":51.3782262,"lon":-0.0995079},
		{"station":"Morden Road","lat":51.3993886,"lon":-0.1796978},
		{"station":"Merton Park","lat":51.411406,"lon":-0.2080169},
		{"station":"Beckenham Road","lat":51.4111647,"lon":-0.047949},
		{"station":"Avenue Road","lat":51.4068033,"lon":-0.0516387},
		{"station":"Birkbeck","lat":51.521975,"lon":-0.130462},
		{"station":"Mitcham Junction","lat":51.39295,"lon":-0.1577299},
		{"station":"Wimbledon","lat":51.4183388,"lon":-0.2206288},
		{"station":"New Addington","lat":51.348184,"lon":-0.017094},
		{"station":"Arena","lat":51.3915446,"lon":-0.0603707},
		{"station":"George Street","lat":51.3739733,"lon":-0.1009087},
		{"station":"Addington Village","lat":51.3585601,"lon":-0.0306037},
		{"station":"Lloyd Park","lat":51.5933743,"lon":-0.0218867},
		{"station":"Church Street","lat":51.3737133,"lon":-0.1065287},
		{"station":"Reeves Corner","lat":51.3738297,"lon":-0.1062489},
		{"station":"Gravel Hill","lat":51.5979054,"lon":-0.1988057},
		{"station":"Centrale","lat":51.3758227,"lon":-0.1059668},
		{"station":"Ampere Way","lat":51.381979,"lon":-0.123944},
		{"station":"Woodside","lat":51.3869323,"lon":-0.0677317},
		{"station":"King Henrys Drive","lat":51.3413903,"lon":-0.0053078},
		{"station":"Coombe Lane","lat":51.4115798,"lon":-0.2405578},
		{"station":"Sandilands","lat":51.3750233,"lon":-0.0802087},
		{"station":"Mitcham","lat":51.402869,"lon":-0.166709},
		{"station":"West Croydon","lat":51.378391,"lon":-0.1049599},
		{"station":"Addiscombe","lat":51.3750731,"lon":-0.0765217}
	];

	var routeLayerData = {
		type: 'FeatureCollection',
		features: Object.keys(directions).map(function(pairRouteKey) {
			var pairRoute = directions[pairRouteKey].directions;
			//console.log(pairRoute);
			var coordinates = pairRoute.map(function(step) {
	   			return [step.from.lng, step.from.lat];
	   		});
	   		coordinates.push([pairRoute[pairRoute.length-1].to.lng, pairRoute[pairRoute.length-1].to.lat]);

			return {
				type: "Feature",
			    properties: {},
			    geometry: {
			        type: "LineString",
			   		coordinates: coordinates
			   	}
			};
		})
	};


	var libraries = {
	  type: 'FeatureCollection',
	  features: stations.map(function(station) {
	  	return { type: 'Feature', properties: { title: station.station }, geometry: { type: 'Point', coordinates: [station.lon, station.lat] } };
	  })
	};

	// Add marker color, symbol, and size to library GeoJSON
	for (var j = 0; j < libraries.features.length; j++) {
		libraries.features[j].properties['marker-color'] = '#4169E1';
		libraries.features[j].properties['marker-symbol'] = 'rail';
		libraries.features[j].properties['marker-size'] = 'small';
	}

	window.libraryLayer = L.mapbox.featureLayer(libraries).addTo(map);
	var stationRouteLayer = L.mapbox.featureLayer(routeLayerData, {}).addTo(map); //  style: { color: '#555' } 

	console.log(stationRouteLayer);

	map.fitBounds(stationRouteLayer.getBounds());
	map.on('click', function(e) { console.log("click ", e.latlng); });


});


function startAnimation() {
	$.get("static/js/tfl-p6-sep-data.csv", function(data) {
		var lines = data.split("\n");
		console.log(data.substr(0, 10));
	});
}