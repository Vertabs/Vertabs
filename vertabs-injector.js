chrome.extension.onMessage.addListener(
	function(request, sender, sendResponse) {

		var tabs = request.tabs;
		var vertabsNode;
		var ulNode;

		// Remove #vertabs if exists
		if(!(vertabsNode = document.getElementById("vertabs"))) {
			// vertabsNode.parentNode.removeChild(vertabsNode);
			vertabsNode = document.createElement("div");
			vertabsNode.setAttribute("id", "vertabs");

			ulNode = document.createElement("ul");
		} else {
			ulNode = vertabsNode.getElementsByTagName("ul")[0];
			ulNode.innerHTML = "";
		}

		vertabsNode.addEventListener("click", vertabsNodeClickHandler);

		tabs.forEach(function(tab){
			var li = document.createElement("li");
			li.setAttribute("data-tab-id", tab.id);

			// This should be delegated to UL!
			// li.addEventListener("click", switchTab);
			

			/*
			Chrome Extensions don't have proper access to favicon stored under chrome://
			This will only output favicons with normal urls. Might change in the future.£
			*/
			if(tab.favIconUrl && tab.favIconUrl.indexOf('chrome://') == -1) {
				var faviconNode = document.createElement("img");
				faviconNode.setAttribute('src', tab.favIconUrl);
				li.appendChild(faviconNode);
			}

			var closeNode = document.createElement("img");
			var closeSrc = chrome.extension.getURL("imgs/close.png");
			closeNode.setAttribute('src', closeSrc);
			closeNode.setAttribute('class', 'vertabs-close-icon')

			// This should be delegated to UL!
			// closeNode.addEventListener("click", function(){console.log("Close!");});

			li.appendChild(closeNode);

			var shorttitle = (tab.title.length > 30) ? tab.title.substring(0,27)+"..." : tab.title;
			li.appendChild(document.createTextNode(shorttitle));
			
			smallNode = document.createElement("small");
			var shorturl = (tab.url.length > 50) ? tab.url.substring(0,47)+"..." : tab.url;
			urlText = document.createTextNode(shorturl);
			smallNode.appendChild(urlText);
			li.appendChild(smallNode);


			ulNode.appendChild(li);
		});

		vertabsNode.appendChild(ulNode);

		document.body.appendChild(vertabsNode);
	}
);


function vertabsNodeClickHandler(e) {
	var closeID, tabID;

	console.log(e);

	// Check if close icon was clicked
	if(e.target.className == "vertabs-close-icon") {
		
		closeID = e.target.parentNode.getAttribute("data-tab-id");
		closeTab(closeID);

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



