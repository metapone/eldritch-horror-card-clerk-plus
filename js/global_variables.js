const deckData = []; // Store all raw deck data in the format below
/* 
name: <Deck name>,
subtitle: <Name subtitle>,
cssClass: <CSS class>,
cardsByExpansions: [
{
    expansionID: <Expansion ID>,
    cards: [
        {
            id: <Card ID>,
            name: <Card Name>,
            traits: [<Card trait>]
        }
    ]
}*/
const expansions = []; // Store expansion IDs in play. Array of int.
const decks = []; // Store all normal decks in play. Array of "deck" objects.
const mythosAvailable = []; // Store Mythos cards available (base + selected expansions). Array of "card" objects.
let mythosDeck = null; // Store Mythos deck in play. "deck" object.
let boxMythosDeck = null; // Store unused Mythos card. "deck" object.
const drakes = {}; // Store dragula APIs using keys
