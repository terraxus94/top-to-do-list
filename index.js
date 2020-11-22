let todaysDate = new Date().toISOString().slice(0, 10);
let state = {}; 

const elements = (function () {
  const content = document.querySelector('.content');

  const addProjectBtn = content.querySelector('#add-project');
  const addTaskBtn = content.querySelector('#add-task');


  const taskModal = content.querySelector('.task-modal');
  const taskModalClose = taskModal.querySelector('.close');
  const taskModalForm = taskModal.querySelector('form');
  const projectModal = content.querySelector('.project-modal');
  const projectModalClose = projectModal.querySelector('.close');
  const projectModalForm = projectModal.querySelector('form');
  const editTaskModal = content.querySelector('.edit-task-modal');
  const editTaskModalClose = editTaskModal.querySelector('.close');
  const editTaskModalForm = editTaskModal.querySelector('form');
  
  const tasksSection = content.querySelector('.tasks');
  const projectsSection = content.querySelector('.projects-list')

  // limit the deadline input to today or later
  const limitDateInput = content.querySelector('#task-due').setAttribute('min', todaysDate); //where tf should this be
 
  const trashcanSVG = `<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-trash" fill="currentColor"
      xmlns="http://www.w3.org/2000/svg">
      <path
      d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
      <path fill-rule="evenodd"
      d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
      </svg>`;
  const pencilSVG = `<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-pencil" fill="currentColor"
      xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd"
      d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5L13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175l-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z" />
      </svg>`

  let projectsAndTasks = {
    Inbox: []
  };

  return {
    content,
    addProjectBtn,
    addTaskBtn,
    taskModal,
    projectModal, 
    taskModalClose,
    projectModalClose,
    taskModalForm,
    projectModalForm, 
    projectsAndTasks,
    tasksSection,
    projectsSection,
    trashcanSVG,
    pencilSVG,
    editTaskModal, 
    editTaskModalClose,   
    editTaskModalForm
  };
})();

class UI {
  static openTaskModal() {
    elements.taskModal.classList.toggle('active');
  }

  static closeTaskModal() {
    elements.taskModal.classList.toggle('active');
    func.resetForms();
  }

  static openProjectModal() {
    elements.projectModal.classList.toggle('active');
  }


  static closeProjectModal() {
    elements.projectModal.classList.toggle('active');
    func.resetForms();
  } 
  
  static openEditTaskModal() {
    elements.editTaskModal.classList.toggle('active');
  }

  static closeEditTaskModal() {
    elements.editTaskModal.classList.toggle('active');
    func.resetForms();
  }

  // clicking on a project - highlights the current project and displays it's tasks
  static projectClickHandler(e) {
    func.updateStateObject(e.target.textContent)
    this.highlightProject();
    this.displayTasks();
  }

  static highlightProject() { 
    const projects = elements.content.querySelectorAll('.project');
    Object.keys(state).forEach((project, i) => {
      if (state[project] == true) {
        projects[i].firstChild.classList.add('active');
      } else {
        projects[i].firstChild.classList.remove('active');
      }
    })
  }
    
  static submitNewTask() {
    Object.keys(state).forEach(project => {
      if (state[project] == true) {
        func.saveTaskToProject(project, func.newTaskFromForm());
      }
    })
    this.closeTaskModal();
    this.displayTasks(); 
  }
  
  static submitNewProject() {
    func.saveProjectFromForm();
    this.closeProjectModal();
    this.displayProjects();
    this.highlightProject();
  }  

  static displayProjects() {
    elements.projectsSection.innerHTML = '';
    Object.keys(elements.projectsAndTasks).forEach((project, i) => {
      if (i == 0) {
        elements.projectsSection.innerHTML += `<li class="nav-item project"><a href="#" class="nav-link">${project}</a>${elements.trashcanSVG}</li>`;
      } else {
        elements.projectsSection.innerHTML += `<li class="nav-item project"><a href="#" class="nav-link">${project}</a>${elements.trashcanSVG}</li>`;
      }
    })

    // highlighting the project
    const projects = elements.content.querySelectorAll('.project .nav-link');
    projects.forEach((el) => {
      el.addEventListener('click', (e) => {
        UI.projectClickHandler(e);
      });
    });

    // deleting the project
    const projectTrash = elements.content.querySelectorAll('.project .bi-trash');
    projectTrash.forEach(el => {
      el.addEventListener('click', e => {
        UI.deleteProject(e.target);
      })
    })
  }

  static displayTasks() {
    elements.tasksSection.innerHTML = '';
    
    Object.keys(state).forEach(project => {
      if (state[project] == true) {
        elements.projectsAndTasks[project].forEach((task) => {
          if (elements.projectsAndTasks[project][0] == undefined) { return };
    
          let priorityColor;
          if (task.priority == 1) { priorityColor = 'danger' };
          if (task.priority == 2) { priorityColor = 'warning' };
          if (task.priority == 3) { priorityColor = 'success' };
          
          elements.tasksSection.innerHTML += this.createTaskElement(task.title, task.created, task.due, priorityColor, task.priority, task.id);
        })
      }
    })
  
    // deleting tasks
    const deleteBins = elements.content.querySelector('.tasks-section').querySelectorAll('.bi-trash'); 
    deleteBins.forEach(el => {
      el.addEventListener('click', e => {
        UI.deleteTask(e.target);
      })
    })

    // editing tasks
    const editPencils = elements.content.querySelectorAll('.bi-pencil'); // not finished, to be completed
    editPencils.forEach(el => {
      el.addEventListener('click', e => {
        UI.editTaskModal(e.target);
      })
    })
  
    let addNewButton = document.createElement('button');
    addNewButton.className = 'add-button';
    addNewButton.id = 'add-task';
    addNewButton.textContent = '+';
    addNewButton.addEventListener('click', UI.openTaskModal);
    
    elements.tasksSection.appendChild(addNewButton);
  }

