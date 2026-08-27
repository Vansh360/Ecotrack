import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Car,
  Zap,
  Utensils,
  Recycle,
  Droplets,
  ArrowLeft,
  Save,
} from "lucide-react";


// =====================================================
// CATEGORIES
// =====================================================

const categories = [
  {
    id: "Transportation",
    label: "Transportation",
    icon: Car,
  },
  {
    id: "Electricity",
    label: "Electricity",
    icon: Zap,
  },
  {
    id: "Food",
    label: "Food",
    icon: Utensils,
  },
  {
    id: "Waste",
    label: "Waste",
    icon: Recycle,
  },
  {
    id: "Water",
    label: "Water",
    icon: Droplets,
  },
];


// =====================================================
// ACTIVITY TYPES
// These must match your EmissionFactorSeeder
// =====================================================

const activityTypesByCategory = {
  Transportation: [
    {
      value: "CAR",
      label: "Car",
      factor: 0.21,
    },
    {
      value: "BUS",
      label: "Bus",
      factor: 0.08,
    },
    {
      value: "TRAIN",
      label: "Train",
      factor: 0.04,
    },
    {
      value: "BIKE",
      label: "Bike",
      factor: 0.0,
    },
    {
      value: "WALK",
      label: "Walk",
      factor: 0.0,
    },
  ],

  Electricity: [
    {
      value: "GRID",
      label: "Grid electricity",
      factor: 0.71,
    },
  ],

  Food: [
    {
      value: "VEGETARIAN",
      label: "Vegetarian meal",
      factor: 1.5,
    },
    {
      value: "NON_VEGETARIAN",
      label: "Non-vegetarian meal",
      factor: 3.5,
    },
  ],

  Waste: [
    {
      value: "PLASTIC",
      label: "Plastic",
      factor: 1.8,
    },
    {
      value: "PAPER",
      label: "Paper",
      factor: 1.0,
    },
    {
      value: "GLASS",
      label: "Glass",
      factor: 0.5,
    },
    {
      value: "ORGANIC",
      label: "Organic",
      factor: 0.4,
    },
  ],

  Water: [
    {
      value: "TAP_WATER",
      label: "Tap water",
      factor: 0.0003,
    },
  ],
};


// =====================================================
// DEFAULT UNITS
// =====================================================

const defaultUnitFor = {
  Transportation: "km",
  Electricity: "kWh",
  Food: "servings",
  Waste: "kg",
  Water: "litres",
};


// =====================================================
// COMPONENT
// =====================================================

