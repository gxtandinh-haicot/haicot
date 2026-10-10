/* Thư viện ảnh Nhà chờ Phục sinh – đọc file hinh-anh.json (tối đa 12 ảnh) */
(function(){
  const $=id=>document.getElementById(id);
  let photos=null, cur=0;

  async function fetchPhotos(){
    if(photos) return photos;
    try{
      const r=await fetch("hinh-anh.json?v="+Date.now(),{cache:"no-store"});
      photos=r.ok?((await r.json()).photos||[]).slice(0,12):[];
    }catch(e){ photos=[]; }
    return photos;
  }

  // Chỉ hiện nút khi đã có file ảnh trên trang
  (async()=>{
    try{
      const r=await fetch("hinh-anh.json?v="+Date.now(),{method:"HEAD",cache:"no-store"});
      if(r.ok) $("galOpen").hidden=false;
    }catch(e){}
  })();

  function esc(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}

  async function openGal(){
    $("gal").hidden=false; document.body.style.overflow="hidden";
    const list=await fetchPhotos();
    $("galGrid").innerHTML=list.length
      ? list.map((p,i)=>`<button class="gal-item" type="button" data-i="${i}"><img src="${p.src}" alt="${esc(p.caption||"Nhà chờ Phục sinh")}" loading="lazy">${p.caption?`<span>${esc(p.caption)}</span>`:""}</button>`).join("")
      : `<p class="hint">Chưa có hình ảnh.</p>`;
    $("galClose").focus();
  }
  function closeGal(){ $("gal").hidden=true; document.body.style.overflow=""; }

  function show(i){
    cur=(i+photos.length)%photos.length;
    const p=photos[cur];
    $("lbImg").src=p.src; $("lbImg").alt=p.caption||"Nhà chờ Phục sinh";
    $("lbCap").textContent=(p.caption?p.caption+" · ":"")+(cur+1)+"/"+photos.length;
    const many=photos.length>1; $("lbPrev").hidden=!many; $("lbNext").hidden=!many;
  }
  function openLb(i){ $("lb").hidden=false; show(i); }
  function closeLb(){ $("lb").hidden=true; $("lbImg").src=""; }

  $("galOpen").onclick=openGal;
  $("galClose").onclick=closeGal;
  $("galGrid").addEventListener("click",e=>{const b=e.target.closest(".gal-item"); if(b) openLb(+b.dataset.i);});
  $("lbClose").onclick=closeLb;
  $("lbPrev").onclick=()=>show(cur-1);
  $("lbNext").onclick=()=>show(cur+1);
  $("lb").addEventListener("click",e=>{ if(e.target.id==="lb") closeLb(); });
  document.addEventListener("keydown",e=>{
    if(!$("lb").hidden){ if(e.key==="Escape")closeLb(); if(e.key==="ArrowLeft")show(cur-1); if(e.key==="ArrowRight")show(cur+1); }
    else if(!$("gal").hidden && e.key==="Escape") closeGal();
  });
  // Vuốt trái/phải trên điện thoại
  let sx=null;
  $("lb").addEventListener("touchstart",e=>{sx=e.touches[0].clientX;},{passive:true});
  $("lb").addEventListener("touchend",e=>{ if(sx==null)return; const dx=e.changedTouches[0].clientX-sx; if(Math.abs(dx)>50) show(cur+(dx<0?1:-1)); sx=null; });
})();
