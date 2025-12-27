import { useState } from "react";
import { collection, addDoc, serverTimestamp, doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";

export default function AddHabit({ habit, onHabitAdded, onClose }) {
const [habitName, setHabitName] = useState(habit?.name || "");
const [frequency, setFrequency] = useState(habit?.frequency || "Daily");
const [startDate, setStartDate] = useState(habit?.startDate || "");

  const [loading, setLoading] = useState(false);
  

const handleSubmit = async (e) => {
  e.preventDefault();
  const user = auth.currentUser;
  if (!user) return;

  setLoading(true);

  if (habit) {
    await updateDoc(
      doc(db, "users", user.uid, "habits", habit.id),
      {
        name: habitName,
        frequency,
        startDate,
      }
    );
  } else {
    await addDoc(collection(db, "users", user.uid, "habits"), {
      name: habitName,
      frequency,
      startDate,
      createdAt: serverTimestamp(),
    });
  }

  setLoading(false);
  onHabitAdded();
};

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>{habit ? "Edit Habit" : "Add New Habit"}</h3>


        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Habit name"
            value={habitName}
            onChange={(e) => setHabitName(e.target.value)}
            required
          />

          <select
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
          >
            <option>Daily</option>
            <option>Weekly</option>
          </select>

          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />

          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
           <button type="submit" className="primary-btn" disabled={loading}>
  {loading ? "Saving..." : habit ? "Update Habit" : "Add Habit"}
</button>

          </div>
        </form>
      </div>
    </div>
  );
}
