var tabs = new Array();

// Fetch all tabs, async
chrome.tabs.getAllInWindow(function(t){

	tabs = t;
	chrome.extension.getBackgroundPage().console.log(tabs);

	// Send the list to vertabs-injector.js at callback
	chrome.tabs.getSelected(null, function(tab){

		chrome.tabs.sendMessage(tab.id, {tabsList: tabs}, function(response) {
			// Message now confirmed as reveived by content script
		});

	});

});