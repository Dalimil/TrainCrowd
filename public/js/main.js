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

var stationsIndex = {};
stations.forEach(station => {
	stationsIndex[station.station] = { lat: station.lat, lng: station.lon };
});

var map;
var tramLayer;
var $legend;
var ik = {
    className: 'my-icon icon-dc', // class name to style
    html: '&#9733;', // add content inside the marker
    iconSize: null // size of icon, use null to set the size in CSS
  };

$(function() {
	$("#map").css({
		height: $("body").height() * 1.0
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
		//libraries.features[j].properties['marker-color'] = '#4169E1';
		//libraries.features[j].properties['marker-symbol'] = 'rail';
		//libraries.features[j].properties['marker-size'] = 'small';
	}



	var libraryLayer = L.mapbox.featureLayer(libraries).addTo(map);
	//var stationRouteLayer = L.mapbox.featureLayer(routeLayerData, {}).addTo(map); //  style: { color: '#555' } 

	libraryLayer.on('layeradd', function(e) {
	  var marker = e.layer,
	    feature = marker.feature;
	  marker.setIcon(L.divIcon(ik));
	});
	libraryLayer.setGeoJSON(libraries);

	//console.log(stationRouteLayer);

	map.fitBounds(libraryLayer.getBounds());
	map.on('click', function(e) { console.log("click ", e.latlng); });

	startAnimation();

});


function startAnimation() {
	$.get("static/js/tfl-p6-sep-data.csv", function(data) {
		lines = data.split("\n");
		console.log(data.substr(0, 10));
		process();
	});
}

let lines;
let trams = {};
let tramJourneyIndx = {};
let activeTrams = {};
let tramLayerData;
let currentLineIndex = 0;
let animationInterval;

function process() {

	lines.forEach(line => {
		let attrs = line.split(",");
		let stopCode = attrs[1];
		let stopName = attrs[2].replace(/\'/g, "");
		let stopType = attrs[3];
		let time = timeToSeconds(attrs[4]);
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

	tramLayerData = {
		type: 'FeatureCollection',
		features: [	]
	};

	tramLayer = L.mapbox.featureLayer(tramLayerData).addTo(map);

	var legendControl = L.mapbox.legendControl();
	legendControl.addLegend('<div class="legend"></div>');
	map.addControl(legendControl);

	animationInterval = setInterval(tick, 170);
	$legend = $(".legend");

}

let redrawTime;
let currentTime;

function tick() {
	let line = lines[currentLineIndex];

	let attrs = line.split(",");
	let stopCode = attrs[1];
	let stopName = attrs[2].replace(/\'/g, "");
	let stopType = attrs[3];
	let time = timeToSeconds(attrs[4]);
	let waitTime = timeToSeconds(attrs[5]);
	let tramLine = attrs[6];
	let tramId = attrs[7];
	let peopleIn = attrs[8];
	let peopleOut = attrs[9];
	let peopleLoad = attrs[10];
	let percentSeatLoad = attrs[11];
	let percentLoad = attrs[12];

	//console.log(currentTime, time);
	if (currentTime == undefined) {
		currentTime = time;
		redrawTime = time + 5;
	}

	if (redrawTime + 5 < time) {
		redrawTime += 5;
		// just redraw
		currentTime = redrawTime;
	} else {
		currentTime = time;
		// process this tram event and move on
		currentLineIndex += 1;
		console.log(currentLineIndex / lines.length);
		if (currentLineIndex > lines.length) {
			clearInterval(animationInterval);
		}

		//console.log(stopName, time, waitTime);

		delete activeTrams[tramId];

		tramJourneyIndx[tramId] = tramJourneyIndx[tramId] + 1 || 1;

		if (stopName != '*DEPOT*') { // (stopType != 'B') {

			let stationLatlng = stationsIndex[stopName];
			let tramsJourneyStop = trams[tramId][tramJourneyIndx[tramId]];
			//console.log(tramsJourneyStop);
			let toStop = stationsIndex[tramsJourneyStop.stop];

			activeTrams[tramId] = {
				from: { lat: stationLatlng.lat, lng: stationLatlng.lng, time: time + waitTime },
				to: { lat: toStop.lat, lng: toStop.lng, time: tramsJourneyStop.time },
				properties: {
			    	title: "Line " + tramLine + " - " + tramId,
			    	description: "Load " + peopleLoad + " " + percentLoad + " " + percentSeatLoad,
			    	'marker-color': (percentLoad > 10) ? "#C33" : (percentLoad > 5) ? "#CC3" : "#3C3",
			    	'marker-size': "small"
			    }
			};
		}
	}

	$legend.text(timeFromSeconds(currentTime);
		
	//console.log(activeTrams);
	var newTramLayerData = Object.keys(activeTrams).map(activeTramKey => {
		let tram = activeTrams[activeTramKey];
		let coordinates;
		if (tram.from.time >= currentTime) {
			coordinates = [tram.from.lng, tram.from.lat];
		} else {
			// between
			let percent = (currentTime - tram.from.time) / (tram.to.time - tram.from.time);
			//console.log("percent", percent);
			let movement = [(tram.to.lng - tram.from.lng) * percent, (tram.to.lat - tram.from.lat) * percent];
			coordinates = [tram.from.lng + movement[0], tram.from.lat + movement[1]];
		}

		// create tram
		var tramJson = {
			type: "Feature",
		    properties: tram.properties,
		    geometry: {
		        type: "Point",
		   		coordinates: coordinates
		   	}
		};
		//console.log(tramJson);
		return tramJson;
	});

	tramLayerData = newTramLayerData;
	tramLayer.setGeoJSON(tramLayerData);
}



function isStopNameValid(name) {
	return (name != '* UNKNOWN *' && name != '*DEPOT*');
}

function timeToSeconds(formatedTime) {
	let s = formatedTime.toString().split(":");
	let num = parseInt(s[0]) * 3600 + parseInt(s[1]) * 60 + parseInt(s[2]);
	return num || 0;
}

function timeFromSeconds(timeSeconds) {
	let seconds = timeSeconds % 60;
	timeSeconds = Math.round(timeSeconds / 60);

	let minutes = timeSeconds % 60;
	timeSeconds = Math.round(timeSeconds / 60);

	let hours = Math.round(timeSeconds);

	return hours + ":" + minutes;
}



