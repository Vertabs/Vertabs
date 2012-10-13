var tabs = [];

// Receive messages from background.js
chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {	
	tabs = sender.tabs;
	console.log(tabs.length);
	//sendResponse({text: "Number of tabs received: "+tabs.length});
});



var vertabNode = document.createElement("div");
vertabNode.setAttribute("id", "vertab");

var h1Node = document.createElement("h1");
h1Node.appendChild(document.createTextNode("Vertabs"));
vertabNode.appendChild(h1Node);

var ulNode = document.createElement("ul");

/*
Looping thru all available tabs
1. Create li element
2. Append text node to li element
3. Append li element to ulNode element
*/
console.log(tabs.length);
for(var i in tabs){
	var li = document.createElement("li");
	li.appendChild(document.createTextNode(tabs[i].url));
	ulNode.appendChild(li);
}

vertabNode.appendChild(ulNode);


document.body.appendChild(vertabNode);