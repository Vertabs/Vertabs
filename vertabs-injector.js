/*
Define these variables here to be able to save them.
*/
var tablist;
var options;
var vertabsnode;
var ulnode;


chrome.extension.onMessage.addListener(
	function(request, sender, sendResponse) {

		if(request.turnOff) {
			$("div#vertabs").remove();
			return null;
		}


		tablist	= request.tabs;
		options	= request.options;


		if($("#vertabs").length === 0) {
			vertabsnode = $("<div></div>").attr("id", "vertabs");
			ulnode 		= $("<ul></ul>");

			vertabsnode.on("click", vertabsClickHandler);
			vertabsnode.on("hover", function(){});
		} else {
			vertabsnode = $("#vertabs");
			ulnode 		= vertabsnode.find("ul").empty();
		}

		// Pick your side, young Padawan.
		vertabsnode.removeClass(["left", "right"]);
		vertabsnode.addClass(options.side);

		// "New tab"
		var newtabLi = $("<li></li>")
						.text("+")
						.addClass("vertabs-new-tab");

		ulnode.append(newtabLi);

		// Create a list item for each tab
		tablist.forEach(function(tab){
			var li = $("<li></li>").attr("data-tab-id", tab.id);

			// This will only output favicons with normal urls. SO question: http://tinyurl.com/d857xwk
			if(tab.favIconUrl && tab.favIconUrl.indexOf('chrome://') == -1) {
				var favicon = $("<img />")
								.attr("src", tab.favIconUrl)
								.appendTo(li);
			}

			// Shorten the tab title if it's toooo long.
			var title;
			if(tab.title.length > 35) {
				title = tab.title.substring(0,32)+"...";
			} else {
				title = tab.title;
			}

			console.log(title.length);

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
				.appendTo(ulnode);
		});

		if(tablist.length >= 10)
			ulnode.append(newtabLi.clone());

		vertabsnode.append(ulnode);

		$("body").append(vertabsnode);

		// Show as many pixels as set by The User
		var hoveredOffset = (options.pxShowing - vertabsnode.outerWidth()) + 1; // Adding 1 to compensate for the 1px border.
		var cssProps = {};
		cssProps[options.side] = hoveredOffset;
		vertabsnode.css(cssProps);
	}
);


function vertabsClickHandler(event) {

	var tabID;
	var closeID;

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

function switchTab(id) {
	chrome.extension.sendMessage({gotoTab: id});
}
function closeTab(id) {
	chrome.extension.sendMessage({closeTab: id});
}
function newTab() {
	chrome.extension.sendMessage({newTab: true});
}