"use strict";

const fs = require('fs');

let lines = fs.readFileSync('tfl-p6-sep-data.csv').toString().split("\n");

let trams = {};

lines.forEach(line => {
	let attrs = line.split(",");
	let stopCode = attrs[1];
	let stopName = attrs[2];
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
	//console.log(time);

	if (trams[tramId] == undefined) {
		trams[tramId] = [{ time: time, stop: stopCode }];
	}
	
});


//Date,Code,Stop,Stop Type,Time,R Length,Line,Tram,Ins,Outs,Load,Seat. load,%Load,I,V,P
