const cafeList = document.querySelector("#cafeList");
const form = document.querySelector("#formId");

function renderCafe(doc) {
  let li = document.createElement("li");
  let name = document.createElement("p");
  let city = document.createElement("p");
  let cross = document.createElement("button");

  li.setAttribute("id", doc.id);
  name.textContent = doc.data().name;
  city.textContent = doc.data().city;
  cross.textContent = "Delete";

  li.appendChild(name);
  li.appendChild(city);
  li.appendChild(cross);

  cafeList.appendChild(li);

  //delete data
  cross.addEventListener("click", (evt) => {
    evt.stopPropagation();

    const id = evt.target.parentElement.getAttribute("id");
    db.collection("cafes").doc(id).delete();
  });
}

//get data
/*
db.collection("cafes")
  .get()
  .then((snapshot) => {
    snapshot.docs.forEach((doc) => {
      renderCafe(doc);
    });
  });
  */
//.where("city", "==", "simla")//condition data retrieve

//add data
form.addEventListener("submit", (evt) => {
  evt.preventDefault();

  db.collection("cafes").add({
    name: form.name.value,
    city: form.city.value,
  });

  form.name.value = "";
  form.city.value = "";
});

//Real time data rendering
db.collection("cafes")
  .orderBy("city")
  .onSnapshot((snapshot) => {
    let changes = snapshot.docChanges();
    changes.forEach((change) => {
      console.log(change.doc.data());
      if (change.type == "added") {
        renderCafe(change.doc);
      } else if (change.type == "removed") {
        let id = '"#' + change.doc.id + '"';
        console.log(id);
        let li = cafeList.querySelector("[id=" + change.doc.id + "]");
        cafeList.removeChild(li);
      }
    });
  });
//update data

// db.collection('cafes').doc("pass key").update({
//   name: newname,
// })
//note that if we use set() method it overwrite the entire document
