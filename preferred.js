let records = {};
let removeLocked = false;

let undoStack = [];


let files = [
"ROUND 1 JOSSA 2025.xlsx",
"ROUND 2 JOSSA 2025.xlsx",
"ROUND 3 JOSSA 2025.xlsx",
"ROUND 4 JOSSA 2025.xlsx",
"ROUND 5 JOSSA 2025.xlsx",
"ROUND 6 JOSSA 2025.xlsx",
"ROUND 1 CSAB 2025.xlsx",
"ROUND 2 CSAB 2025.xlsx",
"ROUND 3 CSAB 2025.xlsx"
];

const NIT_ORDER = {
"national institute of technology, tiruchirappalli":1,
"national institute of technology karnataka, surathkal":2,
"national institute of technology, rourkela":3,
"malaviya national institute of technology jaipur":4,
"national institute of technology, warangal":5,
"national institute of technology calicut":6,
"motilal nehru national institute of technology allahabad":7,
"national institute of technology, kurukshetra":8,
"sardar vallabhbhai national institute of technology, surat":9,
"national institute of technology hamirpur":10,
"visvesvaraya national institute of technology, nagpur":11,
"national institute of technology durgapur":12,
"national institute of technology, silchar":13,
"dr. b r ambedkar national institute of technology, jalandhar":14,
"national institute of technology raipur":15,
"national institute of technology, jamshedpur":16,
"national institute of technology patna":17,
"national institute of technology delhi":18,
"maulana azad national institute of technology bhopal":19,
"national institute of technology, andhra pradesh":20,
"national institute of technology, uttarakhand":21,
"national institute of technology agartala":22,
"national institute of technology goa":23,
"national institute of technology puducherry":24,
  "national institute of technology arunachal pradesh":25,
"national institute of technology meghalaya":26,
"national institute of technology nagaland":27,
"national institute of technology sikkim":28,
"national institute of technology, manipur":29,
"national institute of technology, mizoram":30,
"national institute of technology, srinagar":31
};

const IIIT_ORDER = {
"indian institute of information technology, allahabad":55,
"atal bihari vajpayee indian institute of information technology & management gwalior":56,
"indian institute of information technology lucknow":57,
"indian institute of information technology (iiit) nagpur":58,
"indian institute of information technology (iiit) pune":59,
"indian institute of information technology, raichur, karnataka":60,
"indian institute of information technology surat":61,
"indian institute of information technology (iiit) ranchi":62,
"indian institute of information technology (iiit), sri city, chittoor":63,
"indian institute of information technology (iiit)kota, rajasthan":64,
"indian institute of information technology(iiit) una, himachal pradesh":75,
"indian institute of information technology(iiit), vadodara, gujrat":76,
"indian institute of information technology bhagalpur":67,
"indian institute of information technology bhopal":68,
"indian institute of information technology design & manufacturing kurnool, andhra pradesh":69,
"indian institute of information technology guwahati":70,
"indian institute of information technology tiruchirappalli":71,
"indian institute of information technology(iiit) dharwad":72,
"indian institute of information technology(iiit) kalyani, west bengal":73,
"indian institute of information technology(iiit) kilohrad, sonepat, haryana":74,
"indian institute of information technology(iiit) kottayam":75,
"indian institute of information technology, agartala":76,
"indian institute of information technology, design & manufacturing, kancheepuram":77,
"indian institute of information technology, vadodara international campus diu (iiitvicd)":78,
"international institute of information technology, bhubaneswar":79,
"international institute of information technology, naya raipur":80,
"indian institute of information technology senapati manipur":81
};

const IIT_ORDER = {
"indian institute of technology (bhu) varanasi":32,
"indian institute of technology madras":33,
"indian institute of technology delhi":34,
"indian institute of technology bombay":35,
"indian institute of technology kanpur":36,
"indian institute of technology kharagpur":37,
"indian institute of technology roorkee":38,
"indian institute of technology guwahati":39,
"indian institute of technology hyderabad":40,
"indian institute of technology indore":41,
"indian institute of technology (ism) dhanbad":42,
"indian institute of technology bhilai":43,
"indian institute of technology bhubaneswar":44,
"indian institute of technology dharwad":45,
"indian institute of technology gandhinagar":46,
"indian institute of technology goa":47,
"indian institute of technology jammu":48,
"indian institute of technology jodhpur":49,
"indian institute of technology mandi":50,
"indian institute of technology palakkad":51,
"indian institute of technology patna":52,
"indian institute of technology ropar":53,
"indian institute of technology tirupati":54
};