export default function AddActivity() {

  const navigate = useNavigate();


  // ---------------------------------------------------
  // STATE
  // ---------------------------------------------------

  const [category, setCategory] =
    useState("Electricity");

  const [activityType, setActivityType] =
    useState("GRID");

  const [quantity, setQuantity] =
    useState("");

  const [unit, setUnit] =
    useState("kWh");

  const [activityDate, setActivityDate] =
    useState(
      new Date().toISOString().split("T")[0]
    );

  const [saving, setSaving] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [messageType, setMessageType] =
    useState("");


  // ===================================================
  // GET SELECTED EMISSION FACTOR
  // ===================================================

  const getSelectedFactor = () => {

    const options =
      activityTypesByCategory[category] || [];

    const selected =
      options.find(
        (item) =>
          item.value === activityType
      );

    return selected
      ? selected.factor
      : 0;
  };


  // ===================================================
  // CALCULATE EMISSION
  // ===================================================

  const calculateEmission = () => {

    const value =
      Number(quantity);

    if (
      !value ||
      value <= 0
    ) {
      return 0;
    }

    return (
      value *
      getSelectedFactor()
    );
  };


  // ===================================================
  // CATEGORY CHANGE
  // ===================================================

  const handleCategorySelect = (id) => {

    setCategory(id);

    const options =
      activityTypesByCategory[id] || [];

    setActivityType(
      options[0]?.value || ""
    );

    setUnit(
      defaultUnitFor[id] || ""
    );

    setMessage("");
    setMessageType("");
  };


  // ===================================================
  // SAVE ACTIVITY
  // ===================================================

  const handleSave = async (e) => {

    e.preventDefault();

    setMessage("");
    setMessageType("");


    // -------------------------------------------------
    // VALIDATION
    // -------------------------------------------------

    if (
      !quantity ||
      Number(quantity) <= 0
    ) {

      setMessage(
        "Please enter a valid quantity."
      );

      setMessageType("error");

      return;
    }


    if (!activityType) {

      setMessage(
        "Please select an activity type."
      );

      setMessageType("error");

      return;
    }


    if (!unit) {

      setMessage(
        "Please select a unit."
      );

      setMessageType("error");

      return;
    }


    if (!activityDate) {

      setMessage(
        "Please select an activity date."
      );

      setMessageType("error");

      return;
    }


    // -------------------------------------------------
    // GET TOKEN
    // -------------------------------------------------

    const token =
      localStorage.getItem("token");


    if (
      !token ||
      token === "development-token"
    ) {

      setMessage(
        "Your session is invalid. Please login again."
      );

      setMessageType("error");

      return;
    }


    // -------------------------------------------------
    // REQUEST DATA
    // -------------------------------------------------

    const activityData = {

      category: category,

      activityType: activityType,

      quantity: Number(quantity),

      unit: unit,

      activityDate: activityDate,

      metadata:
        `${category} activity`,
    };


    console.log(
      "Saving activity:",
      activityData
    );


    try {

      setSaving(true);


      // ------------------------------------------------
      // API REQUEST
      // ------------------------------------------------

      const response =
        await fetch(
          "http://localhost:8080/api/activities",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,
            },

            body:
              JSON.stringify(
                activityData
              ),
          }
        );


      // ------------------------------------------------
      // READ RESPONSE
      // ------------------------------------------------

      const responseText =
        await response.text();

      let responseData = null;


      try {

        responseData =
          responseText
            ? JSON.parse(responseText)
            : null;

      } catch {

        responseData = null;
      }


      console.log(
        "Backend status:",
        response.status
      );

      console.log(
        "Backend response:",
        responseData || responseText
      );


      // ------------------------------------------------
      // HANDLE ERROR
      // ------------------------------------------------

      if (!response.ok) {

        let errorMessage =
          "Failed to save activity.";


        if (
          responseData?.message
        ) {

          errorMessage =
            responseData.message;

        } else if (
          responseText
        ) {

          errorMessage =
            responseText;
        }


        if (
          response.status === 401
        ) {

          errorMessage =
            "Session expired. Please login again.";
        }


        if (
          response.status === 403
        ) {

          errorMessage =
            "Access denied. Please login again.";
        }


        if (
          response.status === 500
        ) {

          errorMessage =
            responseData?.message ||
            "Backend error while saving activity. Check the Spring Boot terminal.";
        }


        throw new Error(
          errorMessage
        );
      }


      // ------------------------------------------------
      // SUCCESS
      // ------------------------------------------------

      console.log(
        "Activity saved successfully:",
        responseData
      );


      setMessage(
        "Activity saved successfully!"
      );

      setMessageType("success");


      // Clear quantity

      setQuantity("");


      // ------------------------------------------------
      // GO TO DASHBOARD
      // ------------------------------------------------

      setTimeout(() => {

        navigate(
          "/dashboard"
        );

      }, 1000);


    } catch (error) {

      console.error(
        "SAVE ACTIVITY ERROR:",
        error
      );


      setMessage(
        error.message ||
        "Unable to save activity."
      );

      setMessageType("error");


    } finally {

      setSaving(false);

    }
  };


  // ===================================================
  // UI
  // ===================================================

  return (

    <div className="add-activity-page">


      {/* ============================================= */}
      {/* BACK BUTTON */}
      {/* ============================================= */}

      <button
        type="button"
        className="back-button"
        onClick={() =>
          navigate("/dashboard")
        }
      >

        <ArrowLeft size={18} />

        Back to Dashboard

      </button>


      {/* ============================================= */}
      {/* HEADER */}
      {/* ============================================= */}

      <div className="activity-header">

        <div>

          <p className="eyebrow">
            ECOTRACK
          </p>

          <h1>
            Add Activity
          </h1>

          <p>
            Record your daily activity
            to calculate your carbon
            footprint.
          </p>

        </div>

      </div>


      {/* ============================================= */}
      {/* CATEGORY SELECTOR */}
      {/* ============================================= */}

      <div className="category-grid">

        {categories.map(
          ({
            id,
            label,
            icon: Icon,
          }) => (

            <button
              type="button"
              key={id}
              className={
                category === id
                  ? "category-card active"
                  : "category-card"
              }
              onClick={() =>
                handleCategorySelect(id)
              }
            >

              <Icon size={28} />

              <span>
                {label}
              </span>

            </button>

          )
        )}

      </div>


      {/* ============================================= */}
      {/* FORM */}
      {/* ============================================= */}

      <form
        className="activity-form"
        onSubmit={handleSave}
      >


        {/* ------------------------------------------- */}
        {/* ACTIVITY TYPE */}
        {/* ------------------------------------------- */}

        <div className="form-group">

          <label>
            Activity Type
          </label>

          <select
            value={activityType}
            onChange={(e) =>
              setActivityType(
                e.target.value
              )
            }
          >

            {(
              activityTypesByCategory[
                category
              ] || []
            ).map(
              (option) => (

                <option
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </option>

              )
            )}

          </select>

        </div>


        {/* ------------------------------------------- */}
        {/* QUANTITY + UNIT */}
        {/* ------------------------------------------- */}

        <div className="form-row">


          <div className="form-group">

            <label>
              Quantity
            </label>

            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="Enter quantity"
              value={quantity}
              onChange={(e) =>
                setQuantity(
                  e.target.value
                )
              }
            />

          </div>


          <div className="form-group">

            <label>
              Unit
            </label>

            <select
              value={unit}
              onChange={(e) =>
                setUnit(
                  e.target.value
                )
              }
            >

              <option value="km">
                km
              </option>

              <option value="kWh">
                kWh
              </option>

              <option value="litres">
                litres
              </option>

              <option value="kg">
                kg
              </option>

              <option value="servings">
                servings
              </option>

            </select>

          </div>

        </div>


        {/* ------------------------------------------- */}
        {/* DATE */}
        {/* ------------------------------------------- */}

        <div className="form-group">

          <label>
            Activity Date
          </label>

          <input
            type="date"
            value={activityDate}
            onChange={(e) =>
              setActivityDate(
                e.target.value
              )
            }
          />

        </div>


        {/* ------------------------------------------- */}
        {/* EMISSION PREVIEW */}
        {/* ------------------------------------------- */}

        <div className="emission-preview">

          <span>
            Estimated CO₂ Emission
          </span>

          <strong>

            {calculateEmission().toFixed(2)}

            {" "}

            kg CO₂e

          </strong>

        </div>


        {/* ------------------------------------------- */}
        {/* MESSAGE */}
        {/* ------------------------------------------- */}

        {message && (

          <div
            className={
              messageType === "success"
                ? "activity-message success"
                : "activity-message error"
            }
          >

            {message}

          </div>

        )}


        {/* ------------------------------------------- */}
        {/* SAVE BUTTON */}
        {/* ------------------------------------------- */}

        <button
          type="submit"
          className="save-activity-button"
          disabled={saving}
        >

          <Save size={18} />

          {saving
            ? "Saving..."
            : "Save Activity"}

        </button>


      </form>

    </div>

  );
}