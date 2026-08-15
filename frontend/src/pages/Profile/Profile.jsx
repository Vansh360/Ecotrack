import { useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building2,
  GraduationCap,
  Leaf,
  Save,
  ShieldCheck,
  Award,
  Target,
  TreePine,
  Edit3,
} from "lucide-react";

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);

  const [profile, setProfile] = useState({
    name: "Vansh",
    email: "vansh@example.com",
    phone: "",
    college: "",
    department: "Electronics and Computer Science",
    location: "",
    carbonGoal: "250",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = (e) => {
    e.preventDefault();

    setIsEditing(false);
    setMessage("Profile updated successfully!");

    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  return (
    <div className="profile-page">

      {/* HEADER */}

      <div className="profile-page-header">

        <div>
          <span className="dashboard-label">
            ACCOUNT
          </span>

          <h1>My Profile</h1>

          <p>
            Manage your personal information and
            sustainability preferences.
          </p>
        </div>

        <button
          className="profile-edit-button"
          onClick={() => setIsEditing(!isEditing)}
        >
          <Edit3 size={16} />

          {isEditing ? "Cancel" : "Edit Profile"}
        </button>

      </div>

      {/* SUCCESS MESSAGE */}

      {message && (
        <div className="profile-success">
          <ShieldCheck size={18} />
          {message}
        </div>
      )}

      {/* PROFILE TOP */}

      <div className="profile-top-card">

        <div className="profile-large-avatar">
          {profile.name.charAt(0).toUpperCase()}
        </div>

        <div className="profile-main-info">

          <h2>{profile.name}</h2>

          <p>
            <Mail size={14} />
            {profile.email}
          </p>

          <span className="profile-user-badge">
            <Leaf size={13} />
            EcoTrack User
          </span>

        </div>

        <div className="profile-score">

          <div className="profile-score-icon">
            <Leaf size={20} />
          </div>

          <div>
            <span>Sustainability Score</span>
            <strong>78/100</strong>
          </div>

        </div>

      </div>

      {/* MAIN CONTENT */}

      <div className="profile-content-grid">

        {/* PERSONAL INFORMATION */}

        <div className="profile-card">

          <div className="profile-card-header">

            <div>
              <h3>Personal Information</h3>

              <p>
                Your basic account information.
              </p>
            </div>

            <User size={20} />

          </div>

          <form onSubmit={handleSave}>

            <div className="profile-form-grid">

              {/* NAME */}

              <div className="profile-form-group">

                <label>
                  Full Name
                </label>

                <div className="profile-input-wrapper">

                  <User size={16} />

                  <input
                    type="text"
                    name="name"
                    value={profile.name}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />

                </div>

              </div>

              {/* EMAIL */}

              <div className="profile-form-group">

                <label>
                  Email Address
                </label>

                <div className="profile-input-wrapper">

                  <Mail size={16} />

                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />

                </div>

              </div>

              {/* PHONE */}

              <div className="profile-form-group">

                <label>
                  Phone Number
                </label>

                <div className="profile-input-wrapper">

                  <Phone size={16} />

                  <input
                    type="tel"
                    name="phone"
                    value={profile.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    disabled={!isEditing}
                  />

                </div>

              </div>

              {/* LOCATION */}

              <div className="profile-form-group">

                <label>
                  Location
                </label>

                <div className="profile-input-wrapper">

                  <MapPin size={16} />

                  <input
                    type="text"
                    name="location"
                    value={profile.location}
                    onChange={handleChange}
                    placeholder="Enter your city"
                    disabled={!isEditing}
                  />

                </div>

              </div>

              {/* COLLEGE */}

              <div className="profile-form-group">

                <label>
                  College / University
                </label>

                <div className="profile-input-wrapper">

                  <Building2 size={16} />

                  <input
                    type="text"
                    name="college"
                    value={profile.college}
                    onChange={handleChange}
                    placeholder="Enter college name"
                    disabled={!isEditing}
                  />

                </div>

              </div>

              {/* DEPARTMENT */}

              <div className="profile-form-group">

                <label>
                  Department
                </label>

                <div className="profile-input-wrapper">

                  <GraduationCap size={16} />

                  <input
                    type="text"
                    name="department"
                    value={profile.department}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />

                </div>

              </div>

            </div>

            {/* CARBON GOAL */}

            <div className="profile-goal-section">

              <div className="profile-goal-icon">
                <Target size={20} />
              </div>

              <div className="profile-goal-content">

                <label>
                  Monthly Carbon Goal
                </label>

                <p>
                  Set the maximum CO₂ emissions you
                  want to produce each month.
                </p>

                <div className="carbon-goal-input">

                  <input
                    type="number"
                    name="carbonGoal"
                    value={profile.carbonGoal}
                    onChange={handleChange}
                    disabled={!isEditing}
                    min="0"
                  />

                  <span>
                    kg CO₂ / month
                  </span>

                </div>

              </div>

            </div>

            {/* SAVE */}

            {isEditing && (
              <div className="profile-form-actions">

                <button
                  type="submit"
                  className="profile-save-button"
                >
                  <Save size={16} />
                  Save Changes
                </button>

              </div>
            )}

          </form>

        </div>

        {/* ACHIEVEMENTS */}

        <div className="profile-card achievements-card">

          <div className="profile-card-header">

            <div>
              <h3>Achievements</h3>

              <p>
                Your sustainability milestones.
              </p>
            </div>

            <Award size={20} />

          </div>

          <div className="badges-list">

            <div className="profile-badge unlocked">

              <div className="profile-badge-icon">
                🌱
              </div>

              <div>
                <strong>
                  Green Beginner
                </strong>

                <span>
                  Started your sustainability journey
                </span>
              </div>

            </div>

            <div className="profile-badge unlocked">

              <div className="profile-badge-icon">
                🌳
              </div>

              <div>
                <strong>
                  Eco Warrior
                </strong>

                <span>
                  Reduced monthly emissions by 10%
                </span>
              </div>

            </div>

            <div className="profile-badge unlocked">

              <div className="profile-badge-icon">
                💧
              </div>

              <div>
                <strong>
                  Water Saver
                </strong>

                <span>
                  Maintained efficient water usage
                </span>
              </div>

            </div>

            <div className="profile-badge locked">

              <div className="profile-badge-icon">
                🌍
              </div>

              <div>
                <strong>
                  Climate Hero
                </strong>

                <span>
                  Reduce your footprint below 250 kg
                </span>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* STATISTICS */}

      <div className="profile-stat-section">

        <h2>Your EcoTrack Statistics</h2>

        <div className="profile-stats-grid">

          <div className="profile-stat">

            <div className="profile-stat-icon">
              <Leaf size={19} />
            </div>

            <div>
              <span>Total CO₂ Reduced</span>
              <strong>38.5 kg</strong>
            </div>

          </div>

          <div className="profile-stat">

            <div className="profile-stat-icon">
              <TreePine size={19} />
            </div>

            <div>
              <span>Equivalent Trees</span>
              <strong>2 trees</strong>
            </div>

          </div>

          <div className="profile-stat">

            <div className="profile-stat-icon">
              <Target size={19} />
            </div>

            <div>
              <span>Goals Completed</span>
              <strong>4</strong>
            </div>

          </div>

          <div className="profile-stat">

            <div className="profile-stat-icon">
              <Award size={19} />
            </div>

            <div>
              <span>Badges Earned</span>
              <strong>3</strong>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}