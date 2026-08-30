// const API_URL =
//   import.meta.env.VITE_API_URL || "http://localhost:8080/api";

// export async function getDashboardData() {

//   const token =
//     localStorage.getItem("token");

//   if (!token) {
//     const err = new Error("No authentication token found");
//     err.code = "NO_TOKEN";
//     throw err;
//   }

//   const response =
//     await fetch(
//       `${API_URL}/dashboard`,
//       {
//         method: "GET",

//         headers: {
//           "Content-Type":
//             "application/json",

//           Authorization:
//             `Bearer ${token}`,
//         },
//       }
//     );

//   if (!response.ok) {

//     const errorText =
//       await response.text();

//     console.error(
//       "Dashboard error:",
//       response.status,
//       errorText
//     );

//     const err = new Error(
//       `Dashboard request failed: ${response.status}`
//     );
//     err.status = response.status;
//     throw err;
//   }

//   return response.json();
// }
const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:8080/api";


// ==========================================
// GET DASHBOARD DATA
// ==========================================

export async function getDashboardData() {

  const token =
    localStorage.getItem("token");

  if (!token) {

    const err =
      new Error(
        "No authentication token found"
      );

    err.code =
      "NO_TOKEN";

    err.status =
      401;

    throw err;
  }

  const response =
    await fetch(
      `${API_URL}/dashboard`,
      {
        method: "GET",

        headers: {
          "Content-Type":
            "application/json",

          Authorization:
            `Bearer ${token}`,
        },
      }
    );

  if (!response.ok) {

    const errorText =
      await response.text();

    console.error(
      "Dashboard error:",
      response.status,
      errorText
    );

    const err =
      new Error(
        `Dashboard request failed: ${response.status}`
      );

    err.status =
      response.status;

    throw err;
  }

  return response.json();
}