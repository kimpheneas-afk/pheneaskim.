const display = document.getElementById("display");
const historyList = document.getElementById("historyList");

/* Calculator */
function add(v) {
  display.value += v;
}

function clearDisplay() {
  display.value = "";
}

function calculate() {
  try {
    const exp = display.value
      .replace(/sin/g, "Math.sin")
      .replace(/cos/g, "Math.cos")
      .replace(/tan/g, "Math.tan");

    const res = eval(exp);
    saveHistory(`${display.value} = ${res}`);
    display.value = res;
  } catch {
    display.value = "Error";
  }
}

/* Screens */
function showScreen(id) {
  document.querySelectorAll(".screen")
    .forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

/* Themes */
document.getElementById("themeSelect")
  .addEventListener("change", e => {
    document.body.className = "theme-" + e.target.value;
  });

/* History */
function saveHistory(entry) {
  let h = JSON.parse(localStorage.getItem("history")) || [];
  h.push(entry);
  localStorage.setItem("history", JSON.stringify(h));
  loadHistory();
}

function loadHistory() {
  historyList.innerHTML = "";
  let h = JSON.parse(localStorage.getItem("history")) || [];
  h.forEach(i => historyList.innerHTML += `<li>${i}</li>`);
}
loadHistory();

/* Units */
const unitSets = {
  length: ["m","cm","km"],
  mass: ["kg","g"],
  temp: ["C","F"]
};

function switchUnits() {
  const type = unitType.value;
  fromUnit.innerHTML = "";
  toUnit.innerHTML = "";
  unitSets[type].forEach(u => {
    fromUnit.innerHTML += `<option>${u}</option>`;
    toUnit.innerHTML += `<option>${u}</option>`;
  });
}
switchUnits();

function convertUnits() {
  let v = parseFloat(unitInput.value);
  let f = fromUnit.value;
  let t = toUnit.value;
  let r = v;

  if (unitType.value === "length") {
    if (f === "km") v *= 1000;
    if (f === "cm") v /= 100;
    if (t === "km") r = v / 1000;
    else if (t === "cm") r = v * 100;
    else r = v;
  }

  if (unitType.value === "mass") {
    if (f === "kg" && t === "g") r = v * 1000;
    if (f === "g" && t === "kg") r = v / 1000;
  }

  if (unitType.value === "temp") {
    if (f === "C" && t === "F") r = v * 9/5 + 32;
    if (f === "F" && t === "C") r = (v - 32) * 5/9;
  }

  unitResult.innerText = "Result: " + r;
}

/* Graph */
function drawGraph() {
  const fx = fxInput.value;
  const c = graphCanvas;
  const ctx = c.getContext("2d");

  ctx.clearRect(0,0,c.width,c.height);
  ctx.beginPath();
  ctx.strokeStyle = "cyan";

  for (let x = -50; x <= 50; x++) {
    let y;
    try { y = eval(fx.replace(/x/g, `(${x})`)); } 
    catch { return; }
    let px = c.width/2 + x * 3;
    let py = c.height/2 - y * 3;
    if (x === -50) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.stroke();
         }
