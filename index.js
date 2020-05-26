//Need to add dynamic users display
//Modal to display address
//

const table = document.querySelector('tbody');
const addressTable = document.querySelector(".tableAddressBody")
// const adressModal = document.getElementById("addressModal")

const handleError = (error) => {
	console.log(error);
};

const getHTMLElement = (str) => {
	const parser = new DOMParser();	
	const childNodes = parser.parseFromString(str, "text/html").body.childNodes;
	return childNodes.length > 0 ? childNodes[0] : document.createElement("div");
};

const addUser = (user) => {
  fetch("http://localhost:8090/v1/users/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
	},   
	body: JSON.stringify(user),
	}).then(res => res.json())
		.catch(handleError);
}

const getAllUsers = () => 
	fetch("http://localhost:8090/v1/users/get")
	   .then(res => res.json())
	   .then(res => {
		   res.data.forEach(userComponent)	
	   }).catch(handleError);


const getUserById = (id) => 
	fetch(`http://localhost:8090/v1/users/get/${id}`)
		.then((res) => res.json())
		.catch(handleError);


const deleteUser = (id) => 
	fetch(`http://localhost:8090/v1/users/delete/${id}`, {
		method: "DELETE",
		headers: {
	 		"Content-Type": "application/json"
		}
	}).then(res => res.json())
		.catch(handleError)


const changeUserData = () => 
	fetch(`http://localhost:8090/v1/users/update`, {
		method: 'PUT',
		headers: {
			"Content-Type": "application/json"
		}
	}).then(res => res.json())
		.catch(handleError);


document.forms.formAdd.addEventListener("submit", (e) => {
	e.preventDefault();
	const body = Object.fromEntries(new FormData(e.target));
	const addressFields = ['city', 'street', 'zipCode', 'number'];
	
	const data = Object.entries(body).reduce((prev, actual) => {
		const [key, value] = actual;
		if(key === 'priority') {
			return { ...prev, [key]: +value }
		};
		
		if (addressFields.includes(key)) {
			const { address } = prev;
			return { ...prev, address: { ...address, [key]: value }};
		}
		return { ...prev, [key]: value };
		
	}, {});
	 addUser(data);
	 //Neet to clear table before using function again
	 //getAllUsers()
})

const userComponent = ((user, index) => {
	const rows = [
		user.name, 
		user.surname, 
		user.role, 
		user.priority, 
		user.email, 
		user.phoneNumber, 
		`<div><a data-toggle="modal" data-target="#addressModal">Show Address</a></div>`,
		`<div><button class="btn-edit fas fa-edit"></button><button class="btn-del fas fa-trash"></button></div>`
	];

	const modalRows = [
		user.address.street,
		user.address.number,
		user.address.zipCode,
		user.address.city,
	];

	//Jak ubrać to w jedna funkcję? 
	const tr = table.insertRow(rows, index);
	const tds = rows.map(value => getHTMLElement(value));
	tds.forEach((td, i) => tr.insertCell(i).appendChild(td));
	//Tu kod wyżej się powtarza co jest bez sensu.
	const tr2 = addressTable.insertRow(modalRows, index);
	const tds2 = modalRows.map(value => getHTMLElement(value));
	tds2.forEach((td, i) => tr2.insertCell(i).appendChild(td))

	const deleteButton = document.querySelector(".btn-del");
	deleteButton.addEventListener("click", () => deleteUser(user.id))
		return tds;
})

const userDelete = id => deleteUser(id);
const userById = id => getUserById(id);

getAllUsers();