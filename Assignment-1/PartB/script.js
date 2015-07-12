// Calculator

function numberButton(n) {
	if (document.getElementById("resultBox").value[0] == "0" && document.getElementById("resultBox").value.length == 1){
		document.getElementById("resultBox").value = n;
	}
	else {
		document.getElementById("resultBox").value += n;
	}
}

function dotButton() {
	document.getElementById("resultBox").value += ".";
}

function buttonC() {
	document.getElementById("resultBox").value = "0";
	var firstValue = 0, secondValue = 0, resultValue = 0;
	d3.select("svg").remove();
}

function buttonBack() {
	document.getElementById("resultBox").value = document.getElementById("resultBox").value.slice(0, -1);
	if (document.getElementById("resultBox").value.length == 0){
		document.getElementById("resultBox").value = 0;
	}
}

var firstValue = 0;
var secondValue = 0;
var resultValue = 0;
var action = "";

function operator(act) {
	firstValue = document.getElementById("resultBox").value;
	action = act;
	document.getElementById("resultBox").value = "";
}

function buttonResult() {
	firstValue = parseFloat(firstValue);
	secondValue = parseFloat(document.getElementById("resultBox").value);
	if (action == "sum"){
		document.getElementById("resultBox").value = parseFloat((firstValue + secondValue).toFixed(3));
	}
	else if (action == "subtract"){
		document.getElementById("resultBox").value = parseFloat((firstValue - secondValue).toFixed(3));
	}
	else if (action == "multiply"){
		document.getElementById("resultBox").value = parseFloat((firstValue * secondValue).toFixed(3));
	}
	else if (action == "divide"){
		document.getElementById("resultBox").value = parseFloat((firstValue / secondValue).toFixed(3));
	}
	resultValue = document.getElementById("resultBox").value;

	createChart();
}

// Color Palette

function changeColor(c){
	d3.selectAll(".ordinaryButton").style({"background-color":c, "color":"#2e2e2e"});
	d3.select("#zeroButton").style({"background-color":c, "color":"#2e2e2e"});
	d3.select("#resultButton").style("color", "#2e2e2e");
	d3.select("#chartDiv").style({"background-color":c});
}

// Bar Chart

function createChart(){

	var data = [firstValue, secondValue, resultValue],
		labels = ["First Value", "Second Value", "Result"];

	var width = 400,
		height = 372,
		barPadding = 50,
		yPadding = 35,
		xHorPadding = 50,
		xVerPadding = 25,
		divider = d3.max(data) / 85;

	var svg = d3.select("#chartDiv")
		.append("svg")
		.attr("width", width)
		.attr("height", height);

	var xScale = d3.scale.ordinal()
		.domain(labels)
		.rangePoints([xHorPadding + 30, width - xHorPadding]);

	var xAxis = d3.svg.axis()
		.scale(xScale)
		.orient("bottom")
		.ticks(3);

	var yScale = d3.scale.linear()
		.domain([d3.max(data, function(d){return d;}), 0])
		.range([0, height - xVerPadding]);

	var yAxis = d3.svg.axis()
		.scale(yScale)
		.orient("left")
		.ticks(5);

	svg.selectAll("rect")
		.data(data)
		.enter()
		.append("rect")
		.attr("x", function(d, i){
			return yPadding + 10 + (i * (width / data.length));
		})
		.attr("y", function(d){
			return height - yPadding + 10 - (d/divider) * 4;
		})
		.attr("width", width / data.length - barPadding)
		.attr("height", function(d){
			return (d/divider) * 4;
		})
		.attr("fill", function(d){
			return "rgb(0, "+ (d * 5) +", 0)";
		})

	svg.selectAll("text")
		.data(data)
		.enter()
		.append("text")
		.text(function(d){
			return d;
		})
		.attr("x", function(d, i){
			return 65 + (i * (width / data.length));
		})
		.attr("y", function(d){
			return height - ((d/divider) * 4) + 10;
		})
		.attr("font-family", "sans-serif")
		.attr("font-size", "24px")
		.attr("fill", "white");

	svg.append("g")
		.attr("class", "axis")
		.attr("transform", "translate(0," + (height - xVerPadding) + ")")
		.call(xAxis);

	svg.append("g")
		.attr("class", "axis")
		.attr("transform", "translate(" + (yPadding) + ", 0)")
		.call(yAxis);
}






