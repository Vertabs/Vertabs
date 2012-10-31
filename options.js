$(getOptions);

var storage = {
	side: "vertabs-position-side",
	pxShowing: "vertabs-pxs-showing"
};


function setOptions(event) {
	var newSide = $("#vertabs-side").val();
	var newPxs = $("#vertabs-pxs-showing").val();

	localStorage.setItem(storage.side, newSide);
	localStorage.setItem(storage.pxShowing, newPxs);

	chrome.extension.sendMessage({storageLabels: storage});
}

function getOptions() {
	var sideVal 		= localStorage.getItem(storage.side) || "left";
	var pxsShowingVal 	= localStorage.getItem(storage.pxShowing) || "10";


	var section = $("#wrapper section");

	// Right or left?
	section.find("select#vertabs-side").val(sideVal);
		
	// Pixels showing when not hovered?
	section.find("input#vertabs-pxs-showing").val(pxsShowingVal);


	// Save options on change
	var changeSelector = [
		"#vertabs-side",
		"#vertabs-pxs-showing"
	].join(", ");
	$(wrapper).on("change", changeSelector, setOptions);
}