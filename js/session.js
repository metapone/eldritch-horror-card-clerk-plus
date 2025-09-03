// --- Multi-session constants and helpers ---
const SINGLE_SESSION_KEY = "Eldritch Horror Session"; // legacy
const SESSIONS_INDEX_KEY = "EHCC+ Sessions Index"; // array of { id, name, createdAt, updatedAt }
const CURRENT_SESSION_ID_KEY = "EHCC+ Current Session ID";

function getSessionsIndex() {
	let index = [];
	try {
		index = JSON.parse(localStorage.getItem(SESSIONS_INDEX_KEY)) || [];
	} catch (_) {
		index = [];
	}
	// Migrate legacy single save if present and no index exists
	try {
		const legacy = localStorage.getItem(SINGLE_SESSION_KEY);
		if (legacy && index.length === 0) {
			const id = generateSessionId();
			const name = `Session 1`;
			localStorage.setItem(sessionStorageKey(id), legacy);
			index = [{ id, name, createdAt: Date.now(), updatedAt: Date.now() }];
			localStorage.setItem(SESSIONS_INDEX_KEY, JSON.stringify(index));
			localStorage.setItem(CURRENT_SESSION_ID_KEY, id);
			localStorage.removeItem(SINGLE_SESSION_KEY);
		}
	} catch (e) {
		console.error("Error migrating legacy session:", e);
	}
	return index;
}

function setSessionsIndex(index) {
	localStorage.setItem(SESSIONS_INDEX_KEY, JSON.stringify(index));
}

function sessionStorageKey(id) {
	return `EHC+ Session:${id}`;
}

