const display = document.getElementById("display");

window.onload = function () {
  display.focus();
};

function toDisplay(input) {
  display.value += input;
}

function calculate() {
  try {
    let originalExpr = display.value;
    let expr = display.value;
    expr = expr.replace(/(\d+(?:\.\d+)?)%/g, "($1/100)");
    expr = expr.replace(
      /(\d+(?:\.\d+)?)([\+\-])((?:\d+(?:\.\d+)?)\/100)/g,
      (match, num1, op, percent) => {
        return `${num1}${op}(${num1}*${percent})`;
      }
    );
    expr = expr.replace(/(\d+(?:\.\d+)?)\^(\d+(?:\.\d+)?)/g, "Math.pow($1,$2)");
    expr = expr.replace(/sqrt\(/g, "Math.sqrt(");
    expr = expr.replace(/sin\(/g, "Math.sin(");
    expr = expr.replace(/cos\(/g, "Math.cos(");
    expr = expr.replace(/tan\(/g, "Math.tan(");
    let result = eval(expr);
    display.value = result;
    history.push({ expr: originalExpr, result: result });
    // Optionally clear display after calculation:
    // setTimeout(() => { display.value = ""; }, 1500);
  } catch (error) {
    display.value = "Error";
    // Optionally clear display after error:
    // setTimeout(() => { display.value = ""; }, 1500);
  }
}
function backspace() {
  display.value = display.value.slice(0, -1);
}

function clearDisplay() {
  display.value = "";
}
function toggleSign() {
  if (display.value.startsWith("-")) {
    display.value = display.value.substring(1);
  } else if (display.value.length > 0 && display.value !== "0") {
    display.value = "-" + display.value;
  }
}

function insertParenthesis() {
  let value = display.value;
  let open = (value.match(/\(/g) || []).length;
  let close = (value.match(/\)/g) || []).length;
  if (open <= close) {
    display.value += "(";
  } else {
    display.value += ")";
  }
}

function toggleSciKeys() {
  const sciKeys = document.getElementById("sci-keys");
  if (sciKeys.style.display === "none" || sciKeys.style.display === "") {
    sciKeys.style.display = "grid";
  } else {
    sciKeys.style.display = "none";
  }
}

let history = [];

function toggleHistory() {
  const panel = document.getElementById("history-panel");
  if (panel.classList.contains("active")) {
    panel.classList.remove("active");
    panel.style.display = "none";
  } else {
    renderHistory();
    panel.classList.add("active");
    panel.style.display = "block";
  }
}

function renderHistory() {
  const content = document.getElementById("history-content");
  content.innerHTML =
    history.length === 0
      ? "<div>No history yet.</div>"
      : history
          .map(
            (item) =>
              `<div class="history-item" onclick="useHistory('${item.expr}')">
            ${item.expr} = ${item.result}
          </div>`
          )
          .join("");
}

function useHistory(expr) {
  display.value = expr;
  document.getElementById("history-panel").style.display = "none";
}

document.addEventListener("keydown", function (event) {
  const key = event.key;
  if (!isNaN(key)) {
    toDisplay(key);
  } else if (["+", "-", "*", "/", ".", "%"].includes(key)) {
    toDisplay(key);
  } else if (key === "Enter" || key === "=") {
    event.preventDefault();
    calculate();
  } else if (key === "Backspace") {
    backspace();
  } else if (key.toLowerCase() === "c") {
    clearDisplay();
  } else if (key === "(") {
    toDisplay("(");
  } else if (key === ")") {
    toDisplay(")");
  }
});

function toggleUnitConverter() {
  const panel = document.getElementById("unit-converter-panel");
  panel.style.display =
    panel.style.display === "none" || panel.style.display === ""
      ? "block"
      : "none";
}

function convertUnit() {
  const value = parseFloat(document.getElementById("uc-input").value);
  const from = document.getElementById("uc-from").value;
  const to = document.getElementById("uc-to").value;
  let result = value;
  const toMeters = {
    m: 1,
    km: 1000,
    ft: 0.3048,
    mi: 1609.34,
  };

  if (isNaN(value)) {
    document.getElementById("uc-result").innerText =
      "Please enter a valid number.";
    return;
  }

  // Convert to meters, then to target unit
  result = (value * toMeters[from]) / toMeters[to];
  document.getElementById(
    "uc-result"
  ).innerText = `${value} ${from} = ${result} ${to}`;
}
