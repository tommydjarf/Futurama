async function printCharacters() {
	let characters = await performDBOperation("characters", "readonly", "getAll");

	// Remap the characters
	characters = characters.map(remapCharacters);

	const container = document.getElementsByClassName("characters-container")[0];

	for (const character of characters) {
		const characterElement = document.createElement("div");
		characterElement.textContent = `Name: ${character.fullName}, Occupation: ${character.occupation}, Homeplanet: ${character.homePlanet}`;
		container.appendChild(characterElement);
	}
}

// classname "character-card"

async function printCharacter() {
	let test = document.getElementById("testButton");
	let value = Number(test.dataset.id);

	let character = await performDBOperation("characters", "readonly", "get", value);

	// Remap the character
	character = remapCharacters(character);

	let characterCard = document.querySelector("#characterModal .character-card");
	let randomSayings = getRandomSayings(character.sayings);
	characterCard.innerHTML = `
	<h3>${character.fullName}</h3>
	<p>Occupation: ${character.occupation}</p>
	<p>Homeplanet: ${character.homePlanet}</p>
	<img src="${character.images.main}" alt="${character.fullName}">
	<ul>
		${randomSayings.map((saying) => `<li>${saying}</li>`).join("")}
	</ul>
	`;

	let characterModal = document.getElementById("characterModal");
	characterModal.style.display = "block";
}

let closeButton = document.querySelector("#characterModal .close");
closeButton.addEventListener("click", function () {
	let characterModal = document.getElementById("characterModal");
	characterModal.style.display = "none";
});

// Remap for characters
function remapCharacters(character) {
	const fullName = `${character.name.first || " "} ${character.name.middle || " "} ${character.name.last || " "}`;
	return {
		...character,
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

function getRandomSayings(sayings) {
	let randomSayings = [];
	for (let i = 0; i < 1; i++) {
		let randomIndex = Math.floor(Math.random() * sayings.length);
		randomSayings.push(sayings[randomIndex]);
		sayings.splice(randomIndex, 1);
	}
	return randomSayings;
}

window.onload = function () {
	printCharacters();

	let testButton = document.getElementById("testButton");
	testButton.addEventListener("click", printCharacter);
};

// TODO: Add print function for characters/ edit function
// TODO: Add print function for episodes
// TODO: Add print punction for single character
// TODO: Add print punction for single episode
