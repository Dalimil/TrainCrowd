"use strict";

const fs = require('fs');

let lines = fs.readFileSync('tfl-p6-sep-data.csv').toString().split("\n");

let trams = {};
let stopNames = {};
let stopPairs = {};
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

		let prevStop = trams[tramId][trams[tramId].length-2];
		let thisStop = trams[tramId][trams[tramId].length-1];

		if (prevStop.stop != thisStop.stop && isStopNameValid(prevStop.stop) && isStopNameValid(thisStop.stop)) {
			let stopPair = { from: prevStop.stop, to: thisStop.stop };
			let pairKey = stopPair.from + ";" + stopPair.to;
			stopPairs[pairKey] = stopPair;
		} else {
			if (prevStop.stop != thisStop.stop)
				console.log("Invalid: ", prevStop.stop, thisStop.stop);
		}
	}
	
	// 	tramJourneyIndx[tramId] = tramJourneyIndx[tramId] + 1 || 0;
	stopNames[stopName] = 1;
});

// console.log(Object.keys(trams).map(xKey => { let x = trams[xKey]; return x[x.length-1] }));


function isStopNameValid(name) {
	return (name != '* UNKNOWN *' && name != '*DEPOT*');
}

function timeToSeconds(formatedTime) {
	let s = formatedTime.split(":");
	let num = parseInt(s[0]) * 3600 + parseInt(s[1]) * 60 + parseInt[2];
	return num;
}

const pairsList = Object.keys(stopPairs).map(x => stopPairs[x]);
const pairsOutput = JSON.stringify({ pairs: pairsList }, null, 2);

// console.log(Object.keys(stopPairs), Object.keys(stopPairs).length);
// console.log(Object.keys(stopNames));


//fs.writeFileSync('stop_pairs.json', pairsOutput);

// require('./directions').fetch([{ from: 'a', to: ' B b' }]);
require('./directions').fetch(pairsList);
console.log("directions fetched");

