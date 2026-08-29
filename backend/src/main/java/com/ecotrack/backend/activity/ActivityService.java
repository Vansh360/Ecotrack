import React, { useEffect, useMemo, useState } from "react";
import { useActivities } from "../context/ActivityContext";

export default function ActivityHistory() {

  // =====================================================
  // ACTIVITY CONTEXT
  // =====================================================

  const {
    activities,
    loading,
    error,
    updateActivity,
    deleteActivity,
    refreshActivities,
  } = useActivities();


  // =====================================================
  // STATE
  // =====================================================

  const [search, setSearch] = useState("");

  const [categoryFilter, setCategoryFilter] =
    useState("ALL");

  const [dateFilter, setDateFilter] =
    useState("ALL");

  const [deletingId, setDeletingId] =
    useState(null);

  const [editingId, setEditingId] =
    useState(null);

  const [editData, setEditData] =
    useState({
      category: "",
      activityType: "",
      quantity: "",
      unit: "",
      activityDate: "",
    });


  // =====================================================
  // REFRESH
  // =====================================================

  useEffect(() => {

    if (
      !activities ||
      activities.length === 0
    ) {
      refreshActivities();
    }

  }, []);


  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {

    if (!date) {
      return "Unknown";
    }

    try {

      return new Date(date).toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      );

    } catch (err) {

      return "Unknown";
    }
  };


  // =====================================================
  // NORMALIZE DATE FOR COMPARISON
  // =====================================================

  const getDateOnly = (date) => {

    if (!date) {
      return "";
    }

    return String(date).substring(0, 10);
  };


  // =====================================================
  // FILTER ACTIVITIES
  // =====================================================

  const filteredActivities = useMemo(() => {

    if (!Array.isArray(activities)) {
      return [];
    }

    return activities.filter(
      (activity) => {

        // -----------------------------
        // SEARCH
        // -----------------------------

        const searchText =
          search.trim().toLowerCase();

        const matchesSearch =
          searchText === "" ||
          String(
            activity.category || ""
          )
            .toLowerCase()
            .includes(searchText) ||
          String(
            activity.activityType || ""
          )
            .toLowerCase()
            .includes(searchText) ||
          String(
            activity.unit || ""
          )
            .toLowerCase()
            .includes(searchText);


        // -----------------------------
        // CATEGORY
        // -----------------------------

        const matchesCategory =
          categoryFilter === "ALL" ||
          String(
            activity.category || ""
          ).toUpperCase() ===
            categoryFilter;


        // -----------------------------
        // DATE
        // -----------------------------

        const activityDate =
          getDateOnly(
            activity.activityDate
          );

        const today =
          new Date();

        const todayString =
          today.toISOString().substring(0, 10);

        const yesterday =
          new Date();

        yesterday.setDate(
          yesterday.getDate() - 1
        );

        const yesterdayString =
          yesterday
            .toISOString()
            .substring(0, 10);


        let matchesDate = true;


        if (dateFilter === "TODAY") {

          matchesDate =
            activityDate ===
            todayString;

        }


        if (dateFilter === "YESTERDAY") {

          matchesDate =
            activityDate ===
            yesterdayString;

        }


        if (dateFilter === "THIS_MONTH") {

          if (!activityDate) {

            matchesDate = false;

          } else {

            const activityDateObject =
              new Date(activityDate);

            const currentDate =
              new Date();

            matchesDate =
              activityDateObject.getMonth() ===
                currentDate.getMonth() &&
              activityDateObject.getFullYear() ===
                currentDate.getFullYear();
          }
        }


        return (
          matchesSearch &&
          matchesCategory &&
          matchesDate
        );
      }
    );

  }, [
    activities,
    search,
    categoryFilter,
    dateFilter,
  ]);


  // =====================================================
  // TOTAL EMISSION
  // =====================================================

  const totalEmission =
    filteredActivities.reduce(
      (total, activity) =>
        total +
        Number(
          activity.emission || 0
        ),
      0
    );


  // =====================================================
  // DELETE ACTIVITY
  // =====================================================

  const handleDelete = async (id) => {

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this activity?"
      );

    if (!confirmed) {
      return;
    }

    try {

      setDeletingId(id);

      await deleteActivity(id);

    } catch (err) {

      console.error(
        "Delete activity error:",
        err
      );

      alert(
        "Failed to delete activity."
      );

    } finally {

      setDeletingId(null);
    }
  };


  // =====================================================
  // START EDIT
  // =====================================================

  const handleEdit = (activity) => {

    setEditingId(activity.id);

    setEditData({
      category:
        activity.category || "",

      activityType:
        activity.activityType || "",

      quantity:
        activity.quantity ?? "",

      unit:
        activity.unit || "",

      activityDate:
        getDateOnly(
          activity.activityDate
        ),
    });
  };


  // =====================================================
  // CANCEL EDIT
  // =====================================================

  const handleCancelEdit = () => {

    setEditingId(null);

    setEditData({
      category: "",
      activityType: "",
      quantity: "",
      unit: "",
      activityDate: "",
    });
  };


  // =====================================================
  // SAVE EDIT
  // =====================================================

  const handleSaveEdit = async () => {

    if (!editingId) {
      return;
    }

    if (
      !editData.category ||
      !editData.activityType ||
      !editData.quantity ||
      !editData.unit
    ) {

      alert(
        "Please fill all required fields."
      );

      return;
    }

    try {

      await updateActivity(
        editingId,
        {
          category:
            editData.category,

          activityType:
            editData.activityType,

          quantity:
            Number(
              editData.quantity
            ),

          unit:
            editData.unit,

          activityDate:
            editData.activityDate ||
            undefined,
        }
      );

      handleCancelEdit();

    } catch (err) {

      console.error(
        "Update activity error:",
        err
      );

      alert(
        "Failed to update activity."
      );
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
    ];


    const rows =
      filteredActivities.map(
        (activity) => [

          activity.activityDate
            ? getDateOnly(
                activity.activityDate
              )
            : "",

          activity.category || "",

          activity.activityType || "",

          activity.quantity ?? "",

          activity.unit || "",

          Number(
            activity.emission || 0
          ).toFixed(2),
        ]
      );


    const csv = [
      headers,
      ...rows,
    ]
      .map(
        (row) =>
          row
            .map(
              (value) =>
                `"${String(value).replace(
                  /"/g,
                  '""'
                )}"`
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
      "ecotrack-activities.csv";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (
      <div
        style={{
          padding: "40px",
          textAlign: "center",
        }}
      >
        <h2>
          Loading activities...
        </h2>

        <p>
          Please wait while we load
          your EcoTrack activity history.
        </p>
      </div>
    );
  }


  // =====================================================
  // ERROR
  // =====================================================

  if (error) {

    return (
      <div
        style={{
          padding: "40px",
          textAlign: "center",
        }}
      >

        <h2>
          Unable to load activities
        </h2>

        <p>
          {error}
        </p>

        <button
          onClick={refreshActivities}
        >
          Try Again
        </button>

      </div>
    );
  }


  // =====================================================
  // UI
  // =====================================================

  return (

    <div
      style={{
        padding: "30px",
        maxWidth: "1400px",
        margin: "0 auto",
      }}
    >

      {/* ===============================================
          HEADER
      =============================================== */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >

        <div>

          <div
            style={{
              fontSize: "13px",
              fontWeight: "700",
              color: "#21854d",
              letterSpacing: "1px",
            }}
          >
            ECOTRACK
          </div>

          <h1
            style={{
              margin: "5px 0",
            }}
          >
            Activity History
          </h1>

          <p>
            View and manage your carbon
            footprint activities.
          </p>

        </div>


        <button
          onClick={exportCSV}
          style={{
            padding: "10px 16px",
            cursor: "pointer",
          }}
        >
          ↓ Export CSV
        </button>

      </div>


      {/* ===============================================
          SUMMARY
      =============================================== */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(3, 1fr)",
          gap: "15px",
          marginBottom: "25px",
        }}
      >

        <div
          style={{
            padding: "20px",
            background: "#ffffff",
            borderRadius: "12px",
          }}
        >

          <div>
            Activities
          </div>

          <h2>
            {filteredActivities.length}
          </h2>

        </div>


        <div
          style={{
            padding: "20px",
            background: "#ffffff",
            borderRadius: "12px",
          }}
        >

          <div>
            Total CO₂e
          </div>

          <h2>
            {totalEmission.toFixed(2)}
            {" "}kg
          </h2>

        </div>


        <div
          style={{
            padding: "20px",
            background: "#ffffff",
            borderRadius: "12px",
          }}
        >

          <div>
            Total Records
          </div>

          <h2>
            {activities.length}
          </h2>

        </div>

      </div>


      {/* ===============================================
          SEARCH + FILTERS
      =============================================== */}

      <div
        style={{
          display: "flex",
          gap: "12px",
          flexWrap: "wrap",
          marginBottom: "20px",
        }}
      >

        <input
          type="text"
          placeholder="Search activities..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          style={{
            padding: "11px",
            minWidth: "260px",
          }}
        />


        <select
          value={categoryFilter}
          onChange={(e) =>
            setCategoryFilter(
              e.target.value
            )
          }
          style={{
            padding: "11px",
          }}
        >

          <option value="ALL">
            All Categories
          </option>

          <option value="TRANSPORTATION">
            Transportation
          </option>

          <option value="ELECTRICITY">
            Electricity
          </option>

          <option value="FOOD">
            Food
          </option>

          <option value="WASTE">
            Waste
          </option>

          <option value="WATER">
            Water
          </option>

        </select>


        <select
          value={dateFilter}
          onChange={(e) =>
            setDateFilter(
              e.target.value
            )
          }
          style={{
            padding: "11px",
          }}
        >

          <option value="ALL">
            All Dates
          </option>

          <option value="TODAY">
            Today
          </option>

          <option value="YESTERDAY">
            Yesterday
          </option>

          <option value="THIS_MONTH">
            This Month
          </option>

        </select>

      </div>


      {/* ===============================================
          TABLE
      =============================================== */}

      {filteredActivities.length > 0 ? (

        <div
          style={{
            overflowX: "auto",
            background: "#ffffff",
            borderRadius: "12px",
          }}
        >

          <table
            style={{
              width: "100%",
              borderCollapse:
                "collapse",
            }}
          >

            <thead>

              <tr>

                <th
                  style={{
                    padding: "15px",
                    textAlign: "left",
                  }}
                >
                  DATE
                </th>

                <th
                  style={{
                    padding: "15px",
                    textAlign: "left",
                  }}
                >
                  CATEGORY
                </th>

                <th
                  style={{
                    padding: "15px",
                    textAlign: "left",
                  }}
                >
                  ACTIVITY
                </th>

                <th
                  style={{
                    padding: "15px",
                    textAlign: "left",
                  }}
                >
                  QUANTITY
                </th>

                <th
                  style={{
                    padding: "15px",
                    textAlign: "left",
                  }}
                >
                  CO₂e
                </th>

                <th
                  style={{
                    padding: "15px",
                    textAlign: "left",
                  }}
                >
                  ACTIONS
                </th>

              </tr>

            </thead>


            <tbody>

              {filteredActivities.map(
                (activity) => (

                  <React.Fragment
                    key={activity.id}
                  >

                    {/* =================================
                        NORMAL ROW
                    ================================= */}

                    {editingId !==
                    activity.id ? (

                      <tr>

                        <td
                          style={{
                            padding: "15px",
                          }}
                        >

                          <strong>

                            {formatDate(
                              activity.activityDate
                            )}

                          </strong>

                        </td>


                        <td
                          style={{
                            padding: "15px",
                          }}
                        >

                          {activity.category}

                        </td>


                        <td
                          style={{
                            padding: "15px",
                            fontWeight: "600",
                          }}
                        >

                          {activity.activityType}

                        </td>


                        <td
                          style={{
                            padding: "15px",
                          }}
                        >

                          {activity.quantity}
                          {" "}
                          {activity.unit}

                        </td>


                        <td
                          style={{
                            padding: "15px",
                            fontWeight: "700",
                          }}
                        >

                          {Number(
                            activity.emission || 0
                          ).toFixed(2)}

                          {" "}kg

                        </td>


                        <td
                          style={{
                            padding: "15px",
                          }}
                        >

                          <button
                            onClick={() =>
                              handleEdit(
                                activity
                              )
                            }
                            style={{
                              marginRight:
                                "6px",
                              cursor:
                                "pointer",
                            }}
                          >
                            ✎
                          </button>


                          <button
                            onClick={() =>
                              handleDelete(
                                activity.id
                              )
                            }
                            disabled={
                              deletingId ===
                              activity.id
                            }
                            style={{
                              cursor:
                                "pointer",
                            }}
                          >

                            {deletingId ===
                            activity.id
                              ? "..."
                              : "🗑"}

                          </button>

                        </td>

                      </tr>

                    ) : (

                      /* =================================
                         EDIT ROW
                      ================================= */

                      <tr>

                        <td
                          style={{
                            padding: "10px",
                          }}
                        >

                          <input
                            type="date"
                            value={
                              editData.activityDate
                            }
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                activityDate:
                                  e.target.value,
                              })
                            }
                          />

                        </td>


                        <td
                          style={{
                            padding: "10px",
                          }}
                        >

                          <select
                            value={
                              editData.category
                            }
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                category:
                                  e.target.value,
                              })
                            }
                          >

                            <option value="TRANSPORTATION">
                              Transportation
                            </option>

                            <option value="ELECTRICITY">
                              Electricity
                            </option>

                            <option value="FOOD">
                              Food
                            </option>

                            <option value="WASTE">
                              Waste
                            </option>

                            <option value="WATER">
                              Water
                            </option>

                          </select>

                        </td>


                        <td
                          style={{
                            padding: "10px",
                          }}
                        >

                          <input
                            type="text"
                            value={
                              editData.activityType
                            }
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                activityType:
                                  e.target.value,
                              })
                            }
                          />

                        </td>


                        <td
                          style={{
                            padding: "10px",
                          }}
                        >

                          <input
                            type="number"
                            min="0"
                            value={
                              editData.quantity
                            }
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                quantity:
                                  e.target.value,
                              })
                            }
                            style={{
                              width: "80px",
                            }}
                          />


                          <input
                            type="text"
                            value={
                              editData.unit
                            }
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                unit:
                                  e.target.value,
                              })
                            }
                            style={{
                              width: "70px",
                              marginLeft:
                                "5px",
                            }}
                          />

                        </td>


                        <td
                          style={{
                            padding: "10px",
                          }}
                        >
                          —
                        </td>


                        <td
                          style={{
                            padding: "10px",
                          }}
                        >

                          <button
                            onClick={
                              handleSaveEdit
                            }
                            style={{
                              marginRight:
                                "6px",
                              cursor:
                                "pointer",
                            }}
                          >
                            Save
                          </button>


                          <button
                            onClick={
                              handleCancelEdit
                            }
                            style={{
                              cursor:
                                "pointer",
                            }}
                          >
                            Cancel
                          </button>

                        </td>

                      </tr>

                    )}

                  </React.Fragment>

                )
              )}

            </tbody>

          </table>

        </div>

      ) : (

        /* ===============================================
           EMPTY STATE
        =============================================== */

        <div
          style={{
            padding: "60px 20px",
            textAlign: "center",
            background: "#ffffff",
            borderRadius: "12px",
          }}
        >

          <div
            style={{
              fontSize: "50px",
              marginBottom: "15px",
            }}
          >
            🌱
          </div>

          <h2>
            No activities found
          </h2>

          <p>
            Start tracking your
            transportation, electricity,
            food, waste or water usage.
          </p>

        </div>

      )}

    </div>
  );
}