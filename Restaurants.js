import { collection, getDocs, db, query, where } from "./firebase.js";

let food = document.querySelector("#food");
let cardLoader = document.querySelector(".load-card");

let shopRef = collection(db, "users");

let shops = query(shopRef, where("type", "==", "owner"));

const querySnapshot = await getDocs(shops);
querySnapshot.forEach((doc) => {
  food.innerHTML += `
  <div class="card-box">
          <div class="card" style="width: 17.5rem">
            <img
              src="${doc.data().profile_img}"
              height="230"
              class="card-img-top object-fit-cover"
              alt="..."
            />
            <div class="card-body">
              <h5 class="card-title">${doc.data().Business_Name}</h5>
              <p class="card-text d-flex justify-content-between">
                <span class="card-address"> ${doc.data().Adress}</span
              </p>
              </div>
              <div class="ps-3 pb-3">
              <a
                href="./DishesPage.html?id=${
                    doc.data().User_ID
                  }"
                class="btn btn-primary"
                >Open</a
              >
              </div>
          </div>
        `;
});

