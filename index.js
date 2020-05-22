
const handleError = (error) => {
	console.log(error);
}

const addUser = () => {
  fetch("localhost:8080/v1/users/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },   
	}).then(res => res.json())
		.catch(handleError);
}

const getAllUsers = () => {
	 fetch("http://localhost:8080/v1/users/get")
		.then(res => res.json())
		.then(data => {
			data.data.forEach(user1 => {
				console.log(user1)
				document.querySelector('.name').innerText = user1.name
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
