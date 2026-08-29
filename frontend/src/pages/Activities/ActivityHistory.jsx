import { useMemo, useState } from "react";

import {
  Activity,
  Search,
  Trash2,
  Pencil,
  Download,
  X,
  CalendarDays,
  Leaf,
} from "lucide-react";

import { useActivities } from "../../context/ActivityContext";


export default function ActivityHistory() {

  const {
    activities,
    updateActivity,
    deleteActivity,
  } = useActivities();


  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [dateFilter, setDateFilter] = useState("All");
  const [editingActivity, setEditingActivity] = useState(null);


  // =====================================================
  // GET ACTIVITY DATE
  // Backend returns: activityDate
  // Older data may contain: date
  // =====================================================

  const getActivityDate = (activity) => {

    return (
      activity.activityDate ||
      activity.date ||
      activity.createdAt ||
      null
    );
  };


  // =====================================================
  // FILTER ACTIVITIES
  // =====================================================

  const filteredActivities = useMemo(() => {

    return activities.filter((activity) => {

      const searchText =
        search.toLowerCase().trim();


      const matchesSearch =
        !searchText ||
        activity.category
          ?.toLowerCase()
          .includes(searchText) ||

        activity.activityType
          ?.toLowerCase()
          .includes(searchText) ||

        activity.details
          ?.toLowerCase()
          .includes(searchText);


      // Backend category is currently uppercase
      const activityCategory =
        activity.category?.toUpperCase();

      const selectedCategory =
        category.toUpperCase();


      const matchesCategory =
        category === "All" ||
        activityCategory === selectedCategory;


      let matchesDate = true;


      // =================================================
      // DATE FILTER
      // =================================================

      if (dateFilter !== "All") {

        const rawDate =
          getActivityDate(activity);


        if (!rawDate) {

          matchesDate = false;

        } else {

          const activityDate =
            new Date(rawDate);

          const today =
            new Date();


          if (
            dateFilter === "Today"
          ) {

            matchesDate =
              activityDate.toDateString() ===
              today.toDateString();

          }


          if (
            dateFilter === "This Month"
          ) {

            matchesDate =
              activityDate.getMonth() ===
                today.getMonth() &&

              activityDate.getFullYear() ===
                today.getFullYear();

          }


          if (
            dateFilter === "This Year"
          ) {

            matchesDate =
              activityDate.getFullYear() ===
              today.getFullYear();

          }

        }
      }


      return (
        matchesSearch &&
        matchesCategory &&
        matchesDate
      );

    });

  }, [
    activities,
    search,
    category,
    dateFilter,
  ]);


  // =====================================================
  // TOTAL EMISSION
  // =====================================================

  const filteredEmission =
    filteredActivities.reduce(
      (total, activity) =>
        total +
        Number(activity.emission || 0),
      0
    );


  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {

    if (!date) {
      return "Unknown";
    }


    try {

      /*
       * If backend sends:
       *
       * 2026-08-27
       *
       * don't directly use new Date()
       * because timezone conversion can sometimes
       * shift date.
       */

      if (
        typeof date === "string" &&
        /^\d{4}-\d{2}-\d{2}$/.test(date)
      ) {

        const [
          year,
          month,
          day,
        ] = date.split("-");


        return new Date(
          Number(year),
          Number(month) - 1,
          Number(day)
        ).toLocaleDateString(
          "en-IN",
          {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }
        );

      }


      return new Date(date)
        .toLocaleDateString(
          "en-IN",
          {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }
        );

    } catch (error) {

      console.error(
        "Date formatting error:",
        error
      );

      return "Unknown";
    }
  };


  // =====================================================
  // FORMAT TIME
  // =====================================================

  const formatTime = (date) => {

    if (!date) {
      return "";
    }


    try {

      /*
       * activityDate may only contain
       * YYYY-MM-DD.
       *
       * In that case don't display
       * an incorrect time.
       */

      if (
        typeof date === "string" &&
        /^\d{4}-\d{2}-\d{2}$/.test(date)
      ) {

        return "";
      }


      return new Date(date)
        .toLocaleTimeString(
          "en-IN",
          {
            hour: "2-digit",
            minute: "2-digit",
          }
        );

    } catch {

      return "";
    }
  };


  // =====================================================
  // DELETE
  // =====================================================

  const handleDelete = (id) => {

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this activity?"
      );


    if (confirmed) {

      deleteActivity(id);

    }
  };


  // =====================================================
  // EXPORT CSV
  // =====================================================

  const exportCSV = () => {

    if (
      filteredActivities.length === 0
    ) {

      alert(
        "There are no activities to export."
      );

      return;
    }


    const headers = [

      "Date",

      "Category",

      "Activity",

      "Quantity",

      "Unit",

      "CO2e (kg)",

      "Emission Factor",

      "Factor Unit",

      "Region",

      "Year",

    ];


    const rows =
      filteredActivities.map(
        (activity) => [

          formatDate(
            getActivityDate(activity)
          ),

          activity.category || "",

          activity.activityType ||
            activity.details ||
            "",

          activity.quantity ?? "",

          activity.unit || "",

          Number(
            activity.emission || 0
          ).toFixed(3),

          activity.emissionFactor ?? "",

          activity.emissionFactorUnit ||
            "",

          activity.factorRegion || "",

          activity.factorYear || "",

        ]
      );


    const csv =
      [headers, ...rows]

        .map((row) =>

          row
            .map(
              (value) =>
                `"${String(value)
                  .replace(/"/g, '""')}"`
            )
            .join(",")

        )

        .join("\n");


    const blob =
      new Blob(
        [csv],
        {
          type:
            "text/csv;charset=utf-8;",
        }
      );


    const url =
      URL.createObjectURL(blob);


    const link =
      document.createElement("a");


    link.href = url;

    link.download =
      "ecotrack-activity-history.csv";


    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);


    URL.revokeObjectURL(url);

  };


  // =====================================================
  // UI
  // =====================================================

  return (

    <div className="activity-history-page">


      {/* HEADER */}

      <div className="history-page-header">

        <div>

          <span className="page-eyebrow">
            ECOTRACK
          </span>

          <h1>
            Activity History
          </h1>

          <p>
            View and manage your carbon
            footprint activities.
          </p>

        </div>


        <button
          className="export-button"
          onClick={exportCSV}
        >

          <Download size={15} />

          Export CSV

        </button>

      </div>


      {/* SUMMARY */}

      <div className="history-summary">


        <div className="history-summary-card">

          <div className="summary-icon">

            <Activity size={19} />

          </div>


          <div>

            <span>
              Activities
            </span>

            <strong>
              {filteredActivities.length}
            </strong>

          </div>

        </div>



        <div className="history-summary-card">

          <div className="summary-icon">

            <Leaf size={19} />

          </div>


          <div>

            <span>
              Total CO₂e
            </span>

            <strong>
              {filteredEmission.toFixed(2)} kg
            </strong>

          </div>

        </div>



        <div className="history-summary-card">

          <div className="summary-icon">

            <CalendarDays size={19} />

          </div>


          <div>

            <span>
              Total Records
            </span>

            <strong>
              {activities.length}
            </strong>

          </div>

        </div>


      </div>


      {/* FILTERS */}

      <div className="history-filter-card">


        <div className="search-box">

          <Search size={16} />

          <input
            type="text"
            placeholder="Search activities..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>



        <select
          value={category}
          onChange={(e) =>
            setCategory(e.target.value)
          }
        >

          <option value="All">
            All Categories
          </option>

          <option value="Transportation">
            Transportation
          </option>

          <option value="Electricity">
            Electricity
          </option>

          <option value="Food">
            Food
          </option>

          <option value="Waste">
            Waste
          </option>

          <option value="Water">
            Water
          </option>

        </select>



        <select
          value={dateFilter}
          onChange={(e) =>
            setDateFilter(e.target.value)
          }
        >

          <option value="All">
            All Dates
          </option>

          <option value="Today">
            Today
          </option>

          <option value="This Month">
            This Month
          </option>

          <option value="This Year">
            This Year
          </option>

        </select>


      </div>


      {/* TABLE */}

      <div className="history-table-card">


        {filteredActivities.length === 0 ? (

          <div className="history-empty">

            <Leaf size={34} />

            <h3>
              No activities found
            </h3>

            <p>
              Start tracking your
              transportation, electricity,
              food, waste or water usage.
            </p>

          </div>

        ) : (

          <div className="history-table-wrapper">

            <table>

              <thead>

                <tr>

                  <th>
                    DATE
                  </th>

                  <th>
                    CATEGORY
                  </th>

                  <th>
                    ACTIVITY
                  </th>

                  <th>
                    QUANTITY
                  </th>

                  <th>
                    CO₂e
                  </th>

                  <th>
                    ACTIONS
                  </th>

                </tr>

              </thead>


              <tbody>

                {filteredActivities.map(
                  (activity) => {

                    const activityDate =
                      getActivityDate(
                        activity
                      );


                    return (

                      <tr
                        key={activity.id}
                      >


                        {/* DATE */}

                        <td>

                          <div className="date-cell">

                            <strong>

                              {formatDate(
                                activityDate
                              )}

                            </strong>


                            {formatTime(
                              activityDate
                            ) && (

                              <span>

                                {formatTime(
                                  activityDate
                                )}

                              </span>

                            )}

                          </div>

                        </td>


                        {/* CATEGORY */}

                        <td>

                          <span
                            className={`category-badge category-${activity.category?.toLowerCase()}`}
                          >

                            {activity.category}

                          </span>

                        </td>


                        {/* ACTIVITY */}

                        <td>

                          <div className="activity-name">

                            <strong>

                              {activity.activityType ||
                                activity.details ||
                                "Activity"}

                            </strong>


                            {activity.details && (

                              <span>
                                {activity.details}
                              </span>

                            )}

                          </div>

                        </td>


                        {/* QUANTITY */}

                        <td>

                          {activity.quantity !==
                          undefined

                            ? `${activity.quantity} ${
                                activity.unit || ""
                              }`

                            : "—"}

                        </td>


                        {/* EMISSION */}

                        <td>

                          <strong
                            className="co2-value"
                          >

                            {Number(
                              activity.emission || 0
                            ).toFixed(2)}{" "}

                            kg

                          </strong>

                        </td>


                        {/* ACTIONS */}

                        <td>

                          <div className="action-buttons">


                            <button
                              className="edit-button"
                              title="Edit"
                              onClick={() =>
                                setEditingActivity(
                                  activity
                                )
                              }
                            >

                              <Pencil size={14} />

                            </button>


                            <button
                              className="delete-button"
                              title="Delete"
                              onClick={() =>
                                handleDelete(
                                  activity.id
                                )
                              }
                            >

                              <Trash2 size={14} />

                            </button>


                          </div>

                        </td>


                      </tr>

                    );

                  }
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>


      {/* EDIT MODAL */}

      {editingActivity && (

        <EditActivityModal

          activity={editingActivity}

          onClose={() =>
            setEditingActivity(null)
          }

          onSave={(updatedActivity) => {

            updateActivity(
              editingActivity.id,
              updatedActivity
            );

            setEditingActivity(null);

          }}

        />

      )}

    </div>

  );
}


// =====================================================
// EDIT ACTIVITY MODAL
// =====================================================

function EditActivityModal({
  activity,
  onClose,
  onSave,
}) {


  const [
    quantity,
    setQuantity,
  ] = useState(
    activity.quantity ?? ""
  );


  const [
    emission,
    setEmission,
  ] = useState(
    activity.emission ?? ""
  );


  const handleSubmit = (e) => {

    e.preventDefault();


    if (
      quantity === "" ||
      Number(quantity) < 0
    ) {

      alert(
        "Please enter a valid quantity."
      );

      return;
    }


    if (
      emission === "" ||
      Number(emission) < 0
    ) {

      alert(
        "Please enter a valid emission."
      );

      return;
    }


    onSave({

      quantity:
        Number(quantity),

      emission:
        Number(emission),

    });

  };


  return (

    <div
      className="edit-modal-overlay"
      onClick={onClose}
    >

      <div
        className="edit-modal"
        onClick={(e) =>
          e.stopPropagation()
        }
      >


        <div className="edit-modal-header">

          <div>

            <span>
              EDIT ACTIVITY
            </span>

            <h2>
              {activity.category}
            </h2>

          </div>


          <button
            onClick={onClose}
            className="close-edit-button"
          >

            <X size={17} />

          </button>

        </div>



        <form
          onSubmit={handleSubmit}
        >


          <div className="edit-form-group">

            <label>
              Activity
            </label>

            <input
              value={
                activity.activityType ||
                activity.details ||
                ""
              }
              disabled
            />

          </div>



          <div className="edit-form-group">

            <label>
              Quantity
            </label>

            <input
              type="number"
              min="0"
              step="0.01"
              value={quantity}
              onChange={(e) =>
                setQuantity(
                  e.target.value
                )
              }
            />

          </div>



          <div className="edit-form-group">

            <label>
              CO₂e (kg)
            </label>

            <input
              type="number"
              min="0"
              step="0.001"
              value={emission}
              onChange={(e) =>
                setEmission(
                  e.target.value
                )
              }
            />

          </div>



          <div className="edit-actions">

            <button
              type="button"
              className="cancel-edit"
              onClick={onClose}
            >

              Cancel

            </button>


            <button
              type="submit"
              className="save-edit"
            >

              Save Changes

            </button>

          </div>


        </form>

      </div>

    </div>

  );
}