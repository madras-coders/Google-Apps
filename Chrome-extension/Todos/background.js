var text_selected;

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	text_selected = request.text_selected;
});

chrome.browserAction.onClicked.addListener(function(tab) {
	chrome.storage.sync.get('notes', function(result) {
		notes = result.notes;
		if (!notes) {
			notes = [text_selected];
		} else {
			notes.push(text_selected);
		}
		chrome.storage.sync.set({ notes: notes });
		text_selected = '';
	});
});
