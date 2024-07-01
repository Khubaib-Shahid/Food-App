import {onAuthStateChanged, auth} from "./firebase.js"

let loader = document.querySelector(".setting-loading")

let page = document.querySelector("#paging");

onAuthStateChanged(auth, (user) => {
    if (user) {
        loader.style.display = "none"
        console.log(user)
    }
})


function back() {
    window.history.back();
}

window.back = back