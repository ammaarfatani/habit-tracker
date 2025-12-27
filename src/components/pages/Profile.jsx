import { auth, db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { sendPasswordResetEmail } from "firebase/auth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Profile.css";

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  const avatarUrl = userData?.username
    ? `https://api.dicebear.com/7.x/initials/svg?seed=${userData.username}`
    : "";

  useEffect(() => {
    const loadData = async () => {
      if (!auth.currentUser) return;
      const snap = await getDoc(doc(db, "users", auth.currentUser.uid));
      setUserData(snap.data());
    };
    loadData();
  }, []);

  const resetPassword = async () => {
    await sendPasswordResetEmail(auth, auth.currentUser.email);
    alert("Password reset email sent 📩");
  };

  return (
    <div className="profile-page">
      <div className="profile-card">

        <button id="back-btn" className="back-btn" onClick={() => navigate("/dashboard")}>
          ← Back to Dashboard
        </button>

        <div className="profile-header">
          <img src={avatarUrl} alt="avatar" />
          <h2>{userData?.username}</h2>
          <p>{userData?.email}</p>
        </div>

        <div className="profile-info">
          <div className="info-row">
            <span>Account Created</span>
            <strong>
              {userData?.createdAt?.toDate().toLocaleString()}
            </strong>
          </div>

          <div className="info-row">
            <span>Last Login</span>
            <strong>
              {userData?.lastLogin?.toDate().toLocaleString()}
            </strong>
          </div>
        </div>

        <button  onClick={() => navigate("/forgot-password")} className="reset-btn">
          Reset Password
        </button>
      </div>
    </div>
  );
}
