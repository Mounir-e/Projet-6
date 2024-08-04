async function login() {
  const emailLogin = document.getElementById("email").value;
  const passwordLogin = document.getElementById("password").value;

  const user = {
    email: emailLogin,
    password: passwordLogin,
  };

  await fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
    },
    body:JSON.stringify(user),
  })
    .then((res) =>{
      if(res.ok) {
        res.json()
      .then((data) => {
        const userdata = data.token;
        if (localStorage.user = userdata) 
        document.location.href=("edit.html"); 
        })} else {
          document.querySelector(".error").innerHTML = "Erreur dans l’identifiant ou le mot de passe";
        }
    });    
}

const btnForm = document.querySelector(".connexion");
btnForm.addEventListener("submit", (e) => {
  e.preventDefault();
  login();
});