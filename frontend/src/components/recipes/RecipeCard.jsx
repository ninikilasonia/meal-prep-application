import { formatNumber } from "../../utils/formatUtils.js";
import styles from "./RecipeCard.module.css";

const TOTAL_FIELDS = [
  { key: "total_calories", label: "Calories" },
  { key: "total_protein", label: "Protein" },
  { key: "total_carbohydrates", label: "Carbs" },
  { key: "total_fat", label: "Fat" },
  { key: "total_fiber", label: "Fiber" },
];

const SERVING_FIELDS = [
  { key: "calories_per_serving", label: "Calories" },
  { key: "protein_per_serving", label: "Protein" },
  { key: "carbohydrates_per_serving", label: "Carbs" },
  { key: "fat_per_serving", label: "Fat" },
  { key: "fiber_per_serving", label: "Fiber" },
];

function NutritionGrid({ fields, recipe }) {
  return (
    <div className={styles.nutritionGrid}>
      {fields.map((field) => (
        <div key={field.key} className={styles.nutritionItem}>
          <span className={styles.nutritionValue}>
            {formatNumber(recipe[field.key])}
          </span>
          <span className={styles.nutritionLabel}>{field.label}</span>
        </div>
      ))}
    </div>
  );
}

function RecipeCard({ recipe, ingredientsById = {}, onDelete }) {
  const hasNutrition = recipe.total_calories !== undefined;

  return (
    <article className={styles.card}>
      <header className={styles.head}>
        <div>
          <h3 className={styles.name}>{recipe.name}</h3>
          <p className={styles.meta}>
            {recipe.meal_type} · {recipe.base_servings} servings
          </p>
        </div>
        <button type="button" className={styles.delete} onClick={() => onDelete(recipe.id)}>
          Delete
        </button>
      </header>

      {recipe.description ? (
        <p className={styles.description}>{recipe.description}</p>
      ) : null}

      {hasNutrition ? (
        <>
          <section>
            <h4 className={styles.sectionTitle}>Total nutrition</h4>
            <NutritionGrid fields={TOTAL_FIELDS} recipe={recipe} />
          </section>
          <section>
            <h4 className={styles.sectionTitle}>Per serving</h4>
            <NutritionGrid fields={SERVING_FIELDS} recipe={recipe} />
          </section>
        </>
      ) : (
        <p className={styles.fallback}>Nutrition values are not available yet.</p>
      )}

      <section>
        <h4 className={styles.sectionTitle}>Ingredients</h4>
        {recipe.ingredients && recipe.ingredients.length > 0 ? (
          <ul className={styles.ingredientList}>
            {recipe.ingredients.map((item) => {
              const ingredient = ingredientsById[item.ingredient_id];
              const name = ingredient?.name ?? `Ingredient #${item.ingredient_id}`;
              const unit = ingredient?.unit ?? "";
              return (
                <li key={item.id ?? item.ingredient_id}>
                  {name} — {item.quantity} {unit}
                </li>
              );
            })}
          </ul>
        ) : (
          <p className={styles.fallback}>No ingredients listed.</p>
        )}
      </section>
    </article>
  );
}

export default RecipeCard;
