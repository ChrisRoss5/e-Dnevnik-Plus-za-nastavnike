(() => {
  "use strict";

  let randomButton = document.getElementsByClassName("icon-random")[0];
  let plusButton = document.createElement("div");
  plusButton.className = "button2 plus-button";
  plusButton.textContent = "Plus";
  randomButton.after(plusButton);

  plusButton.onclick = plusClicked;

  function plusClicked() {

    if (plusButton.classList.contains("plusClicked")) {
      return false;
    }
    plusButton.classList.add("plusClicked");

    let studentsQueue = [];
    let students = document.querySelectorAll("#content > a.student");
    let totalGradesEach = {"5": 0, "4": 0, "3": 0, "2": 0, "1": 0};
    let totalAvgsEach = {"5": 0, "4": 0, "3": 0, "2": 0, "1": 0};
    let totalAvgs = 0, totalAvgsRoundedSum = 0;
    let totalGradesCount = 0, totalGradesSum = 0;

    students.forEach((student) => {
      studentsQueue.push(getAverage(student));
    });

    Promise.all(studentsQueue).then((values) => {

      for (let i = 0; i < values.length; i++) {
        if (!values[i]) {continue;}

        let gradesEach = values[i].gradesEach;
        let gradesCount = values[i].gradesCount;
        let gradesSum = values[i].gradesSum;
        let avg = Math.round(values[i].avg);

        if (!gradesCount) {continue;}

        for (let k in gradesEach) {
          totalGradesEach[k] += gradesEach[k];
        }
        totalGradesCount += gradesCount;
        totalGradesSum += gradesSum;

        totalAvgsRoundedSum += avg;
        totalAvgsEach[avg]++;
        totalAvgs++;
      }

      let contentTitle = document.querySelector(".content>.title-select");
      let totalRoundedAvg = totalAvgsRoundedSum / totalAvgs;
      totalRoundedAvg = isNaN(totalRoundedAvg) ? "0,00" :
        totalRoundedAvg.toFixed(2).toString().replace(".", ",");
      let totalGradesAvg = totalGradesSum / totalGradesCount;
      totalGradesAvg = isNaN(totalGradesAvg) ? "0,00" :
        totalGradesAvg.toFixed(2).toString().replace(".", ",");

      let totalAvgContainer = document.createElement("div");
      totalAvgContainer.className = "classAvg";
      totalAvgContainer.innerHTML = "Prosjek razreda: " + totalRoundedAvg + '<sup>?</sup><div class="stats"> \
      <table class="statsTable"> \
        <tbody> \
            <tr> \
              <td></td> \
              <td>Zaključne ocjene</td> \
              <td>Sve ocjene</td> \
            </tr> \
            <tr> \
              <td>Odličnih:</td> \
              <td>' + (totalAvgsEach["5"] || "") + '</td> \
              <td>' + (totalGradesEach["5"] || "") + '</td> \
            </tr> \
            <tr> \
              <td>Vrlo dobrih:</td> \
              <td>' + (totalAvgsEach["4"] || "") + '</td> \
              <td>' + (totalGradesEach["4"] || "") + '</td> \
            </tr> \
            <tr> \
              <td>Dobrih:</td> \
              <td>' + (totalAvgsEach["3"] || "") + '</td> \
              <td>' + (totalGradesEach["3"] || "") + '</td> \
            </tr> \
            <tr> \
              <td>Dovoljnih:</td> \
              <td>' + (totalAvgsEach["2"] || "") + '</td> \
              <td>' + (totalGradesEach["2"] || "") + '</td> \
            </tr> \
            <tr> \
              <td>Nedovoljnih:</td> \
              <td>' + (totalAvgsEach["1"] || "") + '</td> \
              <td>' + (totalGradesEach["1"] || "") + '</td> \
            </tr> \
            <tr> \
              <td>Ukupno ocjena:</td> \
              <td>' + totalAvgs + '</td> \
              <td>' + totalGradesCount + '</td> \
            </tr> \
            <tr> \
              <td>Prosjek razreda:</td> \
              <td>' + totalRoundedAvg + '</td> \
              <td>' + totalGradesAvg + '</td> \
            </tr> \
        </tbody> \
      </table>';

      contentTitle.appendChild(totalAvgContainer);
    });
  }

  function getStats(obj) {
    let stats = "";
    let words = ["Odličnih", "Vrlo dobrih", "Dobrih", "Dovoljnih", "Nedovoljnih"];
    for (let i = 5; i > 0; i--) {
      if (obj[i]) {
        stats += 2
      }
    }
    return "Odličnih: " + obj["5"];
  }

  function getAverage(student) {
    return new Promise((resolve) => {

      let url = student.href;
      if (!url) { resolve(false); return; }

      let parser = new DOMParser();
      let xhr = new XMLHttpRequest();
      xhr.open("GET", url, true);
      xhr.send();
      xhr.onload = () => {
        try {

          let doc = parser.parseFromString(xhr.responseText, "text/html");
          let totalGrades = 0, gradesSum = 0;
          let gradesEach = {"5": 0, "4": 0, "3": 0, "2": 0, "1": 0};

          let gradesTable = doc.getElementById("tbl-ocjene");
          gradesTable.querySelectorAll("td[id^='grade']").forEach((gradeBlock) => {
            let grades = gradeBlock.innerText.match(/\d+/g);
            if (grades) {
              for (let i = 0; i < grades.length; i++) {
                gradesSum += parseInt(grades[i]);
                gradesEach[grades[i].toString()]++;
                totalGrades++;
              }
            }
          });


          let alignRight = student.querySelector(".right");
          let averageContainer = document.createElement("div");
          let avgNumber = gradesSum / totalGrades;
          resolve({gradesEach: gradesEach, gradesCount: totalGrades, gradesSum: gradesSum, avg: avgNumber});

          if (avgNumber < 1.5) {
            averageContainer.style.color = "red";
          }

          avgNumber = isNaN(avgNumber) ? "0,00" : avgNumber.toFixed(2).toString().replace(".", ",");
          let avgTitle = "Broj ocjena: " + totalGrades + " | Zbroj ocjena: " + gradesSum;

          averageContainer.className = "studentAvg";
          averageContainer.textContent = avgNumber;
          averageContainer.title = avgTitle;
          alignRight.appendChild(averageContainer);

        } catch(e) {
          resolve(false);
        }
      };

    });
  }

})();