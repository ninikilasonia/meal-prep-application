import { useState } from "react";

import PageHeader from "../components/layout/PageHeader.jsx";
import Card from "../components/common/Card.jsx";
import EmptyState from "../components/common/EmptyState.jsx";
import RecipeForm from "../components/forms/RecipeForm.jsx";
import styles from "./RecipesPage.module.css";

// Temporary ingredient options for the selector — replaced by /ingredients in Task 16.
const PLACEHOLDER_INGREDIENTS = [
  { id: 1, name: "Chicken breast", unit: "g" },
  { id: 2, name: "Rice", unit: "g" },
  { id: 3, name: "Broccoli", unit: "g" },
  { id: 4, name: "Olive oil", unit: "ml" },
  { id: 5, name: "Eggs", unit: "piece" },
];

function RecipesPage() {
  const [recipes, setRecipes] = useState([]);

  function handleCreate(recipe) {
    setRecipes((prev) => [
      ...prev,
      { id: Date.now(), ...recipe, ingredientCount: recipe.ingredients.length },
    ]);
  }

  function handleDelete(id) {
    setRecipes((prev) => prev.filter((recipe) => recipe.id !== id));
  }

  return (
    <div className={styles.page}>
      <PageHeader
        title="Recipes"
        description="Build recipes from your ingredients. Nutrition is calculated by the backend once connected."
      />

      <Card title="New recipe">
        <RecipeForm
          availableIngredients={PLACEHOLDER_INGREDIENTS}
          onSubmit={handleCreate}
        />
      </Card>

      <Card title={`Your recipes (${recipes.length})`}>
        {recipes.length === 0 ? (
          <EmptyState
            icon="🍲"
            title="No recipes yet"
            message="Create your first recipe using the form above."
          />
        ) : (
          <ul className={styles.recipeList}>
            {recipes.map((recipe) => (
              <li key={recipe.id} className={styles.recipeItem}>
                <div>
                  <h3 className={styles.recipeName}>{recipe.name}</h3>
                  <p className={styles.recipeMeta}>
                    {recipe.meal_type} · {recipe.base_servings} servings ·{" "}
                    {recipe.ingredientCount} ingredient
                    {recipe.ingredientCount === 1 ? "" : "s"}
                  </p>
                  {recipe.description ? (
                    <p className={styles.recipeDesc}>{recipe.description}</p>
                  ) : null}
                </div>
                <button
                  type="button"
                  className={styles.delete}
                  onClick={() => handleDelete(recipe.id)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}

export default RecipesPage;
