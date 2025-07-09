document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const addnewtaskbtn = document.getElementById('add-new-task-btn');
    const taskList = document.getElementById('task-list');
    const emptyImage = document.querySelector('.empty-img');
    const todocontainer = document.querySelector('.todo-container');
    const progressBar = document.getElementById('progress');
    const progressNumber = document.getElementById('numbers');

    const toggleEmptyState = () => {
        emptyImage.style.display = taskList.children.length === 0 ? 'block' : 'none';
        todocontainer.style.width = taskList.children.length > 0 ? '100%' : '50%';
    };

    const updateProgress = (checkCompletion = true) => {
        const totalTasks = taskList.children.length;
        const completedTasks = taskList.querySelectorAll('.checkbox:checked').length;

        progressBar.style.width = totalTasks ? `${(completedTasks / totalTasks) * 100}%` : '0%';
        progressNumber.textContent = `${completedTasks} / ${totalTasks}`;

        if(checkCompletion && totalTasks > 0 && completedTasks === totalTasks){
            launchConfetti();
        }
    };

const saveTaskToLocalStorage = () => {
    const task = Array.from(taskList.querySelectorAll('li')).map(li => ({text: li.querySelector('span').textContent, completed: li.querySelector('.checkbox').checked}));
    localStorage.setItem('task', JSON.stringify(task));
};

const loadTaskFromLocalStorage = () => {
    const savedTasks = JSON.parse(localStorage.getItem('task')) || [];
    savedTasks.forEach(({text, completed}) => addTask(text, completed, false));
    toggleEmptyState();
    updateProgress();
}

    const addTask = (text, completed = false, checkCompletion = true) => {       
        const taskText = text || taskInput.value.trim();
        if (!taskText) {
            return;
        }

        const li = document.createElement('li');
        li.innerHTML = `
        <input type = "checkbox" class = "checkbox" ${completed ? 'checked' : ''}/>
        <span>${taskText}</span>
        <div class="task-btns">
        <button class="edit-btn"><i class="fa-solid fa-pen"></i></button>
        <button class="dlt-btn"><i class="fa-regular fa-trash-can"></i></button>
        </div> 
        `;
        
        const checkbox = li.querySelector('.checkbox');
        const editBtn = li.querySelector('.edit-btn');

        if (completed) {
            li.classList.add('completed');
            editBtn.disabled = true;
            editBtn.style.opacity = '0.5';
            editBtn.style.pointerEvents = 'none';
        }

        checkbox.addEventListener('change', () => {
            const isChecked = checkbox.checked;
            li.classList.toggle('completed', isChecked);
            editBtn.disabled = isChecked;
            editBtn.style.opacity = isChecked ? '0.5' : '1';
            editBtn.style.pointerEvents = isChecked ? 'none' : 'auto';
            updateProgress();
            saveTaskToLocalStorage();
        })

        editBtn.addEventListener('click', () => {
            if (!checkbox.checked) {
                taskInput.value = li.querySelector('span').textContent;
                li.remove();
                toggleEmptyState();
                updateProgress(false);
                saveTaskToLocalStorage();
            }
        });

        li.querySelector('.dlt-btn').addEventListener('click', () => {
            li.remove();
            toggleEmptyState();
            updateProgress();
            saveTaskToLocalStorage();
        });

        taskList.appendChild(li);
        taskInput.value = '';
        toggleEmptyState();
        updateProgress(checkCompletion);
        saveTaskToLocalStorage();
    };

    addnewtaskbtn.addEventListener('click', () => addTask());
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTask();
        }
    });

    loadTaskFromLocalStorage();
});


//  this for ts-particles styles
const launchConfetti = () =>{
function randomInRange(min, max) {
  return Math.random() * (max - min) + min;
}

confetti({
  angle: randomInRange(55, 125),
  spread: randomInRange(50, 70),
  particleCount: randomInRange(50, 100),
  origin: { y: 0.6 },
});
};