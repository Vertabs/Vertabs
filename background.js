function sendTabs() {

	// Fetch all tabs, async
	chrome.tabs.getAllInWindow(function(tabs){

		// Select the open tab
		chrome.tabs.getSelected(null, function(tab) {
			
			console.log("Tab status: "+tab.status);

			// Send message to that tab
			if(tab.status == "complete") {
				chrome.tabs.sendMessage(tab.id, {tabs: tabs}, function(response) {
					
					// Tabs were sent, callback code here

				});
			}

		});

	});

}


chrome.tabs.onCreated.addListener(function(e){
	console.log("onCreated");
});
chrome.tabs.onRemoved.addListener(function(tabid, removeinfo){
	console.log("Removed:");
	console.log(removeinfo);
});
chrome.tabs.onUpdated.addListener(function(tabid, changeinfo, tab){
	console.log("Updated: "+tab.url);
	console.log(changeinfo);
});