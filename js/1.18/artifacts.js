var eldritch = eldritch || {};
eldritch.decks = eldritch.decks || [];

var artefacts = new Deck("Artifacts", "2.0", [], [], [], [
    {
        name: "Eldritch Horror",
        image: "eldritchhorroricon.jpg",
        cards: [
            {
                id: 1,
                name: "Glass of Mortlan",
                traits: [
                    "ITEM",
                    "MAGICAL"
                ]
            },
            {
                id: 2,
                name: "Grotesque Statue",
                traits: [
                    "ITEM"
                ]
            },
            {
                id: 3,
                name: "De Vermis Mysteriis",
                traits: [
                    "ITEM",
                    "TOME"
                ]
            },
            {
                id: 4,
                name: "The Silver Key",
                traits: [
                    "ITEM",
                    "MAGICAL"
                ]
            },
            {
                id: 5,
                name: "Gate Box",
                traits: [
                    "ITEM",
                    "MAGICAL"
                ]
            },
            {
                id: 6,
                name: "Flute of the Outer Gods",
                traits: [
                    "ITEM",
                    "MAGICAL"
                ]
            },
            {
                id: 7,
                name: "Mi-Go Brain Case",
                traits: [
                    "ITEM",
                    "MAGICAL",
                    "TEAMWORK"
                ]
            },
            {
                id: 8,
                name: "Necronomicon",
                traits: [
                    "ITEM",
                    "TOME"
                ]
            },
            {
                id: 9,
                name: "Lightning Gun",
                traits: [
                    "ITEM",
                    "WEAPON",
                    "MAGICAL"
                ]
            },
            {
                id: 10,
                name: "Sword of Saint Jerome",
                traits: [
                    "ITEM",
                    "MAGICAL",
                    "WEAPON"
                ]
            },
            {
                id: 11,
                name: "T'tka Halot",
                traits: [
                    "ITEM",
                    "TOME"
                ]
            },
            {
                id: 12,
                name: "Ruby of R`lyeh",
                traits: [
                    "ITEM",
                    "MAGICAL"
                ]
            },
            {
                id: 13,
                name: "Cultes des Goules",
                traits: [
                    "ITEM",
                    "TOME"
                ]
            },
            {
                id: 14,
                name: "Pallid Mask",
                traits: [
                    "ITEM",
                    "MAGICAL"
                ]
            },
        ]
    },
    {
        name: "Forsaken Lore",
        image: "forsakenlore.png",
        cards: [
            {
                id: 15,
                name: "Cursed Sphere",
                traits: [
                    "ITEM",
                    "MAGICAL"
                ]
            },
            {
                id: 16,
                name: "Massa di Requiem per Shuggay",
                traits: [
                    "ITEM",
                    "TOME"
                ]
            },
            {
                id: 17,
                name: "Milk of Shub-Niggurath",
                traits: [
                    "ITEM",
                    "ELIXIR"
                ]
            },
            {
                id: 18,
                name: "Sword of Y'ha-Talla",
                traits: [
                    "ITEM",
                    "WEAPON",
                    "MAGICAL"
                ]
            },
            {
                id: 19,
                name: "Satchel of the Void",
                traits: [
                    "ITEM",
                    "MAGICAL"
                ]
            },
            {
                id: 20,
                name: "Elixir of Life",
                traits: [
                    "ITEM",
                    "ELIXIR"
                ]
            },
            {
                id: 21,
                name: "Serpent Crown",
                traits: [
                    "ITEM",
                    "MAGICAL"
                ]
            },
            {
                id: 22,
                name: "Zanthu Tablets",
                traits: [
                    "ITEM",
                    "TOME"
                ]
            },

        ]
    },
    {
        name: "Mountains of Madness",
        image: "mountainsofmadness.png",
        cards: [
            {
                id: 23,
                name: "Pnakotic Manuscripts",
                traits: [
                    "ITEM",
                    "TOME"
                ]
            },
            {
                id: 24,
                name: "Alien Device",
                traits: [
                    "ITEM"
                ]
            },
            {
                id: 25,
                name: "Heart of Winter",
                traits: [
                    "ITEM"
                ]
            },
            {
                id: 26,
                name: "Livre d'Ivon",
                traits: [
                    "ITEM",
                    "TOME"
                ]
            },
            {
                id: 27,
                name: "Crystal of the Elder Things",
                traits: [
                    "ITEM"
                ]
            },
            {
                id: 28,
                name: "Eltdown Shards",
                traits: [
                    "ITEM",
                    "TOME"
                ]
            },
            {
                id: 29,
                name: "Hyperborean Crystal",
                traits: [
                    "ITEM",
                    "MAGICAL"
                ]
            },
            {
                id: 30,
                name: "Dhol Chants",
                traits: [
                    "ITEM",
                    "TOME"
                ]
            },
        ]
    },
    {
        name: "Strange Remnants",
        image: "strangeremnants.png",
        cards: [
            {
                id: 31,
                name: "Dragon Idol",
                traits: [
                    "ITEM",
                    "MAGICAL",
                    "RELIC"
                ]
            },
            {
                id: 32,
                name: "Mask of the Watcher",
                traits: [
                    "ITEM",
                    "MAGICAL"
                ]
            },
            {
                id: 33,
                name: "Bone Pipes",
                traits: [
                    "ITEM",
                    "MAGICAL"
                ]
            },
            {
                id: 34,
                name: "Khopesh of the Abyss",
                traits: [
                    "ITEM",
                    "MAGICAL",
                    "RELIC",
                    "WEAPON"
                ]
            },
        ]
    },
    {
        name: "Under the Pyramids",
        image: "underthepyramids.png",
        cards: [
            {
                id: 35,
                name: "Book of the Dead",
                traits: [
                    "ITEM",
                    "RELIC",
                    "TOME"
                ]
            },
            {
                id: 36,
                name: "Scales of Thoth",
                traits: [
                    "ITEM",
                    "MAGICAL",
                    "RELIC"
                ]
            },
            {
                id: 37,
                name: "Shining Trapezohedron",
                traits: [
                    "ITEM",
                    "MAGICAL"
                ]
            },
            {
                id: 38,
                name: "Twin Scepters",
                traits: [
                    "ITEM",
                    "MAGICAL",
                    "RELIC"
                ]
            },
        ]
    },
    {
        name: "Signs of Carcosa",
        image: "signsofcarcossa.png",
        cards: [
            {
                id: 39,
                name: "Key to Carcosa",
                traits: [
                    "TRINKET",
                    "MAGICAL"
                ]
            },
            {
                id: 40,
                name: "Tattered Cloak",
                traits: [
                    "ITEM",
                    "MAGICAL"
                ]
            },
            {
                id: 42,
                name: "King In Yellow",
                traits: [
                    "ITEM",
                    "TOME"
                ]
            },
            {
                id: 43,
                name: "Mask of Sthenelus",
                traits: [
                    "ITEM",
                    "MAGICAL",
                    "RELIC"
                ]
            },
        ]
    },
    {
        name: "Dreamlands",
        image: "dreamlands.png",
        cards: [
            {
                id: 44,
                name: "Crystallizer of Dreams",
                traits: [
                    "ITEM",
                    "MAGICAL",
                    "TEAMWORK"
                ]
            },
            {
                id: 45,
                name: "Crux of Cykranosh",
                traits: [
                    "ITEM",
                    "MAGICAL"
                ]
            },
            {
                id: 46,
                name: "Elder Key",
                traits: [
                    "ITEM",
                    "TOME"
                ]
            },
            {
                id: 47,
                name: "Pentacle of Planes",
                traits: [
                    "ITEM",
                    "MAGICAL"
                ]
            },
        ]
    },
    {
        name: "Cities in Ruin",
        image: "citiesInRuins.png",
        cards: [
            {
                id: 48,
                name: "Fetch Stick",
                traits: [
                    "ITEM",
                    "MAGICAL",
                    "WEAPON"
                ]
            },
            {
                id: 49,
                name: "G`harne Fragments",
                traits: [
                    "ITEM",
                    "RELIC",
                    "TOME"
                ]
            },
            {
                id: 50,
                name: "Tikkoun Elixir",
                traits: [
                    "ITEM",
                    "ELIXIR"
                ]
            },
            {
                id: 51,
                name: "Vach-Viraj Chant",
                traits: [
                    "ITEM",
                    "MAGICAL",
                    "TOME"
                ]
            }
        ]
    },
    {
        name: "Masks of Nyarlathotep",
        image: "mon.png",
        cards: [
            {
                id: 52,
                name: "Black Book",
                traits: [
                    "ITEM",
                    "TOME",
                ]
            },
            {
                id: 53,
                name: "Black Fan",
                traits: [
                    "ITEM",
                    "MAGICAL"
                ]
            },
            {
                id: 54,
                name: "Hemisphere Map",
                traits: [
                    "ITEM"
                ]
            },
            {
                id: 55,
                name: "True Magick",
                traits: [
                    "ITEM",
                    "TOME"
                ]
            }
        ]
    }
]);
eldritch.decks.push(artefacts);

