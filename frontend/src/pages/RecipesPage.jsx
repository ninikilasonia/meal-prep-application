import { useCallback, useEffect, useMemo, useState } from "react";

import PageHeader from "../components/layout/PageHeader.jsx";
import Card from "../components/common/Card.jsx";
import Alert from "../components/common/Alert.jsx";
import LoadingState from "../components/common/LoadingState.jsx";
import EmptyState from "../components/common/EmptyState.jsx";
import RecipeForm from "../components/forms/RecipeForm.jsx";
import RecipeCard from "../components/recipes/RecipeCard.jsx";
import { getIngredients } from "../api/ingredientsApi.js";
import {
  createRecipe,
  deleteRecipe,
  getRecipes,
} from "../api/recipesApi.js";
import styles from "./RecipesPage.module.css";

function RecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);

  const ingredientsById = useMemo(() => {
    return Object.fromEntries(ingredients.map((item) => [item.id, item]));
  }, [ingredients]);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [recipeData, ingredientData] = await Promise.all([
        getRecipes(),
        getIngredients(),
      ]);
      setRecipes(recipeData);
      setIngredients(ingredientData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function handleCreate(recipe) {
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      const created = await createRecipe(recipe);
      setRecipes((prev) => [...prev, created]);
      setSuccess(`Saved "${created.name}".`);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    setError(null);
    setSuccess(null);
    try {
      await deleteRecipe(id);
      setRecipes((prev) => prev.filter((recipe) => recipe.id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className={styles.page}>
      <PageHeader
        title="Recipes"
        description="Build recipes from your ingredients. The backend calculates total and per-serving nutrition automatically."
      />

      {error ? (
        <Alert variant="error" onDismiss={() => setError(null)}>
          {error}
        </Alert>
      ) : null}
      {success ? (
        <Alert variant="success" onDismiss={() => setSuccess(null)}>
          {success}
        </Alert>
      ) : null}

      <Card title="New recipe">
        {ingredients.length === 0 && !loading ? (
          <p className={styles.notice}>
            Add ingredients first — recipes are built from your ingredient library.
          </p>
        ) : null}
        <RecipeForm
          availableIngredients={ingredients}
          onSubmit={handleCreate}
          submitting={submitting}
        />
      </Card>

      <Card title={`Your recipes (${recipes.length})`}>
        {loading ? (
          <LoadingState label="Loading recipes…" />
        ) : recipes.length === 0 ? (
          <EmptyState
            icon="🍲"
            title="No recipes yet"
            message="Create your first recipe using the form above to see its calculated nutrition."
          />
        ) : (
          <div className={styles.recipeGrid}>
            {recipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                ingredientsById={ingredientsById}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

export default RecipesPage;
