/*****
VERTABS - Vertical Tabs for Chrome

By Anton Niklasson
http://www.antonniklasson.se
*****/


// Installed or not?
chrome.storage.sync.get("vertabs-installed", function(object){

	/* Vertabs 1.3 previously installed? If not, show welcome.html */
	if(object['vertabs-installed'] !== 1) {
		chrome.storage.sync.set({"vertabs-installed": 1}, function(){
			// Save installed as state, and show welcome.html
			chrome.tabs.create(
				{url:chrome.extension.getURL("welcome.html")}
			);
		});
	}
});


var vertabsActive = [];
var iconPath = "imgs/icon_inactive.png";
var options = {};
var storageLabels = ["vertabs-position-side", "vertabs-pxs-showing"];

chrome.storage.sync.get(storageLabels, function(object){
	options.side = object['vertabs-position-side'];
	options.pxShowing = object['vertabs-pxs-showing'];
});


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
Depending on what is specified in the request:
 - Open a new tab
 - Switch tab
 - Close a tab
 - React to saved options and refresh Vertabs
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

		// Close given tab
		} else if(request.closeTab) {
			chrome.tabs.remove(
				parseInt(request.closeTab)
			);

		// Options were saved
		} else if(request.storageLabels) {
			chrome.storage.sync.get(storageLabels, function(object){

				options.side = object[storageLabels[0]];
				options.pxShowing = object[storageLabels[1]];

				sendTabs();
			});
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
Send out Vertabs to every tab in every window of Chrome
*/
function sendTabs() {
	chrome.windows.getAll({populate:true}, function(windows){
		windows.forEach(function(window){
			window.tabs.forEach(function(tab){
				chrome.tabs.sendMessage(tab.id, {tabs: window.tabs, options: options});
			});
		});
	});
}