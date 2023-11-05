function Deck(name, version, availableCards, playedCards, availableTraits, expansions) {
    this.name = name;
    this.version = version;
    this.availableCards = availableCards;
    this.playedCards = playedCards;
    this.availableTraits = availableTraits;
    this.expansions = expansions;
    this.buildAvailableTraits = function () {
        var uniqueTraits = new Set();
        for (j = 0; j < this.expansions.length; j++) {
            for (k = 0; k < this.expansions[j].cards.length; k++) {
                for (l = 0; l < this.expansions[j].cards[k].traits.length; l++) {
                    uniqueTraits.add(this.expansions[j].cards[k].traits[l]);
                }
            }
        }
        this.availableTraits = Array.from(uniqueTraits);
    };

    this.buildAvailableCards = function () {
        for (j = 0; j < this.expansions.length; j++) {
            this.availableCards = this.availableCards.concat(this.expansions[j].cards);
        }
        this.shuffle();
    };

    this.shuffle = function () {
        for (let i = this.availableCards.length; i; i--) {
            let j = Math.floor(Math.random() * i);
            [this.availableCards[i - 1], this.availableCards[j]] = [this.availableCards[j], this.availableCards[i - 1]];
        }
    };

    this.buildAvailableExpansions = function (name) {
        for (j = 0; j < this.expansions.length; j++) {
            if (this.expansions[j].name === name) {
                this.expansions.splice(j, 1);
                continue;
            }
        }
    };

    this.deal = function (traits, logicOperatorIsAnd) {
        if (this.availableCards.length > 0) {
            var searchBase = this.filterDeck(traits, this.availableCards, logicOperatorIsAnd);
            if (searchBase.length > 0) {
                var number = Math.floor(Math.random() * (searchBase.length));
                var card = searchBase[number];
                if (searchBase.length < this.availableCards.length) {
                    for (i = 0; i < this.availableCards.length; i++) {
                        if (this.availableCards[i].name === card.name) {
                            card = this.availableCards[i];
                            number = i;
                        }
                    }
                }
                this.availableCards.splice(number, 1);
                this.playedCards.push(card);
                return card;
            }
        }
    };

    this.filterDeck = function (traits, cards, logicOperatorIsAND) {
        if (traits.length > 0) {
            if (logicOperatorIsAND) {
                return this.filterOnTraitsLogicalAND(traits, cards);

            } else {
                return this.filterOnTraitsLogicalOR(traits, cards);
            }
        } else {
            return cards;
        }
    };

    this.filterOnTraitsLogicalAND = function (traits, cards) {
        var returnArray = [];
        for (i = 0; i < cards.length; i++) {
            var returnValue = true;
            traits.forEach(function (trait) {
                if (cards[i].traits.indexOf(trait) === -1) {
                    returnValue = false;
                }
            });
            if (returnValue) {
                returnArray.push(cards[i]);
            }
        }
        return returnArray;
    };

    this.filterOnTraitsLogicalOR = function (traits, cards) {
        var returnArray = [];
        for (i = 0; i < cards.length; i++) {
            traits.forEach(function (trait) {
                if (cards[i].traits.indexOf(trait) !== -1) {
                    returnArray.push(cards[i]);
                }
            });
        }
        return returnArray;
    };
}