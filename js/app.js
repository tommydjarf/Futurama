// TODO: Add print function for characters/ edit function
// TODO: Add print function for episodes
// TODO: Add print punction for single character
// TODO: Add print punction for single episode

async function printCharacters() {
	let characters = await performDBOperation("characters", "readonly", "getAll");

	// Remap the characters
	characters = characters.map(remapCharacters);

	const container = document.getElementsByClassName("characters-container")[0];

	for (const character of characters) {
		const characterElement = document.createElement("div");
		const fullName = `${character.name.first} ${character.name.middle} ${character.name.last}`;
		characterElement.textContent = `Name: ${fullName}, Occupation: ${character.occupation}, Homeplanet: ${character.homePlanet}`;
		container.appendChild(characterElement);
	}
}

// Remap for characters
function remapCharacters(character) {
	const fullName = `${character.name.first || " "} ${character.name.middle || " "} ${character.name.last || " "}`;
	return {
		name: {
			first: character.name.first || " ",
			middle: character.name.middle || " ",
			last: character.name.last || " ",
		},
		fullName: fullName,
		occupation: character.occupation || "Slacker",
		homePlanet: character.homePlanet || "The universe!",
	};
}

window.onload = function () {
	printCharacters();
};
