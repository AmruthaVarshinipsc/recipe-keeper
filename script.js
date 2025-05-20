const form = document.getElementById("recipe-form");
const recipeList = document.getElementById("recipe-list");
let editIndex = null;

function getRecipes() {
  return JSON.parse(localStorage.getItem("recipes")) || [];
}

function saveRecipes(recipes) {
  localStorage.setItem("recipes", JSON.stringify(recipes));
}

function renderRecipes() {
  const recipes = getRecipes();
  recipeList.innerHTML = "";
  recipes.forEach((recipe, index) => {
    const div = document.createElement("div");
    div.className = "recipe-card";
    div.innerHTML = `
      <img src="${recipe.image || ""}" alt="Recipe Image"/>
      <h3>${recipe.title}</h3>
      <p><strong>Ingredients:</strong> ${recipe.ingredients}</p>
      <p><strong>Steps:</strong> ${recipe.steps}</p>
      <div class="card-buttons">
        <button class="edit" onclick="editRecipe(${index})">Edit</button>
        <button onclick="deleteRecipe(${index})">Delete</button>
      </div>
    `;
    recipeList.appendChild(div);
  });
}

function editRecipe(index) {
  const recipes = getRecipes();
  const recipe = recipes[index];
  document.getElementById("title").value = recipe.title;
  document.getElementById("ingredients").value = recipe.ingredients;
  document.getElementById("steps").value = recipe.steps;
  editIndex = index;
}

function deleteRecipe(index) {
  const recipes = getRecipes();
  recipes.splice(index, 1);
  saveRecipes(recipes);
  renderRecipes();
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = document.getElementById("title").value.trim();
  const ingredients = document.getElementById("ingredients").value.trim();
  const steps = document.getElementById("steps").value.trim();
  const imageInput = document.getElementById("image");
  const file = imageInput.files[0];

  const reader = new FileReader();
  reader.onloadend = function () {
    const image = file ? reader.result : null;
    const newRecipe = { title, ingredients, steps, image };

    let recipes = getRecipes();
    if (editIndex !== null) {
      recipes[editIndex] = newRecipe;
      editIndex = null;
    } else {
      recipes.push(newRecipe);
    }
    saveRecipes(recipes);
    renderRecipes();
    form.reset();
  };

  if (file) {
    reader.readAsDataURL(file);
  } else {
    reader.onloadend();
  }
});

window.onload = renderRecipes;
