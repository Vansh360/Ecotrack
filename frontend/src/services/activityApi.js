// import axios from "axios";

// const API_URL =
//   "http://localhost:8080/api/activities";

// const getAuthHeaders = () => {
//   const token =
//     localStorage.getItem("token");

//   if (!token) {
//     throw new Error(
//       "No login token found."
//     );
//   }

//   return {
//     Authorization: `Bearer ${token}`,
//     "Content-Type":
//       "application/json",
//   };
// };


// // GET
// export const getActivities =
//   async () => {

//     const response =
//       await axios.get(
//         API_URL,
//         {
//           headers:
//             getAuthHeaders(),
//         }
//       );

//     console.log(
//       "GET ACTIVITIES:",
//       response.data
//     );

//     return response.data;
//   };


// // CREATE
// export const createActivity =
//   async (activity) => {

//     const response =
//       await axios.post(
//         API_URL,
//         {
//           category:
//             activity.category,

//           activityType:
//             activity.activityType,

//           quantity:
//             Number(activity.quantity),

//           unit:
//             activity.unit,
//         },
//         {
//           headers:
//             getAuthHeaders(),
//         }
//       );

//     console.log(
//       "CREATED ACTIVITY:",
//       response.data
//     );

//     return response.data;
//   };


// // UPDATE
// export const updateActivity =
//   async (
//     id,
//     activity
//   ) => {

//     const response =
//       await axios.put(
//         `${API_URL}/${id}`,
//         {
//           category:
//             activity.category,

//           activityType:
//             activity.activityType,

//           quantity:
//             Number(activity.quantity),

//           unit:
//             activity.unit,
//         },
//         {
//           headers:
//             getAuthHeaders(),
//         }
//       );

//     return response.data;
//   };


// // DELETE
// export const deleteActivity =
//   async (id) => {

//     await axios.delete(
//       `${API_URL}/${id}`,
//       {
//         headers:
//           getAuthHeaders(),
//       }
//     );
//   };


import axios from "axios";

const API_URL =
  `${import.meta.env.VITE_API_URL || "http://localhost:8080/api"}/activities`;


// ==========================================
// AUTH HEADERS
// ==========================================

const getAuthHeaders = () => {

  const token =
    localStorage.getItem("token");

  if (!token) {

    throw new Error(
      "No login token found."
    );
  }

  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};


// ==========================================
// GET ACTIVITIES
// ==========================================

export const getActivities =
  async () => {

    const response =
      await axios.get(
        API_URL,
        {
          headers:
            getAuthHeaders(),
        }
      );

    console.log(
      "GET ACTIVITIES:",
      response.data
    );

    return response.data;
  };


// ==========================================
// CREATE ACTIVITY
// ==========================================

export const createActivity =
  async (activity) => {

    const response =
      await axios.post(
        API_URL,
        {
          category:
            activity.category,

          activityType:
            activity.activityType,

          quantity:
            Number(activity.quantity),

          unit:
            activity.unit,

          ...(activity.activityDate && {
            activityDate:
              activity.activityDate,
          }),
        },
        {
          headers:
            getAuthHeaders(),
        }
      );

    console.log(
      "CREATED ACTIVITY:",
      response.data
    );

    return response.data;
  };


// ==========================================
// UPDATE ACTIVITY
// ==========================================

export const updateActivity =
  async (
    id,
    activity
  ) => {

    const response =
      await axios.put(
        `${API_URL}/${id}`,
        {
          category:
            activity.category,

          activityType:
            activity.activityType,

          quantity:
            Number(activity.quantity),

          unit:
            activity.unit,

          ...(activity.activityDate && {
            activityDate:
              activity.activityDate,
          }),
        },
        {
          headers:
            getAuthHeaders(),
        }
      );

    return response.data;
  };


// ==========================================
// DELETE ACTIVITY
// ==========================================

export const deleteActivity =
  async (id) => {

    await axios.delete(
      `${API_URL}/${id}`,
      {
        headers:
          getAuthHeaders(),
      }
    );
  };