var vertabsActive = [];
var iconPath = "imgs/icon_inactive.png";


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
		if(request.newTab) {
			chrome.tabs.create({});
		} else if(request.gotoTab) {
			chrome.tabs.update(parseInt(request.gotoTab), {active:true});
		} else if(request.closeTab) {
			chrome.tabs.remove(parseInt(request.closeTab));
		}
	}
);


/*
Listen for tab events being removed or created.
*/
chrome.tabs.onRemoved.addListener(function(tabID, removeInfo){
	chrome.windows.getCurrent(function(win){
		if(vertabsActive[win.id])
			sendTabs();
	});
});
chrome.tabs.onUpdated.addListener(function(tabID, changeInfo, tab){
	if(vertabsActive[tab.windowId])
		sendTabs();
});


/*
Clicking the browserAction toggles Vertabs on and off in
that particular Chrome window.
*/
function toggleVertabs(tab) {
	
	vertabsActive[tab.windowId] = !vertabsActive[tab.windowId];

	if(vertabsActive[tab.windowId]) {
		sendTabs();
		var iconPath = "imgs/icon.png";
	} else {
		chrome.tabs.getAllInWindow(function(tabs){
			tabs.forEach(function(tab){
				chrome.tabs.sendMessage(tab.id, {turnOff: true});
			});
			return true;
		});
		var iconPath = "imgs/icon_inactive.png";
	}

	chrome.tabs.getAllInWindow(function(tabs){
		tabs.forEach(function(tab){
			chrome.browserAction.setIcon({tabId: tab.id,path:iconPath});
		});
		return true;
	});
}

function sendTabs() {
	// Fetch all tabs, async
	chrome.tabs.getAllInWindow(function(tabs){

		// Send list of tabs to each open tab. How bad is that performance-wise?
		tabs.forEach(function(tab){
			chrome.tabs.sendMessage(tab.id, {tabs: tabs});
		});

		return true;
	});
}