let preferences=[];

const leftTable=document.querySelector("#leftTable tbody");
const rightTable=document.querySelector("#rightTable tbody");

const availableCount=document.getElementById("availableCount");
const filledCount=document.querySelector(".filledCount");
const savedCount=document.querySelector(".savedCount");

const typeSearch=document.getElementById("typeSearch");
const instSearch=document.getElementById("instSearch");
const branchSearch=document.getElementById("branchSearch");

const instList=document.getElementById("instList");
const branchList=document.getElementById("branchList");

let data=[];
let filteredData=[];

fetch("data.json")
.then(r=>r.json())
.then(json=>{

data=json;
filteredData=[...data];

populateLists();
loadSaved();
renderLeft();

});

function populateLists(){

let instSet=new Set();
let branchSet=new Set();

data.forEach(d=>{
instSet.add(d.inst);
branchSet.add(d.branch);
});

instSet.forEach(i=>{
let o=document.createElement("option");
o.value=i;
instList.appendChild(o);
});

branchSet.forEach(b=>{
let o=document.createElement("option");
o.value=b;
branchList.appendChild(o);
});

}

function renderLeft(){

leftTable.innerHTML="";

let last="";

filteredData.forEach(item=>{

if(last!=="" && last!==item.inst){

let sep=document.createElement("tr");
sep.innerHTML="<td colspan='4' style='background:lightyellow;height:8px'></td>";
leftTable.appendChild(sep);

}

last=item.inst;

let row=document.createElement("tr");

let already=preferences.some(p=>p.inst===item.inst && p.branch===item.branch);

row.innerHTML=`
<td>${item.inst}</td>
<td>${item.branch}</td>
<td contenteditable="true"></td>
<td><button class="addBtn" ${already?"disabled":""}>Add</button></td>
`;

if(!already){

row.querySelector(".addBtn").onclick=()=>{

let choice=row.children[2].textContent.trim();
addPref(item.inst,item.branch,choice);

};

}

leftTable.appendChild(row);

});

availableCount.textContent="Total Available Choices: "+filteredData.length;

}

function addPref(inst,branch,choice){

if(preferences.some(p=>p.inst===inst && p.branch===branch)) return;

let pos=parseInt(choice);

if(pos && pos>0 && pos<=preferences.length){
preferences.splice(pos-1,0,{inst,branch});
}else{
preferences.push({inst,branch});
}

renderRight();
renderLeft();
autoSave();

}

function renderRight(){

rightTable.innerHTML="";

preferences.forEach((p,i)=>{

let row=document.createElement("tr");

row.innerHTML=`
<td>${p.inst}</td>
<td>${p.branch}</td>
<td><input type="number" value="${i+1}" min="1"></td>
<td><button class="deleteBtn">Delete</button></td>
`;

row.querySelector(".deleteBtn").onclick=()=>{
preferences.splice(i,1);
renderRight();
renderLeft();
autoSave();
};

row.querySelector("input").onchange=(e)=>{

let n=parseInt(e.target.value);

if(!n || n<1 || n>preferences.length){
renderRight();
return;
}

let item=preferences.splice(i,1)[0];
preferences.splice(n-1,0,item);

renderRight();
autoSave();

};

rightTable.appendChild(row);

});

filledCount.textContent="Total Filled Choices: "+preferences.length;
savedCount.textContent="Total Saved Choices: "+preferences.length;

}

function autoSave(){
localStorage.setItem("prefs",JSON.stringify(preferences));
}

function loadSaved(){

let s=localStorage.getItem("prefs");

if(s){
preferences=JSON.parse(s);
}

}

document.getElementById("searchBtn").onclick=()=>{

let t=typeSearch.value.toLowerCase();
let i=instSearch.value.toLowerCase();
let b=branchSearch.value.toLowerCase();

filteredData=data.filter(d=>{

return(
d.type.toLowerCase().includes(t) &&
d.inst.toLowerCase().includes(i) &&
d.branch.toLowerCase().includes(b)
);

});

renderLeft();

};

document.getElementById("clearFilters").onclick=()=>{

typeSearch.value="";
instSearch.value="";
branchSearch.value="";

filteredData=[...data];
renderLeft();

};

document.getElementById("downloadPdf").onclick=()=>{

let text="Choice No,Institute,Branch\n";

preferences.forEach((p,i)=>{
text+=(i+1)+","+p.inst+","+p.branch+"\n";
});

let blob=new Blob([text],{type:"text/csv"});
let link=document.createElement("a");

link.href=URL.createObjectURL(blob);
link.download="SAMPLE_CHOICES_FILLING.pdf";

document.body.appendChild(link);
link.click();
document.body.removeChild(link);

};