function generateSessionId() {
	// Simple unique id: timestamp + random
	return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function getCurrentSessionId() {
	return localStorage.getItem(CURRENT_SESSION_ID_KEY);
}

function setCurrentSessionId(id) {
	if (id) {
		localStorage.setItem(CURRENT_SESSION_ID_KEY, id);
	} else {
		localStorage.removeItem(CURRENT_SESSION_ID_KEY);
	}
}

function createNewSession(name) {
	try {
		const id = generateSessionId();
		const now = Date.now();
		const index = getSessionsIndex();
		index.push({ id, name: name || `Session ${new Date(now).toISOString()}`, createdAt: now, updatedAt: now });
		setSessionsIndex(index);
		setCurrentSessionId(id);
		renderCurrentSessionBanner();
		return id;
	} catch (e) {
		alert("Error creating session. Please refresh the page and try again.");
		console.error("Session creation error:", e);
		return null;
	}
}

function updateSessionTimestamp(id) {
	const index = getSessionsIndex();
	const entry = index.find((s) => s.id === id);
	if (entry) {
		entry.updatedAt = Date.now();
		setSessionsIndex(index);
	}
}

function renameSession(id, newName) {
	const index = getSessionsIndex();
	const entry = index.find((s) => s.id === id);
	if (entry) {
		entry.name = newName;
		setSessionsIndex(index);
		renderSavedSessions();
		renderCurrentSessionBanner();
	}
}

// --- Save / Load / Delete APIs ---
function saveGame() {
	try {
		const currentId = getCurrentSessionId();
		if (!currentId) {
			throw new Error("No current session ID");
		}
		const saveItem = {
			expansions,
			decks,
			deckVisibility,
			mythosDeck,
			boxMythosDeck,
		};
		localStorage.setItem(sessionStorageKey(currentId), JSON.stringify(saveItem));
		updateSessionTimestamp(currentId);
	} catch (e) {
		alert("Error saving game. Please refresh the page and try again.");
		console.error("Session save error:", e);
	}
}

function loadGame(sessionId = null) {
	try {
		let id = sessionId;
		if (!id) {
			// Pick most recently updated session
			const index = getSessionsIndex();
			if (index.length === 0) {
				return;
			}
			index.sort((a, b) => (b.updatedAt ?? b.createdAt) - (a.updatedAt ?? a.createdAt));
			id = index[0].id;
		}
		const savedItem = JSON.parse(localStorage.getItem(sessionStorageKey(id)));
		if (!savedItem) {
			return;
		}

		// Reset runtime state, then apply saved values
		resetGlobalVariables();
		deckVisibility = savedItem.deckVisibility || {};
		loadExpansions(savedItem);
		loadDecks(savedItem);
		renderDeckPanels();
		renderMythosDeckPanel();
		if (mythosDeck) {
			renderInitMythosDeck();
		}
		// Set current session before any UI triggers a save
		setCurrentSessionId(id);
		renderCurrentSessionBanner();
		renderDeckVisibilityPanel();
		switchToView("mainView");
	} catch (e) {
		console.log(e);
	}
}

function deleteGame(sessionId) {
	try {
		const index = getSessionsIndex();
		const i = index.findIndex((s) => s.id === sessionId);
		if (i === -1) {
			return;
		}
		localStorage.removeItem(sessionStorageKey(sessionId));
		index.splice(i, 1);
		setSessionsIndex(index);
		if (getCurrentSessionId() === sessionId) {
			setCurrentSessionId(null);
			renderCurrentSessionBanner();
			switchToView("startView");
		}
		renderSavedSessions();
	} catch (e) {
		console.log(e);
	}
}

function loadDecks(savedItem) {
	savedItem.decks.forEach((item) => {
		decks.push(new deck(item.name, item.subtitle, item.cssClass, item.availableCards, item.playedCards));
	});

	const savedMythos = savedItem.mythosDeck;
	if (savedMythos) {
		mythosDeck = new deck(savedMythos.name, savedMythos.subtitle, savedMythos.cssClass, savedMythos.availableCards, savedMythos.playedCards);
	}

	const savedBoxMythos = savedItem.boxMythosDeck;
	if (savedBoxMythos) {
		boxMythosDeck = new deck(
			savedBoxMythos.name,
			savedBoxMythos.subtitle,
			savedBoxMythos.cssClass,
			savedBoxMythos.availableCards,
			savedBoxMythos.playedCards
		);
	}
}

function loadExpansions(savedItem) {
	expansions.push(...savedItem.expansions);

	const expansionsSelected = document.getElementsByName("expansions");
	for (let i = 0; i < expansionsSelected.length; i++) {
		expansionsSelected[i].checked = expansions.includes(Number(expansionsSelected[i].value));
	}
}

// --- UI: Saved Sessions List (Start View) ---
function renderSavedSessions() {
	const container = document.getElementById("savedSessions");
	if (!container) {
		return;
	}
	const listEl = container.querySelector(".saved-sessions__list");
	const emptyEl = container.querySelector(".saved-sessions__empty");
	const index = getSessionsIndex();

	if (!index || index.length === 0) {
		listEl.replaceChildren();
		emptyEl.style.display = "block";
		return;
	}

	emptyEl.style.display = "none";

	// Use template to build the table and rows
	const template = document.getElementById("savedSessionsTemplate");
	if (!template) {
		// Fallback: if template missing, just clear and show nothing to avoid errors
		listEl.replaceChildren();
		return;
	}

	const tableFrag = template.content.cloneNode(true);
	const tableEl = tableFrag.querySelector(".saved-sessions__table");
	const tbody = tableFrag.querySelector("tbody");
	const rowTemplate = tbody.querySelector("tr");

	// Clear tbody before populating
	tbody.replaceChildren();

	index
		.slice()
		.sort((a, b) => (b.updatedAt ?? b.createdAt) - (a.updatedAt ?? a.createdAt))
		.forEach((s) => {
			const tr = rowTemplate.cloneNode(true);
			const nameSpan = tr.querySelector(".saved-session__name");
			const metaSpan = tr.querySelector(".saved-session__meta");
			const buttons = tr.querySelectorAll("button");

			const updatedStr = new Date(s.updatedAt || s.createdAt).toLocaleString("en-CA");
			nameSpan.textContent = s.name;
			nameSpan.title = updatedStr;
			metaSpan.textContent = updatedStr;

			const [loadBtn, renameBtn, deleteBtn] = buttons;
			if (loadBtn) loadBtn.addEventListener("click", () => loadGame(s.id));
			if (renameBtn)
				renameBtn.addEventListener("click", () => {
					const newName = prompt("Rename session:", s.name);
					if (newName && newName.trim()) renameSession(s.id, newName.trim());
				});
			if (deleteBtn)
				deleteBtn.addEventListener("click", () => {
					if (confirm(`Delete session "${s.name}"? This cannot be undone.`)) {
						deleteGame(s.id);
					}
				});

			tbody.appendChild(tr);
		});

	// Replace current list with the built table
	listEl.replaceChildren(tableEl);
}

// Render session list on page load
document.addEventListener("DOMContentLoaded", () => {
	renderSavedSessions();
	renderCurrentSessionBanner();
});

// --- UI: Current Session Banner ---
function getCurrentSessionName() {
	const id = getCurrentSessionId();
	if (!id) return {
		name: null
	};
	const index = getSessionsIndex();
	const entry = index.find((s) => s.id === id);
	return entry ? entry.name : null;
}

function renderCurrentSessionBanner() {
	const banner = document.getElementById("currentSessionBanner");
	const nameEl = document.getElementById("currentSessionName");
	if (!banner || !nameEl) {
		return;
	}
	const name = getCurrentSessionName();
	if (name) {
		nameEl.textContent = name;
		banner.style.display = "block";
	} else {
		nameEl.textContent = "";
		banner.style.display = "none";
	}
}
