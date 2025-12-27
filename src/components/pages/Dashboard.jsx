import { signOut } from "firebase/auth";
import { auth, db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import {
  collection,
  getDocs,
  query,
  orderBy,
  deleteDoc,
  doc,
  getDoc,
} from "firebase/firestore";

import HabitProgressModal from "../habbits/HabitProgressModal";
import AddHabit from "../habbits/AddHabit";
import HabitTable from "../habbits/HabitTable";
import "../styles/Dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();

  const [habits, setHabits] = useState([]);
  const [profile, setProfile] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [editHabit, setEditHabit] = useState(null);
  const [viewHabit, setViewHabit] = useState(null);

  const [open, setOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const dropdownRef = useRef(null);

  const avatarUrl = profile?.username
    ? `https://api.dicebear.com/7.x/initials/svg?seed=${profile.username}`
    : "";

  useEffect(() => {
    const loadProfile = async () => {
      if (!auth.currentUser) return;
      const snap = await getDoc(doc(db, "users", auth.currentUser.uid));
      setProfile(snap.data());
    };
    loadProfile();
  }, []);

  const fetchHabits = async () => {
    if (!auth.currentUser) return;

    const ref = collection(db, "users", auth.currentUser.uid, "habits");
    const q = query(ref, orderBy("createdAt", "desc"));
    const snap = await getDocs(q);

    setHabits(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete habit?")) return;
    await deleteDoc(doc(db, "users", auth.currentUser.uid, "habits", id));
    fetchHabits();
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1 className="logo">HabitFlow</h1>

        <div className="user-menu" ref={dropdownRef}>
          <button className="user-trigger" onClick={() => setOpen(!open)}>
            <img src={avatarUrl} className="avatar" alt="avatar" />
            <span>{profile?.username}</span>
          </button>

          {open && (
            <div className="dropdown">
              <div className="dropdown-header">
                <img src={avatarUrl} className="avatar-lg" alt="avatar" />
                <div>
                  <strong>{profile?.username}</strong>
                  <p>{profile?.email}</p>
                </div>
              </div>

              <div className="dropdown-info">
                <span>Last login</span>
                <small>
                  {profile?.lastLogin?.toDate().toLocaleString()}
                </small>
              </div>

              <button
                className="dropdown-btn"
                onClick={() => navigate("/profile")}
              >
                Account Settings
              </button>

              <button
                className="dropdown-btn danger"
                onClick={() => setShowLogoutConfirm(true)}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="dashboard-content">
        <div className="top-bar">
          <h2>Your Habits</h2>
          <button
            className="primary-btn"
            onClick={() => {
              setEditHabit(null);
              setShowModal(true);
            }}
          >
            + Add Habit
          </button>
        </div>

        {habits.length === 0 && (
          <div className="empty-state">
            <p>No habits added yet 🌱</p>
          </div>
        )}

        <HabitTable
          habits={habits}
          onView={(habit) => setViewHabit(habit)}
          onEdit={(habit) => {
            setEditHabit(habit);
            setShowModal(true);
          }}
          onDelete={handleDelete}
        />
      </main>

      {viewHabit && (
        <HabitProgressModal
          habit={viewHabit}
          onClose={() => setViewHabit(null)}
        />
      )}

      {showModal && (
        <AddHabit
          habit={editHabit}
          onClose={() => {
            setShowModal(false);
            setEditHabit(null);
          }}
          onHabitAdded={() => {
            fetchHabits();
            setShowModal(false);
            setEditHabit(null);
          }}
        />
      )}

      {showLogoutConfirm && (
        <div className="modal-overlay">
          <div className="confirm-modal">
            <h3>Logout Confirmation</h3>
            <p>Are you sure you want to logout?</p>

            <div className="confirm-actions">
              <button
                className="btn-secondary"
                onClick={() => setShowLogoutConfirm(false)}
              >
                Cancel
              </button>

              <button className="btn-danger" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
