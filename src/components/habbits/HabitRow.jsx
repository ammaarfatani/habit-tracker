import { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import {
  collection,
  getDocs,
  doc,
  setDoc,
} from "firebase/firestore";

import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { MdShowChart } from "react-icons/md";

export default function HabitRow({ habit, onView, onEdit, onDelete }) {
  const user = auth.currentUser;
  const today = new Date().toISOString().split("T")[0];

  const [completedCount, setCompletedCount] = useState(0);
  const [todayDone, setTodayDone] = useState(false);

  const progressRef = collection(
    db,
    "users",
    user.uid,
    "habits",
    habit.id,
    "progress"
  );

  const loadProgress = async () => {
    const snap = await getDocs(progressRef);
    let count = 0;
    let done = false;

    snap.forEach((d) => {
      if (d.data().completed) count++;
      if (d.id === today && d.data().completed) done = true;
    });

    setCompletedCount(count);
    setTodayDone(done);
  };

  useEffect(() => {
    loadProgress();
  }, []);

  const toggleToday = async () => {
    await setDoc(
      doc(progressRef, today),
      { completed: !todayDone },
      { merge: true }
    );
    setTodayDone(!todayDone);
    loadProgress();
  };

  return (
    <tr>
      <td className="center">
        <input
          type="checkbox"
          checked={todayDone}
          onChange={toggleToday}
        />
      </td>

      <td className="habit-name">{habit.name}</td>

      <td>{habit.frequency}</td>

      <td>{habit.startDate}</td>

      <td className="center">{completedCount}</td>

      <td className="actions">
        <button className="btn view" onClick={onView}>
          <MdShowChart size={18} />
        </button>

        <button className="btn edit" onClick={() => onEdit(habit)}>
          <FiEdit2 size={16} />
        </button>

        <button
          className="btn delete"
          onClick={() => onDelete(habit.id)}
        >
          <FiTrash2 size={16} />
        </button>
      </td>
    </tr>
  );
}
