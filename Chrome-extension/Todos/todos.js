/**
 * todos chrome extension
 *
 * A simple Note taking application. Replaces the new tab to display the notes.
 * Highlight the text and save to notes. 
 * 
 * Default short cut keys. Mac -> CMD + E. Windows -> Ctrl + E.
 * 
 * Multi language support.
 * 
 * Sync notes between multiple devices using same chrome login.
 *
 * author: Saravana Mahesh Thangavelu
 * 
 * year: 2020
 */

window.onload = function() {
	var dt = new Date();
	var hours = dt.getHours();
	var minutes = ('0' + dt.getMinutes()).slice(-2);
	document.getElementById('time').innerHTML = hours + ':' + minutes;

	var noteId = 0;
	var data = document.getElementById('data');
	data.addEventListener('blur', onblur, false);

	//Set the background images
	var n = Math.floor(Math.random() * 7 + 1);
	document.body.style.backgroundImage = "url('images/" + n + ".jpg')";

	loadNotes();

	// load notes from chrome storage
	function loadNotes() {
		noteId = 0;
		notes = [];
		document.getElementById('data').innerHTML = '';

		chrome.storage.sync.get('todos_notes', function(result) {
			notes = result.todos_notes;
			if (!notes) {
				notes = [''];
			}

			notes.forEach(function(element) {
				let div = document.createElement('div');
				div.setAttribute('id', noteId);
				let rmBtn = getRemoveBtn();
				let noteTxt = getNoteElement(noteId);
				noteTxt.appendChild(document.createTextNode(element));
				div.appendChild(rmBtn);
				div.appendChild(noteTxt);
				data.appendChild(div);
				noteId++;
			});
		});
	}

	// returns a remove button element
	function getRemoveBtn() {
		let div = document.createElement('div');
		div.innerHTML =
			'<img src="images/remove.png" id="image" style="width:30px;height:30px"/>';
		div.setAttribute('style', 'display: inline;');
		div.addEventListener('click', removeNote, false);

		return div;
	}

	// Returns the tags for Note text
	function getNoteElement(id) {
		let div = document.createElement('div');
		div.setAttribute('id', id);
		div.setAttribute('contentEditable', true);
		div.setAttribute('class', 'note');
		// set event listeners for 'Enter' key, 'Backspace' key and'Blur'
		div.addEventListener('keypress', keypressEvent, false);
		div.addEventListener('keydown', keydownEvent, false);
		div.addEventListener('blur', onblur, false);
		div.setAttribute('style', 'display: inline;');

		return div;
	}

	// when enter key is pressed.
	// insert a new line after the current line and set focus.
	function keypressEvent(e) {
		currElement = e.target.parentNode;
		let key = e.which || e.keyCode;
		if (key == 13) {
			e.preventDefault();
			let div = document.createElement('div');
			div.setAttribute('id', noteId);
			let rmBtn = getRemoveBtn();
			let noteTxt = getNoteElement(noteId);
			noteTxt.appendChild(document.createTextNode(''));
			div.appendChild(rmBtn);
			div.appendChild(noteTxt);
			// Insert after the current note.
			currElement.parentNode.insertBefore(div, currElement.nextSibling);
			div.getElementsByClassName('note')[0].focus();
			noteId++;
		}
	}

	// when Backspace key is pressed
	// Delete the line and remove button.
	function keydownEvent(e) {
		var key = e.which || e.keyCode;
		currElement = e.target;
		if (key == 8) {
			let div = currElement.parentNode;
			let note = div.getElementsByClassName('note')[0].innerText;
			if (note == '' || note == null) {
				removedivbyid(e.target.id);
			}
		}
	}

	// triggered when the div is out of focus
	function onblur(e) {
		if (e.target.innerText) {
			notes = data.innerText.split('\n');
			chrome.storage.sync.set({ todos_notes: notes });
		} else {
			// remove if there are any empty note lines.
			notes = data.innerText.replace(/(^[ \t]*\n)/gm, '').split('\n');
			chrome.storage.sync.set({ todos_notes: notes }, function() {
				loadNotes();
			});
		}
	}

	// remove a div element from the html based on id.
	function removedivbyid(div_id) {
		document.getElementById(div_id).remove();
	}

	// event handler for remove note button.
	function removeNote(e) {
		div_id = e.path[2].id;
		if (div_id !== 'data') {
			// do not delete the entire data element accidentally due to html image glitches.
			document.getElementById(div_id).remove();
			notes = data.innerText.split('\n');
			chrome.storage.sync.set({ todos_notes: notes });
			loadNotes();
		}
	}
};
