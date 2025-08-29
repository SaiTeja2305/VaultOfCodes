const KEY='booking.demo.v1';
let bookings=JSON.parse(localStorage.getItem(KEY)||'[]');

function save(){ localStorage.setItem(KEY, JSON.stringify(bookings)); }

function fillTimes(){
  const sel=document.getElementById('time');
  sel.innerHTML='';
  const hours=[9,10,11,12,14,15,16,17];
  hours.forEach(h=>{
    ['00','30'].forEach(m=>{
      const t=`${String(h).padStart(2,'0')}:${m}`;
      const opt=document.createElement('option');
      opt.value=t; opt.textContent=t; sel.appendChild(opt);
    })
  })
}

function render(){
  const tbody=document.querySelector('#table tbody');
  tbody.innerHTML='';
  bookings.sort((a,b)=>a.date.localeCompare(b.date)||a.time.localeCompare(b.time))
    .forEach(b=>{
      const tr=document.createElement('tr');
      tr.innerHTML=`<td>${b.name}</td><td>${b.email}</td><td>${b.date}</td><td>${b.time}</td>
      <td><button data-id="${b.id}" class="danger">Cancel</button></td>`;
      tbody.appendChild(tr);
    });
}

function uid(){ return Math.random().toString(36).slice(2,9); }

function isTaken(date,time){ return bookings.some(b=>b.date===date && b.time===time); }

fillTimes();
render();

document.getElementById('booking-form').addEventListener('submit',(e)=>{
  e.preventDefault();
  const name=document.getElementById('name').value.trim();
  const email=document.getElementById('email').value.trim();
  const date=document.getElementById('date').value; 
  const time=document.getElementById('time').value;
  if(!name||!email||!date||!time) return;
  if(isTaken(date,time)) { alert('That slot is already booked.'); return; }
  bookings.push({ id: uid(), name, email, date, time });
  save();
  render();
  e.target.reset();
});

document.querySelector('#table').addEventListener('click',(e)=>{
  if(e.target.matches('button[data-id]')){
    const id=e.target.dataset.id;
    bookings=bookings.filter(b=>b.id!==id);
    save();
    render();
  }
});
