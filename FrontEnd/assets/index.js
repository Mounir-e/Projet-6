//------------------------- récupérer la galerie et les catégories ----------------------------------//
let lstGallery = [];
let lstCategories = [];

const getWorks = async () => {
  await fetch("http://localhost:5678/api/works")
    .then(res => res.json())
    .then(data => lstGallery = data)
  await fetch("http://localhost:5678/api/categories")
    .then(res => res.json())
    .then(data => lstCategories = data)
    .then(() => {
      createCategory();
      createGallery(lstGallery);
      createGalleryModal(lstGallery);
  });
}

// -------------------------- créer les catégories et rendre fonctionnel les filtres ----------------------------------//

const createCategory = () => {
  const filter = document.createElement("div");
  filter.classList.add("filter");
  portfolio.appendChild(filter);

  filter.innerHTML =
    `<div class="button selected" id="0">Tous</div>
  ` +
    lstCategories
      .map(
        (categories) =>
        
          `<div class="button" id="${categories.name}">${categories.name}</div>`
      )
      .join("");

  let btnFilter = document.querySelectorAll(".button");
  for (let i = 0; i < btnFilter.length; i++) {
    btnFilter[i].addEventListener("click", () => {
      if (i !== 0) {
        lstGalleryFilter = lstGallery.filter((el) => el.categoryId == i);
        createGallery(lstGalleryFilter);
      } else {
        createGallery(lstGallery);
      }

      btnFilter.forEach((btn) => btn.classList.remove("selected"));
      btnFilter[i].classList.add("selected");
    });
  }
};

//------------------------- créer la galerie ----------------------------------//

let gallery = document.createElement("div");
gallery.classList.add("gallery");

const createGallery = (lstGallery) => {
  gallery.innerHTML = lstGallery
    .map(
      (img) =>
        `<figure>
    <img src=${img.imageUrl} alt=${img.title}>
    <figcaption>${img.title}</figcaption>
  </figure>
  `)
    .join("");
  portfolio.appendChild(gallery);
};

getWorks();

// ---------------- Apparition de la modal sur le lien "modifier" -------------------------------//

const modalContainer = document.querySelector(".modal-container");
const modalTriggers = document.querySelectorAll(".modal-trigger");

modalTriggers.forEach(trigger => trigger.addEventListener("click", toggleModal))

function toggleModal() {
  modalContainer.classList.toggle("active")
  createGalleryModal(lstGallery);
}

const modalLink = document.querySelector(".modalLink");
if (modalLink !== null)
modalLink.addEventListener("click", firstModal);

// ---------------------fonction pour faire apparaitre la galerie dans la modale et ajouter les icones suppression ------------//

function createGalleryModal(lstGallery) {
  const galleryModal = document.querySelector('.gallery_modal');
  if (galleryModal !== null) {
    galleryModal.innerHTML = lstGallery.map(
      (img) =>
        `<div class="img_modal">
          <img src=${img.imageUrl} alt=${img.title} data-id=${img.id}>
          <img src="assets/icons/Group 9.svg" alt="" class="icon_delete" data-id=${img.id}> 
          <figcaption>éditer</figcaption>
  </div> `
    )
    .join("");
  
    let iconsDelete = document.querySelectorAll(".icon_delete");
    for (let iconDelete of iconsDelete) {
    iconDelete.addEventListener('click', deleteProject)
    }
  }  
}

//------------------------- fonction pour supprimer des projets-------------------------//

async function deleteProject (e) { 
  let id = this.dataset.id; 
  
 await fetch(`http://localhost:5678/api/works/${id}`, {
        method: "DELETE",
        headers: {
          "Accept": "*/*",
          "Authorization": "Bearer " + localStorage.user,
        },
      }).then(res => {
        if (res.ok) {
          e.target.parentElement.remove()
          getWorks();
        } else if (res.status == "401") {
          alert('Session expirée, merci de vous reconnecter');
          document.location.href=("login.html"); 
        }
      })
};

//---------------- AJOUTS DE PROJETS----------------------------//

//initialisation de variables globales des éléments du formulaire utilisés dans plusieurs fonctions
const modal = document.querySelector('.modal');
const modal_add= document.querySelector('.modal_add');

const arrowModal = document.querySelector(".arrow-modal")
if (arrowModal !== null)
arrowModal.addEventListener("click", firstModal)

