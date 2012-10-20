/*
Is Vertabs installed? Otherwise show welcome.html
*/
if(localStorage.getItem("vertabsInstalled")) {
	
} else {
	localStorage.setItem("vertabsInstalled", true);
	chrome.tabs.create({url: chrome.extension.getURL("welcome.html")});
}	



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
			chrome.tabs.create({}, function(tab) {
				// chrome.tabs.update(tab.id, {url:tab.url, selected:true});
			});
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

/*
Loop thru each tab in current window and show Vertabs
*/
function sendTabs() {
	chrome.tabs.getAllInWindow(function(tabs){
		tabs.forEach(function(tab){
			chrome.tabs.sendMessage(tab.id, {tabs: tabs});
		});
		return true;
	});
}