(function($){

chrome.extension.onMessage.addListener(
	function(request, sender, sendResponse) {
		
		if(request.turnOff) {
			$("div#vertabs").remove();
			return null;
		}

		var tabs = request.tabs;
		var options = request.options;

		if($("#vertabs").length == 0) {
			var vertabs = $("<div></div>").attr("id", "vertabs");
			var ul = $("<ul></ul>");

			// Handles all click events. Delegation.
			vertabs.on("click", vertabsClickHandler);
		} else {
			var vertabs = $("#vertabs");
			var ul = vertabs.find("ul").empty();
		}

		// Set right or left side
		vertabs.addClass(options.side);

		// "New tab" li element
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

			var closeIcon = $("<img />")
				.attr("src", chrome.extension.getURL("imgs/close.png"))
				.addClass("vertabs-close-icon")
				.appendTo(li);

			// Title won't be longer than 30
			var title = (tab.title.length > 30) ? tab.title.substring(0,27)+"..." : tab.title;
			li.attr("data-text", title);
			
			// URLs won't be longer than 50
			var url = (tab.url.length > 50) ? tab.url.substring(0,47)+"..." : tab.url;
			li.append($("<small></small>")
				.attr("data-text", url))
				.appendTo(ul);
		});

		if(tabs.length >= 10) {
			ul.append(newtabLi);
		}

		vertabs.append(ul);
		$("body").append(vertabs);

		// Setting number of pixels showing
		if(options.side == "left") {
			var normalOffset = "0";
			var hoveredOffset = (vertabs.outerWidth() - options.pxShowing) * -1;
		} else {
			var normalOffset = "0";
			var hoveredOffset = (vertabs.outerWidth() - options.pxShowing) * -1;
		}		
		vertabs.mouseenter(function(){
			vertabs.css(options.side, normalOffset+"px");
		});
		vertabs.mouseleave(function(){
			vertabs.css(options.side, hoveredOffset+"px");
		});
		vertabs.mouseleave();
	}
);

})(jQuery);
// Functions below isn't using jQuery anyway...


function vertabsClickHandler(e) {
	// New tab clicked
	if(e.target.className == "vertabs-new-tab") {
		newTab();

	// Close tab if the close icon was clicked
	} else if(e.target.className == "vertabs-close-icon") {
		var closeID = e.target.parentNode.getAttribute("data-tab-id");
		closeTab(closeID);

	// Otherwise switch to clicked tab. Make sure to grab the tab id from the li element
	} else {
		if(e.target.nodeName == "IMG" || e.target.nodeName == "SMALL")
			var tabID = e.target.parentNode.getAttribute("data-tab-id");
		else
			var tabID = e.target.getAttribute("data-tab-id");

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