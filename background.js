/*****
VERTABS - Vertical Tabs for Chrome

By Anton Niklasson
http://www.antonniklasson.se
*****/


/* Is this the versions first run? If that's true - show welcome.html */
chrome.storage.sync.get("vertabs-1.3", function(object){

	console.log(object['vertabs-1.3'] !== 1);

	if(object['vertabs-1.3'] !== 1) {
		// Store the "installed" state and open the welcome tab
		chrome.storage.sync.set({"vertabs-1.3": 1}, function(){
			chrome.tabs.create(
				{url:chrome.extension.getURL("welcome.html")}
			);
		});
	}
});


/**
vertabsActive[]
- Array to keep track of which Chrome windows have Vertabs activated.

options{}
- A simple object keeping track of settings. For now just right/left and number of pixels showing.
**/
var vertabsActive = [];
var iconPath      = "imgs/icon_inactive.png";
var options       = {
		side: chrome.storage.sync.get("vertabs-position-side", function(){}) || "left",
		pxShowing: chrome.storage.sync.get("vertabs-pxs-showing", function(){}) || "10"
};


/*
Pushing the Chrome toolbar button toggles Vertabs in that window.
Users can have multiple Chrome windows, and therefore Vertabs
activated in some of them.
*/
chrome.browserAction.onClicked.addListener(function(tab) {
	toggleVertabs(tab);
});


/*
Receive message sent from a content script.
Switch tab, or close a tab, depending on
what's specified in the request object.
*/
chrome.extension.onMessage.addListener(
	function(request, sender, sendResponse) {

		// Open new tab
		if(request.newTab) {
			chrome.tabs.create({});

		// Switch tab
		} else if(request.gotoTab) {
			chrome.tabs.update(
				parseInt(request.gotoTab),
				{active: true}
			);

		// Close tab
		} else if(request.closeTab) {
			chrome.tabs.remove(
				parseInt(request.closeTab)
			);

		// Catch options saved
		} else if(request.storageLabels) {

			options.side = chrome.storage.sync.get(request.storageLabels.side, function(){});
			options.pxShowing = chrome.storage.sync.get(request.storageLabels.pxShowing, function(){});

			sendTabs();
		}
	}
);


/*
Listen for tab events.
Upadte Vertabs when...
	- Closing
	- Updating
	- Moving
	- Detaching
tabs.
*/
chrome.tabs.onRemoved.addListener(function(tabID, removeInfo){
	chrome.windows.getCurrent(function(win){
		if(vertabsActive[win.id]) {
			sendTabs();
		}
	});
});
chrome.tabs.onUpdated.addListener(function(tabID, changeInfo, tab){
	if(vertabsActive[tab.windowId])
		sendTabs();

	chrome.browserAction.setIcon({tabId: tab.id, path: iconPath});
});
chrome.tabs.onMoved.addListener(function(tabID, moveInfo){
	if(vertabsActive[moveInfo.windowId])
		sendTabs();
});
chrome.tabs.onDetached.addListener(function(tabID, detachInfo){
	if(vertabsActive[detachInfo.windowId])
		sendTabs();
});


/*
Clicking the browserAction toggles Vertabs on and off in
that particular window. It also toggles between "active"/"inactive" icon.
*/
function toggleVertabs(tab) {

	if(vertabsActive[tab.windowId] === true) {
		vertabsActive[tab.windowId] = false;
	} else {
		vertabsActive[tab.windowId] = true;
	}

	if(vertabsActive[tab.windowId] === true) {
		sendTabs();
		iconPath = "imgs/icon.png";
	} else {
		chrome.tabs.getAllInWindow(function(tabs){
			tabs.forEach(function(tab){
				chrome.tabs.sendMessage(tab.id, {turnOff: true});
			});
			return true;
		});

		iconPath = "imgs/icon_inactive.png";
	}

	chrome.tabs.getAllInWindow(function(tabs){
		tabs.forEach(function(tab){
			chrome.browserAction.setIcon({tabId: tab.id,path:iconPath});
		});
		return true;
	});
}

/*
Send all tabs and options to the currently open window.
*/
function sendTabs() {
	chrome.tabs.getAllInWindow(function(tabs){
		tabs.forEach(function(tab){
			chrome.tabs.sendMessage(tab.id, {tabs: tabs, options: options});
		});
		return true;
	});
}
