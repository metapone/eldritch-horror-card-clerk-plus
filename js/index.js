function markSelectedExpansions() {
	const expansionsSelected = document.getElementsByName("expansions");
	for (let i = 0; i < expansionsSelected.length; i++) {
		if (expansionsSelected[i].checked) {
			expansions.push(Number(expansionsSelected[i].value));
		}
	}
}

function startNewGame() {
	resetGlobalVariables();
	switchToView("mainView");
	markSelectedExpansions();
	buildDecks();
	renderDeckPanels();
	renderMythosDeckPanel();
	saveGame();
}

function resetGlobalVariables() {
	expansions.length = 0;
	decks.length = 0;
	mythosAvailable.length = 0;
	mythosDeck = null;
}

function buildDecks() {
	deckData.forEach((data) => {
		const availableCards = data.cardsByExpansions
			.filter((cardGroup) => expansions.includes(cardGroup.expansionID))
			.flatMap((cardGroup) => cardGroup.cards);
		const newDeck = new deck(data.name, availableCards);
		newDeck.shuffle();
		decks.push(newDeck);
	});
}

function renderDeckPanels() {
	const deckPlaceholder = document.getElementById("decks");
	const deckTemplate = document.getElementById("deckItemTemplate");
	const fragment = document.createDocumentFragment();
	decks.forEach((deck, index) => {
		const itemNode = deckTemplate.content.cloneNode(true);
		const countPlaceholder = itemNode.querySelector(".deck__count");
		const traitPlaceholder = itemNode.querySelector(".traits");
		const nameFilterPlaceholder = itemNode.querySelector(".name-filter");
		const historyPlaceholder = itemNode.querySelector(".history");

		itemNode.querySelector(".deck").name = deck.name;
		itemNode.querySelector("form").addEventListener("submit", drawCard);
		itemNode.querySelector(".deck__name").textContent = deck.name;
		itemNode.querySelector(".deck__index").value = index;

		renderDeckCount(deck.availableCards.length, countPlaceholder);
		renderTraitList(Array.from(deck.traits).sort(), traitPlaceholder);
		renderNameFilter(deck.availableCards, nameFilterPlaceholder, index);
		renderHistoryList(deck.playedCards, historyPlaceholder);

		itemNode
			.querySelector(".toggle-name-filter")
			.addEventListener("click", toggleSectionByClassName.bind(itemNode.querySelector(".name-filter")));
		itemNode.querySelector(".toggle-history").addEventListener("click", toggleSectionByClassName.bind(itemNode.querySelector(".drawn-cards")));

		if (deck.traits.size > 0) {
			itemNode
				.querySelector(".toggle-trait-filter")
				.addEventListener("click", toggleSectionByClassName.bind(itemNode.querySelector(".trait-filter")));
		} else {
			itemNode.querySelector(".toggle-trait-filter").remove();
		}

		fragment.appendChild(itemNode);
	});
	deckPlaceholder.replaceChildren(fragment);
}

function renderDeckCount(count, countPlaceholder) {
	countPlaceholder.textContent = count;
}

function renderTraitList(traits, traitPlaceholder) {
	const traitTemplate = document.getElementById("traitItemTemplate");
	const fragment = document.createDocumentFragment();
	traits.forEach((trait) => {
		const itemNode = traitTemplate.content.cloneNode(true);
		itemNode.querySelector(".trait__value").value = trait;
		itemNode.querySelector(".trait__name").textContent = trait;
		fragment.appendChild(itemNode);
	});
	traitPlaceholder.replaceChildren(fragment);
}

function renderNameFilter(cards, nameFilterPlaceholder, id) {
	const nameInputPlaceholder = nameFilterPlaceholder.querySelector(".name-filter__input");
	const nameSuggestionPlaceholder = nameFilterPlaceholder.querySelector(".name-filter__suggestion");
	const fragment = document.createDocumentFragment();

	nameInputPlaceholder.setAttribute("list", `nameFilter${id}`);
	nameSuggestionPlaceholder.setAttribute("id", `nameFilter${id}`);

	cards.forEach((card) => {
		let option = new Option(card.name, card.name);
		fragment.appendChild(option);
	});
	nameSuggestionPlaceholder.replaceChildren(fragment);
}

function renderDrawnCard(card, drawnCardPlaceholder) {
	const cardTemplate = document.getElementById("cardItemTemplate");
	const itemNode = cardTemplate.content.cloneNode(true);
	itemNode.querySelector(".card").textContent = card.name;
	drawnCardPlaceholder.replaceChildren(itemNode);
}

function renderHistoryList(cardLists, historyPlaceholder) {
	const cardTemplate = document.getElementById("historyItemTemplate");
	const fragment = document.createDocumentFragment();
	const form = historyPlaceholder.closest("form");
	const deckIndex = form.querySelector(".deck__index").value;
	cardLists.toReversed().forEach((card, index) => {
		const shuffleInData = {
			cardIndex: cardLists.length - 1 - index, // Because card list is reversed beforehand
			deckID: deckIndex,
			formName: form.name,
		};
		const itemNode = cardTemplate.content.cloneNode(true);
		itemNode.querySelector(".card__name").textContent = card.name;
		itemNode.querySelector(".card__shuffleIn").addEventListener("click", shuffleIn.bind(shuffleInData)); // Assign shuffleInData to "this"
		fragment.appendChild(itemNode);
	});
	historyPlaceholder.replaceChildren(fragment);
}

function shuffleIn() {
	const data = this;
	const deck = decks[data.deckID];
	deck.returnCardsToBottom([data.cardIndex]);
	deck.shuffle();

	const form = document.querySelector(`form[name='${data.formName}']`);
	const historyPlaceholder = form.querySelector(".history");
	const countPlaceholder = form.querySelector(".deck__count");
	renderDeckCount(deck.availableCards.length, countPlaceholder);
	renderHistoryList(deck.playedCards, historyPlaceholder);
}

function drawCard(event) {
	event.preventDefault();
	const form = event.target;
	const formData = new FormData(form);
	const deck = decks[formData.get("deckIndex")];
	const nameFilter = form.querySelector(".name-filter").style.display == "none" ? null : formData.get("nameFilter");
	const traits = form.querySelector(".trait-filter").style.display == "none" ? null : formData.getAll("traits");
	const isOr = !!formData.get("isOr");

	const result = deck.drawCards(1, traits, isOr, nameFilter);

	const drawnCardPlaceholder = form.querySelector(".newest-card");
	const noDrawnCardMessage = form.querySelector(".no-newest-card");
	if (result.length == 1) {
		const historyPlaceholder = form.querySelector(".history");
		const countPlaceholder = form.querySelector(".deck__count");
		renderDeckCount(deck.availableCards.length, countPlaceholder);
		renderDrawnCard(result[0], drawnCardPlaceholder);
		renderHistoryList(deck.playedCards, historyPlaceholder);

		drawnCardPlaceholder.style.display = "block";
		noDrawnCardMessage.style.display = "none";
	} else {
		drawnCardPlaceholder.style.display = "none";
		noDrawnCardMessage.style.display = "block";
	}
}

function backToMainView() {
	switchToView("startView");
}

function switchToView(viewId) {
	const views = document.getElementsByClassName("view");
	for (let i = 0; i < views.length; i++) {
		views[i].style.display = "none";
	}
	document.getElementById(viewId).style.display = "block";
	window.scrollTo(0, 0);
}

function toggleSectionByClassName() {
	if (this.style.display == "none") {
		this.style.display = "block";
	} else {
		this.style.display = "none";
	}
}
