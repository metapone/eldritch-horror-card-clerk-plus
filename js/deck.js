class deck {
	name = "";
	subtitle = "";
	cssClass = "";
	availableCards = [];
	playedCards = [];
	traits = new Set();

	constructor(name, subtitle, cssClass, availableCards, playedCards) {
		this.name = name;
		this.subtitle = subtitle;
		this.cssClass = cssClass;
		this.availableCards = availableCards || [];
		this.playedCards = playedCards || [];
		this.#createTraitList();
	}

	shuffle() {
		shuffleArray(this.availableCards);
		saveGame();
	}

	drawCards(count, traitsFilter, isOr, nameFilter) {
		const drawnCards = [];
		const searchString = !nameFilter ? "" : nameFilter.trim();
		let filteredCardIndexes = [];

		for (let i = 0; i < this.availableCards.length; i++) {
			const card = this.availableCards[i];

			if (searchString.length > 0 && !card.name.toLowerCase().includes(searchString.toLowerCase())) continue;

			if (!!traitsFilter && traitsFilter.length > 0) {
				if (isOr) {
					if (traitsFilter.every((trait) => !card.traits.includes(trait))) continue;
				} else {
					if (traitsFilter.some((trait) => !card.traits.includes(trait))) continue;
				}
			}

			filteredCardIndexes.push(i);
			if (filteredCardIndexes.length == count) break;
		}

		for (let i = 0; i < count; i++) {
			if (filteredCardIndexes.length == 0) break;

			const drawnCard = this.availableCards.splice(filteredCardIndexes[0], 1)[0];
			drawnCards.push(drawnCard);
			this.playedCards.push(drawnCard);
		}

		saveGame();
		return drawnCards;
	}

	returnCardsToBottom(playedCardIndexes) {
		if (!playedCardIndexes || !playedCardIndexes.length) return;

		for (let i = playedCardIndexes.length - 1; i >= 0; i--) {
			this.availableCards.push(this.playedCards.splice(playedCardIndexes[i], 1)[0]);
		}

		saveGame();
	}

	// Trait list is built from the whole initial deck, not just remaining cards
	// so that we can't know which trait has no card left just by looking at the filters
	#createTraitList() {
		const deckCards = this.availableCards.concat(this.playedCards);

		for (let i = 0; i < deckCards.length; i++) {
			for (let j = 0; j < deckCards[i].traits.length; j++) {
				this.traits.add(deckCards[i].traits[j]);
			}
		}
	}
}
