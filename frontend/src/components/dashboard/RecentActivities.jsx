import {
  Car,
  Zap,
  Utensils,
  Recycle,
  Droplets,
  Leaf,
} from "lucide-react";

const icons = {
  Transportation: Car,
  Electricity: Zap,
  Food: Utensils,
  Waste: Recycle,
  Water: Droplets,
};

export default function RecentActivities({
  activities = [],
}) {
  if (activities.length === 0) {
    return (
      <div className="recent-activities">
        <h2>Recent Activities</h2>

        <p>
          No activities added yet.
        </p>
      </div>
    );
  }

  return (
    <div className="recent-activities">

      <div className="section-header">
        <div>
          <h2>Recent Activities</h2>
          <p>
            Your latest environmental activities
          </p>
        </div>
      </div>

      <div className="activity-list">

        {activities.map((activity) => {

          const Icon =
            icons[activity.category] || Leaf;

          return (
            <div
              className="activity-row"
              key={activity.id}
            >

              <div className="activity-icon">
                <Icon size={20} />
              </div>

              <div className="activity-info">

                <strong>
                  {activity.activityType ||
                    activity.category}
                </strong>

                <span>
                  {activity.category}
                  {" • "}
                  {activity.quantity}
                  {" "}
                  {activity.unit}
                </span>

              </div>

              <div className="activity-emission">

                <strong>
                  {Number(
                    activity.emission || 0
                  ).toFixed(2)}
                  {" kg"}
                </strong>

                <span>
                  CO₂e
                </span>

              </div>

            </div>
          );

        })}

      </div>

    </div>
  );
}