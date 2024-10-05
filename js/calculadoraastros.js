const form = document.querySelector('form');
const startingAstroSelect = document.querySelector('#starting-astro');
const endingAstroSelect = document.querySelector('#ending-astro');
const startingDistanceSpan = document.querySelector('#starting-distance');
const endingDistanceSpan = document.querySelector('#ending-distance');
const resultElement = document.querySelector('#result');

// Average distances from the Sun in astronomical units (AU)
const distances = {
  SOL: 0,
  MERCURIO: 0.39,
  VENUS: 0.72,
  TIERRA: 1,
  MARTE: 1.38,
  JUPITER: 5.2,
  SATURNO: 9.5,
  URANO: 19.1,
  NEPTUNO: 29.9,
  PLUTON: 39.5
};

// Function to calculate the distance in light years
function getDistanceInLightYears(astro) {
  return distances[astro] * 0.0000158;
}

// Update the text of the span elements when an astro is selected
startingAstroSelect.addEventListener('change', () => {
  const selectedOption = startingAstroSelect.options[startingAstroSelect.selectedIndex];
  startingDistanceSpan.textContent = `(${selectedOption.value} - ${getDistanceInLightYears(selectedOption.value).toFixed(3)} ly)`;
});

endingAstroSelect.addEventListener('change', () => {
  const selectedOption = endingAstroSelect.options[endingAstroSelect.selectedIndex];
  endingDistanceSpan.textContent = `(${selectedOption.value} - ${getDistanceInLightYears(selectedOption.value).toFixed(3)} ly)`;
});

// Event listener for the form submission
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const startingAstro = startingAstroSelect.value;
  const endingAstro = endingAstroSelect.value;
  const startingDistance = getDistanceInLightYears(startingAstro);
  const endingDistance = getDistanceInLightYears(endingAstro);
  const distance = Math.abs(startingDistance - endingDistance);
  resultElement.innerHTML = `${distance.toFixed(3)} light years.`;
});
