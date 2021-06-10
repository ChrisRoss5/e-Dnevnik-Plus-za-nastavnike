(() => {
  "use strict";

  console.log("e-Dnevnik Plus za nastavnike je omogućen.");

  // Izračunava prosjek za tablicu ocjena u predmetu
  const formatAvg = (n) => isNaN(n) ? "0,00" : n.toFixed(2).toString().replace(".", ",");
  const gradesTable = document.getElementById("tbl-ocjene");
  if (!gradesTable) return;

  let totalGrades = 0;
  let gradesSum = 0;

  const tableRows = gradesTable.querySelectorAll("tr");
  for (const row of tableRows) {
    const gradesRow = row.querySelectorAll("td[id^='grade']");
    if (!gradesRow.length) continue;
    let rowTotalGrades = 0;
    let rowGradesSum = 0;
    for (const gradeBlock of gradesRow) {
      const grades = gradeBlock.textContent.match(/\d+/g) || [];
      rowTotalGrades += grades.length;
      rowGradesSum += grades.map(Number).reduce((a, b) => a + b, 0);
    }
    if (!rowTotalGrades) continue;

    // Dodavanje prosjeka po retku
    row.firstElementChild.innerHTML += '<div class="plus-row-avg">' +
      formatAvg(rowGradesSum / rowTotalGrades) + "</div>";
    totalGrades += rowTotalGrades;
    gradesSum += rowGradesSum;
  }

  const avgNumber = formatAvg(gradesSum / totalGrades);
  const avgTitle = "Broj ocjena: " + totalGrades + " | Zbroj ocjena: " + gradesSum;
  let avg = document.getElementById("prosjek");

  if (avg) {

    // Prostor za prosjek već postoji
    avg.textContent = "Prosjek ocjena: " + avgNumber;
    avg.title = avgTitle;
    avg.className = "plus-avg";
  } else {

    // Izrada prostora za prosjek ispod tablice
    let old = document.getElementById("tbl-prosjek");
    old && old.remove();
    avg = document.createElement("div");
    avg.id = "tbl-prosjek";
    avg.innerHTML = ' \
    <table width="100%" class="normal"> \
      <tbody> \
        <tr> \
          <td> \
            <div id="prosjek" class="plus-avg" title="' + avgTitle + '"> \
            Prosjek ocjena: "' + avgNumber + '"</div> \
          </td> \
        </tr> \
      </tbody> \
    </table>';
    gradesTable.after(avg);
  }
})();