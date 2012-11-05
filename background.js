/*
Is Vertabs 1.2 installed? Otherwise show welcome.html
*/
if(!localStorage.getItem("vertabsInstalled1.2")) {
	localStorage.setItem("vertabsInstalled1.2", true);
	chrome.tabs.create({url: chrome.extension.getURL("welcome.html")});
}




var vertabsActive = [];
var iconPath = "imgs/icon_inactive.png";
var options = {
	side: localStorage.getItem("vertabs-position-side") || "left",
	pxShowing: localStorage.getItem("vertabs-pxs-showing") || "10"
};


/*
Pushing the Chrome toolbar button toggles Vertabs in that window.
Users can have multiple Chrome windows, and therefore Vertabs
active in some of them, and inactive in some of them.
*/
chrome.browserAction.onClicked.addListener(function(tab) {
	toggleVertabs(tab);
});


/*
Receive message sent from a content script.
Will switch tab, or close a tab, depending on
what's specified in the request object.
*/
chrome.extension.onMessage.addListener(
	function(request, sender, sendResponse) {
		
		// Open new tab
		if(request.newTab) {
			chrome.tabs.create({});

		// Switch tab
		} else if(request.gotoTab) {
			chrome.tabs.update(parseInt(request.gotoTab), {active:true});

		// Close tab
		} else if(request.closeTab) {
			chrome.tabs.remove(parseInt(request.closeTab));
		
		// Catch options saved
		} else if(request.storageLabels) {
			options.side = localStorage.getItem(request.storageLabels.side);
			options.pxShowing = localStorage.getItem(request.storageLabels.pxShowing);
			sendTabs();
		}
	}
);


/*
Listen for tab events.
Just listening for remove or create seems to be enough.
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


/*
Clicking the browserAction toggles Vertabs on and off in
that particular Chrome window.
*/
function toggleVertabs(tab) {

	if(vertabsActive[tab.windowId] == true) vertabsActive[tab.windowId] = false;
	else vertabsActive[tab.windowId] = true;

	if(vertabsActive[tab.windowId] == true) {
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
Loop thru each tab in current window and show Vertabs
*/
function sendTabs() {
	chrome.tabs.getAllInWindow(function(tabs){
		tabs.forEach(function(tab){
			chrome.tabs.sendMessage(tab.id, {tabs: tabs, options: options});
		});
		return true;
	});
}