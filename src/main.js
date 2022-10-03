import axios from 'axios';

const var_register = document.getElementById('register-btn');
if(var_register) var_register.addEventListener('click', register);
const var_login = document.getElementById('login-btn');
if(var_login) var_login.addEventListener('click',login);
const var_logout = document.getElementById('logout-btn');
if(var_logout) var_logout.addEventListener('click',logout);
const var_add = document.getElementById('add-task');
if(var_add) var_add.addEventListener('click',addTask);
function displaySuccessToast(message) {
    iziToast.success({
        title: 'Success',
        message: message
    });
}

function displayErrorToast(message) {
    iziToast.error({
        title: 'Error',
        message: message
    });
}

function displayInfoToast(message) {
    iziToast.info({
        title: 'Info',
        message: message
    });
}

const API_BASE_URL = 'https://todo-app-csoc.herokuapp.com/';

function logout() {
    console.log('hello');
    localStorage.removeItem('token');
    window.location.href = '/login/';
}

function registerFieldsAreValid(firstName, lastName, email, username, password) {
    if (firstName === '' || lastName === '' || email === '' || username === '' || password === '') {
        displayErrorToast("Please fill all the fields correctly.");
        return false;
    }
    if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))) {
        displayErrorToast("Please enter a valid email address.")
        return false;
    }
    return true;
}

function loginDetailsValid(username, password) {
    if(username === '' || password === '') {
        displayErrorToast("Please fill all the fields correctly.");
        return false;
    }
    return true;
}

function register() {
    const firstName = document.getElementById('inputFirstName').value.trim();
    const lastName = document.getElementById('inputLastName').value.trim();
    const email = document.getElementById('inputEmail').value.trim();
    const username = document.getElementById('inputUsername').value.trim();
    const password = document.getElementById('inputPassword').value;

    if (registerFieldsAreValid(firstName, lastName, email, username, password)) {
        displayInfoToast("Please wait...");

        const dataForApiRequest = {
            name: firstName + " " + lastName,
            email: email,
            username: username,
            password: password
        }

        axios({
            url: API_BASE_URL + 'auth/register/',
            method: 'post',
            data: dataForApiRequest,
        }).then(function({data, status}) {
          localStorage.setItem('token', data.token);
          window.location.href = '/';
        }).catch(function(err) {
          displayErrorToast('An account using same email or username is already created');
        })
    }
}

function login() {
    /***
     * @todo Complete this function.
     * @todo 1. Write code for form validation.
     * @todo 2. Fetch the auth token from backend and login the user.
     */
    const username = document.getElementById('inputUsername').value.trim();
    const password = document.getElementById('inputPassword').value;

    const dataForApiRequest = {
        username: username,
        password: password
    }
    if(loginDetailsValid(username,password)) {
        displayInfoToast('Please Wait... ');
        axios({
            url: API_BASE_URL + 'auth/login/',
            method: 'post',
            data: dataForApiRequest,
        }).then(function({data, status}) {
            localStorage.setItem('token', data.token);
            window.location.href = '/';
        }).catch(function(err){
            displayErrorToast('Invalid Credentials!!');
            window.location.href = '/register/';
        })
    } 
}

function editTask(id) {
    document.getElementById('task-' + id).classList.add('hideme');
    document.getElementById('task-actions-' + id).classList.add('hideme');
    document.getElementById('input-button-' + id).classList.remove('hideme');
    document.getElementById('done-button-' + id).classList.remove('hideme');
}

function addTask() {
    /**
     * @todo Complete this function.
     * @todo 1. Send the request to add the task to the backend server.
     * @todo 2. Add the task in the dom.
     */
    const taskToadd = document.querySelector('.todo-add-task input').value.trim();
    if(taskToadd === '') {
        displayErrorToast("Empty task can not be added");
        return;
    }
    axios({
        headers: {
            Authorization: 'Token ' + localStorage.getItem('token'),
        },
        url: API_BASE_URL + 'todo/create/',
        method: 'post',
        data: {
            title: taskToadd
        }
    }).then(function({data, status}){
        axios({
            headers: {
                Authorization: 'Token ' + localStorage.getItem('token'), 
            },
            url: API_BASE_URL + 'todo/',
            method: 'get',
        }).then(function({data,status}){
            const newtodo = data[data.length - 1];
            const tNo = newtodo.id;
            const newtask = document.createElement("li");
            newtask.innerHTML = `
            <input id="input-button-${tNo}" type="text" class="form-control todo-edit-task-input hideme" placeholder="Edit The Task">
            <div id="done-button-${tNo}"  class="input-group-append hideme">
                <button class="btn btn-outline-secondary todo-update-task" type="button" id="update-task-${tNo}">Done</button>
            </div>
            <div id="task-${tNo}" class="todo-task">
                ${taskToadd}
            </div>

            <span id="task-actions-${tNo}">
                <button style="margin-right:5px;" type="button" id="edit-task-${tNo}"
                    class="btn btn-outline-warning">
                    <img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486663/CSOC/edit.png"
                        width="18px" height="20px">
                </button>
                <button type="button" class="btn btn-outline-danger" id="delete-task-${tNo}">
                    <img src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486661/CSOC/delete.svg"
                        width="18px" height="22px">
                </button>
            </span>`;
            newtask.id = `todo-${tNo}`;
            newtask.classList.add(
                "list-group-item", "d-flex", "justify-content-between", "align-items-center"
            );
            console.log(tNo);
            document.querySelector(".todo-available-tasks").appendChild(newtask);
            document.querySelector(`#edit-task-${tNo}`).addEventListener("click", () => editTask(tNo));
            document.querySelector(`#delete-task-${tNo}`).addEventListener("click", () => deleteTask(tNo));
            document.querySelector(`#update-task-${tNo}`).addEventListener("click", () => updateTask(tNo));
            document.querySelector('.todo-add-task input').value = "";
        })
    }).catch(function(err){
        displayErrorToast("Error Occured!!");
    })
}



function deleteTask(id) {
    /**
     * @todo Complete this function.
     * @todo 1. Send the request to delete the task to the backend server.
     * @todo 2. Remove the task from the dom.
     */
    axios({
        headers: {
            Authorization: 'Token ' + localStorage.getItem('token'),
        },
        url: API_BASE_URL + `todo/${id}`,
        method: 'delete',
    }).then(function(response){
        displaySuccessToast("Task deleted");
        document.querySelector(`#todo-${id}`).remove();
    }).catch(function(err) {
        displayErrorToast("Error Occured!!");
    });
}

function updateTask(id) {
    /**
     * @todo Complete this function.
     * @todo 1. Send the request to update the task to the backend server.
     * @todo 2. Update the task in the dom.
     */
    // console.log("update");
    const task_up = document.getElementById(`input-button-${id}`).value.trim();
    if(!task_up) {
        displayErrorToast("Task can't be Empty!!");
        return;
    }
    axios({
        headers: {
            Authorization: 'Token ' + localStorage.getItem('token'),
        },
        url: API_BASE_URL + `todo/${id}/`,
        method: 'put',
        data: {
            id: id,
            title: task_up
        }
    }).then(function({data,status}){
        document.getElementById("task-" + id).classList.remove("hideme");
            document.getElementById("task-actions-" + id).classList.remove("hideme");
            document.getElementById("input-button-" + id).classList.add("hideme");
            document.getElementById("done-button-" + id).classList.add("hideme");
            document.getElementById(`task-${id}`).innerHTML = task_up;
        // document.getElementById(`task-${id}`).value = task_up;
    })
}


export { editTask, updateTask, deleteTask }