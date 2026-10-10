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
