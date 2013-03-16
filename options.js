var storageLabels = {
	side: "vertabs-position-side",
	pxShowing: "vertabs-pxs-showing"
};


function setOptions(event) {

	var toStore = {};
	var sideInput = $("#vertabs-side")[0];
	var pxsShowingInput = $("#vertabs-pxs-showing")[0];

	console.dir(sideInput.value);
	console.dir(pxsShowingInput.value);

	toStore[storageLabels.side] = sideInput.value;
	toStore[storageLabels.pxShowing] = pxsShowingInput.value;

	//console.log("toStore from options.js:");
	//console.dir(toStore);

	chrome.storage.sync.set(toStore, function(){
		chrome.extension.sendMessage({storageLabels: storageLabels});
	});
}


function getOptions() {

	var sideInput = $("#wrapper select#vertabs-side")
		.on("change", setOptions);
	var pxsInput = $("#wrapper input#vertabs-pxs-showing")
		.on("change", setOptions);

	var getLabels = [storageLabels.side, storageLabels.pxShowing];
	chrome.storage.sync.get(getLabels, function(object){
		sideVal = object[storageLabels.side];
		pxsShowingVal = object[storageLabels.pxShowing];

		if(sideVal != undefined) sideInput.val(sideVal);
		if(pxsShowingVal != undefined) pxsInput.val(pxsShowingVal);
	});
}


jQuery(getOptions);