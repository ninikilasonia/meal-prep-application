import { useEffect, useState } from "react";

import Card from "../common/Card.jsx";
import Alert from "../common/Alert.jsx";
import LoadingState from "../common/LoadingState.jsx";
import EmptyState from "../common/EmptyState.jsx";
import ProgressBar from "../common/ProgressBar.jsx";
import { formatNumber } from "../../utils/formatUtils.js";
import { getNutritionSummary } from "../../api/nutritionSummaryApi.js";
import styles from "./NutritionSummary.module.css";

const DAY_LABEL = (day) => (day ? day[0].toUpperCase() + day.slice(1) : "");

function DailyCard({ entry }) {
  return (
    <div className={styles.dayCard}>
      <h4 className={styles.dayTitle}>{DAY_LABEL(entry.day)}</h4>
      <div className={styles.bars}>
        <ProgressBar label="Calories" value={entry.calories} goal={entry.calorie_goal} unit="kcal" />
        <ProgressBar label="Protein" value={entry.protein} goal={entry.protein_goal} unit="g" />
        <ProgressBar label="Fiber" value={entry.fiber} goal={entry.fiber_goal} unit="g" />
      </div>
    </div>
  );
}

function WeeklyCard({ weekly }) {
  const rows = [
    ["Calories", weekly.total_calories, "kcal"],
    ["Protein", weekly.total_protein, "g"],
    ["Carbohydrates", weekly.total_carbohydrates, "g"],
    ["Fat", weekly.total_fat, "g"],
    ["Fiber", weekly.total_fiber, "g"],
  ];
  return (
    <div className={styles.weekly}>
      {rows.map(([label, value, unit]) => (
        <div key={label} className={styles.weeklyStat}>
          <span className={styles.weeklyValue}>{formatNumber(value)}</span>
          <span className={styles.weeklyLabel}>
            {label} ({unit})
          </span>
        </div>
      ))}
    </div>
  );
}

function NutritionSummary() {
  const [summaries, setSummaries] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await getNutritionSummary();
        // Accept either a single member object or a list of them.
        const list = Array.isArray(data) ? data : data ? [data] : [];
        if (cancelled) return;
        setSummaries(list);
        setSelectedId(list.length > 0 ? list[0].member_id : null);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const selected =
    summaries.find((item) => item.member_id === selectedId) || summaries[0] || null;

  return (
    <Card
      title="Nutrition summary"
      actions={
        summaries.length > 1 ? (
          <select
            className={styles.select}
            value={selectedId ?? ""}
            onChange={(event) => setSelectedId(Number(event.target.value))}
          >
            {summaries.map((item) => (
              <option key={item.member_id} value={item.member_id}>
                {item.member_name ?? `Member #${item.member_id}`}
              </option>
            ))}
          </select>
        ) : null
      }
    >
      {error ? (
        <Alert variant="error">{error}</Alert>
      ) : loading ? (
        <LoadingState label="Loading nutrition summary…" />
      ) : !selected ? (
        <EmptyState
          icon="📊"
          title="No nutrition data yet"
          message="Add household members and plan some meals to see daily and weekly nutrition."
        />
      ) : (
        <div className={styles.body}>
          <p className={styles.member}>
            {selected.member_name ?? `Member #${selected.member_id}`}
          </p>

          {Array.isArray(selected.daily_summary) && selected.daily_summary.length > 0 ? (
            <div className={styles.dayGrid}>
              {selected.daily_summary.map((entry) => (
                <DailyCard key={entry.day} entry={entry} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon="🗓️"
              title="No planned meals"
              message="This member has no planned meals yet, so there is nothing to summarize."
            />
          )}

          {selected.weekly_summary ? (
            <div className={styles.weeklyWrap}>
              <h4 className={styles.weeklyTitle}>Weekly totals</h4>
              <WeeklyCard weekly={selected.weekly_summary} />
            </div>
          ) : null}
        </div>
      )}
    </Card>
  );
}

export default NutritionSummary;
