import { useCallback, useEffect, useState } from "react";

import PageHeader from "../components/layout/PageHeader.jsx";
import Card from "../components/common/Card.jsx";
import Alert from "../components/common/Alert.jsx";
import LoadingState from "../components/common/LoadingState.jsx";
import EmptyState from "../components/common/EmptyState.jsx";
import MemberForm from "../components/forms/MemberForm.jsx";
import MemberCard from "../components/household/MemberCard.jsx";
import {
  createHouseholdMember,
  deleteHouseholdMember,
  getHouseholdMembers,
} from "../api/householdApi.js";
import styles from "./HouseholdPage.module.css";

function HouseholdPage() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);

  const loadMembers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getHouseholdMembers();
      setMembers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMembers();
  }, [loadMembers]);

  async function handleAdd(member) {
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      const created = await createHouseholdMember(member);
      setMembers((prev) => [...prev, created]);
      setSuccess(`Added "${created.name}".`);
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
      await deleteHouseholdMember(id);
      setMembers((prev) => prev.filter((member) => member.id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className={styles.page}>
      <PageHeader
        title="Household"
        description="Add household members with their goals. Used for personalized daily nutrition goals and meal portions."
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

      <Card title="Add household member">
        <MemberForm onSubmit={handleAdd} submitting={submitting} />
      </Card>

      <Card title={`Members (${members.length})`}>
        {loading ? (
          <LoadingState label="Loading members…" />
        ) : members.length === 0 ? (
          <EmptyState
            icon="👥"
            title="No household members yet"
            message="Add a member using the form above to start personalized planning."
          />
        ) : (
          <div className={styles.memberGrid}>
            {members.map((member) => (
              <MemberCard key={member.id} member={member} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

export default HouseholdPage;
