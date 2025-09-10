const input = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const list = document.getElementById('taskList');
const count = document.getElementById('count');
const filters = document.querySelectorAll('.filter');
const clearAllBtn = document.getElementById('clearAll');

let tasks = JSON.parse(localStorage.getItem('tasks_v1')||'[]');
let filterMode = 'all';

function save(){ localStorage.setItem('tasks_v1', JSON.stringify(tasks)); }

function render(){
  list.innerHTML = '';
  let visible = tasks.filter(t => {
    if(filterMode==='active') return !t.done;
    if(filterMode==='completed') return t.done;
    return true;
  });

  visible.forEach((t, idx) => {
    const li = document.createElement('li');
    li.className = 'task-item';

    const left = document.createElement('div'); left.className = 'left';
    // checkbox
    const cb = document.createElement('div');
    cb.className = 'checkbox' + (t.done? ' checked':'');
    cb.innerHTML = t.done ? '&#10003;' : '';
    cb.onclick = () => { tasks[idx].done = !tasks[idx].done; save(); render(); };

    const text = document.createElement('div');
    text.className = 'task-text' + (t.done? ' completed':'');
    text.textContent = t.text;

    left.appendChild(cb);
    left.appendChild(text);

    // actions
    const actions = document.createElement('div'); actions.className='actions';
    const edit = document.createElement('button'); edit.className='action-btn'; edit.title='Edit';
    edit.innerHTML = '&#9998;'; edit.onclick = () => {
      const newVal = prompt('Edit task', t.text);
      if(newVal!==null && newVal.trim()!==''){
        tasks[idx].text = newVal.trim(); save(); render();
      }
    };
    const del = document.createElement('button'); del.className='action-btn'; del.title='Delete';
    del.innerHTML = '&#128465;'; del.onclick = () => {
      if(confirm('Delete this task?')){
        tasks.splice(idx,1); save(); render();
      }
    };

    actions.appendChild(edit); actions.appendChild(del);

    li.appendChild(left); li.appendChild(actions);
    list.appendChild(li);
  });

  const total = tasks.length;
  const leftCount = tasks.filter(t=>!t.done).length;
  count.textContent = `${total} items • ${leftCount} left`;
}

addBtn.addEventListener('click', ()=> {
  const v = input.value.trim();
  if(!v) return;
  tasks.push({text:v, done:false});
  input.value=''; save(); render();
});

input.addEventListener('keydown', (e)=> {
  if(e.key==='Enter') addBtn.click();
});

filters.forEach(f=>{
  f.addEventListener('click', ()=>{
    filters.forEach(x=>x.classList.remove('active'));
    f.classList.add('active');
    filterMode = f.dataset.filter;
    render();
  });
});

clearAllBtn.addEventListener('click', ()=>{
  if(confirm('Clear all tasks?')){ tasks=[]; save(); render(); }
});

render();
