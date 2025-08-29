const moves=['rock','paper','scissors'];
let ps=0, cs=0;

function winner(p,c){
  if(p===c) return 'draw';
  if((p==='rock'&&c==='scissors')||(p==='paper'&&c==='rock')||(p==='scissors'&&c==='paper')) return 'player';
  return 'computer';
}

document.querySelectorAll('button[data-move]').forEach(btn=>{
  btn.onclick=()=>{
    const p=btn.dataset.move;
    const c=moves[Math.floor(Math.random()*3)];
    const w=winner(p,c);
    if(w==='player') ps++; else if(w==='computer') cs++;
    document.getElementById('ps').textContent=ps;
    document.getElementById('cs').textContent=cs;
    const r=document.getElementById('result');
    r.textContent=`You chose ${p}, computer chose ${c} → ${w.toUpperCase()}`;
  };
});
