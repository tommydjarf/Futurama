// CRUD operations made on IndexedDB (async is used for more reality purpose)

function performDBOperation(storeName, mode, operation, value) {
	return new Promise((resolve, reject) => {
		const openRequest = indexedDB.open("futurama", 1);

		openRequest.onerror = function () {
			reject("Error opening db");
		};

		openRequest.onsuccess = function (e) {
			const db = e.target.result;
			const transaction = db.transaction(storeName, mode);
			const store = transaction.objectStore(storeName);

			let request;
			switch (operation) {
				case "getAll":
					request = store.getAll();
					break;
				case "get":
					request = store.get(value);
					break;
				case "post":
					request = store.add(value);
					break;
				case "put":
					request = store.put(value);
					break;
				case "delete":
					request = store.delete(value);
					break;
				default:
					reject("Invalid operation");
					return;
			}

			request.onerror = function () {
				reject("Couldn't preform operation");
			};

			request.onsuccess = function () {
				resolve(request.result);
			};
		};
	});
}

// Function for add
function addCharacter(character) {
	// Set default values for the rest of the properties
	const defaultCharacter = {
		age: "",
		gender: "",
		homePlanet: "",
		id: "",
		images: { headShot: "", main: "" },
		name: { first: "", middle: "", last: "" },
		occupation: "",
		sayings: [],
		species: "",
	};

	const fullCharacter = { ...defaultCharacter, ...character };

	return performDBOperation("characters", "readwrite", "post", fullCharacter);
}

// Function for put
async function updateCharacter(id, character) {
	// Get existing character data from IndexedDB
	const existingCharacter = await performDBOperation("characters", "readonly", "get", id);

	if (!existingCharacter) {
		throw new Error(`Character with id ${id} is not found`);
	}

	const fullCharacter = { ...existingCharacter, ...character };

	return performDBOperation("characters", "readwrite", "put", fullCharacter);
}

// Function for delete
function deleteCharacter(id) {
	return performDBOperation("characters", "readwrite", "delete", id);
}
