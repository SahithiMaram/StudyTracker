// ======= User Login/Signup =======
const signupBtn = document.getElementById("signupBtn");
const loginBtn = document.getElementById("loginBtn");

if(signupBtn){
  signupBtn.addEventListener("click", () => {
    const username = document.getElementById("signupUsername").value.trim();
    const password = document.getElementById("signupPassword").value.trim();
    if(username === "" || password === "") return alert("Enter details");

    let users = JSON.parse(localStorage.getItem("users")) || {};
    if(users[username]) return alert("Username exists");

    users[username] = { password: password, signupDate: new Date().toLocaleDateString() };
    localStorage.setItem("users", JSON.stringify(users));
    alert("Signup successful! Login now.");
    window.location = "index.html";
  });
}

if(loginBtn){
  loginBtn.addEventListener("click", () => {
    const username = document.getElementById("loginUsername").value.trim();
    const password = document.getElementById("loginPassword").value.trim();
    let users = JSON.parse(localStorage.getItem("users")) || {};

    if(users[username] && users[username].password === password){
      localStorage.setItem("currentUser", username);
      window.location = "dashboard.html";
    } else {
      alert("Invalid username or password");
    }
  });
}

// ======= Task Manager =======
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const progressFill = document.getElementById("progressFill");

if(taskInput){ // only run on dashboard.html
  const currentUser = localStorage.getItem("currentUser");
  if(!currentUser) window.location = "index.html";

  let tasks = JSON.parse(localStorage.getItem("tasks_" + currentUser)) || [];

  function renderTasks(){
    taskList.innerHTML = "";
    tasks.forEach((task,index)=>{
      const li = document.createElement("li");
      li.className = task.completed ? "completed" : "";
      li.innerHTML = `<span>${task.text}</span>
      <div>
        <button onclick="toggleTask(${index})">✔</button>
        <button onclick="editTask(${index})">✏️</button>
        <button onclick="deleteTask(${index})">❌</button>
      </div>`;
      taskList.appendChild(li);
    });
    updateProgress();
    localStorage.setItem("tasks_" + currentUser, JSON.stringify(tasks));
  }

  addTaskBtn.addEventListener("click", () => {
    const text = taskInput.value.trim();
    if(text === "") return;
    tasks.push({text, completed:false});
    taskInput.value="";
    renderTasks();
  });

  // Add Enter key support
  taskInput.addEventListener("keyup", (e) => {
    if(e.key === "Enter") addTaskBtn.click();
  });

  window.toggleTask = function(index){
    tasks[index].completed = !tasks[index].completed;
    renderTasks();
  }

  window.deleteTask = function(index){
    tasks.splice(index,1);
    renderTasks();
  }

  window.editTask = function(index){
    const newText = prompt("Edit your task:", tasks[index].text);
    if(newText !== null && newText.trim() !== ""){
      tasks[index].text = newText.trim();
      renderTasks();
    }
  }

  function updateProgress(){
    const total = tasks.length;
    const completed = tasks.filter(t=>t.completed).length;
    const percent = total ? Math.round((completed/total)*100) : 0;
    progressFill.style.width = percent + "%";
    document.getElementById("progressText").textContent = percent + "% completed";
  }

  renderTasks();
}

// ======= Profile Page =======
if(document.getElementById("usernameDisplay")){
  const currentUser = localStorage.getItem("currentUser");
  if(!currentUser) window.location = "index.html";

  const tasks = JSON.parse(localStorage.getItem("tasks_" + currentUser)) || [];

  document.getElementById("usernameDisplay").textContent = currentUser;
  document.getElementById("totalTasks").textContent = tasks.length;
  const completedTasks = tasks.filter(t=>t.completed).length;
  document.getElementById("completedTasks").textContent = completedTasks;
  const pendingTasks = tasks.length - completedTasks;
  document.getElementById("pendingTasks").textContent = pendingTasks;

  const percent = tasks.length ? Math.round((completedTasks/tasks.length)*100) : 0;
  document.getElementById("progressFillProfile").style.width = percent + "%";
  document.getElementById("progressTextProfile").textContent = percent + "% completed";

  document.getElementById("logoutBtn").addEventListener("click", ()=>{
    localStorage.removeItem("currentUser");
    window.location = "index.html";
  });

  document.getElementById("goDashboard").addEventListener("click", ()=>{
    window.location = "dashboard.html";
  });
}
