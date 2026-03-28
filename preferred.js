/* ================= ORIGINAL DATA ================= */
let records = {};
let removeLocked = false;
let originalData = [];

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

/* ================= NIT ORDER (RESTORED) ================= */
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

/* ================= BUTTON FIX ================= */

// GO TO CHOICE FILLING
document.getElementById("goBtn").onclick=()=>{
window.location.href="index.html";
};

// UNFILTER_ALL (SAFE RESET – NO DATA LOSS)
document.getElementById("resetBtn").onclick=()=>{
location.reload();
};

// FAQ FIX (no overlap issue handled by HTML position)

/* ================= LOCK ================= */
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

/* ================= REMOVE CONTROL ================= */
function updateRemove(){
document.querySelectorAll("#previewTable button").forEach(btn=>{
if(btn.innerText==="REMOVE"){
btn.disabled=removeLocked;
btn.style.opacity=removeLocked?0.5:1;
}
});
}

/* ================= PROCESS ================= */
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

/* ================= BUILD ================= */
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

/* ================= PREVIEW ================= */
previewBtn.onclick = async ()=>{

let r=parseInt(rank.value);
let e=exam.value;

await process(r,e);
let data=buildData();

originalData = data; // 🔥 SEARCH STORAGE

renderTable(data);
};

/* ================= RENDER ================= */
function renderTable(data){

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

data.forEach(r=>{

let tr=document.createElement("tr");

tr.innerHTML=`
<td><button>REMOVE</button></td>
<td><input type="number"></td>
<td><button>ADD</button></td>
<td>${r[0]}</td>
<td>${r[1]}</td>
<td>${r[2]}</td>
<td>${r[3]}</td>
<td>${r[4]}</td>
<td>${r[5]}</td>
<td>${r[6]}</td>
<td>${r[7]}</td>
`;

previewTable.appendChild(tr);

});

updateRemove();
}

/* ================= SEARCH ================= */
searchBtn2.onclick=()=>{

let type=typeSearch2.value.toLowerCase();
let inst=instSearch2.value.toLowerCase();
let branch=branchSearch2.value.toLowerCase();

let filtered = originalData.filter(r=>{

let i=r[0].toLowerCase();
let b=r[1].toLowerCase();

let typeMatch=true;

if(type){
if(type==="iit") typeMatch=i.includes("indian institute");
else if(type==="nit") typeMatch=i.includes("national institute");
else if(type==="iiit") typeMatch=i.includes("iiit");
}

return(
typeMatch &&
i.includes(inst) &&
b.includes(branch)
);
});

renderTable(filtered);
};

/* ================= CLEAR ================= */
clearSearch2.onclick=()=>{
typeSearch2.value="";
instSearch2.value="";
branchSearch2.value="";
renderTable(originalData);
};
