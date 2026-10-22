/* Nút Mã QR: tạo mã QR của trang (trang chính, tab ngày giỗ, tab hình ảnh), sao chép link, tải ảnh để in */
(function(){
  const $=id=>document.getElementById(id);
  let hash="";
  const base=()=>location.origin+location.pathname.replace(/index\.html$/,"");
  const url=()=>base()+hash;

  function wrap(ctx,text,x,y,maxW,lh){
    const words=text.split(" "); let line="", lines=[];
    for(const w of words){ const t=line?line+" "+w:w; if(ctx.measureText(t).width>maxW&&line){lines.push(line);line=w;} else line=t; }
    if(line) lines.push(line);
    lines.forEach((l,i)=>ctx.fillText(l,x,y+i*lh)); return lines.length*lh;
  }
  function draw(){
    const cv=$("qrCanvas"), ctx=cv.getContext("2d"), W=cv.width, H=cv.height, u=url();
    $("qrUrl").textContent=u;
    ctx.fillStyle="#ffffff"; ctx.fillRect(0,0,W,H);
    // khung viền vàng
    ctx.strokeStyle="#b98a2f"; ctx.lineWidth=6; ctx.strokeRect(24,24,W-48,H-48);
    ctx.lineWidth=2; ctx.strokeRect(40,40,W-80,H-80);
    ctx.textAlign="center"; ctx.fillStyle="#2d1f45";
    const parish=(document.getElementById("parishName")||{}).textContent||"";
    let y=110;
    if(parish){ ctx.font="600 44px Georgia, 'Times New Roman', serif"; y+=wrap(ctx,parish,W/2,y,W-160,52); y+=6; }
    ctx.font="700 38px 'Be Vietnam Pro', 'Segoe UI', Arial, sans-serif"; ctx.fillText("CẦU NGUYỆN CHO CÁC LINH HỒN",W/2,y); y+=50;
    ctx.fillStyle="#9a6f1c"; ctx.fillText(hash==="#gio"?"NHỚ CÁC LINH HỒN NHÂN NGÀY GIỖ":hash==="#anh"?"HÌNH ẢNH NHÀ CHỜ PHỤC SINH":"TÌM VỊ TRÍ HÀI CỐT THÂN NHÂN",W/2,y);
    const qs=Math.min(700,H-y-190), qx=(W-qs)/2, qy=y+36;
    ctx.fillStyle="#2d1f45";
    if(window.QRCode){
      const tmp=document.createElement("div");
      new QRCode(tmp,{text:u,width:qs,height:qs,colorDark:"#1d1430",colorLight:"#ffffff",correctLevel:QRCode.CorrectLevel.M});
      const src=tmp.querySelector("canvas");
      if(src) ctx.drawImage(src,qx,qy,qs,qs);
      $("qrMsg").textContent="";
    } else {
      ctx.font="28px Arial"; ctx.fillText("Chưa tải được bộ tạo mã QR – hãy tải lại trang.",W/2,qy+qs/2);
      $("qrMsg").textContent="Không tạo được mã QR. Kiểm tra kết nối mạng rồi tải lại trang.";
    }
    ctx.font="italic 30px Georgia, 'Times New Roman', serif"; ctx.fillStyle="#5b3d8a";
    ctx.fillText("“Xin cho các linh hồn được nghỉ yên muôn đời.”",W/2,qy+qs+62);
    ctx.font="24px 'Be Vietnam Pro', Arial, sans-serif"; ctx.fillStyle="#665e78";
    wrap(ctx,u,W/2,qy+qs+108,W-160,30);
  }
  function open(){ $("qrModal").hidden=false; document.body.style.overflow="hidden"; draw(); $("qrClose").focus(); }
  function close(){ $("qrModal").hidden=true; document.body.style.overflow=""; }

  $("qrOpen").onclick=open;
  $("qrClose").onclick=close;
  $("qrModal").addEventListener("click",e=>{ if(e.target.id==="qrModal") close(); });
  document.addEventListener("keydown",e=>{ if(e.key==="Escape"&&!$("qrModal").hidden) close(); });
  document.querySelectorAll(".qr-pick button").forEach(b=>b.onclick=()=>{
    document.querySelectorAll(".qr-pick button").forEach(x=>x.classList.toggle("on",x===b));
    hash=b.dataset.h; draw();
  });
  $("qrCopy").onclick=async()=>{
    try{ await navigator.clipboard.writeText(url()); $("qrMsg").textContent="Đã sao chép link. Có thể dán vào Zalo, Facebook…"; }
    catch(e){ const r=document.createRange(); r.selectNodeContents($("qrUrl")); const s=getSelection(); s.removeAllRanges(); s.addRange(r); $("qrMsg").textContent="Link đã được chọn, bấm Ctrl+C (hoặc giữ để sao chép)."; }
  };
  $("qrSave").onclick=()=>{
    $("qrCanvas").toBlob(b=>{
      if(!b) return;
      const a=document.createElement("a"); a.href=URL.createObjectURL(b);
      a.download="ma-qr-"+(hash?hash.slice(1):"trang-chinh")+".png";
      document.body.appendChild(a); a.click(); setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},1000);
      $("qrMsg").textContent="Đã tải ảnh mã QR về máy. Có thể in ra để dán ở nhà mồ, bản tin giáo xứ.";
    },"image/png");
  };
})();
