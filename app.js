import {
  auth,
  onAuthStateChanged,
  getDocs,
  collection,
  querySnapshot,
  db,
} from "./firebase.js";

let loginSignupBox = document.querySelector("#login-signup-box");

let profile = document.querySelector("#profile");
let profileName = document.querySelector("#profile-name");
let profileImage = document.querySelector("#profile-image");
let profilePic = document.querySelector("#profile-pic");
let acSider = document.querySelector("#offcanvasRightLabel");
let loaderBox = document.querySelector("#loader-box");
let logOutBtn = document.querySelector("#logout-btn");
let navbarBox = document.querySelector(".navbar-box");
let businessPortal = document.querySelector(".business-portal");

let ownerObj = {}

logOutBtn &&
  logOutBtn.addEventListener("click", () => {
    auth.signOut();
    location.reload();
  });

onAuthStateChanged(auth, async (user) => {
  if (user) {
    console.log(user.email)
    const querySnapshot = await getDocs(collection(db, "users"));
    querySnapshot.forEach((doc) => {
      if (user.email === doc.data().Email) {
        if (doc.data().type === "user") {
          if (
            window.location.pathname === "/dashboard.html" ||
            window.location.pathname === "/login.html" ||
            window.location.pathname === "/signup.html" ||
            window.location.pathname === "/business.html" ||
            window.location.pathname === "/dishes.html" || 
            window.location.pathname === "/aboutus2.html"
          ) {
            window.location.href = "index.html";
          }
          loginSignupBox && (loginSignupBox.style.display = "none");
          if (myQuerry.matches) {
            navbarBox && (navbarBox.style.flexDirection = "row-reverse");
          } else {
            navbarBox && (navbarBox.style.flexDirection = "row");
          }
          profile && (profile.style.display = "block");
          profile && (profilePic.src = doc.data().profile_img);
          acSider &&
            (acSider.innerHTML = `<img src="${
              doc.data().profile_img
            }" class="sider-img" alt="profile-pic" width="60" height="60" /> <h3>${
              doc.data().First_Name
            } ${
              doc.data().Last_Name
            }</h3><p class="text-secondary fs-6 fw-normal">${
              doc.data().Email
            }</p>`);
          loaderBox && (loaderBox.style.display = "none");
        } else if (doc.data().type === "owner") {
          if (
            window.location.pathname === "/login.html" ||
            window.location.pathname === "/signup.html" ||
            window.location.pathname === "/business.html"
          ) {
            window.location.href = "dashboard.html";
          }
          loginSignupBox && (loginSignupBox.style.display = "none");

          if (myQuerry.matches) {
            navbarBox && (navbarBox.style.flexDirection = "row-reverse");
          } else {
            navbarBox && (navbarBox.style.flexDirection = "row");
          }
          profile && (profile.style.display = "block");
          businessPortal && (businessPortal.style.display = "block");
          profile && (profilePic.src = doc.data().profile_img);
          acSider &&
            (acSider.innerHTML = `<img src="${
              doc.data().profile_img
            }" class="sider-img" alt="profile-pic" width="60" height="60" /> <h3>${
              doc.data().First_Name
            } ${
              doc.data().Last_Name
            }</h3><p class="text-secondary fs-6 fw-normal">${
              doc.data().Email
            }</p>`);
          loaderBox && (loaderBox.style.display = "none");

          ownerObj.firstname = doc.data().First_Name
          
        }
      }
    });
  } else {
    if (
      window.location.pathname === "/dashboard.html" ||
      window.location.pathname === "/dishes.html" || 
      window.location.pathname === "/aboutus2.html"
    ) {
      window.location.href = "index.html";
    }
    loaderBox && (loaderBox.style.display = "none");
    navbarBox && (navbarBox.style.flexDirection = "row");
    // User is signed out
    // ...
  }
});

let myQuerry = window.matchMedia("(max-width: 992px)");

function checkoutLocation() {
  let cartItem = localStorage.getItem("cart");
  let cart = cartItem ? JSON.parse(cartItem) : [];
  if (cart.length !== 0) {
    if (window.location.pathname !== "/userorders.html") {
      localStorage.clear()
    }
  }
}

checkoutLocation()
// export {ownerObj}