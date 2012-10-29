$(getOptions);

var labels = {
	h1: 			"Vertabs - Settings", 
	side: 		"Position",
	pxShowing: 	"Pixels showing when not hovered:"
};

var storage = {
	side: "vertabs-position-side",
	pxShowing: "vertabs-pxs-showing"
};


function setOptions(event) {
	var newSide = $("#vertabs-side").val();
	var newPxs = $("#vertabs-pxs-showing").val();
	
	localStorage.setItem(storage.side, newSide);
	localStorage.setItem(storage.pxShowing, newPxs);
}

function getOptions() {
	var sideVal = localStorage.getItem(storage.side);
	var pxsShowingVal = localStorage.getItem(storage.pxShowing);


	var wrapper = $("div#wrapper");

	// Page title
	$("<h1></h1>")
		.text(labels.h1)
		.appendTo(wrapper);

	// Side option
	$("<h2></h2>")
		.text(labels.side)
		.appendTo(wrapper);
	$("<select><select />")
		.attr("id", "vertabs-side")
		.append($("<option />").val("left").text("Left"))
		.append($("<option />").val("right").text("Right"))
		.val((sideVal == "left") ? "left" : "right";)
		.appendTo(wrapper);



	// Pixels showing option
	$("</p>")
		.text(labels.pxShowing)
		.append($("<input>")
			.attr("type", "number")
			.attr("id", "vertabs-pxs-showing")
			.attr("value", "5")
			.attr("min", "0")
			.attr("max", "30"))
		.appendTo(wrapper);


	// Save options on change
	var changeSelector = "#vertabs-side, #vertabs-pxs-showing";
	$(wrapper).on("change", changeSelector, setOptions);
}