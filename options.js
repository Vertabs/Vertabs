$(getOptions);

var labels = {
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


	var section = $("#wrapper section");

	// Side option
	$("<h2></h2>")
		.text(labels.side)
		.appendTo(wrapper);
	$("<select><select />")
		.attr("id", "vertabs-side")
		.append($("<option />").text("Left"))
		.append($("<option />").text("Right"))
		.val(sideVal)
		.appendTo(wrapper);



	// Pixels showing option
	$("</p>")
		.text(labels.pxShowing)
		.append($("<input>")
			.attr("type", "number")
			.attr("id", "vertabs-pxs-showing")
			.attr("min", "1")
			.attr("max", "40")
			.val(pxsShowingVal))
		.appendTo(wrapper);


	// Save options on change
	var changeSelector = "#vertabs-side, #vertabs-pxs-showing";
	$(wrapper).on("change", changeSelector, setOptions);
}