// Now ready to receive all open tabs	
chrome.extension.sendMessage({tabReady: true}, function(response) {
	
	var tabs = response.tabs;
	var vertabNode = document.createElement("div");
	vertabNode.setAttribute("id", "vertab");

	var h1Node = document.createElement("h1");
	h1Node.appendChild(document.createTextNode("Vertabs"));
	vertabNode.appendChild(h1Node);

	var ulNode = document.createElement("ul");


	tabs.forEach(function(tab){
		var li = document.createElement("li");
		li.appendChild(document.createTextNode(tab.url));
		ulNode.appendChild(li);
	});


	vertabNode.appendChild(ulNode);

	document.body.appendChild(vertabNode);

});