// ----------- CHARACTERS ----------- //

async function printCharacters() {
	let characters = await performDBOperation("characters", "readonly", "getAll");

	// Remap the characters
	characters = characters.map(remapCharacters);

	const container = document.getElementsByClassName("characters-container")[0];

	for (const character of characters) {
		const characterElement = document.createElement("div");
		characterElement.className = "character-card";
		characterElement.innerHTML = `
		<h3>${character.fullName}</h3>
		<p>Occupation: ${character.occupation}</p>
		<p>Homeplanet: ${character.homePlanet}</p>
		`;
		container.appendChild(characterElement);
	}
}

async function printCharacter() {
	let test = document.getElementById("testButton");
	let value = Number(test.dataset.id);

	let character = await performDBOperation("characters", "readonly", "get", value);

	// Remap the character
	character = remapCharacters(character);

	console.log(character);

	let characterCard = document.querySelector("#characterModal .modal-character-card");
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
	for (let i = 0; i < 5; i++) {
		let randomIndex = Math.floor(Math.random() * sayings.length);
		randomSayings.push(sayings[randomIndex]);
		sayings.splice(randomIndex, 1);
	}
	return randomSayings;
}

// ----------- EPISODES ----------- //

async function printEpisodes() {
	let characters = await performDBOperation("episodes", "readonly", "getAll");

	const container = document.getElementsByClassName("episodes-container")[0];

	for (const episode of episodes) {
		const episodeElement = document.createElement("div");
		characterElement.className = "episode-card";
		characterElement.innerHTML = `
		<h3>${episode.title}</h3>
		<p>Season: ${episode.season}</p>
		<p>Episode: ${episode.number}</p>
		`;
		container.appendChild(episodeElement);
	}
}

window.onload = function () {
	printCharacters();

	let testButton = document.getElementById("testButton");
	testButton.addEventListener("click", printCharacter);

	let characterButton = document.getElementById("characters-button");
	characterButton.addEventListener("click", printCharacters);

	let episodeButton = document.getElementById("episode-button");
	episodeButton.addEventListener("click", printEpisodes);
};

// TODO: Add print function for characters/ edit function
// TODO: Add print function for episodes
// TODO: Add print punction for single character
// TODO: Add print punction for single episode