const formUploadImg = document.querySelector(".form_upload_img");
const labelFile= document.querySelector(".form_add_photo");
const input_file = document.createElement("input");
const img_element = document.createElement('img');
img_element.classList.add('img_uploaded')

const btnAdd = document.querySelector('.button_add_gallery');
if (btnAdd !== null)
btnAdd.addEventListener('click', modalAdd);

const btnValidate= document.querySelector('.button_validate');

// fonction qui affiche la première modale

function firstModal() {
  modal.style.display = "block";
  modal_add.style.display = "none";
  resetForm();
}

// // fonction pour afficher la deuxième modale
function modalAdd() {
  modal.style.display = "none";
  modal_add.style.display = "block";

  input_file.type = "file";
  input_file.id = "file"
  input_file.name = "file";
  input_file.accept = "image/png, image/jpeg";
  input_file.style.display= "none";
  formUploadImg.appendChild(input_file);

  categoriesSelect(lstCategories);
}

// Sélectionner une catégorie pour l'image à envoyer
function categoriesSelect (categories) {
  const categorySelect =  document.getElementById('categories');

  categorySelect.innerHTML= `
 <option value ="default" selected></option>
  `
  categories.forEach((category) => {
    const option = document.createElement('option');
    option.value = category.id;
    option.textContent= category.name;
    categorySelect.appendChild(option);
  });
}

// récupérer l'image de l'utilisateur dans une variable (file), et faire apparaitre la miniature de l'image uploaded dans le formulaire avant validation 
const inputTitle = document.getElementById("title_picture");
const selectCategories= document.getElementById("categories")

input_file.addEventListener("change", previewFile);

function previewFile(e) {
  const file_extension_regex = /\.(jpe?g|png)$/i;
  if(this.files.length === 0 || !file_extension_regex.test(this.files[0].name)) {
    alert("Format non pris en charge, merci de choisir une autre photo");
    resetForm();
    return;
  }

  let file = e.target.files[0];
  let url = URL.createObjectURL(file);
  displayImg();

  //fonction pour créer l'image, et l'intégrer dans le label

 function displayImg () {
  labelFile.style.padding = "0px";
  img_element.src= url;
  labelFile.innerHTML="";
  labelFile.appendChild(img_element);
  }
}

// fonction pour mettre le bouton valider en vert une fois les conditions remplies
function btnValidateForm() {
  if (inputTitle.value !=="" && selectCategories.value !=="default" &&  input_file.files.length > 0 ) {
    btnValidate.style.background = "#1D6154";
    btnValidate.disabled= false;
    btnValidate.style.cursor= "pointer";
  } else {
    btnValidate.disabled= true;
    btnValidate.style.background = "#A7A7A7";
    btnValidate.style.cursor = "auto";
  }
};

if (inputTitle !== null) {
  inputTitle.addEventListener('input', btnValidateForm);
  selectCategories.addEventListener('input', btnValidateForm);
  input_file.addEventListener('input', btnValidateForm);
  formUploadImg.addEventListener('submit', addProject);
}

// Sounission du formulaire et envoie du projet vers la base de données

async function addProject (e) {
  e.preventDefault();
  const formData = new FormData();
  formData.append("image", input_file.files[0]);
  formData.append('title', inputTitle.value);
  formData.append('category', selectCategories.value);

 await fetch('http://localhost:5678/api/works', {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + localStorage.user,
      },
      body:formData,
    })
    .then(res => {
      if(res.ok) {
        getWorks();
        resetForm();
        firstModal()
      } else if (res.status == "401") {
        alert('Session expirée, merci de vous reconnecter');
        document.location.href=("login.html"); 
      }
    })
}

// fonction pour reset le formulaire

function resetForm() {
  labelFile.style.padding = "30px 0 0"
  labelFile.innerHTML=`
  <img src="assets/icons/add_pic.svg" alt="">
  <div class="button_add_picture">+ Ajouter photo</div>
  <span class="format_picture">jpg, png: 4mo max</span>
  `
  input_file.value= "";
  inputTitle.value = "";
  selectCategories.value = "default";
  btnValidate.disabled= true;
  btnValidate.style.background = "#A7A7A7";
  btnValidate.style.cursor = "auto";
}

const logout = document.querySelector('.logout')
if (logout !== null)
logout.addEventListener("click", ()=> localStorage.removeItem('user'));