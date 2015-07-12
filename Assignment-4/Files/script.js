// Assignment 4

// Show slider data
function showValue(newValue, id){
	document.getElementById(id).value = newValue;
}

// Define variables
var width = 780,
    height = 600,
    svg = d3.select("#chart")
        .attr("width", width)
        .attr("height", height);

var colors = d3.entries(colorbrewer.Reds[5]);

// Get data from json file
d3.json("input/assignments.json", function(jsonData){
    allData = jsonData.Data;

    createVisual(getData(allData));
});

function getData(inputData){
    var organisedData = {nodes: [], edges: [], ranks: []},
        pastVariables = [],
        index = 0;

    for (i=0; i<inputData.length; i++){
        if (!(inputData[i].Student_A in pastVariables)){
            pastVariables[inputData[i].Student_A] = index;
            organisedData.nodes.push({name: inputData[i].Student_A});
            index++;
        }

        if (!(inputData[i].Student_B in pastVariables)){
            pastVariables[inputData[i].Student_B] = index;
            organisedData.nodes.push({name: inputData[i].Student_B});
            index++;
        }

        organisedData.edges.push({
            source: pastVariables[inputData[i].Student_A],
            target: pastVariables[inputData[i].Student_B],
            value: inputData[i].NormalizedMetric,
            similarity: [inputData[i].A_B_Similarity, inputData[i].B_A_Similarity],
            file: inputData[i].File
        });
    }

    var nodeScores = [];

    for (j=0; j<organisedData.nodes.length; j++){
        var tempScore = [];
        for (k=0; k<organisedData.edges.length; k++){
            if (organisedData.nodes[organisedData.edges[k].source].name == organisedData.nodes[j].name){
                tempScore.push(organisedData.edges[k].value);
            }
            if (organisedData.nodes[organisedData.edges[k].target].name == organisedData.nodes[j].name){
                tempScore.push(organisedData.edges[k].value);
            }
        }
        nodeScores.push({name: organisedData.nodes[j].name, score: tempScore});
    }

    organisedData.nodes = nodeScores;

    for (l=0; l<organisedData.nodes.length; l++){
        organisedData["ranks"].push({
            name: organisedData.nodes[l].name,
            score: organisedData.nodes[l].score
        });
    }

    return organisedData;
}

function summation(dataList, limit){
    var totalSum = 0;
    if (typeof limit == "undefined"){
        limit = 0;
    }

    for (i=0; i<dataList.length; i++){
        if (dataList[i] >= limit){
            totalSum += dataList[i];
        }
    }

    return totalSum;
}

function calculateScore(dataList, calculationType, limit){
    if (calculationType == "Sum"){
        return summation(dataList, limit);
    }
    else{
        return d3.max(dataList);
    }
}

