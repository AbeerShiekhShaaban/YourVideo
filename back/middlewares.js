var lookFor = function(arr , vIdd){
	for (var i=0 ; i<arr.length ; i++) {
		if(arr[i].vidId == vIdd){
			return i;
		}
	}
	return -1;
}

exports.lookFor = lookFor;

/**************************************************/

const del = function(arr , id){
	for (var i=0 ; i<arr.length ; i++) {
		if(arr[i].vidId == id){
			arr.splice(i , 1);
		}
	}
}

exports.del = del;

/**************************************************/

// const reverseArr = function(arr){
// 	let newArr = [];
// 	for (var i=arr.length-1 ; i>=0 ; i--) {
// 		newArr.push(arr[i]);
// 	}
// 	return newArr;
// }

// exports.reverseArr = reverseArr;
