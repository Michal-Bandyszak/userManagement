const table = document.querySelector('#usersTable');
const tbody = document.querySelector('#usersTable tbody')
const addressTable = document.querySelector("#addressModalTable");
const editUserModalForm = document.getElementById("formEdit");

const handleError = (error) => {
	console.log(error);
};

const getHTMLElement = (str) => {
	const parser = new DOMParser();	
	const childNodes = parser.parseFromString(str, "text/html").body.childNodes;
	return childNodes.length > 0 ? childNodes[0] : document.createElement("div");
};

const addUser = (user) => 
  fetch("http://localhost:8090/v1/users/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
	},   
	body: JSON.stringify(user),
	}).then(res => res.json())
		.catch(handleError);


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


const changeUserData = (datawithId) => 
	fetch(`http://localhost:8090/v1/users/update`, {
		method: 'PUT',
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify(datawithId),
	}).then(res => res.json())
		.catch(handleError);


const showUsers = () => {
	 tbody.innerHTML =""
		getAllUsers()
}


const showAddress = (address, index) => {
	addressTable.innerHTML = ""
	const tableRow = addressTable.insertRow(index);
	const tableContent = address.map((value) => getHTMLElement(value));
	tableContent.forEach((td, index) => {
		tableRow.insertCell(index).appendChild(td);
	})
	
}

const editUser = (user, id) => {
	$('#editUser').modal('show').find('textarea,input').val('');
	const title = document.getElementById("modal-title");
	title.innerHTML=""
	title.append("Edit user: "+ id)
	
	// const userId = document.getElementById("userId");
	const name = document.getElementById("name");
	const surname = document.getElementById("surname");
	const street = document.getElementById("street");
	const number = document.getElementById("number");
	const zipCode = document.getElementById("zipCode");
	const city = document.getElementById("city");
	const phone = document.getElementById("phone");
	const email = document.getElementById("email");
	const role = document.getElementById("role");
	const priority = document.getElementById("priority");

	userId.value = user.id;
	name.value = user.name;
	surname.value = user.surname;
	street.value = user.address.street;
	number.value = user.address.number;
	zipCode.value = user.address.zipCode;
	city.value = user.address.city;
	phone.value = user.phoneNumber;
	email.value = user.email;
	role.value = user.role;
	priority.value = user.priority;

	document.forms.formEdit.addEventListener("submit", (e) => {
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
	
		const id = userId.value
		const datawithId = {...data, id }
	
		changeUserData(datawithId)
		showUsers()
		$('#editUser').modal('hide').find('textarea, input').val('');
	})
	
}


const showDeleteModal = (user) => {
	$('#deleteModal').modal('show').find('textarea,input').val('');
	const btnDel = document.querySelector("#modalButtonDelete");

	btnDel.addEventListener("click", () => {
		deleteUser(user.id).then(showUsers)
		$('#deleteModal').modal('hide').find('textarea,input').val('');
	})
}

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
	 addUser(data).then(showUsers());
	 $('#newUser').modal('hide').find('textarea,input').val('');
})

const userComponent = (user, index) => {
	const row = [
		user.name, 
		user.surname, 
		user.role, 
		user.priority, 
		user.email, 
		user.phoneNumber, 
		`<div><button class="btn-showAddress" data-toggle="modal" data-target="#addressModal">Show Address</button></div>`,
		`<div><button class="btn-edit fas fa-edit"></button><button class="btn-del fas fa-trash"></button></div>`
	];

	const tableRow = tbody.insertRow(index);
	//in table content there is an array, it contains indexes
	//in each element of that array there is data && node value with our value
	const tableContent = row.map((value) => getHTMLElement(value));

	tableContent.forEach((td, index) => {
		tableRow.insertCell(index).appendChild(td);
		
	})

	const tr = tbody.querySelectorAll("tr")[index];
	const address = [
		user.address.street, 
		user.address.number, 
		user.address.zipCode, 
		user.address.city, 
]

	//Search only through table row  and find each individual button (first child)
	const deleteButton = tr.querySelector(".btn-del");
	const editButton = tr.querySelector(".btn-edit");
	const addressButton = tr.querySelector(".btn-showAddress");

	deleteButton.addEventListener("click", () => showDeleteModal(user))//deleteUser(user.id).then(showUsers));
	editButton.addEventListener("click", () => editUser(user, user.id));
	addressButton.addEventListener("click", () => showAddress(address));
}

showUsers()