function createVisual(inputData){
    inputData.ranks = inputData.ranks.sort(function(a,b){
        return summation(b.score) - summation(a.score);
    });

    var rank = d3.select("#rankBox")
                .selectAll("p")
                .data(inputData.ranks)
                .enter()
                .append("p")
                .text(function(d,i){
                    return "Rank: " + (i+1) + " Student: " + d.name + " Score: " + summation(d.score);
                });

    var rScale = d3.scale.linear()
                .domain([
                    d3.min(inputData.nodes, function(d){ return summation(d.score); }),
                    d3.max(inputData.nodes, function(d){ return summation(d.score); })])
                .range([5, 25]);

    var cScale = d3.scale.quantize()
                .domain([
                    d3.min(inputData.nodes, function(d){ return summation(d.score); }),
                    d3.max(inputData.nodes, function(d){ return summation(d.score); })])
                .range(colors);

    var eScale = d3.scale.linear()
                .domain([
                    d3.min(inputData.edges, function(d){ return d.value; }),
                    d3.max(inputData.edges, function(d){ return d.value; })])
                .range([1, 10]);

    var force = d3.layout.force()
                .nodes(inputData.nodes)
                .links(inputData.edges)
                .size([width, height])
                .linkStrength(1)
                .linkDistance([150])
                .charge([-250])
                .gravity(0.15)
                .start();

    var edges = svg.selectAll("line")
                .data(inputData.edges)
                .enter()
                .append("line")
                .style("stroke", "#ccc")
                .style("stroke-width", function(d){
                    return eScale(d.value);
                });

    var nodes = svg.selectAll("circle")
                .data(inputData.nodes)
                .enter()
                .append("circle")
                .attr("r", function(d){
                    return rScale(calculateScore(d.score, "Sum"));
                })
                .style("fill", function(d){
                    return cScale(summation(d.score)).value;
                })
                .call(force.drag);

    var texts = svg.selectAll("text")
                .data(inputData.nodes)
                .enter()
                .append("text")
                .attr("dy", ".35em")
                .attr("fill", "#000")
                .attr("opacity", 0)
                .text(function(d){
                    return d.name;
                });

    force.on("tick", function(){
        edges.attr("x1", function(d){ return d.source.x; })
             .attr("y1", function(d){ return d.source.y; })
             .attr("x2", function(d){ return d.target.x; })
             .attr("y2", function(d){ return d.target.y; });
        nodes.attr("cx", function(d){ return d.x; })
             .attr("cy", function(d){ return d.y; });
        texts.attr("transform", function(d){
            return "translate(" + d.x + "," + d.y + ")";
        });
    });

    var toolTip = d3.select("#tooltip");
    var previousNode = null;

    nodes.on("mouseover", function(d){
            var xPosition = parseFloat(d3.event.pageX);
            var yPosition = parseFloat(d3.event.pageY);
            toolTip.style("left", xPosition + "px").style("top", yPosition + "px");

            var method = d3.selectAll(".method:checked").node().value;
            var limit = d3.select("#methodSlider").node().value;

            toolTip.select("#name").text("Student: " + d.name);
            toolTip.select("#score").text("Score: " + calculateScore(d.score, method, limit));
            toolTip.classed("hidden", false);
        })
        .on("mouseout", function(){
            toolTip.classed("hidden", true);
        })
        .on("click", function(d){
            if (previousNode === d.name){
                nodes.style("stroke", null);
                edges.style("stroke", "#ccc");
                rank.style("color", "#000");
                previousNode = null;
            }
            else{
                nodes.style("stroke", null);
                edges.style("stroke", "#ccc");

                var nodeName = d.name;
                var neighborNodes = [];

                edges.style("stroke", function(d){
                    if ((d.source.name == nodeName)  ||  (d.target.name == nodeName)){
                        neighborNodes.push(d.source.name == nodeName ? d.target.name : d.source.name);
                        return "#000";
                    }
                    else {
                        return "#ccc";
                    }
                });

                nodes.style("stroke", function(d){
                        if (neighborNodes.indexOf(d.name) != -1){
                            return "#000";
                        }
                    })
                    .style("stroke-width", function(d){
                        if (neighborNodes.indexOf(d.name) != -1){
                            return 2;
                        }
                        else{
                            return 0;
                        }
                    });

                d3.select(this).style("stroke", "#000");
                d3.select(this).style("stroke-width", 2);

                inputData.ranks.forEach(function(node, index) {
                    if (node.name == nodeName) {
                        console.log(node, index);
                        var nodeIndex = index;
                        rank.style("color", function(d, i) {
                            if (i == nodeIndex) { return "red"; }
                        });
                    }
                });
                previousNode = d.name;
            }
        });

    edges.on("mouseover", function(d){
            var xPosition = parseFloat(d3.event.pageX);
            var yPosition = parseFloat(d3.event.pageY);
            toolTip.style("left", xPosition + "px").style("top", yPosition + "px");

            toolTip.select("#name").text("Link: " + d.source.name + " - " + d.target.name);
            toolTip.select("#score").html("Similarity: " + d.similarity[0] + " - " + d.similarity[1] +
                "<br/>" + "Score: " + d.value);
            toolTip.classed("hidden", false);
        })
        .on("mouseout", function(){
            toolTip.classed("hidden", true);
        })
        .on("click", function(d){
            window.open("input/" + d.file, "_blank").focus();
        });

    d3.selectAll(".method").on("change", function(){
        var method = d3.selectAll(".method:checked").node().value;
        var slide = d3.select("#methodSlider").node().value;

        if (method == "max"){
            d3.select("#methodSlider").attr("disabled", true);
            inputData.ranks = inputData.ranks.sort(function(a,b){
                return d3.max(b.score) - d3.max(a.score);
            });

            rank.data(inputData.ranks)
                .text(function(d, i){
                    return "Rank " + (i+1) + " Student_" + d.name + " Score: " + d3.max(d.score);
                });

            cScale.domain([
                d3.min(inputData.nodes, function(d){ return d3.max(d.score); }),
                d3.max(inputData.nodes, function(d){ return d3.max(d.score); })]);

            rScale.domain([
                d3.min(inputData.nodes, function(d){ return d3.max(d.score); }),
                d3.max(inputData.nodes, function(d){ return d3.max(d.score); })]);

            nodes.data(inputData.nodes)
                .attr("r", function(d){
                    return rScale(calculateScore(d.score, method));
                })
                .style("fill", function(d){
                    return cScale(calculateScore(d.score, method)).value;
                });
        }

        if (method == "sum"){
            d3.select("#methodSlider").attr("disabled", null);

            inputData.ranks = inputData.ranks.sort(function(a,b){
                return summation(b.score, slide) - summation(a.score, slide);
            });

            rank.data(inputData.ranks)
                .text(function(d, i){
                    return "Rank " + (i+1) + " Student_" + d.name + " Score: " + summation(d.score, slide);
                });

            cScale.domain([
                d3.min(inputData.nodes, function(d){ return summation(d.score, slide); }),
                d3.max(inputData.nodes, function(d){ return summation(d.score, slide); })]);

            rScale.domain([
                d3.min(inputData.nodes, function(d){ return summation(d.score, slide); }),
                d3.max(inputData.nodes, function(d){ return summation(d.score, slide); })]);

            nodes.data(inputData.nodes)
                .attr("r", function(d){
                    return rScale(calculateScore(d.score, method, slide));
                })
                .style("fill", function(d){
                    var nodeColor = cScale(calculateScore(d.score, method, slide));
                    if (typeof nodeColor == "undefined") {
                        texts.style("fill", "#fff");
                        return "#878787";
                    }
                    else {
                        texts.style("fill", "#000");
                        return nodeColor.value;
                    }
                });
        }

        if (previousNode != null){
            inputData.ranks.forEach(function(node, index){
                if (node.name == previousNode){
                    var nodeIndex = index;
                    rank.style("color", function(d, i){
                        if (i == nodeIndex) { return "red"; }
                    });
                }
            });
        }
    });

    d3.selectAll(".label").on("change", function(){
        var label = d3.selectAll(".label:checked").node().value;
        if (label == "hide") { texts.attr("opacity", 0); }
        if (label == "show") { texts.attr("opacity", 1); }
    });

    d3.select("#labelSlider").on("change", function(){
        var slide = d3.select("#labelSlider").node().value;

        edges.style("opacity", function(d){
            return d.value < slide ? 0.1 : 1;
        });
    });
}

///////////////////////////////////////////////
/// 		Rauf KARAKAS - 210122579		///
///////////////////////////////////////////////