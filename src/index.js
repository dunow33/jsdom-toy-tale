let addToy = false;
const toyFormContainer = document.querySelector(".container");
const addBtn = document.querySelector("#new-toy-btn");
const toyCollection = document.getElementById('toy-collection');

document.addEventListener("DOMContentLoaded", () => {
  fetch("http://localhost:3000/toys")
    .then(response => response.json())
    .then(json => json.forEach(toy => {
      renderToy(toy)
  }));

  function renderToy(toy) {
    let divCard = document.createElement("div");
    divCard.className = "card";
    
    let newH2 = document.createElement("h2");
    newH2.innerText = toy["name"];
  
    let newImg = document.createElement("img");
    newImg.className = "toy-avatar";
    newImg.src = toy["image"];

    let newLikes = document.createElement("p");
    newLikes.innerText = toy["likes"] + " Likes";

    let likesButton = document.createElement("button");
    likesButton.id = toy["id"];
    likesButton.innerText = "Like <3";
    likesButton.addEventListener('click', event => {
      increaseToyLikes(event);
    });

    divCard.append(newH2, newImg, newLikes, likesButton);
    toyCollection.append(divCard);
  }

  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  toyFormContainer.addEventListener("submit", (event) => {
    event.preventDefault();
    let configObj = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          name: event.target.name.value,
          image: event.target.image.value,
          likes: 0
        })
      };
    
      fetch("http://localhost:3000/toys", configObj)
        .then
          ( response => response.json())
        .then
          ( newToy => {

            let newToyHTML = `
              <div class="card">
                <h2>${newToy.name}</h2>
                <img src=${newToy.image} class="toy-avatar" />
                <p>${newToy.likes} Likes </p>
                <button data-id="${newToy.id}" class="like-btn">Like <3</button>
              </div>
            `
            toyCollection.innerHTML += newToyHTML;
          });
      });
  });

  function increaseToyLikes(event) {
    event.preventDefault();
    let Likes = parseInt(event.target.previousElementSibling.innerText) + 1
  
    fetch(`http://localhost:3000/toys/${event.target.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        "likes": Likes
      })
    })
    .then(response => response.json())
    .then(json => {
      event.target.previousElementSibling.innerText = `${Likes} likes`;
    })
  }