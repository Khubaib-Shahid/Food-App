import { onAuthStateChanged, auth, getDocs, doc, query, where, collection, db } from "./firebase.js";

let noStatus = document.querySelector("#no-status");
let orderBox = document.querySelector("#myorder-list");
let statusLoader = document.querySelector("#status-loading");

onAuthStateChanged(auth, async (user) => {
    let orderRef = query(collection(db, "orders"), where("Customer_ID", "==", user.uid));
    let orderToShow = await getDocs(orderRef);
    noStatus.style.display = "none";
    orderToShow.forEach((doc) => {
        for (let i = 0; i < doc.data().Customer_Data.length; i++) {
            orderBox.innerHTML += `
            <li class="list-group-item">
                <div class="myorder-box">
                  <img class="myorder-img" src="${doc.data().Customer_Data[i].Image}" alt="">
                  <h5 class="myorder-name">${doc.data().Customer_Data[i].Dish_Name}</h5>
                  <h6 class="myorder-price">${doc.data().Customer_Data[i].Price} x ${doc.data().Customer_Data[i].quantity} = ${doc.data().Customer_Data[i].Price * doc.data().Customer_Data[i].quantity} PKR</h6>
                  <h6 class="my-order-status fw-bold">${doc.data().status}</h6>
                </div>
              </li>
            `
        }
    })
    statusLoader.style.display = "none";
})

function back() {
    window.history.back()
}

window.back = back