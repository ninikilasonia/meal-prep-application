import { useState } from "react";

import PageHeader from "../components/layout/PageHeader.jsx";
import Card from "../components/common/Card.jsx";
import IngredientForm from "../components/forms/IngredientForm.jsx";
import styles from "./IngredientsPage.module.css";

// Temporary placeholder data — replaced by the backend in Task 12.
const PLACEHOLDER_INGREDIENTS = [
  { id: 1, name: "Chicken breast", unit: "g", calories: 1.65, protein: 0.31, carbohydrates: 0, fat: 0.04, fiber: 0 },
  { id: 2, name: "Rice", unit: "g", calories: 1.3, protein: 0.027, carbohydrates: 0.28, fat: 0.003, fiber: 0.004 },
  { id: 3, name: "Broccoli", unit: "g", calories: 0.34, protein: 0.028, carbohydrates: 0.07, fat: 0.004, fiber: 0.026 },
  { id: 4, name: "Olive oil", unit: "ml", calories: 8.84, protein: 0, carbohydrates: 0, fat: 1, fiber: 0 },
  { id: 5, name: "Eggs", unit: "piece", calories: 78, protein: 6.3, carbohydrates: 0.6, fat: 5.3, fiber: 0 },
  { id: 6, name: "Yogurt", unit: "g", calories: 0.59, protein: 0.1, carbohydrates: 0.047, fat: 0.0033, fiber: 0 },
];

const NUTRITION_COLUMNS = [
  { key: "calories", label: "Calories" },
  { key: "protein", label: "Protein" },
  { key: "carbohydrates", label: "Carbs" },
  { key: "fat", label: "Fat" },
  { key: "fiber", label: "Fiber" },
];

function IngredientsPage() {
  const [ingredients, setIngredients] = useState(PLACEHOLDER_INGREDIENTS);

  function handleAdd(ingredient) {
    setIngredients((prev) => [...prev, { id: Date.now(), ...ingredient }]);
  }

  function handleDelete(id) {
    setIngredients((prev) => prev.filter((item) => item.id !== id));
  }

  return (
    <div className={styles.page}>
      <PageHeader
        title="Ingredients"
        description="Build your ingredient library. Each ingredient stores nutrition per unit, used to calculate recipe nutrition."
      />

      <Card title="Add ingredient">
        <IngredientForm onSubmit={handleAdd} />
      </Card>

      <Card title={`Ingredient library (${ingredients.length})`}>
        {ingredients.length === 0 ? (
          <p className={styles.empty}>
            No ingredients yet. Add your first ingredient using the form above.
          </p>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Unit</th>
                  {NUTRITION_COLUMNS.map((col) => (
                    <th key={col.key} className={styles.num}>
                      {col.label}
                    </th>
                  ))}
                  <th aria-label="actions" />
                </tr>
              </thead>
              <tbody>
                {ingredients.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.unit}</td>
                    {NUTRITION_COLUMNS.map((col) => (
                      <td key={col.key} className={styles.num}>
                        {item[col.key]}
                      </td>
                    ))}
                    <td className={styles.num}>
                      <button
                        type="button"
                        className={styles.delete}
                        onClick={() => handleDelete(item.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

export default IngredientsPage;
