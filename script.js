document.getElementById("downloadPdf").onclick=()=>{

let data = [
["Institute","Branch","Choice No"]
];

preferences.forEach((p,i)=>{
data.push([p.inst,p.branch,(i+1)]);
});

let ws = XLSX.utils.aoa_to_sheet(data);

ws["!cols"]=[
{wch:90},
{wch:90},
{wch:30}
];

let wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb,ws,"Choices");

XLSX.writeFile(wb,"SAMPLE_CHOICES_FILLING.xlsx");

};
