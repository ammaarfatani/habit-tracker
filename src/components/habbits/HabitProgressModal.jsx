import { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";
import HabitProgressChart from "./HabitProgressChart";

export default function HabitProgressModal({ habit, onClose }) {
  const [weekly, setWeekly] = useState([]);
  const [monthly, setMonthly] = useState([]);
  const [streak, setStreak] = useState(0);
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    const load = async () => {
      const snap = await getDocs(
        collection(
          db,
          "users",
          auth.currentUser.uid,
          "habits",
          habit.id,
          "progress"
        )
      );

      let map = {};
      let completed = 0;

      snap.docs.forEach((d) => {
        map[d.id] = d.data().completed ? 1 : 0;
        if (d.data().completed) completed++;
      });

      setPercentage(Math.round((completed / snap.size) * 100 || 0));

      let s = 0;
      let date = new Date();
      while (map[date.toISOString().split("T")[0]] === 1) {
        s++;
        date.setDate(date.getDate() - 1);
      }
      setStreak(s);

      const build = (days) =>
        Array.from({ length: days }).map((_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - (days - 1 - i));
          const key = d.toISOString().split("T")[0];
          return { date: key.slice(5), value: map[key] || 0 };
        });

      setWeekly(build(7));
      setMonthly(build(30));
    };

    load();
  }, [habit.id]);

  return (
    <div className="progress-overlay">
      <div className="progress-modal">
        <div className="modal-header">
          <h2>{habit.name}</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <span>🔥 Streak</span>
            <strong>{streak} days</strong>
          </div>

          <div className="stat-card">
            <span>📊 Completion</span>
            <strong>{percentage}%</strong>
          </div>
        </div>

        {habit.frequency === "Daily" && (
          <>
            <h4 className="chart-title">Weekly Progress</h4>
            <HabitProgressChart data={weekly} />
          </>
        )}

        <h4 className="chart-title">Monthly Progress</h4>
        <HabitProgressChart data={monthly} />
      </div>
    </div>
  );
}
