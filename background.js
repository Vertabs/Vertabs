var vertabsActive = false;
var vertabsBadge = "Off";
chrome.browserAction.setBadgeText({text:vertabsBadge});
chrome.browserAction.setBadgeBackgroundColor({color:"#be7633"});

/*
Pushing the Chrome toolbar button toggles Vertabs
*/
chrome.browserAction.onClicked.addListener(function(tab) {
	toggleVertabs();
});


/*
Receive message sent from a content script.
Will switch tab, or close a tab, depending on
what's specified in the request object.
*/
chrome.extension.onMessage.addListener(
	function(request, sender, sendResponse) {
		if(request.gotoTab) {
			chrome.tabs.update(parseInt(request.gotoTab), {active:true});
		} else if(request.closeTab) {
			chrome.tabs.remove(parseInt(request.closeTab));
		}
	}
);


chrome.tabs.onRemoved.addListener(function(tabID, removeInfo){
	if(vertabsActive)
		sendTabs();
});
chrome.tabs.onUpdated.addListener(function(tabID, changeInfo, tab){
	if(vertabsActive)
		sendTabs();
});


// Clicking the browserAction toggles Vertabs on and off
function toggleVertabs() {
	vertabsActive = !vertabsActive;
	vertabsBadge = (vertabsActive) ? "On" : "Off";
	chrome.browserAction.setBadgeText({text:vertabsBadge});

	// Tell content scripts to remove or add Vertabs
	if(vertabsActive) {
		sendTabs();
	} else {
		chrome.tabs.getAllInWindow(function(tabs){
			tabs.forEach(function(tab){
				chrome.tabs.sendMessage(tab.id, {turnOff: true});
			});
			return true;
		});
	}
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