  // creates task HTML element and returns it
  static createTaskElement(title, created, due, priorityBtn, priority, id) {
    let currentTask = `<div class="task" data-id='${id}'>
      <input type="checkbox" name="" class="task-checkbox">
      <div class="task-title"> ${title}</div>
      <div class="date-added"> ${created}</div>
      <div class="date-due"> ${due}</div>
      <div class="priority btn-${priorityBtn}">${priority}</div>
      ${elements.pencilSVG}
      ${elements.trashcanSVG}
      </div>`;
    return currentTask;
  }

  static deleteTask(el) {
    const taskTitle = el.parentElement.querySelector('.task-title')
    // in order to avoid dealing with an error when clicked between the lines of the svg
    if (taskTitle) {
      func.deleteTaskFromProAndTasks(taskTitle.textContent)
      func.generateStateObject()
      UI.displayTasks();
    }
  }

  static deleteProject(el) {
    func.deleteProjectFromProAndTasks(el.parentElement.firstChild.textContent) // this is the project's name
    func.generateStateObject()
    UI.displayTasks();
    UI.displayProjects();
    UI.highlightProject();
  }

  static editTaskModal(el) {
    const taskID = el.parentElement.dataset.id;
      
    Object.keys(state).forEach(project => {
      if (state[project] == true) {
        elements.projectsAndTasks[project].forEach((task, i) => {
          if (task.id == taskID) {
            this.openEditTaskModal();
            elements.editTaskModalForm['task-title'].value = task.title;
            elements.editTaskModalForm['task-due'].value = task.due;
            elements.editTaskModalForm['task-priority'].value = task.priority;
            elements.editTaskModal.dataset.id = task.id;
          }
        })
      }
    })
  }
}

// calling the display task func to initiate 
UI.displayTasks();
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

  static saveTaskToProject(project, task) {
    elements.projectsAndTasks[project].push(task);
  }

  static saveProjectFromForm() {
    let newProject = elements.projectModalForm['project-title'].value;
    let projectExists = false;

    Object.keys(elements.projectsAndTasks).forEach(e => {
      if (e == newProject) {projectExists = true}
    })

    if (!projectExists) {
      elements.projectsAndTasks[newProject] = [];
      state[newProject] = false;
    } else {
      alert ('Project already exists, please eneter another project name.')
    }
  }

  static deleteTaskFromProAndTasks(id) {
    Object.keys(state).forEach(project => {
      if (state[project] == true) {
        elements.projectsAndTasks[project].forEach((task, i) => {
          if (task.title == id || task.title == id.replace(' ','')) {
            elements.projectsAndTasks[project].splice(i,1);
          }
        })
      }
    })
  }

  static deleteProjectFromProAndTasks(id) {
    Object.keys(elements.projectsAndTasks).forEach(project => {
      if (project == id) { delete elements.projectsAndTasks[id] };
    })
  }
  
  static loadFromLocStorage() {

  }

  static saveToLocStorage() {

  }

  static deleteFromLocStorage() {

  }

  static generateStateObject() {
    state = {};
    Object.keys(elements.projectsAndTasks).forEach((key, i) => {
      if (i == 0) {
        state[key] = true;
      } else {
        state[key] = false;
      }
    })
    return state;
  }

  static updateStateObject(projectClicked) {
    Object.keys(state).forEach(project => {
      if (project == projectClicked) {
        state[project] = true;
      } else {
        state[project] = false;
      }
    })
  }

  static editTask() {
    const taskID = elements.editTaskModal.dataset.id;
    Object.keys(state).forEach(project => {
      if (state[project] == true) {
        elements.projectsAndTasks[project].forEach(task => {
          if (task.id == taskID) {
            task.title = elements.editTaskModalForm['task-title'].value;
            task.due = elements.editTaskModalForm['task-due'].value;
            task.priority = elements.editTaskModalForm['task-priority'].value;
          }
        })
      }
    })
    elements.editTaskModal.dataset.id = '';
    UI.closeEditTaskModal();
    UI.displayTasks();
  }
}

func.generateStateObject();
UI.highlightProject();

const eventListeners = (function () {
  elements.addProjectBtn.addEventListener('click', UI.openProjectModal);
  elements.taskModalClose.addEventListener('click', UI.closeTaskModal);
  elements.projectModalClose.addEventListener('click', UI.closeProjectModal);
  elements.editTaskModalClose.addEventListener('click', UI.closeEditTaskModal);
  
  elements.taskModalForm.addEventListener('submit', (e) => {
    e.preventDefault();
    UI.submitNewTask(e);
  });

  elements.projectModalForm.addEventListener('submit', (e) => {
    e.preventDefault();
    UI.submitNewProject(e);
  });
  
  elements.editTaskModalForm.addEventListener('submit', (e) => {
    e.preventDefault();
    func.editTask(e);
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

// update task deadline - on click on date small date picker pops up
// create modal that pops up on  - create default modal generator and adjust content inside wheteher its new task, new project, open task

// edit task

// local storage

// save to locstor
// retrieve from locstor
// delete from locstor
// delete event listener change from svg to something else it's impossible to fucking click it
// delete tasks by task ID not name

