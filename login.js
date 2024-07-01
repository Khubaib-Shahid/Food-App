import {
  signInWithEmailAndPassword,
  auth,
  collection,
  getDocs,
  db
} from "./firebase.js";

let showPass = document.querySelector("#showPassword");
let backBtn = document.querySelector("#backBtn");

backBtn.addEventListener("click", function () {
  window.history.back();
})

showPass.addEventListener("click", function () {
  let password = document.querySelector("#exampleInputPassword1");
  if (password.type === "password") {
    password.type = "text";
  } else {
    password.type = "password";
  }
});

let loginBtn = document.querySelector("#loginBtn");

loginBtn.addEventListener("click", async function () {
  let email = document.querySelector("#exampleInputEmail1").value;
  let password = document.querySelector("#exampleInputPassword1").value;

  await signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;

      console.log(user, `<-- login`);
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    });

  const querySnapshot = await getDocs(collection(db, "users"));
  querySnapshot.forEach((doc) => {
    console.log(email, doc.data().Email)
    if (email === doc.data().Email) {
      if (doc.data().type === "owner") {
        window.location.href = "/dashboard.html";
      } else if (doc.data().type === "ownner") {
        window.location.href = "/index.html";
      }
    }
  });
});

// import { auth, signInWithPopup, GoogleAuthProvider, provider } from './firebase.js';

// let googleBtn = document.getElementById('google-btn');

// googleBtn.addEventListener('click', googleLogin);

// async function googleLogin() {
//     // console.log("yes")
// signInWithPopup(auth, provider)
//   .then((result) => {
//     // This gives you a Google Access Token. You can use it to access the Google API.
//     const credential = GoogleAuthProvider.credentialFromResult(result);
//     const token = credential.accessToken;
//     // The signed-in user info.
//     const user = result.user;
//     // IdP data available using getAdditionalUserInfo(result)
//     // ...
//     console.log(user);
//   }).catch((error) => {
//     // Handle Errors here.
//     const errorCode = error.code;
//     const errorMessage = error.message;
//     // The email of the user's account used.
//     const email = error.customData.email;
//     // The AuthCredential type that was used.
//     const credential = GoogleAuthProvider.credentialFromError(error);
//     // ...
//   });
// }
