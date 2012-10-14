chrome.extension.onMessage.addListener(
	function(request, sender, sendResponse) {
		
		console.log("hello");

		if(request.tabReady) {

			// Fetch all tabs, async
			chrome.tabs.getAllInWindow(function(tabs){
				sendResponse({tabs:tabs});
			});

			return true;
		}
	}
);