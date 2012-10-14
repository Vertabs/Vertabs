chrome.extension.onMessage.addListener(
	function(request, sender, sendResponse) {

		// Message from extension?
		if(!sender.tab) {
			var tabs = request.tabs;
			var vertabNode = document.createElement("div");
			vertabNode.setAttribute("id", "vertab");

			var ulNode = document.createElement("ul");

			tabs.forEach(function(tab){
				var li = document.createElement("li");
				li.appendChild(document.createTextNode(tab.title));
				ulNode.appendChild(li);
			});

			vertabNode.appendChild(ulNode);

			document.body.appendChild(vertabNode);
		}
	}
);