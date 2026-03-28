let records = {};
let removeLocked = false;

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
"national institute of technology, warangal":4,
"national institute of technology calicut":5,
"motilal nehru national institute of technology allahabad":6,
"malaviya national institute of technology jaipur":7,
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
"national institute of technology arunachal pradesh":23,
"national institute of technology goa":24,
"national institute of technology meghalaya":25,
"national institute of technology nagaland":26,
"national institute of technology puducherry":27,
"national institute of technology sikkim":28,
"national institute of technology, manipur":29,
"national institute of technology, mizoram":30,
"national institute of technology, srinagar":31
};

function getPriority(inst){
return NIT_ORDER[inst.toLowerCase()] || 999;
}

function getType(inst){
let n = inst.toLowerCase();

if(n.includes("indian institute of technology")) return "IIT";
if(n.includes("national institute of technology")) return "NIT";
if(n.includes("iiit")) return "IIIT";
if(n.includes("bit mesra")) return "BIT";

return "OTHER";
}

function valid(inst, exam){
let t = getType(inst);

if(exam==="ADVANCE") return t==="IIT";
if(exam==="MAINS") return ["NIT","IIIT","BIT"].includes(t);

return false;
}

/* LOCK DROPDOWN (FIXED ONLY THIS PART) */
document.addEventListener("DOMContentLoaded",()=>{
let lock = document.getElementById("lockStatus");

if(lock){

// LOAD SAVED VALUE
let saved = localStorage.getItem("lockStatus");
if(saved){
lock.value = saved;
removeLocked = (saved === "lock");
}

// SAVE ON CHANGE
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
row.remove();
saveTable();
};

btns[1].onclick=()=>{
let inst=row.children[3].innerText;
let branch=row.children[4].innerText;

let input=row.children[1].querySelector("input");
let pos=parseInt(input.value);

let main=JSON.parse(localStorage.getItem("mainList")||"[]");

if(main.some(m=>m.inst===inst && m.branch===branch)) return;

if(pos && pos>0 && pos<=main.length){
main.splice(pos-1,0,{inst,branch});
}else{
main.push({inst,branch});
}

localStorage.setItem("mainList",JSON.stringify(main));
};

}
});
}

/* PROCESS + BUILD (UNCHANGED) */
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
arr.sort((a,b)=>getPriority(a[0])-getPriority(b[0]));
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
rm.onclick=()=>{ if(!removeLocked){tr.remove(); saveTable();}};
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

let pos=parseInt(input.value);

if(pos && pos>0 && pos<=main.length){
main.splice(pos-1,0,{inst:r[0],branch:r[1]});
}else{
main.push({inst:r[0],branch:r[1]});
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
}
