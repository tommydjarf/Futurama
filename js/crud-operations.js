// CRUD operations made on IndexedDB (async is used for more reality purpose)

function performDBOperation(storeName, mode, operation, value) {
	return new Promise((resolve, reject) => {
		const openRequest = indexedDB.open("futurama", 1);

		openRequest.onerror = function (e) {
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

			request.onerror = function (event) {
				reject("Couldn't preform operation");
			};

			request.onsuccess = function (event) {
				resolve(request.result);
			};
		};
	});
}

// TODO: Function for add and put

// Function for add

// Function for put
