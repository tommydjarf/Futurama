// Getting main container
const mainContainer = document.querySelector(".main-container");

// ----------- CHARACTERS ----------- //

async function printCharacters() {
	// Clear the main container
	mainContainer.innerHTML = "";

	// Create a new characters container
	const charactersContainer = document.createElement("div");
	charactersContainer.className = "characters-container";
	charactersContainer.innerHTML = "<h2>Characters</h2>";
	mainContainer.appendChild(charactersContainer);

	let characters = await performDBOperation("characters", "readonly", "getAll");

	// Remap the characters
	characters = characters.map(remapCharacters);

	const container = document.getElementsByClassName("characters-container")[0];

	for (const character of characters) {
		const characterElement = document.createElement("div");
		characterElement.className = "card";
		characterElement.innerHTML = `
		<h3>${character.fullName}</h3>
		<p>Occupation: ${character.occupation}</p>
		<p>Homeplanet: ${character.homePlanet}</p>
		`;
		characterElement.addEventListener("click", () => printCharacter(character.id));
		container.appendChild(characterElement);
	}
}

async function printCharacter(id) {
	let character = await performDBOperation("characters", "readonly", "get", id);

	// Remap the character
	character = remapCharacters(character);

	console.log(character);

	let characterCard = document.querySelector("#modal .modal-content-card");
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

	let editDeleteButtons = document.querySelectorAll(".edit-delete");
	editDeleteButtons.forEach((button) => (button.style.display = "inline"));

	let characterModal = document.getElementById("modal");
	characterModal.style.display = "block";

	let deleteButton = document.querySelector(".delete");
	deleteButton.addEventListener("click", () => deleteCharacter(id));
}

let closeButtonElement = document.querySelector("#modal .close");
closeButtonElement.addEventListener("click", closeTheModal);

function closeTheModal() {
	let characterModal = document.getElementById("modal");
	characterModal.style.display = "none";
}

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
	// Clear the main container
	mainContainer.innerHTML = "";

	// Create a new episodes container
	const episodesContainer = document.createElement("div");
	episodesContainer.className = "episodes-container";
	episodesContainer.innerHTML = `
	<h2>Episodes</h2>
	`;
	mainContainer.appendChild(episodesContainer);

	let episodes = await performDBOperation("episodes", "readonly", "getAll");

	console.log(episodes);

	const container = document.getElementsByClassName("episodes-container")[0];

	for (const episode of episodes) {
		let episodeNumber = episode.number.split(" - ")[0];

		const episodeElement = document.createElement("div");
		episodeElement.className = "card";
		episodeElement.innerHTML = `
		<h3>${episode.title}</h3>
		<p>Season: ${episode.season}</p>
		<p>Episode: ${episodeNumber}</p>
		`;
		container.appendChild(episodeElement);
	}
}

async function printEpisode() {
	let test = document.getElementById("testButton2");
	let value = Number(test.dataset.id);

	let episode = await performDBOperation("episodes", "readonly", "get", value);
	let episodeNumber = episode.number.split(" - ")[0];
	console.log(episode);

	let characterCard = document.querySelector("#modal .modal-content-card");
	characterCard.innerHTML = `
	<h3>${episode.title}</h3>
	<h4>Season: ${episode.season} Episode: ${episodeNumber} Date: ${episode.originalAirDate}</h4>
	<p>Description:</p>
	<p>${episode.desc}</p>
	<p>Writers: ${episode.writers}</p>
	`;

	let modal = document.getElementById("modal");
	modal.style.display = "block";
}

document.addEventListener("DOMContentLoaded", function () {
	document.querySelector(".characters-button").addEventListener("click", printCharacters);
	document.querySelector(".episodes-button").addEventListener("click", printEpisodes);
});

window.onload = function () {
	printCharacters();
};

// TODO: Add print function for characters/ edit function

async function addCharacterForm() {
	const form = document.createElement("form");
	form.id = "addCharacterForm";

	form.addEventListener("submit", async function (event) {
		event.preventDefault();

		const firstName = document.getElementById("firstName").value;
		const lastName = document.getElementById("lastName").value;
		const homePlanet = document.getElementById("homePlanet").value;

		const newCharacter = {
			name: {
				first: firstName,
				middle: "",
				last: lastName,
			},
			images: {
				"head-shot": "",
				main: "",
			},
			gender: "",
			species: "",
			occupation: "",
			sayings: ["", ""],
			id: await getNextCharacterId(),
			age: "",
			homePlanet: homePlanet,
		};
		try {
			await addCharacter(newCharacter);
			console.log("Character added successfully IN ADDCHARFORM!");
			form.reset();
			await printCharacters(); // Update the character list after adding
		} catch (error) {
			console.error("Error adding character:", error);
		}
	});

	let modalFormCard = document.querySelector("#modal .modal-content-card");
	modalFormCard.innerHTML = "";
	modalFormCard.appendChild(form);

	form.innerHTML = `
		<label for="firstName">First Name:</label>
		<input type="text" id="firstName" name="firstName" required><br><br>
		<label for="lastName">Last Name:</label>
		<input type="text" id="lastName" name="lastName"><br><br>
		<label for="homePlanet">Home Planet:</label>
		<input type="text" id="homePlanet" name="homePlanet"><br><br>
		<input class="submitAddCharacter" type="submit" value="Submit">
    `;

	// Display the form modal when a button is clicked
	let openFormButton = document.getElementById("openFormButton");
	openFormButton.addEventListener("click", function () {
		document.getElementById("modal").style.display = "block";

		let editDeleteButtons = document.querySelectorAll(".edit-delete");
		editDeleteButtons.forEach((button) => (button.style.display = "none"));
	});
}

async function editCharacterform() {}
// TODO: Add print function for episodes
// TODO: Add print punction for single character
// TODO: Add print punction for single episode
