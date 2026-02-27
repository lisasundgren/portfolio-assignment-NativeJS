let favouritesListed = document.querySelector("#favouritesListed");
let storageList = JSON.parse(localStorage.getItem("favouritesList"));

// Function that captures our drinks from localStorage and creates LIs that are added to the page.
window.addEventListener("load", (event) => {
  if (localStorage !== null) {
    for (let n = 0; n < storageList.length; n++) {
      let favouriteLI = document.createElement("li");

      favouritesListed.appendChild(favouriteLI);

      let cocktailParsed = JSON.parse(localStorage.getItem("favouritesList"))[n]
        .name;

      favouriteLI.innerHTML = cocktailParsed;
    }
  }
});

// Starts our chart-element and how we will get the right data into it
const chartElement = document
  .querySelector("#ingredientChart")
  .getContext("2d");
// Empty arrays to collect unique ingredients and their frequency.
let allIngredients = [];
let countsIngredients = [];

// Loops through localStorage, captures the various drink objects, and goes through their keys.
for (let i = 0; i < storageList.length; i++) {
  let drink = storageList[i];
  let ingredientKeys = Object.keys(drink);

  // Here, we capture values that only relate to ‘ingredient’-keys and push them to our empty array.
  for (let j = 0; j < ingredientKeys.length; j++) {
    if (ingredientKeys[j].indexOf("ingredient") === 0) {
      allIngredients.push(drink[ingredientKeys[j]]);
    }
  }
}
// Filters out our unique ingredients and their index locations in the array.
let uniqueIngredients = allIngredients.filter((ingredientName, index) => {
  // Here it looks out for whether the ingredient is appearing for the first time, and if so, it is retained; otherwise, it is omitted.
  return allIngredients.indexOf(ingredientName) === index;
});

// Here we look up how often the ingredients appeared in allIngredients, .length helps us push in the right number
// based on the new array created by filter().
for (let i = 0; i < uniqueIngredients.length; i++) {
  let ingredient = uniqueIngredients[i];

  let count = allIngredients.filter(
    (ingredientName) => ingredientName === ingredient,
  ).length;

  countsIngredients.push(count);
}

// creates our pie chart
const pieChart = new Chart(chartElement, {
  type: "pie",
  data: {
    labels: uniqueIngredients,
    datasets: [
      {
        label: "How many recipes this occurs in",
        data: countsIngredients,
        hoverOffset: 40,
      },
    ],
  },
});
