chrome.extension.onMessage.addListener(
	function(request, sender, sendResponse) {

		if(request.turnOff) {
			$("div#vertabs").remove();
			return null;
		}

		var tabs 	 = request.tabs,
			options  = request.options,
			vertabs,
			ul;

		if($("#vertabs").length === 0) {
			vertabs = $("<div></div>").attr("id", "vertabs");
			ul 		= $("<ul></ul>");

			vertabs.on("click", vertabsClickHandler);
			vertabs.on("hover", function(){});
		} else {
			vertabs = $("#vertabs");
			ul 		= vertabs.find("ul").empty();
		}

		vertabs.addClass(options.side);

		// "New tab"
		var newtabLi = $("<li></li>")
						.text("New tab")
						.addClass("vertabs-new-tab");

		ul.append(newtabLi);

		// Create a list item for each tab
		tabs.forEach(function(tab){
			var li = $("<li></li>").attr("data-tab-id", tab.id);

			// This will only output favicons with normal urls. SO question: http://tinyurl.com/d857xwk
			if(tab.favIconUrl && tab.favIconUrl.indexOf('chrome://') == -1) {
				var favicon = $("<img />")
								.attr("src", tab.favIconUrl)
								.appendTo(li);
			}

			// Full title or first 27 chars of title with '...' appended
			var title;
			if(tab.title.length > 30) {
				title = tab.title.substring(0,27)+"...";
			} else {
				title = tab.title;
			}

			$("<span></span>")
				.attr("data-text", title)
				.appendTo(li);

			var closeIcon = $("<img />")
							.attr("src", chrome.extension.getURL("imgs/close.png"))
							.addClass("vertabs-close-icon")
							.appendTo(li);

			// Show full url or 47 first chars with '...' appended
			var url;
			if(tab.url.length > 50) {
				url = tab.url.substring(0, 47) + "...";
			} else {
				url = tab.url;
			}

			li.append($("<small></small>")
				.attr("data-text", url))
				.appendTo(ul);
		});

		if(tabs.length >= 10)
			ul.append(newtabLi.clone());

		vertabs.append(ul);

		$("body").append(vertabs);

		// Setting number of pixels showing
		var normalOffset  = "0";
		var hoveredOffset = (vertabs.outerWidth() - options.pxShowing) * -1;
	}
);


function vertabsClickHandler(event) {

	var tabID,
		closeID;

	// New tab clicked
	if(event.target.className == "vertabs-new-tab") {
		newTab();

	// Close tab if the close icon was clicked
	} else if(event.target.className == "vertabs-close-icon") {
		closeID = event.target.parentNode.getAttribute("data-tab-id");
		closeTab(closeID);

	// Otherwise switch to clicked tab. Grab the tab id from the li element.
	} else {
		if(event.target.nodeName == "IMG" || event.target.nodeName == "SMALL") {
			tabID = event.target.parentNode.getAttribute("data-tab-id");
		} else {
			tabID = event.target.getAttribute("data-tab-id");
		}

		switchTab(tabID);
	}
}

function vertabsHoverHandler(event) {

}

function switchTab(id) {
	chrome.extension.sendMessage({gotoTab: id});
}

function closeTab(id) {
	chrome.extension.sendMessage({closeTab: id});
}

function newTab() {
	chrome.extension.sendMessage({newTab: true});
}
