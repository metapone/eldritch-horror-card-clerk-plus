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
		const newDeck = new deck(data.name, data.subtitle, data.cssClass, availableCards);
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
		const costPlaceholder = itemNode.querySelector(".costs");
		const nameFilterPlaceholder = itemNode.querySelector(".name-filter");
		const historyPlaceholder = itemNode.querySelector(".history");

		itemNode.querySelector(".deck").name = deck.name;
		itemNode.querySelector(".deck").classList.add(deck.cssClass);
		itemNode.querySelector("form").addEventListener("submit", drawCard);
		itemNode.querySelector(".deck__name").textContent = deck.name;
		itemNode.querySelector(".deck__subtitle").textContent = deck.subtitle;
		itemNode.querySelector(".deck__index").value = index;

		renderDeckCount(deck.availableCards.length, countPlaceholder);
		renderNameFilter(deck.availableCards, nameFilterPlaceholder, index);
		renderTraitList(Array.from(deck.traits).sort(), traitPlaceholder);
		renderCostList(Array.from(deck.costs).sort(), costPlaceholder);
		renderHistoryList(deck.playedCards, historyPlaceholder);

		itemNode.querySelector(".shuffle").addEventListener("click", () => shuffleDeck(index));

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

		if (deck.costs.size > 0) {
			itemNode
				.querySelector(".toggle-cost-filter")
				.addEventListener("click", toggleSectionByClassName.bind(itemNode.querySelector(".cost-filter")));
		} else {
			itemNode.querySelector(".toggle-cost-filter").remove();
		}

		fragment.appendChild(itemNode);
	});
	deckPlaceholder.replaceChildren(fragment);
}

function renderDeckCount(count, countPlaceholder) {
	countPlaceholder.textContent = count;
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

function renderCostList(costs, costPlaceholder) {
	const costTemplate = document.getElementById("costItemTemplate");
	const fragment = document.createDocumentFragment();
	costs.forEach((cost) => {
		const itemNode = costTemplate.content.cloneNode(true);
		itemNode.querySelector(".cost__value").value = cost;
		itemNode.querySelector(".cost__name").textContent = cost;
		fragment.appendChild(itemNode);
	});
	costPlaceholder.replaceChildren(fragment);
}

function renderDrawnCard(card, drawnCardPlaceholder) {
	const cardTemplate = document.getElementById("lastDrawnCardItemTemplate");
	const itemNode = cardTemplate.content.cloneNode(true);
	const itemTraitsNode = itemNode.querySelector(".last-drawn__traits");
	const badgeNode = document.createElement("span");
	badgeNode.classList.add("badge");

	itemNode.querySelector(".last-drawn__name").textContent = card.name;
	Array.from(card.traits).sort().forEach(trait => {
		const traitNode = badgeNode.cloneNode();
		traitNode.textContent = trait;
		itemTraitsNode.appendChild(traitNode);
	})

	drawnCardPlaceholder.replaceChildren(itemNode);
}

function renderHistoryList(cardLists, historyPlaceholder) {
	const cardTemplate = document.getElementById("historyItemTemplate");
	const fragment = document.createDocumentFragment();
	const form = historyPlaceholder.closest("form");
	const deckIndex = form.querySelector(".deck__index").value;
	const badgeNode = document.createElement("span");
	badgeNode.classList.add("badge");

	cardLists.toReversed().forEach((card, index) => {
		const shuffleInData = {
			cardIndex: cardLists.length - 1 - index, // Because card list is reversed beforehand
			deckID: deckIndex,
			formName: form.name,
		};
		const itemNode = cardTemplate.content.cloneNode(true);
		itemNode.querySelector(".card__name").textContent = card.name;

		const itemTraitsNode = itemNode.querySelector(".card__traits");
		Array.from(card.traits).sort().forEach(trait => {
			const traitNode = badgeNode.cloneNode();
			traitNode.textContent = trait;
			itemTraitsNode.appendChild(traitNode);
		})
		
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

function shuffleDeck(deckIndex) {
	decks[deckIndex].shuffle();
}

function drawCard(event) {
	event.preventDefault();
	const form = event.target;
	const formData = new FormData(form);
	const deck = decks[formData.get("deckIndex")];
	const nameFilter = form.querySelector(".name-filter").style.display == "none" ? null : formData.get("nameFilter");
	const traits = form.querySelector(".trait-filter").style.display == "none" ? null : formData.getAll("traits");
	const costs = form.querySelector(".cost-filter").style.display == "none" ? null : formData.getAll("costs");
	const isOr = !!formData.get("isOr");

	const result = deck.drawCards(1, traits, isOr, nameFilter, costs);

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
