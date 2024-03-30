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

// Function to generate the next uniq ID
async function getNextCharacterId() {
    const characters = await performDBOperation("characters", "readonly", "getAll");

    let maxId = Math.max(...characters.map((character) => character.id));

    let nextId = maxId + 1;

    return nextId;
}

// Function for add
async function addCharacter(character) {
    // Set default values for the rest of the properties
    const defaultCharacter = {
        age: "",
        gender: "",
        homePlanet: "",
        id: await getNextCharacterId(),
        images: { headShot: "", main: "" },
        name: { first: "", middle: "", last: "" },
        occupation: "",
        sayings: [],
        species: "",
    };

    const fullCharacter = { ...defaultCharacter, ...character };

    closeTheModal();
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
async function deleteCharacter(id) {
    let confirmation = confirm("Are you sure you want to delete this caracter?");
    if (confirmation) {
        await performDBOperation("characters", "readwrite", "delete", id);
        alert("Character deleted");
    }
    closeTheModal();
    await printCharacters();
}

/********************************
 * CRUD Operations for Episodes *
 ********************************/

async function getNextEpisodeId() {
    const episodes = await performDBOperation("episodes", "readonly", "getAll");

    let maxId = Math.max(...episodes.map((episode) => episode.id));

    let nextId = maxId + 1;

    return nextId;
}

async function addEpisode(episode) {
    const defaultEpisode = {
        id: await getNextEpisodeId(),
        title: "",
        season: "",
        number: "",
        originalAirDate: "",
        writers: "",
        desc: "",
    };

    const fullEpisode = { ...defaultEpisode, ...episode };

    closeTheModal();
    return performDBOperation("episodes", "readwrite", "post", fullEpisode);
}

// delete episodes
async function deleteEpisode(id) {
    let confirmation = confirm("Are you sure you want to delete this episode?");
    if (confirmation) {
        await performDBOperation("episodes", "readwrite", "delete", id);
        alert("Episode deleted");
    }
    closeTheModal();
    await printEpisodes();
}

//edit episode

async function updateEpisode(id, episode) {
    // Get existing episode data from IndexedDB
    const existingEpisode = await performDBOperation("episodes", "readonly", "get", id);

    if (!existingEpisode) {
        throw new Error(`Episode with id ${id} is not found`);
    }

    const fullEpisode = { ...existingEpisode, ...episode };

    return performDBOperation("episodes", "readwrite", "put", fullEpisode);
}
