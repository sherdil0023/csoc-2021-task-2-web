import axios from 'axios';
import { editTask, updateTask, deleteTask } from "./main";
const API_BASE_URL = 'https://todo-app-csoc.herokuapp.com/';

function getTasks() {
    /***
     * @todo Fetch the tasks created by the user and display them in the dom.
     */
    iziToast.info({
        title: "Info",
        message: "Loading all todos"
    });
    axios({
        headers: {
            Authorization: 'Token ' + localStorage.getItem('token'),
        },
        url: API_BASE_URL + 'todo/',
        method: 'get',
    }).then(function({data,status}){
        for(let task of data) {
            const taskToadd = task.title;
            const tNo = task.id;
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
            document.querySelector(".todo-available-tasks").appendChild(newtask);
            document.querySelector(`#edit-task-${tNo}`).addEventListener("click", () => editTask(tNo));
            document.querySelector(`#delete-task-${tNo}`).addEventListener("click", () => deleteTask(tNo));
            document.querySelector(`#update-task-${tNo}`).addEventListener("click", () => updateTask(tNo));
        }
    });
}

axios({
    headers: {
        Authorization: 'Token ' + localStorage.getItem('token'),
    },
    url: API_BASE_URL + 'auth/profile/',
    method: 'get',
}).then(function({data, status}) {
  document.getElementById('avatar-image').src = 'https://ui-avatars.com/api/?name=' + data.name + '&background=fff&size=33&color=007bff';
  document.getElementById('profile-name').innerHTML = data.name;
  getTasks();
})
