import {
  db,
  addDoc,
  collection,
  querySnapshot,
  createUserWithEmailAndPassword,
  auth,
  storage,
  getDownloadURL,
  uploadBytesResumable,
  ref,
  doc,
  updateDoc
} from "./firebase.js";

let pass = document.querySelector("#exampleInputPassword1");
let cPass = document.querySelector("#exampleInputPassword2");

let email = document.querySelector("#exampleInputEmail1");
let passText = document.querySelector("#passwordText");
let cPassText = document.querySelector("#confirmPasswordText");
let emailText = document.querySelector("#emailHelp");
let fName = document.querySelector("#exampleInputFirstName");
let lName = document.querySelector("#exampleInputLastName");
let fNameText = document.querySelector("#fNameText");
let lNameText = document.querySelector("#lNameText");
let backBtn = document.querySelector("#backBtn");
let testImg = document.querySelector("#test-img");

backBtn.addEventListener("click", () => {
  history.back();
});

let showPasswordBtn = document.querySelector("#showPassword");

showPasswordBtn.addEventListener("click", showPassword);

function showPassword() {
  let showPass = document.querySelector("#showPassword");
  if (showPass.checked) {
    pass.type = "text";
    cPass.type = "text";
  } else {
    pass.type = "password";
    cPass.type = "password";
  }
}

function firstNamesValidation() {
  if (fName.value === "") {
    fName.style.border = "1px solid tomato";
    fNameText.innerHTML = "Please Enter your name";
    fNameText.style.color = "tomato";
    return false;
  } else {
    fName.style.border = "1px solid rgb(13, 204, 13)";
    fNameText.innerHTML = "Correct";
    fNameText.style.color = "rgb(13, 204, 13)";
    return true;
  }
}

function emailValidation() {
  let flag = true;

  let mailPattern =
    /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

  if (email.value.match(mailPattern)) {
    email.style.border = "1px solid rgb(13, 204, 13)";
    emailText.innerHTML = "Correct";
    emailText.style.color = "rgb(13, 204, 13)";
    querySnapshot.forEach((doc) => {
      if (email.value === doc.data().Email) {
        email.style.border = "1px solid tomato";
        emailText.innerHTML = "Email already exists";
        emailText.style.color = "tomato";
        return (flag = false);
      }
    });
    return flag;
  } else {
    email.style.border = "1px solid tomato";
    emailText.innerHTML = "Invalid email";
    emailText.style.color = "tomato";
    return false;
  }
}

function passwordValidation() {
  let flag = true;

  if (pass.value.length >= 8) {
    pass.style.border = "1px solid rgb(13, 204, 13)";
    passText.innerHTML = "Correct";
    passText.style.color = "rgb(13, 204, 13)";
    if (pass.value === cPass.value) {
      cPass.style.border = "1px solid rgb(13, 204, 13)";
      cPassText.innerHTML = "Correct";
      cPassText.style.color = "rgb(13, 204, 13)";
      querySnapshot.forEach((doc) => {
        if (pass.value === doc.data().Password) {
          pass.style.border = "1px solid tomato";
          passText.innerHTML = "Password already exists";
          passText.style.color = "tomato";
          return (flag = false);
        }
      });
      return flag;
    } else {
      cPass.style.border = "1px solid tomato";
      cPassText.innerHTML = "Password doesn't match";
      cPassText.style.color = "tomato";
      return false;
    }
  } else {
    pass.style.border = "1px solid tomato";
    passText.innerHTML = "Password must have at least 8 characters";
    passText.style.color = "tomato";
    return false;
  }
}

async function uploadFile(givenFile, id) {
  return new Promise((resolve, reject) => {
    const storageRef = ref(storage, `images/${id}${givenFile.name.slice(givenFile.name.lastIndexOf("."))}`);

    const uploadTask = uploadBytesResumable(storageRef, givenFile);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        reject(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          resolve(downloadURL);
        });
      }
    );
  });
}

let submitBtn = document.querySelector("#submitBtn");

submitBtn.addEventListener("click", submitForm);

async function submitForm() {
  if (
    firstNamesValidation() &&
    emailValidation() &&
    passwordValidation()
  ) {
    try {
      const docRef = await addDoc(collection(db, "users"), {
        First_Name: fName.value,
        Last_Name: lName.value,
        Email: email.value,
        Password: pass.value,
        type: "user",
      });

      let myId = docRef.id;

      let num = Math.round(Math.random() * 8);
      let bgClr = "";

      if (num === 0) {
        bgClr = "#ff0000";
      } else if (num === 1) {
        bgClr = "#ffa500";
      } else if (num === 2) {
        bgClr = "#eb5959";
      } else if (num === 3) {
        bgClr = "#69b169";
      } else if (num === 4) {
        bgClr = "#774545";
      } else if (num === 5) {
        bgClr = "#802cbd";
      } else if (num === 6) {
        bgClr = "#2d76d9";
      } else {
        bgClr = "#ff6fbd";
      }

      let defaultImg = document.createElement("div");

      let dpName = fName.value[0].toUpperCase();

      defaultImg.innerHTML = dpName;
      defaultImg.style.fontSize = "25px";
      defaultImg.style.color = "white";
      defaultImg.style.backgroundColor = bgClr;
      defaultImg.style.width = "60px";
      defaultImg.style.height = "60px";
      defaultImg.style.display = "flex";
      defaultImg.style.justifyContent = "center";
      defaultImg.style.alignItems = "center";
      defaultImg.style.fontFamily = "sans-serif";


      await domtoimage.toSvg(defaultImg)
      .then(async function (dataUrl) {
        let response = await fetch(dataUrl);
        console.log(dataUrl)
        let blob = await response.blob();
        let myFile = new File([blob], "profile.png", {type: blob.type });

        await uploadFile(myFile, docRef.id)
        .then( async (url) => {
           await updateDoc(doc(db, "users", docRef.id), {
            profile_img: url,
            userId : myId
          })
        })
        .catch((error) => {
          console.log(error);
        });
      });

      await createUserWithEmailAndPassword(auth, email.value, pass.value)
        .then((userCredential) => {
          // Signed up
          const user = userCredential.user;
          // ...
          console.log(user, `<-- auth`);
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          // ..
        });

        let message = document.querySelector(".alert-success");
    
    
        fName.value = "";
        lName.value = "";
        email.value = "";
        pass.value = "";
        cPass.value = "";
        showPassword.checked = false;
        fName.style.border = "1px solid #dee2e6";
        lName.style.border = "1px solid #dee2e6";
        email.style.border = "1px solid #dee2e6";
        pass.style.border = "1px solid #dee2e6";
        cPass.style.border = "1px solid #dee2e6";
        fNameText.innerHTML = "";
        lNameText.innerHTML = "";
        emailText.innerHTML = "We'll never share your email with anyone else.";
        passText.innerHTML = "contain minimum 8 characters";
        cPassText.innerHTML = "";
        emailText.style.color = "#212529bf";
        passText.style.color = "#212529bf";
    
    
        message.style.display = "block";
    
        setTimeout(() => {
          message.style.display = "none";
        }, 3000);

      
      console.log("User ID: ", docRef.id);
      window.location.href = "index.html";
    } catch (e) {
      console.error("Error adding document: ", e);
    }


  }

}
