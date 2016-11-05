/** Sample code using the 'request' module to make server-side http requests */
"use strict";

const request = require('request');

const origin = "75+9th+Ave+New+York,+NY";
const destination = "MetLife+Stadium+1+MetLife+Stadium+Dr+East+Rutherford,+NJ+07073";
const key = "AIzaSyCNtpdJ-cx0367iMVm1oQsioj8ItVMkkww";

const stopPairs = [{ from: 'a', to: 'b' }];
const routes = {};
let pairsToDo = stopPairs.length;

stopPairs.forEach(function(pair, ind) {
	setTimeout(function() { getDirections(pair); }, ind * 200);
});

function getDirections(pair) {
	let from = pair.from;
	let to = pair.to;

	request(`https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&mode=transit&arrival_time=1478520000&key=${key}`,
		function(error, response, body) {
			// Callback function
			if (!error && response.statusCode == 200) {
				let data = JSON.parse(body);
				let steps = data.routes[0].legs[0].steps;

				let routeKey = from + ";" + to;
				routes[routeKey] = steps.map(step => { return { from: step.start_location, to: step.end_location }});
				console.log(routeKey);
				

				pairsToDo -= 1;
				if (pairsToDo <= 0) {
					finish();
				}
			}
		}
	);
}

function finish() {
	console.log(JSON.stringify(routes, null, 2));
}