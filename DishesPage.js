import {
  getDoc,
  collection,
  db,
  doc,
  query,
  where,
  getDocs,
} from "./firebase.js";

let restaurantImg = document.querySelector("#restaurant-img");
let restaurantName = document.querySelector("#restaurant-name");
let restaurantAddress = document.querySelector("#restaurant-adress");
let dishImg = document.querySelector("#dish-image");
let plusBtn = document.querySelector("#plus");
let minusBtn = document.querySelector("#minus");
let dishBox = document.querySelector("#dish-box");
let cartBody = document.querySelector("#cart-body");
let cartFooter = document.querySelector("#cart-footer");
let noDishes = document.querySelector("#no-ownerDishes");

let minus = (e) => {
  let count = e.nextSibling;
  if (count.innerHTML != 1) {
    +count.innerHTML--;
  }
};

let plus = (e) => {
  let count = e.previousSibling;
  +count.innerHTML++;
};

window.minus = minus;
window.plus = plus;

let qp = new URLSearchParams(window.location.search);
let RestaurantId = qp.get("id");


let docRef = doc(db, "users", RestaurantId);
let docSnap = await getDoc(docRef);

restaurantImg.src = docSnap.data().profile_img;
restaurantName.innerHTML = docSnap.data().Business_Name;
restaurantAddress.innerHTML = docSnap.data().Adress;

let dishes = query(collection(db, "Dishes"), where("id", "==", RestaurantId));

let querySnapshot = await getDocs(dishes);
querySnapshot.forEach((doc) => {
  noDishes.style.display = "none"
  cartFooter.innerHTML = `
  <a href="./userorders.html?ownerId=${doc.data().Owner_ID}" class="btn btn-primary">CheckOut</a>
  `
  dishBox.innerHTML += `
    <div class="dish-card" data-bs-toggle="modal" data-bs-target="#fl${
      doc.data().Dish_ID
    }">
              <img class="dish-img" src="${doc.data().Image}" />
              <div class="dish-text p-3 text-light">
                <h4 class="dish-name fw-bold">${doc.data().Dish_Name}</h4>
                <p class="card-text p-0">${doc.data().Price} PKR</p>
                <p class="card-text p-0">serve ${doc.data().Serving} person</p>
              </div>
            </div>

            <!-- Modal -->
            <div
              class="modal fade"
              id="fl${doc.data().Dish_ID}"
              tabindex="-1"
              aria-labelledby="exampleModalLabel"
              aria-hidden="true"
            >
              <div class="modal-dialog">
                <div class="modal-content">
                  <div class="modal-header">
                    <h1 class="modal-title fs-5" id="exampleModalLabel">
                      Dish
                    </h1>
                    <button
                      type="button"
                      class="btn-close"
                      id="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                      ></button>
                    </div>
                    <div class="modal-body">
                    <img class="dish-modal-image" src="${
                      doc.data().Image
                    }" alt="">
                    <h3 class="pt-3">${doc.data().Dish_Name}</h3>
                    <p class="card-text">Price : ${doc.data().Price} PKR</p>
                    <p class="card-text">serve : ${
                      doc.data().Serving
                    } Person</p>
                    <div class="quantity">
                      <button onClick="minus(this)" class="btn btn-light count-btn"><i class="fa-solid fa-minus"></i></button><div class="count" id="count">1</div><button onClick="plus(this)" class="btn btn-light count-btn"><i class="fa-solid fa-plus"></i></button>
                    </div>
                  </div>
                  <div class="modal-footer">
                    <button
                      type="button"
                      class="btn btn-secondary"
                      data-bs-dismiss="modal"
                    >
                      Close
                    </button>
                    <button onclick="AddToCart('${
                      doc.data().Dish_ID
                    }', this)" type="button" class="btn btn-primary">
                      Add to cart
                    </button>
                  </div>
                </div>
              </div>`;
});




let AddToCart = async (id, e) => {
  let count = document.querySelector("#count").innerHTML;
  let quant =
    e.parentNode.previousSibling.previousSibling.lastChild.previousSibling
      .childNodes[2];
  let cartItem = localStorage.getItem("cart");
  let cart = cartItem ? JSON.parse(cartItem) : [];
  let dish = await getDoc(doc(db, "Dishes", id));
  dish = dish.data();

  cart.push({
    ...dish,
    quantity: +quant.innerHTML,
  });

  localStorage.setItem("cart", JSON.stringify(cart));
  getCartItems();
  quant.innerHTML = 1;
  let closeBtn = document.querySelector("#btn-close");
  e.previousSibling.previousSibling.click()
};

let removeItem = (index) => {
  let cartItem = JSON.parse(localStorage.getItem("cart"));
  cartItem.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cartItem));
  getCartItems();
}

let getCartItems = () => {
  let cartItem = JSON.parse(localStorage.getItem("cart"));
  if (cartItem) {
    cartBody.innerHTML = "";
    for (let i = 0; i < cartItem.length; i++) {
      cartBody.innerHTML += `
      <div class="cart-item-box">
      <img class="cart-item-img" src="${cartItem[i].Image}" />
      <div class="cart-item-text">
                <h6>${cartItem[i].Dish_Name}</h6>
                <p class="form-text m-0">Rs : ${cartItem[i].Price} x ${
        cartItem[i].quantity
      } = ${cartItem[i].Price * cartItem[i].quantity} PKR</p>
                </div>
                <button onclick="removeItem(${i})" class="btn btn-danger"><i class="fa-solid fa-trash"></i></button>
                </div>
                `;
    }
  }
};



window.AddToCart = AddToCart;
window.removeItem = removeItem;
