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
	renderDeckVisibilityPanel();
	saveGame();
}

function resetGlobalVariables() {
	expansions.length = 0;
	decks.length = 0;
	mythosAvailable.length = 0;
	mythosDeck = null;
	boxMythosDeck = null;
}

function buildDecks() {
	deckData.forEach((data) => {
		const availableCards = data.cardsByExpansions
			.filter((cardGroup) => expansions.includes(cardGroup.expansionID))
			.flatMap((cardGroup) => cardGroup.cards);
		const newDeck = new deck(data.name, data.subtitle, data.cssClass, availableCards, null, data.canRearrangeTop);
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
		itemNode.querySelector("form").addEventListener("submit", (event) => {
			if (deck.canRearrangeTop) {
				document.querySelector(`form[deckIndex='${index}'] .rearrange-top`).style.display = "none";
			}
			drawCard(event);
		});
		itemNode.querySelector("form").setAttribute("deckIndex", index);
		itemNode.querySelector(".deck__name").textContent = deck.name;
		itemNode.querySelector(".deck__subtitle").textContent = deck.subtitle;
		itemNode.querySelector(".deck__index").value = index;

		setDeckCount(deck.availableCards.length, countPlaceholder);
		renderNameFilter(deck.availableCards, nameFilterPlaceholder, index);
		renderTraitList(Array.from(deck.traits).sort(), traitPlaceholder);
		renderCostList(Array.from(deck.costs).sort(), costPlaceholder);
		renderHistoryList(deck.playedCards, historyPlaceholder);

		itemNode.querySelector(".shuffle").addEventListener("click", () => {
			if (deck.canRearrangeTop) {
				document.querySelector(`form[deckIndex='${index}'] .rearrange-top`).style.display = "none";
			}
			shuffleDeckAsync(index, countPlaceholder);
		});

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

		if (deck.canRearrangeTop) {
			itemNode.querySelector(".toggle-rearrange-top").addEventListener("click", () => renderRearrageTopCards(index));
			itemNode.querySelector(".rearrange-top-cards").addEventListener("click", () => rearrangeTopCards(index));
		} else {
			itemNode.querySelector(".toggle-rearrange-top").remove();
			itemNode.querySelector(".rearrange-top").remove();
		}

		fragment.appendChild(itemNode);
	});
	deckPlaceholder.replaceChildren(fragment);
}

function setDeckCount(count, countPlaceholder) {
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

function renderDrawnCard(card, drawnCardPlaceholder, sortTraits = true, addBadgeClass = false) {
	const cardTemplate = document.getElementById("lastDrawnCardItemTemplate");
	const itemNode = cardTemplate.content.cloneNode(true);
	const itemTraitsNode = itemNode.querySelector(".last-drawn__traits");
	const badgeNode = document.createElement("span");
	let traitList = Array.from(card.traits);

	badgeNode.classList.add("badge");
	itemNode.querySelector(".last-drawn__name").textContent = card.name;

	if (sortTraits) {
		traitList = traitList.sort();
	}

	traitList.forEach((trait) => {
		const traitNode = badgeNode.cloneNode();

		if (addBadgeClass) {
			traitNode.classList.add(trait.toLowerCase());
		}

		traitNode.textContent = trait;
		itemTraitsNode.appendChild(traitNode);
	});

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
		Array.from(card.traits)
			.sort()
			.forEach((trait) => {
				const traitNode = badgeNode.cloneNode();
				traitNode.textContent = trait;
				itemTraitsNode.appendChild(traitNode);
			});

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
	setDeckCount(deck.availableCards.length, countPlaceholder);
	renderHistoryList(deck.playedCards, historyPlaceholder);
}

async function shuffleDeckAsync(deckIndex, countPlaceholder) {
	decks[deckIndex].shuffle();

	// So that users know the deck has been shuffled, set the count to 0, delay half a second, then set the actual count
	setDeckCount(0, countPlaceholder);
	await new Promise((r) => setTimeout(r, 500));
	setDeckCount(decks[deckIndex].availableCards.length, countPlaceholder);
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
		setDeckCount(deck.availableCards.length, countPlaceholder);
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
	if (this.style.display === "none") {
		this.style.display = "block";
	} else {
		this.style.display = "none";
	}
}

function renderDeckVisibilityPanel() {
	const deckVisibiltyPlaceholder = document.getElementsByClassName("section__decks")[0];
	const fragment = document.createDocumentFragment();
	const deckList = [{ name: "Mythos", value: -1 }]; // Use -1 for Mythos since it's not included in the decks variable

	decks.forEach((deck, index) => {
		deckList.push({ name: deck.name, value: index });
	});
	deckList
		.sort((a, b) => a.name.localeCompare(b.name))
		.forEach((deck) => {
			fragment.appendChild(createDeckVisibilityItem(deck.name, deck.value));
		});
	deckVisibiltyPlaceholder.replaceChildren(fragment);

	function createDeckVisibilityItem(name, value) {
		const deckVisibilityItemTemplate = document.getElementById("deckVisibilityItemTemplate");
		const itemNode = deckVisibilityItemTemplate.content.cloneNode(true);
		const text = itemNode.querySelector(".deck-visibility-item__name");
		const checkbox = itemNode.querySelector(".deck-visibility-item__index");

		text.textContent = name;
		checkbox.value = value;
		checkbox.checked = !(deckVisibility[value] === false); // If save doesn't have the specific index, treat it as true
		checkbox.addEventListener("change", handleChangeDeckVisibility);
		toggleDeckVisibility({ index: value, isVisible: checkbox.checked });
		return itemNode;
	}
}

function toggleDeckVisibility(visibility) {
	if (visibility.index >= 0) {
		// Regular deck
		document.querySelector(`[deckindex='${visibility.index}']`).style.display = visibility.isVisible ? "block" : "none";
	} else {
		// Mythos
		document.getElementsByClassName("mythos-composition")[0].style.display = visibility.isVisible ? "block" : "none";
		document.getElementsByClassName("mythos")[0].style.display = visibility.isVisible && mythosDeck != null ? "block" : "none";
	}

	deckVisibility[visibility.index] = visibility.isVisible;
	saveGame();
}

function handleChangeDeckVisibility(event) {
	const checkbox = event.target;
	toggleDeckVisibility({ index: checkbox.value, isVisible: checkbox.checked });
}
