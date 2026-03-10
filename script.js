let preferences = [];

const rightTable = document.querySelector("#rightTable tbody");
const filledCount = document.querySelector(".filledCount");
const savedCount = document.querySelector(".savedCount");

function updateCounts(){
filledCount.textContent = "Total Filled Choices: " + preferences.length;
}

function savePreferences(){
localStorage.setItem("preferences", JSON.stringify(preferences));
savedCount.textContent = "Total Saved Choices: " + preferences.length;
}

function loadPreferences(){
const data = localStorage.getItem("preferences");

if(data){
preferences = JSON.parse(data);
renderPreferences();
savedCount.textContent = "Total Saved Choices: " + preferences.length;
}
}

function renderPreferences(){

rightTable.innerHTML = "";

preferences.forEach((item,index)=>{

let row = document.createElement("tr");

row.innerHTML = `
<td>${item.institute}</td>
<td>${item.branch}</td>
<td contenteditable="true">${index+1}</td>
<td><button class="deleteBtn">Delete</button></td>
`;

row.querySelector(".deleteBtn").onclick = ()=>{
preferences.splice(index,1);
renderPreferences();
savePreferences();
};

rightTable.appendChild(row);

});

updateCounts();
}

function addPreference(institute,branch,choiceNo){

let position;

if(choiceNo && choiceNo>0 && choiceNo<=preferences.length){
position = choiceNo-1;
preferences.splice(position,0,{institute,branch});
}else{
preferences.push({institute,branch});
}

renderPreferences();
savePreferences();

}

document.querySelector("#saveChoices").onclick = ()=>{
savePreferences();
};

loadPreferences();
