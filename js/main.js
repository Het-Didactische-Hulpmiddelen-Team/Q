const queue = document.querySelector('#students');
$('#logout-button').css('display', 'none');
$('#enterQ-button').css('display', 'none');
let name = "";

db.collection('queue').orderBy('datetime').onSnapshot(snapshot => {
  let changes = snapshot.docChanges();
  changes.forEach(change => {
      if(change.type == 'added'){
          displayName(change.doc);
      } else if (change.type == 'removed'){
          let li = queue.querySelector('[data-id=' + change.doc.id + ']');
          queue.removeChild(li);
      }
  });
});

function displayName(doc) {
  let li = document.createElement('li');
  let span = document.createElement('span');

  li.setAttribute('data-id', doc.id); 
  li.className = 'list-group-item text-center';
  span.textContent = doc.data().name;

  li.appendChild(span);
  queue.appendChild(li);
}

function login(){
  let email = document.querySelector('#email').value.trim();
  let regex = new RegExp('\\w{3,}\\.\\w{3,}@(student\\.)?ucll\\.be');
  if(regex.test(email)){
    // get firstname and name from email
    let user = document.querySelector('#user');
    let splittedemail = email.split(".");
    let firstname = splittedemail[0];
    let lastname = splittedemail[1].split("@")[0];
    let span = document.createElement('span');
    name = firstname + " " + lastname;

    // show logged in user
    span.textContent = `Logged in as ${name}`;
    user.innerHTML = "";
    user.appendChild(span); 

    // close modal
    $("#modal-login").modal("toggle");

    // show logout button and enterQ button
    $('#logout-button').css('display', 'inline-block');
    $('#enterQ-button').css('display', 'inline-block');
    // hide login button
    $('#login-button').css('display', 'none');
  }
}
function logout(){
  $('#logout-button').css('display', 'none');
  $('#enterQ-button').css('display', 'none');
  $('#login-button').css('display', 'inline-block');
  document.querySelector('#user').innerHTML = "";
}

function enterQ(){
// TO DO CHECK IF ALREADY IN Q
// SHOW / MAKE LEAVE Q BUTTON

  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();
  var h = today.getHours();
  var min = today.getMinutes();
  var s = today.getSeconds();
  d = yyyy + '-' + mm + '-' + dd + " " + h+":"+min+":"+s;

  db.collection('queue').add({
    name: name,
    datetime: d
});
}