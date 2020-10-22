const { add } = require("date-fns");

let todaysDate = new Date().toISOString().slice(0, 10);

const elements = (function () {
  const content = document.querySelector('.content');

  const addProjectBtn = content.querySelector('#add-project');
  const addTaskBtn = content.querySelector('#add-task');

  const projects = content.querySelectorAll('.project');

  const taskModal = content.querySelector('.task-modal');
  const taskModalClose = taskModal.querySelector('.close');
  const taskModalForm = taskModal.querySelector('form');
  const projectModal = content.querySelector('.project-modal');
  const projectModalClose = projectModal.querySelector('.close');
  const projectModalForm = projectModal.querySelector('form');
  
  const tasksSection = content.querySelector('.tasks');
  const projectsSection = content.querySelector('.projects-list')

  // limit the date input to today or greater
  const limitDateInput = content.querySelector('#task-due').setAttribute('min', todaysDate);
 

  let projectsAndTasks = {
    inbox: [
      // {
      //   title: 'title 1',
      //   priority: '1',
      //   due: '2020-10-15',
      //   created: '2020-10-14',
      //   completed: 'false'
      // },
      // {
      //   title: 'title 2',
      //   priority: '2',
      //   due: '2020-10-16',
      //   created: '2020-10-14',
      //   completed: 'false'
      // }
    ],
    Project1:[]
  };

  //should we track what project is selected like this? what would duda do
  let state = {
    inbox : true,
    Project1 : false
  }


  return {
    content,
    addProjectBtn,
    addTaskBtn,
    projects,
    taskModal,
    projectModal, 
    taskModalClose,
    projectModalClose,
    taskModalForm,
    projectModalForm, 
    projectsAndTasks,
    tasksSection,
    projectsSection
  };
})();

class UI {
  static openTaskModal() {
    elements.taskModal.classList.toggle('active');
  }

  static openProjectModal() {
    elements.projectModal.classList.toggle('active');
  }

  static closeTaskModal() {
    elements.taskModal.classList.toggle('active');
    func.resetForms();
  }
  
  static closeProjectModal() {
    elements.projectModal.classList.toggle('active');
    func.resetForms();
  } 
  
  // clicking on a project - highlights the current project and displays it's tasks
  static projectClickHandler(e) {
    this.highlightProject(e);
    //not done - should also display all tasks of that project
  }

  static highlightProject(e) { //should be ran after all projects have been loadaed to the page
    // e == element (project) clicked
    elements.projects.forEach((el) => {
      if (el.firstChild == e.target) {
        el.firstChild.classList.add('active');
      } else {
        el.firstChild.classList.remove('active');
      }
    })
  }

  static submitNewTask() {
    console.log('new task sumbission');
    func.saveTaskToProject(func.newTaskFromForm());
    this.closeTaskModal();
    this.displayTasks('inbox'); // needs to be able to display tasks based on the currently selected one
  }
  
  static submitNewProject() {
    console.log('new project sumbission');
    // console.log(elements.projectsAndTasks);
    func.saveProjectFromForm();
    // console.log(elements.projectsAndTasks);
    this.closeProjectModal();
    this.displayProjects();
  }  

  static displayProjects() {
    elements.projectsSection.innerHTML = '';
    Object.keys(elements.projectsAndTasks).forEach((project, i) => {
      if (i == 0) {
        elements.projectsSection.innerHTML += `<li class="nav-item project"><a href="#" class="nav-link active">${project}</a></li>`;
      } else {
        elements.projectsSection.innerHTML += `<li class="nav-item project"><a href="#" class="nav-link">${project}</a></li>`;
      }
    })
  }

  static displayTasks(project) {
    elements.tasksSection.innerHTML = '';
    
    elements.projectsAndTasks[project].forEach((task) => {
      if (elements.projectsAndTasks[project][0] == undefined) { return };

      let priorityColor;
      if (task.priority == 1) { priorityColor = 'danger' };
      if (task.priority == 2) { priorityColor = 'warning' };
      if (task.priority == 3) { priorityColor = 'success' };
      
      elements.tasksSection.innerHTML += this.createTaskElement(task.title, task.created, task.due, priorityColor, task.priority, task.id);

    })
  
    // add event listeners to newly created elements
    const deleteBins = elements.content.querySelectorAll('.bi-trash');
    deleteBins.forEach(el => {
      el.addEventListener('click', e => {
        UI.deleteTask(e.target);
      })
    })

    const editPencils = elements.content.querySelectorAll('.bi-pencil'); // not finished, to be completed
    editPencils.forEach(el => {
      el.addEventListener('click', e => {
        UI.editTask(e.target);
      })
    })
  
    let addNewButton = document.createElement('button');
    addNewButton.className = 'add-button';
    addNewButton.id = 'add-task';
    addNewButton.textContent = '+';
    addNewButton.addEventListener('click', UI.openTaskModal);
    
    elements.tasksSection.appendChild(addNewButton);

    console.log(elements.projectsAndTasks);
  }