const OTHER_ORDER = {
"birla institute of technology, mesra, ranchi":82,
"national institute of electronics and information technology, ajmer (rajasthan)":83,
"national institute of electronics and information technology, aurangabad (maharashtra)":84,
"national institute of electronics and information technology, gorakhpur (up)":85,
"national institute of electronics and information technology, patna (bihar)":86,
"national institute of electronics and information technology, ropar (punjab)":87,
"pt. dwarka prasad mishra indian institute of information technology, design & manufacture jabalpur":88,
"assam university, silchar":89,
"birla institute of technology, deoghar off-campus":90,
"birla institute of technology, patna off-campus":91,
"cu jharkhand":92,	
"central university of haryana":93,
"central university of jammu":94,
"central university of rajasthan, rajasthan":95,
"central institute of technology kokrajar, assam":96,
"chhattisgarh swami vivekanada technical university, bhilai (csvtu bhilai)":97,
"gati shakti vishwavidyalaya, vadodara":98,
"ghani khan choudhary institute of engineering and technology, malda, west bengal":99,
"gurukula kangri vishwavidyalaya, haridwar":100,
"indian institute of carpet technology, bhadohi":101,
"indian institute of engineering science and technology, shibpur":102,
"indian institute of handloom technology(iiht), varanasi":103,
"indian institute of handloom technology, salem":104,
"institute of chemical technology, mumbai: indian oil odisha campus, bhubaneswar":105,
"institute of engineering and technology, dr. h. s. gour university. sagar (a central university)":106,
"institute of infrastructure, technology, research and management-ahmedabad":107,
"islamic university of science and technology kashmir":108,
"j.k. institute of applied physics & technology, department of electronics & communication, university of allahabad- allahabad":109,
"jawaharlal nehru university, delhi":110,
"mizoram university, aizawl":111,
"national institute of advanced manufacturing technology, ranchi":112,
"national institute of food technology entrepreneurship and management, kundli":113,
"national institute of food technology entrepreneurship and management, thanjavur":114,
"north eastern regional institute of science and technology, nirjuli-791109 (itanagar),arunachal pradesh":115,
"north-eastern hill university, shillong":116,
"puducherry technological university, puducherry":117,
"punjab engineering college, chandigarh":118,
"rajiv gandhi national aviation university, fursatganj, amethi (up)":119,
"sant longowal institute of engineering and technology":120,
"school of engineering, tezpur university, napaam, tezpur":121,
"school of planning & architecture, bhopal":122,
"school of planning & architecture, new delhi":123,
"school of planning & architecture: vijayawada":124,
"school of studies of engineering and technology, guru ghasidas vishwavidyalaya, bilaspur":125,
"shri g. s. institute of technology and science indore":126,
"shri mata vaishno devi university, katra, jammu & kashmir":127,
"university of hyderabad":128
};



function getPriority(inst){

let name = inst.toLowerCase();

/* NIT */
if(NIT_ORDER[name]){
  return 1000 + NIT_ORDER[name];
}

/* IIIT */
if(IIIT_ORDER[name]){
  return 2000 + IIIT_ORDER[name];
}

/* GFTI */
if(OTHER_ORDER[name]){
  return 3000 + OTHER_ORDER[name];
}

/* IIT */
if(IIT_ORDER[name]){
  return 4000 + IIT_ORDER[name];
}

return 9999;
}



function getType(inst){
let n = inst.toLowerCase();

if(n.includes("indian institute of technology")) return "IIT";
if(n.includes("national institute of technology")) return "NIT";
if(n.includes("indian institute of information technology")) return "IIIT";

return "OTHER";
}

function valid(inst, exam){
let t = getType(inst);

if(exam==="ADVANCE") return t==="IIT";
if(exam==="MAINS") return ["NIT","IIIT","OTHER"].includes(t);

return false;
}

/* LOCK */
document.addEventListener("DOMContentLoaded",()=>{
let lock = document.getElementById("lockStatus");

if(lock){
let saved = localStorage.getItem("lockStatus");
if(saved){
lock.value = saved;
removeLocked = (saved === "lock");
}

lock.onchange=()=>{
localStorage.setItem("lockStatus", lock.value);
removeLocked = (lock.value==="lock");
updateRemove();
};
}
});

/* INPUT SAVE */
rank.oninput=()=>localStorage.setItem("rank",rank.value);
exam.onchange=()=>localStorage.setItem("exam",exam.value);

rank.value=localStorage.getItem("rank")||"";
exam.value=localStorage.getItem("exam")||"";

/* SAVE TABLE */
function saveTable(){
localStorage.setItem("previewTableData",previewTable.innerHTML);
}

/* LOAD TABLE */
function loadTable(){
let t=localStorage.getItem("previewTableData");
if(t){
previewTable.innerHTML=t;
attachEvents();
updateRemove();
}
}
loadTable();

/* UPDATE REMOVE */
function updateRemove(){
document.querySelectorAll("#previewTable button").forEach(btn=>{
if(btn.innerText==="REMOVE"){
btn.disabled=removeLocked;
btn.style.opacity=removeLocked?0.5:1;
}
});
}

/* ATTACH EVENTS */
function attachEvents(){
document.querySelectorAll("#previewTable tr").forEach(row=>{
let btns=row.querySelectorAll("button");

if(btns.length>=2){

btns[0].onclick=()=>{
if(removeLocked)return;

undoStack.push(row.outerHTML);
  
row.remove();
saveTable();
};

btns[1].onclick=()=>{
let inst=row.children[3].innerText;
let branch=row.children[4].innerText;

let input=row.children[1].querySelector("input");
let value = input.value.trim();
let pos = parseInt(value);

let main=JSON.parse(localStorage.getItem("mainList")||"[]");

if(main.some(m=>m.inst===inst && m.branch===branch)) return;

if(value === ""){
main.splice(main.length,0,{inst,branch});
}
else if(!isNaN(pos) && pos>0 && pos<=main.length){
main.splice(pos-1,0,{inst,branch});
}
else{
main.splice(main.length,0,{inst,branch});
}

localStorage.setItem("mainList",JSON.stringify(main));
};

}
});
}

