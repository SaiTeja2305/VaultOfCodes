const key='mini.blog.posts.v1';
let posts=JSON.parse(localStorage.getItem(key)||'[]');
let editingId=null;

const el=(s)=>document.querySelector(s);
const postsEl=el('#posts');

function save(){localStorage.setItem(key,JSON.stringify(posts));}
function uid(){return Math.random().toString(36).slice(2,9)}

function render(){
  const q=el('#q').value.toLowerCase();
  postsEl.innerHTML='';
  posts
    .filter(p=>!q||p.title.toLowerCase().includes(q)||p.content.toLowerCase().includes(q)||p.tags.join(',').toLowerCase().includes(q))
    .sort((a,b)=>b.created-a.created)
    .forEach(p=>{
      const div=document.createElement('article');
      div.className='card';
      div.innerHTML=`
        <h3>${p.title}</h3>
        <div class="post-meta">${new Date(p.created).toLocaleString()}</div>
        <p>${p.content.slice(0,180)}${p.content.length>180?'…':''}</p>
        <div class="tags">${p.tags.map(t=>`<span class="tag">#${t}</span>`).join('')}</div>
        <div class="post-actions">
          <button data-id="${p.id}" class="edit">Edit</button>
          <button data-id="${p.id}" class="delete">Delete</button>
        </div>`;
      postsEl.appendChild(div);
    });
}

function openEditor(post){
  el('#editor').classList.remove('hidden');
  el('#form-title').textContent=post? 'Edit Post' : 'New Post';
  editingId=post?.id||null;
  el('#title').value=post?.title||'';
  el('#content').value=post?.content||'';
  el('#tags').value=post? post.tags.join(', ') : '';
}

el('#new').onclick=()=>openEditor();
el('#cancel').onclick=()=>el('#editor').classList.add('hidden');
el('#q').oninput=render;

el('#post-form').onsubmit=(e)=>{
  e.preventDefault();
  const post={
    id: editingId||uid(),
    title: el('#title').value.trim(),
    content: el('#content').value.trim(),
    tags: el('#tags').value.split(',').map(s=>s.trim()).filter(Boolean),
    created: editingId? posts.find(p=>p.id===editingId).created : Date.now()
  };
  if(editingId){
    posts=posts.map(p=>p.id===editingId? post : p);
  } else {
    posts.push(post);
  }
  save();
  el('#editor').classList.add('hidden');
  render();
}

postsEl.addEventListener('click',(e)=>{
  const id=e.target.dataset.id;
  if(!id) return;
  if(e.target.classList.contains('edit')){
    const post=posts.find(p=>p.id===id); openEditor(post);
  } else if(e.target.classList.contains('delete')){
    posts=posts.filter(p=>p.id!==id); save(); render();
  }
});

render();
