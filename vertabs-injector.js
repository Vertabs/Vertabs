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

		tabs.forEach(function(tab){
			var li = document.createElement("li");
			li.setAttribute("data-tab-id", tab.id);

			li.onclick = switchTab;

			li.appendChild(document.createTextNode(tab.title));
			ulNode.appendChild(li);
		});

		vertabsNode.appendChild(ulNode);

		document.body.appendChild(vertabsNode);
	}
);


function switchTab(e) {
	var tabID = e.target.getAttribute("data-tab-id");

	chrome.extension.sendMessage({gotoTab: tabID}, function(response) {
		// :)
	});
}