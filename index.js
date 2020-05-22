const table = document.querySelector('tbody');

//Stara funckja do pokazywania errorów
const handleError = (error) => {
	console.log(error);
}
//Przekopiowana funckaj do parsowania elementów z todo.
const getHTMLElement = (str) => {
	const parser = new DOMParser();	
	const childNodes = parser.parseFromString(str, "text/html").body.childNodes;
	return childNodes.length > 0 ? childNodes[0] : document.createElement("div");
  };
const btnAddUser = document.querySelector(".btn-addUser");
const addUser = () => {
  fetch("http://localhost:8080/v1/users/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },   
	}).then(res => res.json())
		.catch(handleError);
}

btnAddUser.addEventListener("click", () => {
	addUser();
})

//Pobieramy userów
const getAllUsers = () => {
	 fetch("http://localhost:8080/v1/users/get")
		.then(res => res.json())
		.then(res => {
			//serwer zwraca json w postaci: success i data[] w której są dane użytkownika
			res.data.forEach((user, index) => {
				//lecimy po każdym użytkowniku i od razu przypisujemy też index
				//ta tablica trzyma po koleji dane każdego usera i w ostatnim divie ikonki. To nasz wiersz w tabeli.
				const rows = [
					user.name, 
					user.surname, 
					user.role, 
					user.priority, 
					user.email, 
					user.phoneNumber, 
					user.address.street, 
					`<div><i class="fas fa-edit"></i><button class="btn-del"><i class="fas fa-trash"></i></button></div>`
				];
				//dodajemy tworzymy wiersz wrzucamy wszystko to co mamy zawarte w tablicy wyżej, przypisujemy też index
				const tr = table.insertRow(rows, index);
				//teraz lecimy po tablicy rows i dla każdej jednej wartości używamy tamtej starej funkcji do wyciągnięcia wartości do pojedynczego wiersza
				const tds = rows.map(value => getHTMLElement(value));
				console.log(tds);
				//No i tu w każdej pojedynczej komórce dodajemy w DOM komórkę o indexie i, no ją poszerzamy o to co zawiera każda komórka (zerknij w console loga z czego składa się tds)
				tds.forEach((td, i) => tr.insertCell(i).appendChild(td));
			});
			
		})
		.catch(handleError);
}

const getUserById = () => {
	fetch(`/localhost:8080/v1/users/get/{user_id}`)
		.then((res) => res.json())
		.catch(handleError);
}

const deleteUser = () => {
	fetch(`/localhost:8080/v1/users/delete/{user_id}`, {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json"
		}
	}).then(res => res.json())
		.catch(handleError)
}

const changeUserData = () => {
	fetch(`/localhost:8080/v1/users/update`, {
		method: 'PUT',
		headers: {
			"Content-Type": "application/json"
		}
	}).then(res => res.json())
		.catch(handleError);
}


//const btnAddUser = document.querySelector(".btn-addUser");
getAllUsers();