/* Tưởng nhớ: Thắp nến · Tặng hoa · Thả tim · Cầu nguyện
   Chỉ là hiệu ứng trên máy người xem. Mỗi máy nhớ mỗi loại 1 lần / 1 người / 1 ngày (trong trình duyệt). */
(function(){
  const TYPES=[
    {k:"nen", e:"🕯️", l:"Thắp nến",   done:"Đã thắp nến cho",      fx:["✨","🕯️","✨"]},
    {k:"hoa", e:"🌹",  l:"Tặng hoa",   done:"Đã tặng hoa cho",      fx:["🌹","🌸","🌷"]},
    {k:"tim", e:"❤️",  l:"Thả tim",    done:"Đã thả tim cho",       fx:["❤️","💗","💛"]},
    {k:"kinh",e:"🙏",  l:"Cầu nguyện", done:"Đã dâng lời cầu nguyện cho", fx:["🙏","✝️","✨"]}
  ];
  const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

  /* ---- Nhớ lượt đã bấm hôm nay trên máy này ---- */
  const day=()=>{const d=new Date();return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;};
  const dk=(key,t)=>`tn:${day()}:${key}:${t}`;
  const isDone=(key,t)=>{try{return localStorage.getItem(dk(key,t))==="1";}catch(e){return false;}};
  const setDone=(key,t,v)=>{try{v?localStorage.setItem(dk(key,t),"1"):localStorage.removeItem(dk(key,t));}catch(e){}};

  /* ---- Giao diện ---- */
  function html(key,name){
    return `<div class="tn" data-k="${esc(key)}" data-n="${esc(name)}">`+
      TYPES.map(t=>`<button class="tn-b" type="button" data-t="${t.k}" aria-label="${t.l} cho ${esc(name)}">
        <span class="tn-e" aria-hidden="true">${t.e}</span><span class="tn-l">${t.l}</span></button>`).join("")+
      `</div>`;
  }
  function paint(el){
    el.querySelectorAll(".tn-b").forEach(b=>b.classList.toggle("on",isDone(el.dataset.k,b.dataset.t)));
  }
  function mount(root){
    (root||document).querySelectorAll(".tn:not([data-m])").forEach(el=>{el.dataset.m="1"; paint(el);});
  }

  /* ---- Hiệu ứng ---- */
  const calm=matchMedia("(prefers-reduced-motion: reduce)").matches;
  function burst(btn,t){
    const r=btn.getBoundingClientRect(), n=calm?1:7;
    for(let i=0;i<n;i++){
      const s=document.createElement("span"); s.className="tn-fx"; s.textContent=t.fx[i%t.fx.length];
      s.style.left=(r.left+r.width/2)+"px"; s.style.top=(r.top+r.height/2)+"px";
      s.style.setProperty("--dx",(calm?0:(Math.random()*120-60))+"px");
      s.style.setProperty("--dy",(calm?-40:-(80+Math.random()*90))+"px");
      s.style.setProperty("--rot",(calm?0:(Math.random()*50-25))+"deg");
      s.style.animationDelay=(i*55)+"ms"; s.style.fontSize=(18+Math.random()*12)+"px";
      document.body.appendChild(s); setTimeout(()=>s.remove(),1700+i*55);
    }
  }
  let toastT;
  function toast(msg){
    let el=document.getElementById("tnToast");
    if(!el){ el=document.createElement("div"); el.id="tnToast"; el.className="tn-toast"; el.setAttribute("role","status"); document.body.appendChild(el); }
    el.textContent=msg; el.classList.add("show"); clearTimeout(toastT); toastT=setTimeout(()=>el.classList.remove("show"),2600);
  }

  /* ---- Bấm nút ---- */
  document.addEventListener("click",async e=>{
    const b=e.target.closest(".tn-b"); if(!b) return;
    const box=b.closest(".tn"), key=box.dataset.k, name=box.dataset.n, t=TYPES.find(x=>x.k===b.dataset.t);
    if(isDone(key,t.k)){ toast(`Hôm nay bạn đã ${t.l.toLowerCase()} cho ${name}. Xin tiếp tục cầu nguyện cho linh hồn.`); b.classList.remove("shake"); void b.offsetWidth; b.classList.add("shake"); return; }
    setDone(key,t.k,true); burst(b,t);
    document.querySelectorAll(`.tn[data-k="${CSS.escape(key)}"]`).forEach(paint);
    toast(`${t.done} ${name}. Xin Chúa cho linh hồn được nghỉ yên muôn đời.`);
  });

  window.TN={html,mount};
})();
