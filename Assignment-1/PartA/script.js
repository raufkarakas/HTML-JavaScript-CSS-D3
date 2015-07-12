var givenArray = [3, 5, 2, 7, 88, 34, 21, 0, 14, 17, 72, 61];
var givenSentence = "I don't like curly brackets."

function simpleSort(array){
	var sortedArray = [];
	while(array.length > 0){
		var minValue = array[0];
		console.log(minValue);
		for (i=0; i<array.length; i++){
			if (array[i]<minValue){
				minValue = array[i];
			}
		}
		array.splice(array.indexOf(minValue), 1);
		sortedArray.push(minValue);
	}
	console.log(sortedArray);
}

function simpleShift (array, direction){ 
	if (direction.toLowerCase() == "l"){
		array = array.concat(array.splice(0,1));
		console.log(array);
	}
	else if (direction.toLowerCase() == "r"){
		tempValue = array.splice(array.length - 1,1);
		console.log(tempValue.concat(array));
	}
}

function dizVizz(){
	for (i=0; i<=100; i++){
		if (i%15 == 0){
			console.log("DizVizz");
		}
		else if (i%5 == 0){
			console.log("Vizz");
		}
		else if (i%3 == 0){
			console.log("Diz");
		}
		else {
			console.log(i);
		}
	}
}

function chessBoard(N){
	for (i=0; i<N; i++){
		if (i%2 == 0){
			console.log(" #".repeat(N/2) + "\n");
		}
		else {
			console.log("# ".repeat(N/2) + "\n");
		}
	}
}

function sortSentence(sentence){ 
	tempValue = sentence.indexOf(" ");
	var wordArray = [];
	while (tempValue > 0) {
		tempWord = sentence.slice(0, tempValue);
		wordArray.push(tempWord);
		sentence = sentence.replace(tempWord, "");
		console.log(sentence);
		tempValue = sentence.indexOf(" ");
	}
	console.log(wordArray);
}

//simpleSort(givenArray);
//simpleShift(givenArray, "l");
//simpleShift(givenArray, "r");
//dizVizz();
//chessBoard(8);
sortSentence("I dont like curly brackets.");




