const usersTable = document.querySelector('#usersTable');
// const addressTable = document.querySelector(".tableAddressBody")

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


const changeUserData = () => 
	fetch(`http://localhost:8090/v1/users/update`, {
		method: 'PUT',
		headers: {
			"Content-Type": "application/json"
		}
	}).then(res => res.json())
		.catch(handleError);


const showUsers = () => {
	usersTable.innerHTML=""
	getAllUsers()
}

const editUser = (user) => {
	$('#editUser').modal('show').find('textarea,input').val('');
	
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
		const id = user.id
		const send = {...data, id }
		console.log(send)
		changeUserData(send)
		
		$('#editUser').modal('hide').find('textarea,input').val('');
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

const userComponent = ((user, index) => {
	const rows = [
		user.name, 
		user.surname, 
		user.role, 
		user.priority, 
		user.email, 
		user.phoneNumber, 
		`<div><a class="showAdress" data-toggle="modal" data-target="#addressModal">Show Address</a></div>`,
		`<div><button class="btn-edit fas fa-edit"></button><button class="btn-del fas fa-trash"></button></div>`
	];

	// const modalRows = [
	// 	user.address.street,
	// 	user.address.number,
	// 	user.address.zipCode,
	// 	user.address.city,
	// ];

	const tr = usersTable.insertRow(rows);
	const tds = rows.map(value => getHTMLElement(value));
	tds.forEach((td, i) => tr.insertCell(i).appendChild(td));

	// const tr2 = addressTable.insertRow(modalRows);
	// const tds2 = modalRows.map(value => getHTMLElement(value));
	
	// console.log(tr2)
		

	const deleteButton = document.querySelector(".btn-del");
	const editButton = document.querySelector(".btn-edit");
	
	deleteButton.addEventListener("click", () => deleteUser(user.id).then(showUsers));
	editButton.addEventListener("click", () => editUser(user));

})

// const userById = id => getUserById(id);

showUsers()