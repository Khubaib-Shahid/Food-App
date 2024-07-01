import {
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  updateDoc,
  db,
  onAuthStateChanged,
  auth,
  deleteDoc
} from "./firebase.js";

let orderBox = document.querySelector(".orders-box");

let noOrder = document.querySelector("#no-dashboard");

let conatiner = document.querySelector(".dashboard-main");
let loader = document.querySelector("#dashboard-loading");

onAuthStateChanged(auth, async (user) => {
  if (user) {
    let q = query(collection(db, "orders"), where("Owner_ID", "==", user.uid));
    let getOrder = await getDocs(q);

    console.log(getOrder);
    
    getOrder.forEach((d) => {
      console.log(d.data().Order_ID);
      orderBox.innerHTML += `
            <div
          type="button"
          class="bg-white order text-center"
          data-bs-toggle="modal"
          data-bs-target="#m${d.data().Order_ID}"
        >
          <h3>${d.data().Customer_Name}</h3>
          <h5 class="card-text">${d.data().Customer_Address}</h5>
          <h5 class="card-text">${d.data().Customer_Number}</h5>
        </div>

        <!-- Modal -->
        <div
          class="modal fade"
          id="m${d.data().Order_ID}"
          data-bs-backdrop="static"
          data-bs-keyboard="false"
          tabindex="-1"
          aria-labelledby="staticBackdropLabel"
          aria-hidden="true"
        >
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h1 class="modal-title fs-5" id="staticBackdropLabel">
                  Modal title
                </h1>
                <button
                  type="button"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div class="modal-body" id="modal-${d.data().Order_ID}">
              </div>
              <div class="modal-footer justify-content-between">
              <button id="del${d.data().Order_ID}" onclick="delData(this)" class="btn btn-danger del-btn"><i class="fa-solid fa-trash"></i></button>
              <div class="d-flex gap-2">
                <div class="card-text text text-danger"></div><div class="dropdown">
                  <button id="selector" class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                   ${d.data().status == "Send" ? "Select Status" : d.data().status}
                  </button><ul class="dropdown-menu">
                    <li onclick="selectStatus(this)" class="dropdown-item status-item">Pending</li>
                    <li onclick="selectStatus(this)" class="dropdown-item status-item">Ready to go</li>
                    <li onclick="selectStatus(this)" class="dropdown-item status-item">Delivered</li>
                  </ul>
                </div><button ${d.data().status == "Delivered" ? "disabled" : ""} onclick="updateStatus(this)" id="status-${d.data().Order_ID}" type="button" class="btn btn-primary">
                  Update Status
                </button>
                </div>
              </div>
            </div>
          </div>
        </div>
            `;

      const modalBody = document.querySelector(`#modal-${d.data().Order_ID}`);

      d.data().Customer_Data.forEach((v) => {
        modalBody.innerHTML += `
              <div class="orders">
                  <h4>${v.Dish_Name}</h4>
                  <p class="card-text">
                    quantity : ${v.quantity}
                  </p>
                  <p class="card-text">
                    price : ${v.Price} x ${v.quantity} = ${
          v.Price * v.quantity
        } PKR
                  </p>
                </div>
              `;
      });

      async function updateStatus(updateBtn) {
        loader.style.display = "flex";
        let id = updateBtn.getAttribute("id");
        id = id.slice(id.indexOf("-") + 1);
        let myStatus = updateBtn.previousSibling.childNodes[1].innerHTML.trim();

        let newRef = doc(db, "orders", id);

        if (myStatus !== "Select Status") {

          await updateDoc(newRef, {
            status : myStatus
          })

          window.location.reload()

          updateBtn.previousSibling.previousSibling.innerHTML = ""

        } else {
          updateBtn.previousSibling.previousSibling.innerHTML = "Choose Status *"
        }
      }

      async function delData(e) {
        loader.style.display = "flex";
        let id = e.getAttribute("id");
        id = id.slice(id.indexOf("l") + 1);
        await deleteDoc(doc(db, "orders", id));
        window.location.reload()
      }

      window.delData = delData

      window.updateStatus = updateStatus
    });
  }
});

function selectStatus(item) {
  let selector = item.parentNode.previousSibling;
    selector.innerHTML = item.innerHTML;
}

window.selectStatus = selectStatus;