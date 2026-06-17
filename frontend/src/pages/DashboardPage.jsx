import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import PageHeader from "../components/layout/PageHeader.jsx";
import Card from "../components/common/Card.jsx";
import NutritionSummary from "../components/nutrition/NutritionSummary.jsx";
import { getIngredients } from "../api/ingredientsApi.js";
import { getRecipes } from "../api/recipesApi.js";
import { getHouseholdMembers } from "../api/householdApi.js";
import { getMealPlan } from "../api/mealPlanApi.js";
import styles from "./DashboardPage.module.css";

const FEATURE_CARDS = [
  { icon: "🥕", title: "Ingredient Library", description: "Store ingredients with nutrition per unit.", to: "/ingredients" },
  { icon: "🍲", title: "Recipe Builder", description: "Build recipes and see calculated nutrition.", to: "/recipes" },
  { icon: "👥", title: "Household Profiles", description: "Add members for personalized planning.", to: "/household" },
  { icon: "🗓️", title: "Meal Plan Calendar", description: "Plan meals across the week.", to: "/meal-plan" },
  { icon: "🛒", title: "Shopping List", description: "Generate a list from planned meals.", to: "/shopping-list" },
];

function StatCard({ label, value }) {
  return (
    <div className={styles.stat}>
      <span className={styles.statValue}>{value}</span>
      <span className={styles.statLabel}>{label}</span>
    </div>
  );
}

function DashboardPage() {
  const [stats, setStats] = useState({
    ingredients: null,
    recipes: null,
    members: null,
    plannedMeals: null,
  });

  useEffect(() => {
    let cancelled = false;
    async function loadStats() {
      // Use allSettled so the dashboard always renders, even if the backend
      // is down or an endpoint is missing.
      const [ingredients, recipes, members, plan] = await Promise.allSettled([
        getIngredients(),
        getRecipes(),
        getHouseholdMembers(),
        getMealPlan(),
      ]);
      if (cancelled) return;
      const count = (result) =>
        result.status === "fulfilled" && Array.isArray(result.value)
          ? result.value.length
          : null;
      setStats({
        ingredients: count(ingredients),
        recipes: count(recipes),
        members: count(members),
        plannedMeals: count(plan),
      });
    }
    loadStats();
    return () => {
      cancelled = true;
    };
  }, []);

  const show = (value) => (value === null ? "—" : value);

  return (
    <div className={styles.page}>
      <PageHeader
        title="Dashboard"
        description="Welcome to your meal prep platform. Manage ingredients, build recipes, plan meals, and more."
      />

      <div className={styles.statGrid}>
        <StatCard label="Ingredients" value={show(stats.ingredients)} />
        <StatCard label="Recipes" value={show(stats.recipes)} />
        <StatCard label="Household members" value={show(stats.members)} />
        <StatCard label="Planned meals" value={show(stats.plannedMeals)} />
      </div>

      <NutritionSummary />

      <Card title="Modules">
        <div className={styles.featureGrid}>
          {FEATURE_CARDS.map((feature) => {
            const body = (
              <>
                <span className={styles.featureIcon}>{feature.icon}</span>
                <span className={styles.featureTitle}>{feature.title}</span>
                <span className={styles.featureDesc}>{feature.description}</span>
                {feature.comingSoon ? (
                  <span className={styles.badge}>Coming soon</span>
                ) : null}
              </>
            );
            return feature.to ? (
              <Link key={feature.title} to={feature.to} className={styles.feature}>
                {body}
              </Link>
            ) : (
              <div key={feature.title} className={`${styles.feature} ${styles.featureDisabled}`}>
                {body}
              </div>
            );
          })}
        </div>
      </Card>

      <Card>
        <p className={styles.note}>
          This progress version demonstrates the core structure of the meal prep
          platform: ingredients, recipes, household members, and basic meal
          planning. Shopping list generation and nutrition summaries will be
          completed in the final version.
        </p>
      </Card>
    </div>
  );
}

export default DashboardPage;
