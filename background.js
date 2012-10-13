// Fetch all tabs, async
var tabList = chrome.tabs.getAllInWindow(function(){

	console.log(tabList);

	// Send the list to vertabs-injector.js when all tabs were fetched
	chrome.tabs.getSelected(null, function(tab) {

		chrome.tabs.sendMessage(tab.id, {tabs: tabList}, function(response) {
			alert(response.text);
		});

	});

});