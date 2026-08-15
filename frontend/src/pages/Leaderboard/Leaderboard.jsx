import {
  Trophy,
  Medal,
  Leaf,
  TrendingDown,
  Users,
} from "lucide-react";

export default function Leaderboard() {
  const users = [
    {
      rank: 1,
      name: "Aarav Sharma",
      department: "Computer Science",
      emission: 210,
      score: 94,
      change: "12%",
    },
    {
      rank: 2,
      name: "Priya Patel",
      department: "Information Technology",
      emission: 235,
      score: 91,
      change: "10%",
    },
    {
      rank: 3,
      name: "Rahul Verma",
      department: "Electronics",
      emission: 260,
      score: 87,
      change: "8%",
    },
    {
      rank: 4,
      name: "Sneha Joshi",
      department: "Computer Science",
      emission: 280,
      score: 84,
      change: "7%",
    },
    {
      rank: 5,
      name: "Vansh",
      department: "Electronics and Computer Science",
      emission: 300,
      score: 78,
      change: "5%",
      currentUser: true,
    },
    {
      rank: 6,
      name: "Rohan Gupta",
      department: "Mechanical Engineering",
      emission: 315,
      score: 76,
      change: "4%",
    },
    {
      rank: 7,
      name: "Neha Singh",
      department: "Civil Engineering",
      emission: 330,
      score: 73,
      change: "3%",
    },
  ];

  return (
    <div className="leaderboard-page">

      {/* HEADER */}

      <div className="leaderboard-header">

        <div className="leaderboard-title-icon">
          <Trophy size={25} />
        </div>

        <div>
          <span>COMMUNITY</span>

          <h1>
            EcoTrack Leaderboard
          </h1>

          <p>
            See how you compare with other
            sustainability-conscious users.
          </p>
        </div>

      </div>

      {/* FILTERS */}

      <div className="leaderboard-controls">

        <div className="leaderboard-tabs">

          <button className="leaderboard-tab active">
            College
          </button>

          <button className="leaderboard-tab">
            Department
          </button>

          <button className="leaderboard-tab">
            City
          </button>

        </div>

        <select className="leaderboard-period">
          <option>
            This Month
          </option>

          <option>
            This Year
          </option>
        </select>

      </div>

      {/* TOP 3 */}

      <div className="top-three">

        <TopUser
          position="2nd"
          user={users[1]}
          medal="🥈"
        />

        <TopUser
          position="1st"
          user={users[0]}
          medal="🥇"
          first
        />

        <TopUser
          position="3rd"
          user={users[2]}
          medal="🥉"
        />

      </div>

      {/* TABLE */}

      <div className="leaderboard-card">

        <div className="leaderboard-card-header">

          <div>
            <h2>
              Monthly Rankings
            </h2>

            <p>
              Ranked by sustainability score and
              carbon footprint.
            </p>
          </div>

          <div className="participants">

            <Users size={15} />

            1,248 participants

          </div>

        </div>

        <div className="leaderboard-table-wrapper">

          <table className="leaderboard-table">

            <thead>

              <tr>
                <th>Rank</th>
                <th>User</th>
                <th>Department</th>
                <th>CO₂ / Month</th>
                <th>Score</th>
                <th>Reduction</th>
              </tr>

            </thead>

            <tbody>

              {users.map((user) => (

                <tr
                  key={user.rank}
                  className={
                    user.currentUser
                      ? "current-user-row"
                      : ""
                  }
                >

                  <td>

                    <div className="rank-number">

                      {user.rank <= 3 ? (
                        <span>
                          {user.rank === 1
                            ? "🥇"
                            : user.rank === 2
                            ? "🥈"
                            : "🥉"}
                        </span>
                      ) : (
                        user.rank
                      )}

                    </div>

                  </td>

                  <td>

                    <div className="leader-user">

                      <div className="leader-avatar">
                        {user.name.charAt(0)}
                      </div>

                      <div>
                        <strong>
                          {user.name}
                        </strong>

                        {user.currentUser && (
                          <span>
                            You
                          </span>
                        )}

                      </div>

                    </div>

                  </td>

                  <td>
                    <span className="department-text">
                      {user.department}
                    </span>
                  </td>

                  <td>

                    <strong>
                      {user.emission} kg
                    </strong>

                  </td>

                  <td>

                    <div className="score-value">
                      <Leaf size={14} />
                      {user.score}
                    </div>

                  </td>

                  <td>

                    <div className="reduction-value">
                      <TrendingDown size={13} />
                      {user.change}
                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

      {/* MOTIVATION */}

      <div className="leaderboard-motivation">

        <div className="motivation-icon">
          <Leaf size={22} />
        </div>

        <div>

          <h3>
            Keep going! 🌱
          </h3>

          <p>
            Reduce your monthly footprint by another
            50 kg to move into the top 3.
          </p>

        </div>

        <button>
          View My Goals →
        </button>

      </div>

    </div>
  );
}

function TopUser({
  position,
  user,
  medal,
  first = false,
}) {
  return (
    <div
      className={
        first
          ? "top-user first"
          : "top-user"
      }
    >

      <div className="top-medal">
        {medal}
      </div>

      <div className="top-avatar">
        {user.name.charAt(0)}
      </div>

      <span className="top-position">
        {position}
      </span>

      <h3>
        {user.name}
      </h3>

      <p>
        {user.emission} kg CO₂/month
      </p>

      <strong>
        {user.score}/100
      </strong>

    </div>
  );
}