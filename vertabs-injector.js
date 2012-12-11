chrome.extension.onMessage.addListener(
	function(request, sender, sendResponse) {

		if(request.turnOff) {
			$("div#vertabs").remove();
			return null;
		}

		var tabs = request.tabs;
		var options = request.options;

		var vertabs;
		var ul;

		if($("#vertabs").length === 0) {
			vertabs = $("<div></div>").attr("id", "vertabs");
			ul = $("<ul></ul>");
			vertabs.on("click", vertabsClickHandler);
		} else {
			vertabs = $("#vertabs");
			ul = vertabs.find("ul").empty();
		}

		vertabs.addClass(options.side);

		// "New tab"
		var newtabLi = $("<li></li>")
			.text("New tab")
			.addClass("vertabs-new-tab");

		ul.append(newtabLi);

		tabs.forEach(function(tab){
			var li = $("<li></li>").attr("data-tab-id", tab.id);

			// This will only output favicons with normal urls. SO question: http://tinyurl.com/d857xwk
			if(tab.favIconUrl && tab.favIconUrl.indexOf('chrome://') == -1) {

				var favicon = $("<img />")
					.attr("src", tab.favIconUrl)
					.appendTo(li);
			}

			// Full title or first 30 chars of title with '...' appended
			var title;
			if(tab.title.length > 30)
				title = tab.title.substring(0,27)+"...";
			else
				title = tab.title;

			$("<span></span>")
				.attr("data-text", title)
				.appendTo(li);

			var closeIcon = $("<img />")
				.attr("src", chrome.extension.getURL("imgs/close.png"))
				.addClass("vertabs-close-icon")
				.appendTo(li);

			// Show full url or 50 first chars with '...' appended
			var url;
			if(tab.url.length > 50)
				url = tab.url.substring(0, 47) + "...";
			else
				url = tab.url;

			li.append($("<small></small>").attr("data-text", url)).appendTo(ul);
		});

		if(tabs.length >= 10)
			ul.append(newtabLi.clone());

		vertabs.append(ul);
		$("body").append(vertabs);

		// Setting number of pixels showing
		var normalOffset;
		var hoveredOffset;
		if(options.side == "left") {
			normalOffset = "0";
			hoveredOffset = (vertabs.outerWidth() - options.pxShowing) * -1;
		} else {
			normalOffset = "0";
			hoveredOffset = (vertabs.outerWidth() - options.pxShowing) * -1;
		}
	}
);


function vertabsClickHandler(e) {
	var tabID;
	var closeID;

	// New tab clicked
	if(e.target.className == "vertabs-new-tab") {
		newTab();

	// Close tab if the close icon was clicked
	} else if(e.target.className == "vertabs-close-icon") {
		closeID = e.target.parentNode.getAttribute("data-tab-id");
		closeTab(closeID);

	// Otherwise switch to clicked tab. Make sure to grab the tab id from the li element
	} else {
		if(e.target.nodeName == "IMG" || e.target.nodeName == "SMALL")
			tabID = e.target.parentNode.getAttribute("data-tab-id");
		else
			tabID = e.target.getAttribute("data-tab-id");

		switchTab(tabID);
	}
}
function switchTab(tabID) {
	chrome.extension.sendMessage({gotoTab: tabID});
}
function closeTab(tabID) {
	chrome.extension.sendMessage({closeTab: tabID});
}
function newTab() {
	chrome.extension.sendMessage({newTab: true});
}
