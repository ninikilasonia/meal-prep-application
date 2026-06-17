import { useState } from "react";

import PageHeader from "../components/layout/PageHeader.jsx";
import Card from "../components/common/Card.jsx";
import EmptyState from "../components/common/EmptyState.jsx";
import ShoppingListTable from "../components/shopping-list/ShoppingListTable.jsx";
import styles from "./ShoppingListPage.module.css";

// Task 35 — static placeholder behavior. The shopping list is generated from
// local sample data so the layout can be reviewed before the backend
// /shopping-list and /pantry endpoints are wired up (Task 36).
const PLACEHOLDER_ITEMS = [
  {
    ingredient_id: 1,
    ingredient_name: "Chicken breast",
    unit: "g",
    required_quantity: 800,
    available_quantity: 200,
  },
  {
    ingredient_id: 2,
    ingredient_name: "Rice",
    unit: "g",
    required_quantity: 600,
    available_quantity: 0,
  },
  {
    ingredient_id: 3,
    ingredient_name: "Broccoli",
    unit: "g",
    required_quantity: 300,
    available_quantity: 350,
  },
];

// final_quantity_to_buy never goes below zero, even if you already have more
// than the recipe requires.
function withFinalQuantity(item) {
  const required = Number(item.required_quantity) || 0;
  const available = Number(item.available_quantity) || 0;
  return { ...item, final_quantity_to_buy: Math.max(required - available, 0) };
}

function ShoppingListPage() {
  const [items, setItems] = useState([]);
  const [generated, setGenerated] = useState(false);

  function handleGenerate() {
    setItems(PLACEHOLDER_ITEMS.map(withFinalQuantity));
    setGenerated(true);
  }

  function handleAvailableChange(ingredientId, value) {
    setItems((prev) =>
      prev.map((item) =>
        item.ingredient_id === ingredientId
          ? withFinalQuantity({ ...item, available_quantity: value })
          : item
      )
    );
  }

  return (
    <div className={styles.page}>
      <PageHeader
        title="Shopping List"
        description="A generated list of ingredients you still need to buy, based on your planned meals and what you already have at home."
      />

      <Card
        title="Ingredients to buy"
        actions={
          <button type="button" className={styles.generate} onClick={handleGenerate}>
            {generated ? "Regenerate list" : "Generate shopping list"}
          </button>
        }
      >
        {items.length === 0 ? (
          <EmptyState
            icon="🛒"
            title="No shopping list yet"
            message="Plan some meals first, then generate a shopping list to see what you need to buy."
          />
        ) : (
          <ShoppingListTable items={items} onAvailableChange={handleAvailableChange} />
        )}
      </Card>
    </div>
  );
}

export default ShoppingListPage;