/* PROCESS */
async function process(rank, exam){

records = {};

for(let file of files){

try{

let res = await fetch(file);
let buf = await res.arrayBuffer();

let wb = XLSX.read(buf,{type:"array"});
let ws = wb.Sheets[wb.SheetNames[0]];
let rows = XLSX.utils.sheet_to_json(ws,{header:1});

let round = parseInt(file.match(/round (\d+)/i)[1]);
let source = file.toLowerCase().includes("jossa") ? "JOSSA" : "CSAB";

for(let i=1;i<rows.length;i++){

let r = rows[i];

let inst = r[0];
let branch = r[1];
let opening = parseInt(r[4]);
let closing = parseInt(r[5]);

if(!closing || closing < rank) continue;
if(!valid(inst, exam)) continue;

let key = inst+"||"+branch;

if(!records[key]){
records[key] = {inst,branch,JOSSA:{},CSAB:{}};
}

let curr = records[key][source];

if(!curr.round || round < curr.round){
records[key][source] = {opening,closing,round};
}

}

}catch(e){}
}
}

/* 🔥 BUILD + SORT (FINAL FIX) */
function buildData(){
let arr=[];

for(let k in records){
let d=records[k];

arr.push([
d.inst,d.branch,
d.JOSSA.opening||"",d.JOSSA.closing||"",d.JOSSA.round||"",
d.CSAB.opening||"",d.CSAB.closing||"",d.CSAB.round||""
]);
}

/* ✅ BLOCK GROUPING SORT */
arr.sort((a,b)=>{

let p1 = getPriority(a[0]);
let p2 = getPriority(b[0]);

if(p1 !== p2){
  return p1 - p2;
}

// SAME COLLEGE → GROUP TOGETHER
if(a[0] === b[0]){
  return a[1].localeCompare(b[1]);
}

return a[0].localeCompare(b[0]);

});

return arr;
}

/* PREVIEW */
previewBtn.onclick = async ()=>{

let r=parseInt(rank.value);
let e=exam.value;

await process(r,e);
let data=buildData();

previewTable.innerHTML="";

let headers=[
"REMOVE","FILL TO NUMBER","ADD",
"Institute","Branch",
"JoSAA Opening","JoSAA Closing","JoSAA Round",
"CSAB Opening","CSAB Closing","CSAB Round"
];

let tr=document.createElement("tr");
headers.forEach(h=>{
let th=document.createElement("th");
th.innerText=h;
tr.appendChild(th);
});
previewTable.appendChild(tr);

let last="";

data.forEach(r=>{

if(last && last!==r[0]){
let sep=document.createElement("tr");
sep.innerHTML="<td colspan='11' style='height:10px;background:#eee'></td>";
previewTable.appendChild(sep);
}

last=r[0];

let tr=document.createElement("tr");

// REMOVE
let td1=document.createElement("td");
let rm=document.createElement("button");
rm.innerText="REMOVE";
rm.style.background="red";
rm.style.color="white";
rm.onclick=()=>{
if(!removeLocked){

undoStack.push(tr.outerHTML);

tr.remove();
saveTable();
}
};
td1.appendChild(rm);
tr.appendChild(td1);

// INPUT
let td2=document.createElement("td");
let input=document.createElement("input");
input.type="number";
input.style.width="60px";
input.style.textAlign="center";
input.style.border="2px solid black";
td2.appendChild(input);
tr.appendChild(td2);

// ADD
let td3=document.createElement("td");
let add=document.createElement("button");
add.innerText="ADD";
add.style.background="lightgreen";

add.onclick=()=>{
let main=JSON.parse(localStorage.getItem("mainList")||"[]");

if(main.some(m=>m.inst===r[0] && m.branch===r[1])) return;

let value = input.value.trim();
let pos = parseInt(value);

if(value === ""){
main.splice(main.length,0,{inst:r[0],branch:r[1]});
}
else if(!isNaN(pos) && pos>0 && pos<=main.length){
main.splice(pos-1,0,{inst:r[0],branch:r[1]});
}
else{
main.splice(main.length,0,{inst:r[0],branch:r[1]});
}

localStorage.setItem("mainList",JSON.stringify(main));
};

td3.appendChild(add);
tr.appendChild(td3);

// DATA
r.forEach(v=>{
let td=document.createElement("td");
td.innerText=v;
tr.appendChild(td);
});

previewTable.appendChild(tr);

});

saveTable();
attachEvents();
updateRemove();

};

/* RESET */
function resetAll(){
rank.value="";
exam.value="";
previewTable.innerHTML="";
localStorage.clear();

undoStack = [];
  
}
