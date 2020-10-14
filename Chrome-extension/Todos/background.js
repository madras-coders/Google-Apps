var text_selected;

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	text_selected = request.text_selected;
});

chrome.runtime.onInstalled.addListener(function() {
	let welcome_note = ['Thank you for choosing Todos notes !!! '];
	chrome.storage.sync.set({ todos_notes: welcome_note });
});

chrome.browserAction.onClicked.addListener(function(tab) {
	chrome.storage.sync.get('todos_notes', function(result) {
		notes = result.todos_notes;
		if (!notes) {
			notes = [text_selected];
		} else {
			notes.push(text_selected);
		}
		notes = notes.filter(function(e) {
			return e;
		});
		chrome.storage.sync.set({ todos_notes: notes });
		text_selected = '';
	});
});
