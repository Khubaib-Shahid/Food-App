// import { ownerObj } from "./app.js";
import {
  addDoc,
  collection,
  storage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  updateDoc,
  getDocs,
  auth,
  onAuthStateChanged,
  db,
  where,
  query,
  doc,
  deleteDoc
} from "./firebase.js";


let search = document.querySelector("#search-input");
let option = document.querySelectorAll(".dropdown-item");
let selectedItem = document.querySelector("#selected-category");
let categorySelector = document.querySelector("#category-selector");
let dishName = document.querySelector("#exampleInputDishName");
let dishServing = document.querySelector("#exampleInputServing");
let dishPrice = document.querySelector("#exampleInputPrice");
let dishImage = document.querySelector("#dishImage");
let dishUploadedPicture = document.querySelector("#dish-uploaded-picture");
let addDish = document.querySelector("#add-dish");
let dishText = document.querySelector("#dishHelp");
let servingText = document.querySelector("#servingHelp");
let priceText = document.querySelector("#priceHelp");
let categoryText = document.querySelector("#categoryHelp");
let dishImageText = document.querySelector("#dishImageHelp");
let ownerDishes = document.querySelector("#owner-dishes-have");
let dishesLoader = document.querySelector(".dishes-loader-box");

search.addEventListener("keyup", () => {
  let searchValue = search.value.toLowerCase();
  for (let i = 0; i < option.length; i++) {
    let optionValue = option[i].textContent.toLowerCase();
    if (optionValue.indexOf(searchValue) > -1) {
      option[i].style.display = "";
    } else {
      option[i].style.display = "none";
    }
  }
});

option.forEach((option) => {
  option.addEventListener("click", () => {
    selectedItem.innerHTML = option.textContent;
  });
});

dishImage.addEventListener("change", (event) => {
  let image = event.target.files[0];
  let dishUrl = URL.createObjectURL(image);
  dishUploadedPicture.setAttribute("src", dishUrl);
});

function chechDishName() {
  if (dishName.value == "") {
    dishName.style.borderColor = "tomato";
    dishText.style.color = "tomato";
    dishText.innerHTML = "Please enter dish name";
    return false;
  } else {
    dishText.innerHTML = "";
    dishName.style.borderColor = "#dee2e6";
    return true;
  }
}

function chechServing() {
  if (dishServing.value == "") {
    dishServing.style.borderColor = "tomato";
    servingText.style.color = "tomato";
    servingText.innerHTML = "Please enter serving size";
    return false;
  } else {
    servingText.innerHTML = "";
    dishServing.style.borderColor = "#dee2e6";
    return true;
  }
}

function chechPrice() {
  if (dishPrice.value == "") {
    dishPrice.style.borderColor = "tomato";
    priceText.style.color = "tomato";
    priceText.innerHTML = "Please enter price";
    return false;
  } else {
    priceText.innerHTML = "";
    dishPrice.style.borderColor = "#dee2e6";
    return true;
  }
}

function chechCategory() {
  if (selectedItem.innerHTML == "") {
    categorySelector.style.borderColor = "tomato";
    categoryText.style.color = "tomato";
    categoryText.innerHTML = "Please select category";
    return false;
  } else {
    categoryText.innerHTML = "";
    categorySelector.style.borderColor = "#dee2e6";
    return true;
  }
}

function chechDishImage() {
  if (dishImage.value == "") {
    dishImage.style.borderColor = "tomato";
    dishImageText.style.color = "tomato";
    dishImageText.innerHTML = "Please select dish image";
    return false;
  } else {
    dishImageText.innerHTML = "";
    dishImage.style.borderColor = "#dee2e6";
    return true;
  }
}

function uploadDishImage(dishImageFile, id, imageName) {
  let fileName = dishImageFile.name;
  imageName = imageName.replace(/\s/g, "");
  return new Promise((resolve, reject) => {
    const storageRef = ref(
      storage,
      `Dishes/${id}/${imageName}${fileName.slice(fileName.lastIndexOf("."))}`
    );

    const uploadTask = uploadBytesResumable(storageRef, dishImageFile);

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
          console.log("File available at", downloadURL);
          resolve(downloadURL);
        });
      }
    );
  });
}

addDish.addEventListener("click", async () => {
  if (
    chechDishName() &&
    chechServing() &&
    chechPrice() &&
    chechCategory() &&
    chechDishImage()
  ) {
    try {
      console.log(dishesLoader)
      dishesLoader.style.display = "flex";
      const docRef = await addDoc(collection(db, "Dishes"), {
        Dish_Name: dishName.value,
        Serving: dishServing.value,
        Price: dishPrice.value,
        Category: selectedItem.innerHTML,
      });

      let dishId = docRef.id;

      onAuthStateChanged(auth, async (user) => {
        if (user) {
          const querySnapshot = await getDocs(collection(db, "users"));
          querySnapshot.forEach( async (doc) => {
            if (doc.data().Email == user.email) {
              let myId = doc.data().User_ID
              await updateDoc(docRef, {
                Owner_ID: user.uid,
                Dish_ID : dishId,
                id : myId
              });
            }
          });
        } else {
          // User is signed out
          // ...
        }
      });

      uploadDishImage(dishImage.files[0], docRef.id, dishName.value)
        .then(async (downloadURL) => {
          await updateDoc(docRef, {
            Image: downloadURL,
          });
          dishesLoader.style.display = "none";
          window.location.reload();
        })
        .catch((error) => {
          console.log(`Error: ${error}`);
        });

      // console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }
});

onAuthStateChanged(auth, async (user) => {
  if (user) {
  try{
    const q = query(
      collection(db, "Dishes"),
      where("Owner_ID", "==", user.uid)
    );
    const querySnapshot = await getDocs(q);
    let index = 1;
    querySnapshot.forEach((d) => {
      console.log(d.data());
      ownerDishes.innerHTML += `
        <li class="list-group-item">
              <div class="owner-dishes-item">
              <div class="Hitem"><p>${index}</p></div>
              <div class="Hitem"><img width="60px" height="60px" src="${
                  d.data().Image
                }" alt="" /></div>
                <div class="Hitem"><p>${d.data().Dish_Name}</p></div>
                <div class="Hitem"><p>${d.data().Serving} person</p></div>
                <div class="Hitem"><p>${d.data().Price}</p></div>
                <div class="Hitem"><p>${d.data().Category}</p></div>
                <button onclick="delDishes(this)" id="dish${d.data().Dish_ID}" class="btn btn-danger"><i class="fa-solid fa-trash"></i></button>
                </div>
                </li>
         `;
      index++;

      async function delDishes(e) {
        let id = e.getAttribute("id");
        id = id.slice(id.indexOf("h") + 1);
        deleteDoc(doc(db, "Dishes", id))
      }

      window.delDishes = delDishes
    });
    }catch(e){
      console.log(e);
    }
  } else {
    // User is signed out
    // ...
  }
});


