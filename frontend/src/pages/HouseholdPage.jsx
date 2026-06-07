import { useState } from "react";

import PageHeader from "../components/layout/PageHeader.jsx";
import Card from "../components/common/Card.jsx";
import EmptyState from "../components/common/EmptyState.jsx";
import MemberForm from "../components/forms/MemberForm.jsx";
import MemberCard from "../components/household/MemberCard.jsx";
import styles from "./HouseholdPage.module.css";

function HouseholdPage() {
  const [members, setMembers] = useState([]);

  function handleAdd(member) {
    setMembers((prev) => [...prev, { id: Date.now(), ...member }]);
  }

  function handleDelete(id) {
    setMembers((prev) => prev.filter((member) => member.id !== id));
  }

  return (
    <div className={styles.page}>
      <PageHeader
        title="Household"
        description="Add household members with their goals. The backend uses this to suggest personalized daily nutrition goals and meal portions."
      />

      <Card title="Add household member">
        <MemberForm onSubmit={handleAdd} />
      </Card>

      <Card title={`Members (${members.length})`}>
        {members.length === 0 ? (
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
