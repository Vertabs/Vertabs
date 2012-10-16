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


chrome.browserAction.onClicked.addListener(function(tab){
	
});


// Receive message and switch tab
chrome.extension.onMessage.addListener(
	function(request, sender, sendResponse) {
		if(request.gotoTab) {
			chrome.tabs.update(parseInt(request.gotoTab), {active:true});
		} else if(request.closeTab) {
			chrome.tabs.remove(parseInt(request.closeTab));
		}
	}
);


// onRemoved will update the tablist
chrome.tabs.onRemoved.addListener(function(tabID, removeInfo){
	console.log("onRemoved ID: "+tabID);
	console.log(removeInfo);
	console.log("");

	sendTabs();
});


chrome.tabs.onUpdated.addListener(function(tabID, changeInfo, tab){
	console.log("onUpdated. Status: "+changeInfo.status);
	console.log(tab);
	console.log("");

	sendTabs();
});
/*chrome.tabs.onCreated.addListener(function(){
	console.log("onCreated");
});*/
/*chrome.tabs.onActiveChanged.addListener(function(){
	console.log("onActiveChanged");
});*/