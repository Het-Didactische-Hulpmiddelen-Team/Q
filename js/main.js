const queue = document.querySelector('#students');

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

    // show logged in user
    span.textContent = `Logged in as ${firstname} ${lastname}`;
    user.innerHTML = "";
    user.appendChild(span); 

    // close modal
    $("#modal-login").modal("toggle");

    // show logout button
    $('#logout-button').css('display', 'inline-block');
    // hide login button
    $('#login-button').css('display', 'none');
  }
}
function logout(){
  $('#logout-button').css('display', 'none');
  $('#login-button').css('display', 'inline-block');
  $('#user').innerHTML = "";
}