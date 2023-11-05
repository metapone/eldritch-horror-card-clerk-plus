var eldritch = eldritch || {};

eldritch.main = {
    saveName: "eldritchHorrorCardClerk",
    initFunctions: function () {
        eldritch.main.showAvailableExpansions();

        eldritch.main.showOptionalLoadGameOption();
    },
    showOptionalLoadGameOption: function () {
        if (eldritch.main.gameExists()) {
            $(".persisted").each(function (index) {
                $(this).removeClass("hidden");
            });
        }
    },
    startNewGame: function () {
        $(".gameForm").each(function (index) {
            $(this).hide();
        });
        eldritch.main.buildAvailableExpansions();
        eldritch.main.showSelectedExpansions();
        eldritch.main.buildAvailableCards();
        eldritch.main.buildAvailableTraits();
        eldritch.main.persistGame();
        eldritch.main.showDecks();
    },
    loadExistingGame: function () {
        $(".gameForm").each(function (index) {
            $(this).hide();
        });
        eldritch.main.retrieveGame();
        eldritch.main.showDecks();
        eldritch.main.showHistory();

    },
    persistGame: function () {
        if (typeof (Storage) !== "undefined") {
            localStorage.setItem(eldritch.main.saveName, JSON.stringify(eldritch.decks));
        }
    },
    retrieveGame: function () {
        if (typeof (Storage) !== "undefined") {
            rawDecks = localStorage.getItem(eldritch.main.saveName);
            if (rawDecks !== null) {
                eldritch.decks=[];
                deckDatas=JSON.parse(rawDecks);
                deckDatas.forEach(function (deckData){
                    var  deck= new Deck(deckData.name, deckData.version, deckData.availableCards, deckData.playedCards, deckData.availableTraits, deckData.expansions );
                    eldritch.decks.push(deck);
                });
            }
        }
    },
    showHistory: function () {
        for (i = 0; i < eldritch.decks.length; i++) {
            var $available = $("." + eldritch.decks[i].name + " .availableCards");
            $available.text(eldritch.decks[i].availableCards.length);
            var $historyList = $("." + eldritch.decks[i].name + " ul.drawnCards");
            for (j = 0; j < eldritch.decks[i].playedCards.length; j++) {
                $("#historicalCardTemplate").tmpl(eldritch.decks[i].playedCards[j]).appendTo($historyList);
                $('#panels').on('click', '.currentGameForm.' + eldritch.decks[i].name + ' .drawnCards li [data-id="' + eldritch.decks[i].playedCards[j].id + '"]', function () {

                    var deck = eldritch.main.getDeckByName($(this).closest('.panel').data('deck'));
                    if (deck !== null) {
                        var $id = $(this).attr("data-id");
                        var card = eldritch.main.getCard(deck.playedCards, $id);
                        if (card !== null) {
                            eldritch.main.cancelCard(deck, card);
                        }
                    }
                });
            }
            if (eldritch.decks[i].length == 0) {
                $('#draw' + eldritch.decks[i].name + 'Button').prop('disabled', true);
            }


        }
    },
    gameExists: function () {
        if (typeof (Storage) !== "undefined") {
            if (localStorage.getItem(eldritch.main.saveName) !== null) {
                return true;
            }
        }
        return false;
    },
    showSelectedExpansions: function () {
        $selectedExpansions = $('#selectedExpansions');
        $("#selectedExpansionListTemplate").tmpl(eldritch.decks[0].expansions).appendTo($selectedExpansions);
    },
    showAvailableExpansions: function () {
        $expansions = $('#expansions');
        $("#availableExpansionListTemplate").tmpl(eldritch.decks[0].expansions).appendTo($expansions);
    },
    buildAvailableExpansions: function () {
        $('.possibleDeck:not(:checked)').each(function (index, value) {
            eldritch.decks.forEach(function (deck) {
                deck.buildAvailableExpansions(value.value);
            });
        });
    }
    ,
    showDecks: function () {
        var $panels = $("#panels");
        $("#deckPanelTemplate").tmpl(eldritch.decks).appendTo($panels);
        $('.currentGameForm').removeClass("hidden");
        $('.logic-toggle').bootstrapToggle();
    }
    ,
    buildAvailableTraits: function () {
        eldritch.decks.forEach(function (deck) {
            deck.buildAvailableTraits();
        });
    },
    shuffle: function (deck) {
        for (let i = deck.length; i; i--) {
            let j = Math.floor(Math.random() * i);
            [deck[i - 1], deck[j]] = [deck[j], deck[i - 1]];
        }
    },

    filterOnTraitsLogicalAND: function ($traits, cards) {
        var returnArray = [];
        for (i = 0; i < cards.length; i++) {
            var returnValue = true;
            $traits.each(function (index, value) {
                if (cards[i].traits.indexOf(value.value) === -1) {
                    returnValue = false;
                }
            });
            if (returnValue) {
                returnArray.push(cards[i]);
            }
        }
        return returnArray;
    },
    filterOnTraitsLogicalOR: function ($traits, cards) {
        var returnArray = [];
        for (i = 0; i < cards.length; i++) {
            $traits.each(function (index, value) {
                if (cards[i].traits.indexOf(value.value) !== -1) {
                    returnArray.push(cards[i]);
                }
            });
        }
        return returnArray;
    },
    buildAvailableCards: function () {
        eldritch.decks.forEach(function (deck) {
            deck.buildAvailableCards();
        });
    },
    filterDeck: function ($traits, cards, logicOperatorIsAND) {
        if ($traits.length > 0) {
            if (logicOperatorIsAND) {
                return eldritch.main.filterOnTraitsLogicalAND($traits, cards);

            } else {
                return eldritch.main.filterOnTraitsLogicalOR($traits, cards);
            }
        } else {
            return cards;
        }
    },
    getDeckByName: function (name) {
        for (i = 0; i < eldritch.decks.length; i++) {
            if (eldritch.decks[i].name === name) {
                return eldritch.decks[i];
            }
        }
        return null;
    },
    showDealResult: function (deck, card) {
        var $available = $("." + deck.name + " .availableCards");
        $available.text(deck.availableCards.length);

        var $historyList = $("." + deck.name + " ul.drawnCards");
        var $lastDrawn = $("." + deck.name + " ul.lastDrawnCard");
        $("#historicalCardTemplate").tmpl(card).appendTo($historyList);
        var $lastHistoryEntry = $("." + deck.name + " ul.drawnCards > li:last");
        $lastDrawn.empty().append($lastHistoryEntry.clone());
        $lastDrawn.find(".glyphicon-remove").hide();

        if (deck.length == 0) {
            $('#draw' + deck.name + 'Button').prop('disabled', true);
        }
        $('#panels').on('click', '.currentGameForm.' + deck.name + ' .drawnCards li [data-id="' + card.id + '"]', function () {
            //eldritch.main.cancelCard(deck, card);
            var deck = eldritch.main.getDeckByName($(this).closest('.panel').data('deck'));
            if (deck !== null) {
                var id = $(this).attr("data-id");
                var card = eldritch.main.getCard(deck.playedCards, id);
                if (card !== null) {
                    eldritch.main.cancelCard(deck, card);
                }
            }
        });

    },
    getCardPosition: function (card, cards) {
        for (i = 0; i < cards.length; i++) {
            if (cards[i] === card) {
                return i;
            }
        }
        return -1;
    },
    getCard: function (cards, id) {
        //replace this horror with a finder
        for (i = 0; i < cards.length; i++) {
            if (cards[i].id == id) {
                return cards[i];
            }
        }
        return null;
    },

    cancelCard: function (deck, card) {
        var position = eldritch.main.getCardPosition(card, deck.playedCards);
        if (position !== -1) {
            deck.playedCards.splice(position, 1);
            deck.availableCards.push(card);
            eldritch.main.shuffle(deck);
            var $available = $("." + deck.name + " .availableCards");
            var $cards = $('.currentGameForm.' + deck.name + ' ul > li span[data-id="' + card.id + '"]');
            eldritch.main.persistGame();
            $cards.each(function (index, element) {
                $(this).parent().fadeOut(function () {
                    $(this).remove();
                    $available.text(deck.availableCards.length);
                });
            });
        }
    },
    deal: function (deck) {
        if (deck != null) {
            if (deck.availableCards.length > 0) {
                var $logicToggle = $('.panel.' + deck.name + ' input.logic-toggle');

                var logicOperatorisAND = $logicToggle.prop('checked');
                var $traits = $('.panel.' + deck.name + ' .filter:checked');

                var traits = $traits.map(function (index, value) {
                    return $(this).attr("value");
                }).get();

                var card = deck.deal(traits, logicOperatorisAND);
                if (card != null) {
                    eldritch.main.persistGame();
                    eldritch.main.showDealResult(deck, card);
                }
            }
        }
    }
}

$(document).ready(function () {
    eldritch.main.initFunctions();

    $(document).on('click', '#newGameButton', function () {
        eldritch.main.startNewGame();
    });

    $(document).on('click', '#loadGameButton', function () {
        eldritch.main.loadExistingGame();
    });
});









