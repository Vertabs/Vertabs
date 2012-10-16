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
	sendTabs();
});
chrome.tabs.onUpdated.addListener(function(tabID, changeInfo, tab){
	sendTabs();
});


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