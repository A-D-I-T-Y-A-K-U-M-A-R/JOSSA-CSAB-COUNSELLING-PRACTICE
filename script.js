document.getElementById("downloadPdf").onclick=()=>{

const { jsPDF } = window.jspdf;

let doc = new jsPDF();

doc.setFontSize(14);
doc.text("JoSAA Choice Filling List",20,20);

let y = 30;

preferences.forEach((p,i)=>{

doc.text((i+1)+". "+p.inst+" - "+p.branch,20,y);

y += 8;

if(y>280){
doc.addPage();
y=20;
}

});

doc.save("SAMPLE_CHOICES_FILLING.pdf");

};
