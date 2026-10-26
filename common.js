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

/* Bộ câu Lời Chúa gợi ý: dùng khi data.json chưa có danh sách riêng.
   Người quản lý đối chiếu và sửa lời văn theo bản dịch giáo xứ dùng ở trang quản lý. */
const DEFAULT_VERSES=[
  {text:"Ta là sự sống lại và là sự sống. Ai tin vào Ta, thì dù đã chết, cũng sẽ được sống.",ref:"Ga 11,25"},
  {text:"Ý của Cha tôi là tất cả những ai thấy người Con và tin vào người Con, thì được sống muôn đời, và tôi sẽ cho họ sống lại trong ngày sau hết.",ref:"Ga 6,40"},
  {text:"Trong nhà Cha Thầy, có nhiều chỗ ở. Thầy đi dọn chỗ cho anh em.",ref:"Ga 14,2"},
  {text:"Linh hồn người công chính ở trong tay Thiên Chúa, và chẳng cực hình nào động tới được nữa.",ref:"Kn 3,1"},
  {text:"Dù sống, dù chết, chúng ta vẫn thuộc về Chúa.",ref:"Rm 14,8"},
  {text:"Hỡi tử thần, chiến thắng của ngươi đâu? Hỡi tử thần, nọc độc của ngươi đâu?",ref:"1 Cr 15,55"},
  {text:"Người sẽ lau sạch nước mắt họ. Sẽ không còn sự chết; cũng chẳng còn tang tóc, kêu than và đau khổ nữa.",ref:"Kh 21,4"},
  {text:"Lạy Chúa, dầu qua lũng âm u, con sợ gì nguy khốn, vì có Chúa ở cùng.",ref:"Tv 22,4"},
  {text:"Cầu nguyện cho người đã chết để họ được giải thoát khỏi tội lỗi, là một ý nghĩ đạo đức và thánh thiện.",ref:"2 Mcb 12,45"},
  {text:"Nếu hạt lúa gieo vào lòng đất mà không chết đi, thì nó vẫn trơ trọi một mình; còn nếu nó chết đi, thì nó mới sinh được nhiều hạt khác.",ref:"Ga 12,24"},
  {text:"Quê hương chúng ta ở trên trời, và chúng ta nóng lòng mong đợi Đức Giêsu Kitô từ trời đến cứu chúng ta.",ref:"Pl 3,20"},
  {text:"Phúc thay ai sầu khổ, vì họ sẽ được Thiên Chúa ủi an.",ref:"Mt 5,4"}
];
/* Danh sách đang dùng: data.json có "verses" thì dùng; chưa có thì câu cũ (nếu có) + bộ gợi ý */
function versePool(D){
  const ok=v=>v&&String(v.text||"").trim();
  if(Array.isArray(D.verses)&&D.verses.filter(ok).length) return D.verses.filter(ok);
  const pool=DEFAULT_VERSES.slice();
  if(ok(D.verse)&&!pool.some(v=>v.text===D.verse.text)) pool.unshift(D.verse);
  return pool;
}
/* Chọn ngẫu nhiên một câu mỗi lần tải trang, tránh lặp lại câu vừa hiện */
let _pickedVerse=null;
function pickVerse(pool){
  if(_pickedVerse&&pool.some(v=>v.text===_pickedVerse.text)) return _pickedVerse;
  if(!pool.length) return null;
  let last=""; try{last=localStorage.getItem("lastVerse")||"";}catch(e){}
  const choices=pool.length>1?pool.filter(v=>v.text!==last):pool;
  _pickedVerse=choices[Math.floor(Math.random()*choices.length)];
  try{localStorage.setItem("lastVerse",_pickedVerse.text);}catch(e){}
  return _pickedVerse;
}

function renderHeader(D){
  const p=D.parish||{};
  const pv=document.getElementById("parishView");
  document.getElementById("parishName").textContent=p.name||"";
  document.getElementById("parishAddr").textContent=p.address||"";
  pv.hidden=!(p.name||p.address);
  const v=D._verseShown||pickVerse(versePool(D));
  document.getElementById("verseText").textContent=(v&&v.text)||"";
  document.getElementById("verseRef").textContent=(v&&v.ref)?"("+v.ref+")":"";
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
