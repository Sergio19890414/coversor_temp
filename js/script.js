const form = document.getElementById("converterForm");
const temperature = document.getElementById("temperature");
const fromUnit = document.getElementById("fromUnit");
const toUnit = document.getElementById("toUnit");
const swapBtn = document.getElementById("swapBtn");
const clearBtn = document.getElementById("clearBtn");
const error = document.getElementById("error");
const resultCard = document.getElementById("resultCard");
const resultValue = document.getElementById("resultValue");
const resultUnit = document.getElementById("resultUnit");
const resultText = document.getElementById("resultText");
const resultEmoji = document.getElementById("resultEmoji");
const scaleMarker = document.getElementById("scaleMarker");

const symbols = {
  C: "°C",
  F: "°F",
  K: "K"
};

function toCelsius(value, unit) {
  if (unit === "C") return value;
  if (unit === "F") return (value - 32) * 5 / 9;
  return value - 273.15;
}

function fromCelsius(value, unit) {
  if (unit === "C") return value;
  if (unit === "F") return (value * 9 / 5) + 32;
  return value + 273.15;
}

function convert(value, from, to) {
  return fromCelsius(toCelsius(value, from), to);
}

function formatNumber(value) {
  return Number(value.toFixed(6)).toLocaleString("es-CO", {
    maximumFractionDigits: 6
  });
}

function validate(value) {
  error.textContent = "";

  if (temperature.value.trim() === "") {
    error.textContent = "Ingresa una temperatura para realizar la conversión.";
    return false;
  }

  if (!Number.isFinite(value)) {
    error.textContent = "El valor ingresado no es numérico. Revisa el campo e inténtalo nuevamente.";
    return false;
  }

  if (fromUnit.value === "K" && value < 0) {
    error.textContent = "Kelvin no puede tener valores inferiores a 0 K.";
    return false;
  }

  if (fromUnit.value === "C" && value < -273.15) {
    error.textContent = "Celsius no puede ser inferior a -273.15 °C (cero absoluto).";
    return false;
  }

  if (fromUnit.value === "F" && value < -459.67) {
    error.textContent = "Fahrenheit no puede ser inferior a -459.67 °F (cero absoluto).";
    return false;
  }

  return true;
}

function updateIndicator(celsius) {
  let position;

  if (celsius <= -20) position = 4;
  else if (celsius >= 50) position = 96;
  else position = 4 + ((celsius + 20) / 70) * 92;

  scaleMarker.style.left = `${position}%`;
}

function updateEmoji(celsius) {
  if (celsius <= 5) resultEmoji.textContent = "❄️";
  else if (celsius <= 25) resultEmoji.textContent = "🌡️";
  else if (celsius <= 35) resultEmoji.textContent = "☀️";
  else resultEmoji.textContent = "🔥";
}

function performConversion() {
  const value = Number(temperature.value);

  if (!validate(value)) return;

  const from = fromUnit.value;
  const to = toUnit.value;
  const result = convert(value, from, to);
  const celsius = toCelsius(value, from);

  resultValue.textContent = formatNumber(result);
  resultUnit.textContent = symbols[to];
  resultText.textContent =
    `${formatNumber(value)} ${symbols[from]} equivale a ${formatNumber(result)} ${symbols[to]}`;

  updateIndicator(celsius);
  updateEmoji(celsius);

  resultCard.classList.remove("animate");
  void resultCard.offsetWidth;
  resultCard.classList.add("animate");
}

function swapUnits() {
  const oldFrom = fromUnit.value;
  fromUnit.value = toUnit.value;
  toUnit.value = oldFrom;

  if (temperature.value.trim() !== "") {
    performConversion();
  }
}

function clearAll() {
  temperature.value = "";
  error.textContent = "";
  resultValue.textContent = "—";
  resultUnit.textContent = symbols[toUnit.value];
  resultText.textContent = "Ingresa una temperatura y pulsa “Convertir temperatura”.";
  resultEmoji.textContent = "🌡️";
  scaleMarker.style.left = "50%";
  temperature.focus();
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  performConversion();
});

swapBtn.addEventListener("click", swapUnits);
clearBtn.addEventListener("click", clearAll);

temperature.addEventListener("input", () => {
  error.textContent = "";
});

fromUnit.addEventListener("change", () => {
  if (temperature.value.trim() !== "") performConversion();
});

toUnit.addEventListener("change", () => {
  if (temperature.value.trim() !== "") performConversion();
});

temperature.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    performConversion();
  }
});
