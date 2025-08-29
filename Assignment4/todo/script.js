const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);
const storeKey = 'todo.items.v1';
let items = JSON.parse(localStorage.getItem(storeKey) || '[]');

function save() { localStorage.setItem(storeKey, JSON.stringify(items)); }
function uid() { return Math.random().toString(36).slice(2, 9); }

function render() {
  const list = $('#list');
  const filter = $('#filter').value;
  const q = $('#search').value.toLowerCase();
  list.innerHTML = '';
  items
    .filter(i => (filter==='all') || (filter==='active' && !i.done) || (filter==='completed' && i.done))
    .filter(i => i.title.toLowerCase().includes(q))
    .forEach(i => {
      const li = document.createElement('li');
      li.dataset.id = i.id;
      li.className = i.done ? 'completed' : '';
      li.innerHTML = `
        <input type="checkbox" ${i.done ? 'checked' : ''}>
        <div class="title" title="Double‑click to edit">${i.title}</div>
        <div class="actions">
          <span class="pill">${new Date(i.created).toLocaleDateString()}</span>
          <button class="delete">Delete</button>
        </div>`;
      list.appendChild(li);
    });
}

$('#todo-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const title = $('#todo-input').value.trim();
  if (!title) return;
  items.push({ id: uid(), title, done: false, created: Date.now() });
  $('#todo-input').value='';
  save();
  render();
});

$('#list').addEventListener('change', (e) => {
  const li = e.target.closest('li');
  if (!li) return;
  const id = li.dataset.id;
  if (e.target.type === 'checkbox') {
    items = items.map(i => i.id===id ? { ...i, done: e.target.checked } : i);
    save();
    render();
  }
});

$('#list').addEventListener('click', (e) => {
  if (e.target.classList.contains('delete')) {
    const id = e.target.closest('li').dataset.id;
    items = items.filter(i => i.id!==id);
    save();
    render();
  }
});

$('#list').addEventListener('dblclick', (e) => {
  const li = e.target.closest('li');
  if (!li) return;
  const id = li.dataset.id;
  const item = items.find(x => x.id===id);
  const titleEl = li.querySelector('.title');
  const input = document.createElement('input');
  input.value = item.title;
  input.style.padding = '8px 10px';
  titleEl.replaceWith(input);
  input.focus();
  input.addEventListener('blur', () => { item.title = input.value.trim()||item.title; save(); render(); });
  input.addEventListener('keydown', (ev)=>{ if(ev.key==='Enter') input.blur(); });
});

$('#filter').addEventListener('change', render);
$('#search').addEventListener('input', render);
$('#clear-completed').addEventListener('click', () => { items = items.filter(i=>!i.done); save(); render(); });

render();
