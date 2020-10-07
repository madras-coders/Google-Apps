document.addEventListener('mouseup', function(event) {
	var text_selected = window.getSelection().toString();

	chrome.runtime.sendMessage({
		text_selected: text_selected,
	});
});
