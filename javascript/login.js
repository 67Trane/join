let BASE_URL = "https://join-318-default-rtdb.europe-west1.firebasedatabase.app/accounts.json" 



function logInAsGuest(){
  window.location.href='./documents/summary.html';
}

function loadSignUp(){
  document.getElementById('log-in').classList.add('d-none');
  document.getElementById('sign-up').classList.remove('d-none');
  renderSignUpHTML();

}

function BackToLogIn(){
  document.getElementById('sign-up').classList.add('d-none');
  document.getElementById('log-in').classList.remove('d-none');
}

function addNewUser(event) {
  event.preventDefault();
  let newName = document.getElementById('new-name').value;
  let newEmail = document.getElementById('new-email').value;
  let newPassword = document.getElementById('new-password').value;
  let checkNewPassword = document.getElementById('check-new-password').value;  
  changeToJSON(newName, newEmail, newPassword, checkNewPassword);
}

function changeToJSON(newName, newEmail, newPassword, checkNewPassword){
 /* if (newPassword == checkNewPassword) {*/
    newAccount = { name: newName, email: newEmail, password: newPassword}    
/*  }else{
    alert('Passwörter stimmen nicht überein')
  }*/
  postNewAccount(newName, newEmail, newPassword);
  console.log(newAccount);
}

function postNewAccount(newName, newEmail, newPassword) {
  fetch(
    BASE_URL,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({name: `${newName}`, email: `${newEmail}`, password: `${newPassword}`}),
    }
  );
  renderSuccessfully();
  setTimeout(() => {
    window.location.href='./index.html';
}, 2000);
}

function renderSuccessfully(){
  document.getElementById('successfully').classList.remove('d-none');
  document.getElementById('successfully').classList.add('sign-up-overlay');
  return document.getElementById('successfully').innerHTML += `
  <div id="sign-up-overlay" class="success-overlay"></div>
  <div class="success-box">You Signed Up successfully</div>
  `;
  
}

/*window.addEventListener('load', function() {
  const logoOverlay = document.getElementById('logo-overlay');
  const loginSection = document.getElementById('log-in');

  setTimeout(() => {
      logoOverlay.classList.add('hidden'); // Füge die Klasse für die Animation hinzu
      loginSection.classList.remove('hidden');
      loginSection.classList.add('visible');
  }, 1000); // 1 Sekunde Verzögerung vor der Animation

  setTimeout(() => {
      logoOverlay.style.display = 'none'; // Logo nach der Animation komplett entfernen
  }, 2000); // 2 Sekunden warten (1 Sekunde Animation + 1 Sekunde Verzögerung)
});*/

function renderSignUpHTML(){
  return document.getElementById('sign-up').innerHTML = `
  <img class="log-in-join-logo" src="/assets/img/join-icon.svg" alt="">
  <div class="log-in-container">
    <div class="sign-in-title-container">
      <img onclick="BackToLogIn()" class="sign-up-arrow" src="/assets/img/arrow-left-line.svg" alt="">
      <h2>Sign up</h2>
    </div>
    <div class="border-bottom-log-in"></div>
    <form onsubmit="addNewUser(event)">
      <input id="new-name" class="input-field name-input" type="text" required placeholder="Name">
      <input id="new-email" class="input-field email-input" type="email" required placeholder="Email">
      <input id="new-password" class="input-field password-input" type="password" required placeholder="Password">
      <input id="check-new-password" class="input-field password-input" type="password" required placeholder="Confirm Password">

      <div class="check-box-container">
        <input type="checkbox" required id="accept-box">
        <label for="checkbox">I accept the</label><a href="">Privacy policy</a>
      </div>
      <button class="button log-in-button">Sign up</button>
  </div>
  </form>
  <div class="log-in-link-container">
    <a href="">Privacy Policy</a>
    <a href="">Legal notice</a>
  </div>
  <div id="successfully" class="d-none"></div>`;
}

