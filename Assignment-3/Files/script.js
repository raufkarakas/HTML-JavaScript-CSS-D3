// Assignment 3

var continents = {},
	countryData= {};

var padding = {top: 10, right: 10, bottom: 35, left: 30},
		width = 850 - padding.left - padding.right,
		height = 480 - padding.top - padding.bottom;

d3.json("countries.json", function(data) {
	allData = data;
    for (i=0; i<data.length; i++){
    	var tempList = [];
    	tempList.push(data[i].longitude, data[i].latitude, (data[i].years[0].population + data[i].years[9].population) / 2000000, data[i].continent);

        try {
        	continents[data[i].continent].push(data[i].name);
        	countryData[data[i].name] = tempList;
        }
        catch(err){
        	continents[data[i].continent] = [data[i].name];
        	countryData[data[i].name] = tempList;
        }
    }

    createSelectbox();
    blankChart();
});

function getCountryColor(name){
	var tempColor;
	if (name == "Africa"){
		tempColor = "red";
	}
	else if (name == "Americas"){
		tempColor = "green";
	}
	else if (name == "Asia"){
		tempColor = "blue";
	}
	else if (name == "Europe"){
		tempColor = "yellow";
	}
	else {
		tempColor = "orange";
	}
	return tempColor;
}

function createSelectbox(){
	var continentOptions = Object.keys(continents).sort();
	continentOptions.unshift("All");
	continentOptions.unshift("Filter by continent...");

	var select = d3.select("#box")
		.append("select")
	  	.attr("class","selectBox")
	    .on("change",onchange)

	var options = select
	  	.selectAll("option")
		.data(continentOptions)
		.enter()
		.append("option")
		.text(function(d) { return d; });
}

function onchange(){
	d3.selectAll("svg").remove();
	blankChart();

	selectedValue = d3.select("select").property("value");
	chartCountries = [];

	if (selectedValue == "All"){
		var tempList = Object.keys(continents).sort();
		for (i=0; i<tempList.length; i++){
			chartCountries = chartCountries.concat(continents[tempList[i]]);
		}
	}
	else{
		chartCountries = continents[selectedValue];
	}
	d3.select("#tooltip").classed("hidden", true);
	if (selectedValue == "Filter by continent..."){
		d3.selectAll("svg").remove();
		blankChart();
	}
	else{
		createChart(chartCountries);
	}
}

function blankChart(){
	var xScale = d3.scale.linear()
		.domain([])
		.range([0, width]);

	var yScale = d3.scale.linear()
		.domain([])
		.range([height, 0]);

	var xAxis = d3.svg.axis()
		.scale(xScale)
		.orient("bottom");

	var yAxis = d3.svg.axis()
		.scale(yScale)
		.orient("left")
		.ticks(8);

	var svg = d3.select("#chart")
		.append("svg")
		.attr("width", width + padding.left + padding.right)
		.attr("height", height + padding.top + padding.bottom)
		.append("g")
		.attr("transform", "translate(" + padding.left + "," + padding.top + ")");

	svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis)
		.append("text")
		.attr("y", -10)
		.attr("x", width)
		.style("text-anchor", "end")
		.text("Longitude");

	svg.append("g")
		.attr("class", "y axis")
		.call(yAxis)
		.append("text")
		.attr("y", 15)
		.attr("x", 0)
		.attr("transform", "rotate(-90)")
		.style("text-anchor", "end")
		.text("Latitude");
}

function createChart(countryList){
	d3.selectAll("svg").remove();

	var xValues = [], // Longitude
		yValues = [], // Latitude
		rValues = []; // Radius

	for (i=0; i < countryList.length; i++){
		xValues.push(countryData[countryList[i]][0]);
		yValues.push(countryData[countryList[i]][1]);
		rValues.push(countryData[countryList[i]][2]);
	}

	var xScale = d3.scale.linear()
		.domain([d3.min(xValues), d3.max(xValues)])
		.range([0, width]);

	var yScale = d3.scale.linear()
		.domain([d3.min(yValues), d3.max(yValues)])
		.range([height, 0]);

	var rScale = d3.scale.linear()
        .domain([d3.min(rValues), d3.max(rValues)])
        .range([5, 35]);

	var xAxis = d3.svg.axis()
		.scale(xScale)
		.orient("bottom");

	var yAxis = d3.svg.axis()
		.scale(yScale)
		.orient("left");

	var svg = d3.select("#chart")
		.append("svg")
		.attr("width", width + padding.left + padding.right)
		.attr("height", height + padding.top + padding.bottom)
		.append("g")
		.attr("transform", "translate(" + padding.left + "," + padding.top + ")");

	var hoverTip = d3.tip()
		.attr('class', 'd3-hoverTip')
		.offset([-5, 0])
		.html(function(d) {
    		return "<strong>" + d + "</strong><span style='color:red'>" + " Longitude: " + countryData[d][0] + " Latitude: " + countryData[d][1] + "</span>";
		});

	svg.call(hoverTip);

	svg.selectAll("circle")
   		.data(countryList)
   		.enter()
   		.append("circle")
		.attr("cx", function(d) {
        	return xScale(countryData[d][0]);
  		 })
   		.attr("cy", function(d) {  
        	return yScale(countryData[d][1]);
   		})
 		.attr("r", function(d) {
   			return rScale(countryData[d][2]);
		})
		.attr("fill", function(d) {
   			return getCountryColor(countryData[d][3]);
   		})
   		.on("mouseover", hoverTip.show)
    	.on("mouseout", hoverTip.hide)
    	.on("click", function(d){
    		hoverTip.hide();

    		var xPosition = parseFloat(d3.select(this).attr("cx")) + 100;
    		var yPosition = parseFloat(d3.select(this).attr("cy")) + 100;

			d3.select("#tooltip")
  				.style("left", xPosition + "px")
  				.style("top", yPosition + "px")
  				.select("#value")
  				.text(d);

  			d3.select("#chartPlace").selectAll("svg").remove();
  			barChart(d);

  			d3.select("#tooltip").classed("hidden", false);
    	});

	svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis)
		.append("text")
		.attr("y", -10)
		.attr("x", width)
		.style("text-anchor", "end")
		.text("Longitude");

	svg.append("g")
		.attr("class", "y axis")
		.call(yAxis)
		.append("text")
		.attr("y", 15)
		.attr("x", 0)
		.attr("transform", "rotate(-90)")
		.style("text-anchor", "end")
		.text("Latitude");
}

function barChart(countryName){
	var populationData = [];

	d3.json("countries.json", function(data) {
    for (i=0; i < data.length; i++) {
    	if (data[i].name == countryName){
    		for (j=0; j < 10; j++){
				tempYear = data[i].years[j].year;
				tempPopulation = data[i].years[j].population / 1000000;
				populationData.push([tempYear, tempPopulation]);
			}
    	}  
    }
    createChart(populationData);
	});

	function createChart(inputList){
		var xValues = [],
			yValues = [];

		for (i=0; i < inputList.length; i++){
			xValues.push(inputList[i][0]);
			yValues.push(inputList[i][1]);
		}
		var padding = {top: 20, right: 10, bottom: 35, left: 45},
			width = 200 - padding.left - padding.right,
			height = 180 - padding.top - padding.bottom;

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

		var svg = d3.select("#chartPlace")
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
}


///////////////////////////////////////////////
/// 		Rauf KARAKAS - 210122579		///
///////////////////////////////////////////////












