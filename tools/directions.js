"use strict";

const fs = require('fs');
const request = require('request');
const stations = require('./stations').stations;

const origin = "75+9th+Ave+New+York,+NY";
const destination = "MetLife+Stadium+1+MetLife+Stadium+Dr+East+Rutherford,+NJ+07073";
const key = "AIzaSyCNtpdJ-cx0367iMVm1oQsioj8ItVMkkww";

const routes = {};
let pairsToDo;

exports.fetch = function(stopPairs) {
	pairsToDo = stopPairs.length;

	stopPairs.forEach(function(pair, ind) {
		setTimeout(function() { getDirections(pair); }, ind * 200);
	});
};

function toPlaceString(s) {
	//console.log(s);
	var ans = "";
	stations.forEach(station => {
		if (station.station == s) {
			//console.log(station.lat, station.lon);
			ans = station.lat + "," + station.lon;
		}
	});
	return ans;
	//s.replace(/ /g, "+") + "+tram+stop";
}

function getDirections(pair) {
	let from = toPlaceString(pair.from);
	let to = toPlaceString(pair.to);
	//console.log(from, to);

	request(`https://maps.googleapis.com/maps/api/directions/json?origin=${from}&destination=${to}&mode=transit&arrival_time=1478520000&key=${key}`,
		function(error, response, body) {
			// Callback function
			if (!error && response.statusCode == 200) {
				let data = JSON.parse(body);
				let routeKey = pair.from + ";" + pair.to;

				let steps = data.routes[0].legs[0].steps;

				routes[routeKey] = {
					from: pair.from,
					to: pair.to,
					directions: steps.map(step => { return { from: step.start_location, to: step.end_location }})
				};
				console.log("tick: " + routeKey);
				
				pairsToDo -= 1;
				if (pairsToDo <= 0) {
					finish();
				}
				// finish();
				console.log(pairsToDo);
			}
		}
	);
}

function finish() {
	var directionsOutput = JSON.stringify(routes, null, 2);

	fs.writeFileSync('directions.json', JSON.stringify(routes));
	fs.writeFileSync('directions-padded.json', directionsOutput);
	console.log("directions done");
}

