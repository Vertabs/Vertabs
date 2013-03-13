var storageLabels = {
	side: "vertabs-position-side",
	pxShowing: "vertabs-pxs-showing"
};

function setOptions(event) {
	var newSide = $("#vertabs-side").val();
	var newPxs = $("#vertabs-pxs-showing").val();

	chrome.storage.sync.set({storageLabels.side: newSide});
	chrome.storage.sync.set({storageLabels.pxShowing: newPxs});

	chrome.extension.sendMessage({storageLabels: storage});
}

function getOptions() {

	var sideVal 		= chrome.storage.sync.get(storageLabels.side, function(){}) || "left";
	var pxsShowingVal 	= chrome.storage.sync.get(storageLabels.pxShowing, function(){}) || "10";

	console.log("Current side : "+sideVal);

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


jQuery(getOptions);