  // creates task HTML element and returns it
  static createTaskElement(title, created, due, priorityBtn, priority, id) {
    let currentTask = `<div class="task" data-id='${id}'>
      <input type="checkbox" name="" class="task-checkbox">
      <div class="task-title"> ${title}</div>
      <div class="date-added"> ${created}</div>
      <div class="date-due"> ${due}</div>
      <div class="priority btn-${priorityBtn}">${priority}</div>
      <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-pencil" fill="currentColor"
      xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd"
      d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5L13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175l-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z" />
      </svg>
      <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-trash" fill="currentColor"
      xmlns="http://www.w3.org/2000/svg">
      <path
      d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
      <path fill-rule="evenodd"
      d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
      </svg>
      </div>`;
    return currentTask;
  }

  static deleteTask(el) {
    //note: weird bug when only el.parentElement.remove() it would get the task div the first time but the svg the second
    if (el.parentElement.classList.value.includes('task')) {
      el.parentElement.remove();
    } else if (el.parentElement.parentElement.classList.value.includes('task')) {
      el.parentElement.parentElement.remove();
    } else {
      console.log('What in lords name have you clicked');
    }
  }
}

// calling the display task func
UI.displayTasks('inbox');
UI.displayProjects();

class func {
  static resetForms() {
    elements.taskModal.querySelector('form').reset();
    elements.projectModal.querySelector('form').reset();
  }
  
  static newTaskFromForm() {
    let taskDue = (elements.taskModalForm['task-due'].value == "") ? todaysDate : elements.taskModalForm['task-due'].value;
    const newTask = Task(
      elements.taskModalForm['task-title'].value,
      elements.taskModalForm['task-priority'].value,
      taskDue,
      todaysDate);
    return newTask;
  }

  static saveTaskToProject(task) {
   // not necessarily only inbox, change to accept any project
    elements.projectsAndTasks.inbox.push(task);
  }

  static saveProjectFromForm() { // needs to be able to pop up something if the project already exists
    let newProject = elements.projectModalForm['project-title'].value;
    console.log(newProject);
    let projectExists = false;

    Object.keys(elements.projectsAndTasks).forEach(e => {
      if (e == newProject) {projectExists = true}
    })

    if (!projectExists) {
      elements.projectsAndTasks[newProject] = [];
      console.log('new project added');
    }
    console.log(elements.projectsAndTasks);
  }

  static deleteFromProAndTasks() {

  }

  static loadFromLocStorage() {

  }

  static saveToLocStorage() {

  }

  static deleteFromLocStorage() {

  }

}


const eventListeners = (function () {
  elements.addProjectBtn.addEventListener('click', UI.openProjectModal);

  elements.taskModalClose.addEventListener('click', UI.closeTaskModal);
  elements.projectModalClose.addEventListener('click', UI.closeProjectModal);

  elements.taskModalForm.addEventListener('submit', (e) => {
    e.preventDefault();
    UI.submitNewTask(e);
  });

  elements.projectModalForm.addEventListener('submit', (e) => {
    e.preventDefault();
    UI.submitNewProject(e);
  });

  elements.projects.forEach((el) => {
    el.addEventListener('click', (e) => {
      UI.projectClickHandler(e);
    });
  });

})();

let i = 0;
const Task = (taskTitle, taskPriority, taskDue = todaysDate, taskCreated = todaysDate, taskCompleted = false) => {
  let title = taskTitle;
  let priority = taskPriority;
  let due = taskDue;
  let created = taskCreated;
  let completed = taskCompleted;
  let id = i;
  i++;
  
  return {
    title,
    priority,
    due,
    created,
    completed,
    id
  };
};



// UI

// add task
// modal for task input
// due date
// title - displayed in the bulk of the tasks
// description
// priority - is indicated as a small number in a circle thats 3 (blue) 2 (yellow) 1 (red)
// update task deadline - on click on date small date picker pops up
// create modal that pops up on  - create default modal generator and adjust content inside wheteher its new task, new project, open task

// add project

// change displayed tasks based on project

// delete task

// edit task

// local storage

// save to locstor
// retrieve from locstor
// delete from locstor

