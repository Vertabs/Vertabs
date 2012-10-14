chrome.extension.onMessage.addListener(
	function(request, sender, sendResponse) {

		var tabs = request.tabs;

		// Remove #vertabs if exists
		if(document.getElementById("vertabs")) {
			document.removeChild(document.getElementById("vertabs"));
		}

		// #vertabs now removed
		var vertabsNode = document.createElement("div");
		vertabsNode.setAttribute("id", "vertabs");

		var ulNode = document.createElement("ul");

		tabs.forEach(function(tab){
			var li = document.createElement("li");
			li.appendChild(document.createTextNode(tab.title));
			ulNode.appendChild(li);
		});

		vertabsNode.appendChild(ulNode);

		document.body.appendChild(vertabsNode);
	}
);