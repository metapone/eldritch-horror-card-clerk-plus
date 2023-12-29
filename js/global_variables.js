const deckData = []; // Store all raw deck data in format below
/* 
name: <Deck name>,
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
const expansions = []; // Store expansion IDs in play
const decks = []; // Store all normal decks in play. "deck" objects
const mythosAvailable = []; // Store Mythos cards available. "deck" objects
let mythosDeck = null; // Store Mythos deck in play. "deck" objects
