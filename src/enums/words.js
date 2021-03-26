const TYPES = {
	0: "Modifiers",
	1: "Directives/Mission Types",
	2: "Specific Actions",
	3: "Locations and Landmarks",
	4: "Generic Nouns",
	5: "Target Descriptors and Adjectives",
	6: "Success, Fail, and Feedback",
	7: "Guild Ranks and Positions",
	8: "Dates, Time, and Distances",
	9: "Directions",
	10: "Numbers"
};

var WORDS_BY_TYPE = {};

// partner words/high-level very common concepts that require additional details
WORDS_BY_TYPE[0] = [
	"armor",
	"weapon",
	"race",
	"nobility/profession",
	"guild rank",
	"magical",
	"mixed/mixture"
];

// mission types
WORDS_BY_TYPE[1] = [
	"reconnaissance",
	"interrogate",
	"assassinate",
	"incriminate",
	"counterintelligence",
	"recruitment",
	"extraction (people/objects)"
];

// specific tasks
WORDS_BY_TYPE[2] = [
	"forge/falsify",
	"steal",
	"plant",
	"poison",
	"sabotage",
	"frame/set-up",
	"eavesdrop",
	"impersonate",
	"kidnap/ransom",
	"trap/entrap",
	"seduce",
	"do nothing"
];

// landmarks and locations
WORDS_BY_TYPE[3] = [
	"city",
	"town",
	"village",
	"house",
	"camp",
	"mountain",
	"forest",
	"river",
	"desert",
	"swamp",
	"lake",
	"ocean",
	"road"
];

// generic nouns
WORDS_BY_TYPE[4] = [
	"tavern",
	"temple",
	"barracks/armory",
	"castle",
	"bedroom/chamber",
	"farm",
	"tree",
	"tent",
	"cloth",
	"leather",
	"metal",
	"shield",
	"sword",
	"axe",
	"bow",
	"crossbow",
	"polearm",
	"club",
	"potion",
	"grave",
	"safehouse",
	"codename",
	"magic",
	"food",
	"drink",
	"gold (money)",
	"jewelry",
	"artifact",
	"paperwork"
];

// target descriptors + adjectives
WORDS_BY_TYPE[5] = [
	"red",
	"green",
	"blue",
	"orc",
	"elf",
	"dwarf",
	"human",
	"halfling",
	"tiefling",
	"gnome",
	"dragonborn",
	"king",
	"queen",
	"princess",
	"prince",
	"lord/lady",
	"duke/duchess",
	"baron/baroness",
	"military officer",
	"potionmaker",
	"smithy",
	"construction worker",
	"tavernkeep",
	"farmer",
	"fisherman",
	"merchant",
	"priest/clergy",
	"wizard/magician",
	"tall/big",
	"average (size)",
	"short/small",
	"male/masculine",
	"female/feminine",
	"old",
	"young",
	"rich",
	"poor"
];

// success fail feedback
WORDS_BY_TYPE[6] = [
	"success",
	"failure",
	"bad intel",
	"additional security",
	"civilian interference",
	"bad weather",
	"change of plans",
	"personal",
	"unavailable"
];

// guild rank
WORDS_BY_TYPE[7] = [
	"initiate",
	"listener",
	"deceiver",
	"counterfeiter",
	"architect",
	"murderer",
	"silencer",
	"deathwalker",
	"pickpocket",
	"shadow",
	"mastermind",
	"lieutenant",
	"grandmaster"
];

// datetime and distance
WORDS_BY_TYPE[8] = [
	"dawn",
	"noon",
	"dusk",
	"midnight",
	"second",
	"minute",
	"hour",
	"day",
	"week",
	"month",
	"year",
	"paces",
	"feet",
	"miles"
];

// Directions
WORDS_BY_TYPE[9] = [
	"north",
	"south",
	"east",
	"west"
];

// Numbers
WORDS_BY_TYPE[10] = [
	"0",
	"1",
	"2",
	"3",
	"4",
	"5",
	"6",
	"7",
	"8",
	"9"
];

let all_words = [];

for (let typeInt in WORDS_BY_TYPE) {
	let words = WORDS_BY_TYPE[typeInt];

	for (let word of words) {
		all_words.push({
			"word": word,
			"type": typeInt
		});
	}
}

const ALL_WORDS = [...all_words];

module.exports = {
	ALL_WORDS,
	TYPES
};