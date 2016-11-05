"use strict";

var stations = [
		{"station":"Wandle Park","lat":51.3734219,"lon":-0.1155658},
		{"station":"Elmers End","lat":51.3984742,"lon":-0.0515946},
		{"station":"Fieldway","lat":51.3509582,"lon":-0.0262749},
		{"station":"Beckenham Junction","lat":51.4107333,"lon":-0.0285587},
		{"station":"Harrington Road","lat":51.3996334,"lon":-0.0627092},
		{"station":"Lebanon Road","lat":51.3752033,"lon":-0.0871687},
		{"station":"Waddon Marsh","lat":51.3770833,"lon":-0.1201787},
		{"station":"Therapia Lane","lat":51.3856419,"lon":-0.1313166},
		{"station":"Blackhorse Lane","lat":51.3849368,"lon":-0.0725809},
		{"station":"East Croydon","lat":51.3750777,"lon":-0.0949256},
		{"station":"Phipps Bridge","lat":51.4033833,"lon":-0.1844787},
		{"station":"Belgrave Walk","lat":51.400991,"lon":-0.1806142},
		{"station":"Dundonald Road","lat":51.4176332,"lon":-0.2097854},
		{"station":"Beddington Lane","lat":51.3892433,"lon":-0.1443287},
		{"station":"Wellesley Road","lat":51.3755359,"lon":-0.0997158},
		{"station":"Morden Road","lat":51.4094153,"lon":-0.1946457},
		{"station":"Merton Park","lat":51.4137571,"lon":-0.2034423},
		{"station":"Beckenham Road","lat":51.4095777,"lon":-0.0453359},
		{"station":"Avenue Road","lat":51.4068033,"lon":-0.0516387},
		{"station":"Birkbeck","lat":51.4037633,"lon":-0.0579487},
		{"station":"Mitcham Junction","lat":51.3926081,"lon":-0.1595124},
		{"station":"Wimbledon","lat":51.4211698,"lon":-0.2080448},
		{"station":"New Addington","lat":51.342595,"lon":-0.0195626},
		{"station":"Arena","lat":51.3915446,"lon":-0.0603707},
		{"station":"George Street","lat":51.3739733,"lon":-0.1009087},
		{"station":"Addington Village","lat":51.3562009,"lon":-0.0350548},
		{"station":"Lloyd Park","lat":51.3641474,"lon":-0.08286},
		{"station":"Church Street","lat":51.3737133,"lon":-0.1065287},
		{"station":"Reeves Corner","lat":51.3749244,"lon":-0.1083972},
		{"station":"Gravel Hill","lat":51.3545433,"lon":-0.0453087},
		{"station":"Centrale","lat":51.3758227,"lon":-0.1059668},
		{"station":"Ampere Way","lat":51.3823545,"lon":-0.1259924},
		{"station":"Woodside","lat":51.3869323,"lon":-0.0677317},
		{"station":"King Henrys Drive","lat":51.3457683,"lon":-0.0231601},
		{"station":"Coombe Lane","lat":51.3597512,"lon":-0.0622878},
		{"station":"Sandilands","lat":51.3750233,"lon":-0.0802087},
		{"station":"Mitcham","lat":51.3974933,"lon":-0.1730587},
		{"station":"West Croydon","lat":51.3789745,"lon":-0.1038732},
		{"station":"Addiscombe","lat":51.3798767,"lon":-0.0754758}
	];

var map;
var tramLayer;

$(function() {
	$("#map").css({
		height: $("body").height() * 0.9
	});

	L.mapbox.accessToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpbG10dnA3NzY3OTZ0dmtwejN2ZnUycjYifQ.1W5oTOnWXQ9R1w8u3Oo1yA';

	map = L.mapbox.map('map', 'mapbox.dark').setView([38.05, -84.5], 12);

	

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
		process(lines);
	});
}


function process(lines) {
	let trams = {};
	let tramJourneyIndx = {};

	lines.forEach(line => {
		let attrs = line.split(",");
		let stopCode = attrs[1];
		let stopName = attrs[2].replace(/\'/g, "");
		let stopType = attrs[3];
		let time = attrs[4];
		let waitTime = attrs[5];
		let tramLine = attrs[6];
		let tramId = attrs[7];
		let peopleIn = attrs[8];
		let peopleOut = attrs[9];
		let peopleLoad = attrs[10];
		let percentSeatLoad = attrs[11];
		let percentLoad = attrs[12];
		//date,stopCode,stopName,stopType,time,waitTime,line,tramId,add,rem,load,seatLoadPercent,loadPercent,...
		//Date,Code,Stop,Stop Type,Time,R Length,Line,Tram,Ins,Outs,Load,Seat. load,%Load,I,V,P
		//console.log(time);

		let stopData = { time: time, stop: stopName, start: (stopType == 'A') };
		if (trams[tramId] == undefined) {
			trams[tramId] = [stopData];
		} else {
			trams[tramId].push(stopData);
		}
		
	});

	// console.log(Object.keys(trams).map(xKey => { let x = trams[xKey]; return x[x.length-1] }));
	var activeTrams = {};

	var tramLayerData = {
		type: 'FeatureCollection',
		features: [
			{
				type: "Feature",
			    properties: {
			    	title: 'Tram',
			    	'marker-color': "#E55",
			    	'marker-size': "small"
			    },
			    geometry: {
			        type: "Point",
			   		coordinates: [-0.1009668, 51.558227]
			   	}
			}
		]
	};

	tramLayer = L.mapbox.featureLayer(tramLayerData).addTo(map);

	tramLayerData.features.push(			{
				type: "Feature",
			    properties: {
			    	title: 'Tram2',
			    	'marker-color': "#E55",
			    	'marker-size': "small"
			    },
			    geometry: {
			        type: "Point",
			   		coordinates: [-0.1059668, 51.3758227]
			   	}
			});

	lines.forEach(line => {
		let attrs = line.split(",");
		let stopCode = attrs[1];
		let stopName = attrs[2].replace(/\'/g, "");
		let stopType = attrs[3];
		let time = attrs[4];
		let waitTime = attrs[5];
		let tramLine = attrs[6];
		let tramId = attrs[7];
		let peopleIn = attrs[8];
		let peopleOut = attrs[9];
		let peopleLoad = attrs[10];
		let percentSeatLoad = attrs[11];
		let percentLoad = attrs[12];

		if (activeTrams[tramId] == undefined) {
			// create tram
		} else {
			// update layer
		}

		tramJourneyIndx[tramId] = tramJourneyIndx[tramId] + 1 || 0;

	});

}


function isStopNameValid(name) {
	return (name != '* UNKNOWN *' && name != '*DEPOT*');
}

function timeToSeconds(formatedTime) {
	let s = formatedTime.split(":");
	let num = parseInt(s[0]) * 3600 + parseInt(s[1]) * 60 + parseInt[2];
	return num;
}


