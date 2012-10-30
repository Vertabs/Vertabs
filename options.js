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

	// Side option
	$("<h2></h2>")
		.text("Right or left?")
		.appendTo(section);
	$("<p></p>")
		.text("Where do you want Vertabs to reside?")
		.appendTo(section);
	$("<select><select />")
		.attr("id", "vertabs-side")
		.append($("<option />").text("left"))
		.append($("<option />").text("right"))
		.val(sideVal)
		.appendTo(section);
		
	// Pixels showing option
	$("<h2></h2>")
		.text("How much Vertabs to show when not hovered")
		.appendTo(section);
	$("</p>")
		.text("Set the amount of pixels of Vertabs that's showing when it's not hovered.")
		.append($("<input>")
			.attr("type", "number")
			.attr("id", "vertabs-pxs-showing")
			.attr("min", "1")
			.attr("max", "40")
			.val(pxsShowingVal))
		.appendTo(section);


	// Save options on change
	var changeSelector = "#vertabs-side, #vertabs-pxs-showing";
	$(wrapper).on("change", changeSelector, setOptions);
}