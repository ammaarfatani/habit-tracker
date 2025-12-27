import HabitRow from "./HabitRow";

export default function HabitTable({ habits, onView, onEdit, onDelete }) {
  return (
    <div className="table-wrapper">
      <table className="habit-table">
        <thead>
          <tr>
            <th>Today</th>
            <th>Habit</th>
            <th>Frequency</th>
            <th>Start Date</th>
            <th>Completed</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {habits.map((habit) => (
            <HabitRow
              key={habit.id}
              habit={habit}
              onView={() => onView(habit)}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
