let preferences = [];

const leftTable = document.querySelector("#leftTable tbody");
const rightTable = document.querySelector("#rightTable tbody");

const availableCount = document.getElementById("availableCount");
const filledCount = document.querySelector(".filledCount");
const savedCount = document.querySelector(".savedCount");

const searchInputs = document.querySelectorAll(".search-row input");
const clearButtons = document.querySelectorAll(".clearBtn");

let data = [];
let filteredData = [];

fetch("data.json")
.then(res => res.json())
.then(json => {

data = json;
filteredData = [...data];

updateAvailableCount();
renderLeftTable();

});

function updateAvailableCount(){
availableCount.textContent = "Total Available Choices: " + filteredData.length;
}

function renderLeftTable(){

leftTable.innerHTML = "";

let lastInstitute = "";

filteredData.forEach(item => {

if(lastInstitute !== "" && lastInstitute !== item.inst){

let sep = document.createElement("tr");

sep.innerHTML =
"<td colspan='4' style='background:lightyellow;height:8px'></td>";

leftTable.appendChild(sep);

}

lastInstitute = item.inst;

let row = document.createElement("tr");

let alreadyAdded = preferences.some(p => p.inst === item.inst && p.branch === item.branch);

row.innerHTML = `
<td>${item.inst}</td>
<td>${item.branch}</td>
<td contenteditable="true"></td>
<td><button class="addBtn" ${alreadyAdded ? "disabled" : ""}>Add</button></td>
`;

if(!alreadyAdded){
row.querySelector(".addBtn").onclick = () => {

let choiceNo = row.children[2].textContent.trim();
addPreference(item.inst,item.branch,choiceNo);

};
}

leftTable.appendChild(row);

});

}

function addPreference(inst,branch,choiceNo){

if(preferences.some(p => p.inst === inst && p.branch === branch)){
return;
}

let pos = parseInt(choiceNo);

if(pos && pos>0 && pos<=preferences.length){

preferences.splice(pos-1,0,{inst,branch});

}else{

preferences.push({inst,branch});

}

renderRightTable();
renderLeftTable();
autoSave();

}

function renderRightTable(){

rightTable.innerHTML="";

preferences.forEach((p,i)=>{

let row=document.createElement("tr");

row.innerHTML=`
<td>${p.inst}</td>
<td>${p.branch}</td>
<td><input class="choiceInput" type="number" value="${i+1}" min="1"></td>
<td><button class="deleteBtn">Delete</button></td>
`;

row.querySelector(".deleteBtn").onclick=()=>{

preferences.splice(i,1);

renderRightTable();
renderLeftTable();
autoSave();

};

row.querySelector(".choiceInput").onchange=(e)=>{

let newPos=parseInt(e.target.value);

if(!newPos || newPos<1 || newPos>preferences.length){
renderRightTable();
return;
}

let item=preferences.splice(i,1)[0];

preferences.splice(newPos-1,0,item);

renderRightTable();
autoSave();

};

rightTable.appendChild(row);

});

filledCount.textContent =
"Total Filled Choices: "+preferences.length;

}

function autoSave(){

localStorage.setItem("prefs",
JSON.stringify(preferences));

savedCount.textContent =
"Total Saved Choices: "+preferences.length;

}

function loadSaved(){

let saved=localStorage.getItem("prefs");

if(saved){

preferences=JSON.parse(saved);

renderRightTable();
renderLeftTable();

savedCount.textContent =
"Total Saved Choices: "+preferences.length;

}

}

document.getElementById("saveChoices").onclick=autoSave;

loadSaved();

/* SEARCH SYSTEM */

function applySearch(){

let type = searchInputs[0].value.toLowerCase();
let inst = searchInputs[1].value.toLowerCase();
let branch = searchInputs[2].value.toLowerCase();

filteredData = data.filter(item => {

return (
item.type.toLowerCase().includes(type) &&
item.inst.toLowerCase().includes(inst) &&
item.branch.toLowerCase().includes(branch)
);

});

updateAvailableCount();
renderLeftTable();

}

searchInputs.forEach(input => {

input.addEventListener("input",applySearch);

});

/* CLEAR BUTTONS */

clearButtons.forEach((btn,index)=>{

btn.onclick=()=>{

searchInputs[index].value="";
applySearch();

};

});

/* CLEAR ALL FILTERS */

document.getElementById("clearFilters").onclick=()=>{

searchInputs.forEach(i=>i.value="");

applySearch();

};
