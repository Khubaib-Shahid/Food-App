import { collection, addDoc, db, onAuthStateChanged, auth, updateDoc, doc } from "./firebase.js"

let checkout = document.querySelector(".checkout-orders");
let userOrders = document.querySelector("#user-orders");
let orderPage = document.querySelector("#order-page");
let fullName = document.querySelector("#fullName");
let PhNumber = document.querySelector("#PhNumber");
let address = document.querySelector("#address");
let loader = document.querySelector(".order-loading");
let totalPrice = document.querySelector("#t-price");
let noOrder = document.querySelector("#no-userorders");
let orderloader = document.querySelector("#ordered-loading")

let param = new URLSearchParams(window.location.search);

let ownerid = param.get("ownerId")

function getOrders() {
  let orderItem = JSON.parse(localStorage.getItem("cart"));

  let getPrice = [100];

  if (orderItem) {
    noOrder.style.display = "none"
    userOrders.innerHTML = ``;
    for (let i = 0; i < orderItem.length; i++) {
      userOrders.innerHTML += `
          <li class="list-group-item d-flex justify-content-between">
          <div class="checkout-item">
                      <img class="checkout-image" src="${
                        orderItem[i].Image
                      }" alt="" />
                      <div class="checkout-text">
                        <h5>${orderItem[i].Dish_Name}</h5>
                        <p class="card-text m-0">${orderItem[i].Price} x ${
        orderItem[i].quantity
      }</p>
                        </div>
                        </div>
                    <div class="checkout-price">${
                      orderItem[i].Price * orderItem[i].quantity
                    } PKR
                    <span>
                    <div class="checkout-del"><button onClick="delOrder(${i})" class="btn btn-danger"><i class="fa-solid fa-trash"></i></button></div>
                    </span></div>
                    
                    </li>
                    `;
                    getPrice.push(orderItem[i].Price * orderItem[i].quantity)
    }



    let total = getPrice.reduce((a, b) => {
      return a + b
    })

    totalPrice.innerHTML = `${total} PKR`


    loader.style.display = "none"
  } else {
    checkout.style.display = "none";
    loader.style.display = "none";
  }

  if (orderItem === false) {
    orderPage.innerHTML = `<div class="no-order" id="no-order">
        <div class="exclaim">
          <h1>!</h1>
        </div>
        <h2>No Orders Yet</h2>
      </div>`;
  }
}

getOrders();

function delOrder(index) {
  let orderItem = JSON.parse(localStorage.getItem("cart"));

  orderItem.splice(index, 1);

  localStorage.setItem("cart", JSON.stringify(orderItem));

  getOrders();
}

function back() {
  window.history.back();
}

async function ordered() {
  if (fullName.value) {
    if (PhNumber.value) {
      if (address.value) {
        try {
          orderloader.style.display = "flex";
          let cart = JSON.parse(localStorage.getItem("cart"));
          const docRef = await addDoc(collection(db, "orders"), {
            Customer_Data : cart,
            Customer_Name : fullName.value,
            Customer_Number : PhNumber.value,
            Customer_Address : address.value, 
            Owner_ID : ownerid,
            status : "Send"
          });
          
          let orderID = docRef.id;
          
          const OrderRef = doc(db, "orders", orderID);
          
          onAuthStateChanged(auth, (user) => {
            if (user) {
               
              updateDoc(OrderRef, {
                Order_ID : orderID,
                Customer_ID : user.uid
              })
              
            }
          })
          localStorage.clear()
          console.log("Document written with ID: ", docRef.id);
          orderloader.style.display = "none"
          window.location.reload()
        } catch (e) {
          console.error("Error adding document: ", e);
        }
      } else {
        address.style.border = "1px solid tomato"
      }
    } else {
      PhNumber.style.border = "1px solid tomato";
    }
  } else {
    fullName.style.border = "1px solid tomato";
  }
}

window.delOrder = delOrder;
window.back = back;
window.ordered = ordered;