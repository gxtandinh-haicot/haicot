/* Hàm dùng chung cho trang tra cứu và trang quản lý */
const norm=s=>String(s??"").normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/đ/g,"d").replace(/Đ/g,"D").toLowerCase().replace(/\s+/g," ").trim();
const digits=s=>String(s??"").replace(/\D/g,"");
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const year=s=>{const m=String(s??"").match(/(\d{4})/);return m?+m[1]:null};

/* Che 3 số cuối điện thoại: 0909399395 → 0909399*** (giữ nguyên dấu cách, chấm) */
function maskPhone(s){
  s=String(s??""); if(s.includes("*")) return s;
  let n=digits(s).length; if(n<6) return s;
  let left=3, out=s.split("");
  for(let i=out.length-1;i>=0&&left>0;i--){ if(/\d/.test(out[i])){out[i]="*";left--;} }
  return out.join("");
}
/* Một ô có thể chứa nhiều số: "0909 123 456 - 0918 222 333" */
function maskPhones(s){ return String(s??"").replace(/(?<![\d*][ .]?)\d(?:[ .]?\d){5,}(?![ .]?[\d*])/g, m=>maskPhone(m)); }

function renderHeader(D){
  const p=D.parish||{};
  const pv=document.getElementById("parishView");
  document.getElementById("parishName").textContent=p.name||"";
  document.getElementById("parishAddr").textContent=p.address||"";
  pv.hidden=!(p.name||p.address);
  document.getElementById("verseText").textContent=(D.verse&&D.verse.text)||"";
  document.getElementById("verseRef").textContent=(D.verse&&D.verse.ref)?"("+D.verse.ref+")":"";
  if(p.name) document.title="Tìm Vị Trí Hài Cốt · "+p.name;
}

/* Năm phụng vụ trên Nến Phục sinh: đổi sang năm mới từ Lễ Phục Sinh */
(function(){
  function easter(y){const a=y%19,b=Math.floor(y/100),c=y%100,d=Math.floor(b/4),e=b%4,f=Math.floor((b+8)/25),g=Math.floor((b-f+1)/3),
    h=(19*a+b-d-g+15)%30,i=Math.floor(c/4),k=c%4,l=(32+2*e+2*i-h-k)%7,m=Math.floor((a+11*h+22*l)/451),
    mo=Math.floor((h+l-7*m+114)/31),da=((h+l-7*m+114)%31)+1; return new Date(y,mo-1,da);}
  const now=new Date(), y=now<easter(now.getFullYear())?now.getFullYear()-1:now.getFullYear();
  const d=String(y).split("");
  document.querySelectorAll(".candle").forEach(svg=>svg.querySelectorAll(".c-yr").forEach((t,i)=>{t.textContent=d[i]||"";}));
})();

/* Mã định danh ổn định cho mỗi người đã khuất (dùng cho lượt thắp nến, tặng hoa…) */
function tnKey(r){
  const s=norm((r.tenThanh||"")+" "+(r.hoTen||""))+"|"+norm(r.viTri)+"|"+norm(r.namMat);
  let h1=0x811c9dc5, h2=0x01000193;
  for(let i=0;i<s.length;i++){const c=s.charCodeAt(i); h1=Math.imul(h1^c,16777619)>>>0; h2=Math.imul(h2^c,2246822519)>>>0;}
  return "p"+h1.toString(36)+h2.toString(36);
}
const tnName=r=>((r.tenThanh?r.tenThanh+" ":"")+(r.hoTen||"")).trim();
