// Assignment 2 - Part B

var countries = ["Select from list..."],
	allData,
	populationData = [],
	gdpData = []
	lifeData = [];

d3.json("countries.json", function(data) {
	allData = data;
    for (i=0; i < data.length; i++) {
        countries.push(data[i].name);   
    }

    createSelectbox();
});

function createSelectbox(){
	var select = d3.select("#box")
		.append("select")
	  	.attr("class","selectBox")
	    .on("change",onchange)

	var options = select
	  	.selectAll("option")
		.data(countries)
		.enter()
		.append("option")
		.text(function(d) { return d; });
}

function onchange(){
	populationData = [],
	gdpData = [],
	lifeData = [];

	d3.selectAll("svg").remove();

	selectedValue = d3.select("select").property("value");

	for (i=0; i < allData[countries.indexOf(selectedValue) - 1].years.length; i++){
		tempYear = allData[countries.indexOf(selectedValue) - 1].years[i].year;
		tempPopulation = allData[countries.indexOf(selectedValue) - 1].years[i].population / 1000000;
		tempGdp = allData[countries.indexOf(selectedValue) - 1].years[i].gdp / 1000000000;
		tempLife = allData[countries.indexOf(selectedValue) - 1].years[i].life_expectancy;
		populationData.push([tempYear, tempPopulation]);
		gdpData.push([tempYear, tempGdp]);
		lifeData.push([tempYear, tempLife]);
	}
	populationChart(populationData);
	gdpChart(gdpData);
	lifeChart(lifeData);
};

function populationChart(inputList){
	var xValues = [],
		yValues = [];

	for (i=0; i < inputList.length; i++){
		xValues.push(inputList[i][0]);
		yValues.push(inputList[i][1]);
	}
	var padding = {top: 20, right: 10, bottom: 35, left: 50},
		width = 350 - padding.left - padding.right,
		height = 350 - padding.top - padding.bottom;

	var xScale = d3.scale.ordinal()
		.domain(xValues)
		.rangeRoundBands([0, width], 0.1);

	var yScale = d3.scale.linear()
		.domain([d3.min(yValues), d3.max(yValues)])
		.range([height, 0]);

	var xAxis = d3.svg.axis()
		.scale(xScale)
		.orient("bottom");

	var yAxis = d3.svg.axis()
		.scale(yScale)
		.orient("left")
		.ticks(8);

	var area = d3.svg.area()
		.x(function(d){return xScale(d[0])})
		.y0(height)
		.y1(function(d){return yScale(d[1])})

	var svg = d3.select("#leftChart")
		.append("svg")
		.attr("width", width + padding.left + padding.right)
		.attr("height", height + padding.top + padding.bottom)
		.append("g")
		.attr("transform", "translate(" + padding.left + "," + padding.top + ")");

	svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis)
		.selectAll("text")
		.attr("y", 0)
		.attr("x", -10)
		.attr("dy", ".35em")
		.attr("transform", "rotate(-90)")
		.style("text-anchor", "end");

	svg.append("g")
		.attr("class", "y axis")
		.call(yAxis)
		.append("text")
		.attr("y", 15)
		.attr("x", 0)
		.attr("transform", "rotate(-90)")
		.style("text-anchor", "end")
		.text("Population (Million)");

	svg.append("path")
		.attr("class", "area")
		.attr("d", area(inputList));
}

function gdpChart(inputList){
	var xValues = [],
		yValues = [];

	for (i=0; i < inputList.length; i++){
		xValues.push(inputList[i][0]);
		yValues.push(inputList[i][1]);
	}
	var padding = {top: 20, right: 10, bottom: 35, left: 50},
		width = 350 - padding.left - padding.right,
		height = 350 - padding.top - padding.bottom;

	var xScale = d3.scale.ordinal()
		.domain(xValues)
		.rangeRoundBands([0, width], 0.1);

	var yScale = d3.scale.linear()
		.domain([d3.min(yValues), d3.max(yValues)])
		.range([height, 0]);

	var xAxis = d3.svg.axis()
		.scale(xScale)
		.orient("bottom");

	var yAxis = d3.svg.axis()
		.scale(yScale)
		.orient("left")
		.ticks(8);

	var svg = d3.select("#midChart")
		.append("svg")
		.attr("width", width + padding.left + padding.right)
		.attr("height", height + padding.top + padding.bottom)
		.append("g")
		.attr("transform", "translate(" + padding.left + "," + padding.top + ")");

	svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis)
		.selectAll("text")
		.attr("y", 0)
		.attr("x", -10)
		.attr("dy", ".35em")
		.attr("transform", "rotate(-90)")
		.style("text-anchor", "end");

	svg.append("g")
		.attr("class", "y axis")
		.call(yAxis)
		.append("text")
		.attr("y", 15)
		.attr("x", 0)
		.attr("transform", "rotate(-90)")
		.style("text-anchor", "end")
		.text("GDP (Billion)");


	svg.selectAll("rect")
		.data(inputList)
		.enter()
		.append("rect")
		.attr("x", function(d, i){
			return xScale(d[0]);
		})
		.attr("width", xScale.rangeBand())
		.attr("y", function(d){
			return yScale(d[1]);
		})
		.attr("height", function(d){
			return height - yScale(d[1]);
		})
		.attr("fill", "rgb(100, 100, 100)");
}

function lifeChart(inputList){
	var xValues = [],
		yValues = [];

	for (i=0; i < inputList.length; i++){
		xValues.push(inputList[i][0]);
		yValues.push(inputList[i][1]);
	}
	var padding = {top: 20, right: 10, bottom: 35, left: 50},
		width = 350 - padding.left - padding.right,
		height = 350 - padding.top - padding.bottom;

	var xScale = d3.scale.ordinal()
		.domain(xValues)
		.rangeRoundBands([0, width], 0.1);

	var yScale = d3.scale.linear()
		.domain([d3.min(yValues), d3.max(yValues)])
		.range([height, 0]);

	var xAxis = d3.svg.axis()
		.scale(xScale)
		.orient("bottom");

	var yAxis = d3.svg.axis()
		.scale(yScale)
		.orient("left")
		.ticks(8);

	var line = d3.svg.line()
		.x(function(d){return xScale(d[0])})
		.y(function(d){return yScale(d[1])})

	var svg = d3.select("#rightChart")
		.append("svg")
		.attr("width", width + padding.left + padding.right)
		.attr("height", height + padding.top + padding.bottom)
		.append("g")
		.attr("transform", "translate(" + padding.left + "," + padding.top + ")");

	svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis)
		.selectAll("text")
		.attr("y", 0)
		.attr("x", -10)
		.attr("dy", ".35em")
		.attr("transform", "rotate(-90)")
		.style("text-anchor", "end");

	svg.append("g")
		.attr("class", "y axis")
		.call(yAxis)
		.append("text")
		.attr("y", 15)
		.attr("x", 0)
		.attr("transform", "rotate(-90)")
		.style("text-anchor", "end")
		.text("Life Expectancy (Years)");

	svg.append("path")
		.attr("class", "line")
		.attr("d", line(inputList));
}

///////////////////////////////////////////////
/// 		Rauf KARAKAS - 210122579		///
///////////////////////////////////////////////












