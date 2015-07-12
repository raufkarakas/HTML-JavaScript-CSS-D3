// Assignment 2 - Part A

// Define functions

function function1(x){return Math.pow(x, 2) / Math.pow(Math.E, 2);}
function function2(x){return Math.pow(Math.E, Math.sqrt(Math.abs(x)));}
function function3(x){return 2 * Math.PI * x;}
function function4(x){return 3 * x / 2;}

// Specify the range and append function outputs to a list

function update(){
	d3.selectAll("svg").remove();

	inputList1 = [],
	inputList2 = [],
	inputList3 = [],
	inputList4 = [],
	state1 = 0,
	state2 = 0,
	state3 = 0,
	state4 = 0;

	document.getElementById("f1").checked = true;
	document.getElementById("f2").checked = true;
	document.getElementById("f3").checked = true;
	document.getElementById("f4").checked = true;

	var fromValue = Number(document.getElementById("fromBox").value);
	var toValue = Number(document.getElementById("toBox").value);

	if (fromValue < -50 || toValue > 50 || fromValue > toValue){
		alert("Range should be between [-50, 50] and the start point should be smaller than the end point.");
	}
	else {
		for (i=fromValue; i<=toValue; i++){
			inputList1.push([i, function1(i)]);
			inputList2.push([i, function2(i)]);
			inputList3.push([i, function3(i)]);
			inputList4.push([i, function4(i)]);
		}
		createChart();
	}
}

// Create SVG, axes and lines

function createChart(){
	var xValues = [],
		yValues = [];

	for (i=0; i < inputList1.length; i++){
		xValues.push(inputList1[i][0]);
		yValues.push(inputList1[i][1]);
		yValues.push(inputList2[i][1]);
		yValues.push(inputList3[i][1]);
		yValues.push(inputList4[i][1]);
	}

	var padding = {top: 20, right: 10, bottom: 35, left: 50},
		width = 350 - padding.left - padding.right,
		height = 350 - padding.top - padding.bottom;

	var xScale = d3.scale.linear()
		.domain([d3.min(xValues), d3.max(xValues)])
		.range([0, width]);

	var yScale = d3.scale.linear()
		.domain([d3.min(yValues), d3.max(yValues)])
		.range([height, 0]);

	var xAxis = d3.svg.axis()
		.scale(xScale)
		.orient("bottom")
		.ticks(8);

	var yAxis = d3.svg.axis()
		.scale(yScale)
		.orient("left")
		.ticks(8);

	var line = d3.svg.line()
		.x(function(d){return xScale(d[0])})
		.y(function(d){return yScale(d[1])})

	var svg = d3.select("div")
		.append("svg")
		.attr("id", "svg")
		.attr("width", width + padding.left + padding.right)
		.attr("height", height + padding.top + padding.bottom)
		.append("g")
		.attr("transform", "translate(" + padding.left + "," + padding.top + ")");

	svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis)
		.append("text")
		.attr("y", -5)
		.attr("x", width)
		.style("text-anchor", "end")
		.text("x Values");

	svg.append("g")
		.attr("class", "y axis")
		.call(yAxis)
		.append("text")
		.attr("y", 15)
		.attr("x", 0)
		.attr("transform", "rotate(-90)")
		.style("text-anchor", "end")
		.text("y Values");

	svg.append("path")
		.attr("class", "line")
		.attr("id", "line1")
		.style("stroke", "red")
		.attr("d", line(inputList1));

	svg.append("path")
		.attr("class", "line")
		.attr("id", "line2")
		.style("stroke", "green")
		.attr("d", line(inputList2));

	svg.append("path")
		.attr("class", "line")
		.attr("id", "line3")
		.style("stroke", "blue")
		.attr("d", line(inputList3));

	svg.append("path")
		.attr("class", "line")
		.attr("id", "line4")
		.style("stroke", "gray")
		.attr("d", line(inputList4));
}

// Manage selections. Show or hide SVG lines.

function functionManager(funNo){
	if (funNo == 1){
		if (state1 % 2 == 0){
			document.getElementById("line1").style.visibility = "hidden";
			state1++;
		}
		else{
			document.getElementById("line1").style.visibility = "visible";
			state1++;
		}
	}
	else if (funNo == 2){
		if (state2 % 2 == 0){
			document.getElementById("line2").style.visibility = "hidden";
			state2++;
		}
		else{
			document.getElementById("line2").style.visibility = "visible";
			state2++;
		}
	}
	else if (funNo == 3){
		if (state3 % 2 == 0){
			document.getElementById("line3").style.visibility = "hidden";
			state3++;
		}
		else{
			document.getElementById("line3").style.visibility = "visible";
			state3++;
		}
	}
	else if (funNo == 4){
		if (state4 % 2 == 0){
			document.getElementById("line4").style.visibility = "hidden";
			state4++;
		}
		else{
			document.getElementById("line4").style.visibility = "visible";
			state4++;
		}
	}
}

///////////////////////////////////////////////
/// 		Rauf KARAKAS - 210122579		///
///////////////////////////////////////////////



