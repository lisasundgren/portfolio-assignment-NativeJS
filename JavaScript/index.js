/* Main content HOME - Start */
let searchPressed = document.querySelector("#searchButton");
let searchString = document.querySelector("#searchBar");
let searchDrink = searchString.value;
let searchResult = document.querySelector("#searchResult");
let resultHeader = document.querySelector("#resultHeader");
let resultIMG = document.querySelector("#resultIMG");
let resultTitle = document.querySelector("#resultTitle");
let resultIngredientsMeasurement = document.querySelector(
  "#resultIngredientsMeasurement",
);
let resultInstructions = document.querySelector("#resultInstructions");
let searchError = document.querySelector("#searchError");
// When saving, the recipe name and associated ingredients are sent to an initially empty array.
const favouriteButton = document.querySelector("#favouriteButton");
let amountOfClicks = 0;
let ingredientsArr = [];

// Clicks "search"
searchPressed.addEventListener("click", result);

function result(event) {
  // Begins with a reset of the like button and the ingredient list from previous recipes.
  amountOfClicks = 0;
  favouriteButton.innerHTML =
    '<a href="#" id="favouriteButton"><i class="bi bi-heart"></i></a>';
  ingredientsArr.length = 0;

  // Captures the search term, does not reload the page when searching, and displays the results.
  let searchDrink = searchString.value;
  event.preventDefault();
  resultHeader.style.display = "block";

  // Retrieves information from my API based on the search term
  fetch(
    "https://www.thecocktaildb.com/api/json/v1/1/search.php?s=" + searchDrink,
  )
    .then((response) => response.json())
    .then((result) => {
      if (result.drinks === null) {
        // Error block becomes visible
        searchError.style.display = "block";
      } else {
        // Displays results and hides errors
        searchResult.style.display = "block";
        searchError.style.display = "none";
        // The parent element for our ingredients LIs
        resultIngredientsMeasurement.innerHTML = "";

        // Loops through our results and extracts the information that is missing from the HTML-file
        for (let i = 0; i < result.drinks.length; i++) {
          if (result.drinks[i].strDrink === searchDrink) {
            let drinkName = result.drinks[i].strDrink;
            let drinkIMG = result.drinks[i].strDrinkThumb + "/small";
            let drinkInstructions = result.drinks[i].strInstructions;

            // then loops through ingredients and their associated quantities, push to array
            for (let x = 1; x <= 15; x++) {
              let strIngredient = "strIngredient" + x;
              let strMeasure = "strMeasure" + x;
              let ingredient = result.drinks[i][strIngredient];
              let measure = result.drinks[i][strMeasure];

              if (ingredient && measure) {
                let ingredientLI = document.createElement("li");
                resultIngredientsMeasurement.appendChild(ingredientLI);
                ingredientLI.innerHTML = ingredient + " " + measure;
                ingredientsArr.push(ingredient);
              } else if (ingredient) {
                let ingredientLI = document.createElement("li");
                resultIngredientsMeasurement.appendChild(ingredientLI);
                ingredientLI.innerHTML = ingredient;
                ingredientsArr.push(ingredient);
              }
            }
            // insert into our HTML code
            resultIMG.setAttribute("src", drinkIMG);
            resultTitle.innerHTML = drinkName;
            resultInstructions.innerHTML =
              "<strong> Instructions: </strong>" + drinkInstructions;
          }
        }
      }
      resultHeader.innerHTML = "Results for: " + searchDrink;
    });
}

// We favourite a recipe, doesn't reload the page
favouriteButton.addEventListener("click", (event) => {
  amountOfClicks++;

  if (amountOfClicks % 2 === 1) {
    // if you have clicked on favourite an odd number of times (goes from unmarked to marked)
    favouriteButton.innerHTML =
      '<a href="#" id="favouriteButton"><i class="bi bi-heart-fill"></i></a>';
    saveARecipe(resultTitle.innerHTML, ingredientsArr);
  }
  event.preventDefault();
});

// the function triggered by favourite being marked, which pushes an array of objects to localStorage
function saveARecipe(cocktailName, arrayWithIngredients) {
  let favouritesList = [];

  let cocktail = {
    name: cocktailName,
  };

  for (let a = 0; a < arrayWithIngredients.length; a++) {
    cocktail["ingredient" + (a + 1)] = arrayWithIngredients[a];
  }

  favouritesList.push(cocktail);
  favouritesList = favouritesList.concat(
    JSON.parse(localStorage.getItem("favouritesList") || "[]"),
  );

  localStorage.setItem("favouritesList", JSON.stringify(favouritesList));
}

/* Main content HOME - End */
