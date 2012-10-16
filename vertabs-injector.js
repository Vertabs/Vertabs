chrome.extension.onMessage.addListener(
	function(request, sender, sendResponse) {
		var tabs = request.tabs;
		var vertabsNode;
		var ulNode;

		// Remove #vertabs if exists
		if(!(vertabsNode = document.getElementById("vertabs"))) {
			vertabsNode = document.createElement("div");
			vertabsNode.setAttribute("id", "vertabs");
			ulNode = document.createElement("ul");
		} else {
			ulNode = vertabsNode.getElementsByTagName("ul")[0];
			ulNode.innerHTML = "";
		}

		// Handles all click events. Delegation.
		vertabsNode.addEventListener("click", vertabsNodeClickHandler);

		tabs.forEach(function(tab){
			var li = document.createElement("li");
			li.setAttribute("data-tab-id", tab.id);			

			/*
			This will only output favicons with normal urls.
			SO question: http://tinyurl.com/d857xwk
			*/
			if(tab.favIconUrl && tab.favIconUrl.indexOf('chrome://') == -1) {
				var faviconNode = document.createElement("img");
				faviconNode.setAttribute('src', tab.favIconUrl);
				li.appendChild(faviconNode);
			}

			var closeNode = document.createElement("img");
			closeNode.setAttribute('src', chrome.extension.getURL("imgs/close.png"));
			closeNode.setAttribute('class', 'vertabs-close-icon')
			li.appendChild(closeNode);

			// Title won't be longer than 30
			var shorttitle = (tab.title.length > 30) ? tab.title.substring(0,27)+"..." : tab.title;
			li.appendChild(document.createTextNode(shorttitle));
			
			// URLs won't be longer than 50
			smallNode = document.createElement("small");
			var shorturl = (tab.url.length > 50) ? tab.url.substring(0,47)+"..." : tab.url;
			smallNode.appendChild(document.createTextNode(shorturl));
			li.appendChild(smallNode);

			ulNode.appendChild(li);
		});

		vertabsNode.appendChild(ulNode);


		document.body.appendChild(vertabsNode);
	}
);


function vertabsNodeClickHandler(e) {
	var closeID, tabID;

	// Close tab if the close icon was clicked
	if(e.target.className == "vertabs-close-icon") {
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