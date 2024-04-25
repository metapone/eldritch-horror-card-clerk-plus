function renderRearrageTopCards(deckIndex) {
	const fieldSet = document.querySelector(`form[deckIndex='${deckIndex}'] .rearrange-top`);
	if (fieldSet.style.display === "none") {
		removeDrake(deckIndex);
		renderTopCards(deckIndex);
		makeTopCardsDraggable(deckIndex);
	}

	toggleSectionByClassName.call(fieldSet);
}

function removeDrake(deckIndex) {
	// If drakes aren't removed when a tag content changes, dragging won't work
	if (drakes.hasOwnProperty(deckIndex) && drakes[deckIndex]) {
		drakes[deckIndex].destroy();
	}
}

function renderTopCards(deckIndex) {
	const cardTemplate = document.getElementById("lastDrawnCardItemTemplate");
	const topCardNode = document.createDocumentFragment();
	const drawnCardPlaceholder = document.querySelector(`form[deckIndex='${deckIndex}'] .top-cards`);
	const badgeNode = document.createElement("span");

	badgeNode.classList.add("badge");

	for (let i = 0; i < 5 && i < decks[deckIndex].availableCards.length; i++) {
		const card = decks[deckIndex].availableCards[i];
		const itemNode = cardTemplate.content.cloneNode(true);
		const itemTraitsNode = itemNode.querySelector(".last-drawn__traits");
		const traitList = Array.from(card.traits);

		itemNode.querySelector(".last-drawn__name").textContent = card.name;

		traitList.forEach((trait) => {
			const traitNode = badgeNode.cloneNode();
			traitNode.textContent = trait;
			itemTraitsNode.appendChild(traitNode);
		});

		topCardNode.appendChild(itemNode);
	}

	drawnCardPlaceholder.replaceChildren(topCardNode);
}

function makeTopCardsDraggable(deckIndex) {
	drakes[deckIndex] = dragula([...document.querySelectorAll(".top-cards")], {
		accepts: function (_, target, source, _) {
			return source === target;
		},
		revertOnSpill: true,
	});
}

function rearrangeTopCards(deckIndex) {
	toggleSectionByClassName.call(document.querySelector(`form[deckIndex='${deckIndex}'] .rearrange-top`));

	const drawnCards = document.querySelectorAll(`form[deckIndex='${deckIndex}'] .top-cards .last-drawn__name`);
	const topCards = decks[deckIndex].availableCards.splice(0, 5);
	const reorderedTopCards = [];
	for (let i = 0; i < drawnCards.length; i++) {
		const card = topCards.find((x) => x.name === drawnCards[i].textContent);
		if (card) {
			reorderedTopCards.push(card);
		}
	}
	decks[deckIndex].availableCards.unshift(...reorderedTopCards);
}
