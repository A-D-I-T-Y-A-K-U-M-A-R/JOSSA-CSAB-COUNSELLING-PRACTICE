let preferences = [];

const leftTable = document.querySelector("#leftTable tbody");
const rightTable = document.querySelector("#rightTable tbody");

const availableCount = document.getElementById("availableCount");
const filledCount = document.querySelector(".filledCount");
const savedCount = document.querySelector(".savedCount");

let data = [];

fetch("data.json")
.then(res => res.json())
.then(json => {

data = json;

availableCount.textContent =
"Total Available Choices: " + data.length;

renderLeftTable();

});

function renderLeftTable(){

leftTable.innerHTML = "";

let lastInstitute = "";

data.forEach(item => {

if(lastInstitute !== "" && lastInstitute !== item.inst){

let sep = document.createElement("tr");

sep.innerHTML =
"<td colspan='4' style='background:lightyellow;height:10px'></td>";

leftTable.appendChild(sep);

}

lastInstitute = item.inst;

let row = document.createElement("tr");

row.innerHTML = `
<td>${item.inst}</td>
<td>${item.branch}</td>
<td contenteditable="true"></td>
<td><button class="addBtn">Add</button></td>
`;

row.querySelector(".addBtn").onclick = () => {

let choiceNo =
row.children[2].textContent.trim();

addPreference(item.inst,item.branch,choiceNo);

};

leftTable.appendChild(row);

});

}

function addPreference(inst,branch,choiceNo){

let pos = parseInt(choiceNo);

if(pos && pos>0 && pos<=preferences.length){

preferences.splice(pos-1,0,{inst,branch});

}else{

preferences.push({inst,branch});

}

renderRightTable();
autoSave();

}

function renderRightTable(){

rightTable.innerHTML="";

preferences.forEach((p,i)=>{

let row=document.createElement("tr");

row.innerHTML=`
<td>${p.inst}</td>
<td>${p.branch}</td>
<td contenteditable="true">${i+1}</td>
<td><button class="deleteBtn">Delete</button></td>
`;

row.querySelector(".deleteBtn").onclick=()=>{

preferences.splice(i,1);

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

savedCount.textContent =
"Total Saved Choices: "+preferences.length;

}

}

document
.getElementById("saveChoices")
.onclick=autoSave;

loadSaved();
