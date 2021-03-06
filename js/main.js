showLoginButton();
hideLogoutButton();
hideEnterQButton();
hideLeaveQButton();

const queue = document.querySelector('#students');
let name = "";
let names = [];

// SHOW Q WITH REALTIME UPDATES
db.collection('queue').orderBy('datetime').onSnapshot(snapshot => {
  let changes = snapshot.docChanges();
  changes.forEach(change => {
      if(change.type == 'added'){
          displayName(change.doc);
          showCrosses();
      } else if (change.type == 'removed'){
          let li = document.querySelector('[data-id=' + change.doc.id + ']');
          queue.removeChild(li);
          removeA(names, change.doc.data().name);
      }
  });
});

function displayName(doc) {
  let li = document.createElement('li');
  let span = document.createElement('span');

  li.setAttribute('data-id', doc.id); 
  li.className = 'list-group-item text-center';
  span.textContent = doc.data().name;
  names.push(doc.data().name);

  // CROSS TO DELETE THE RECORD FROM Q FOR ADMIN
  var d = document.createElement('div');
  d.className = "cross";
  d.innerHTML = "&times;";
  d.addEventListener('click', e => {
    e.preventDefault();
    deleteFromQ(doc.id);
  });
  li.appendChild(d);
  li.appendChild(span);
  queue.appendChild(li);
}

function login(){
  let email = document.querySelector('#email').value.trim();
  let regex = new RegExp('\\w{2,}\\.\\w{2,}@(student\\.)?ucll\\.be');
  if(regex.test(email)){
    // get firstname and name from email
    let user = document.querySelector('#user');
    let splittedemail = email.split(".");
    let firstname = splittedemail[0];
    let lastname = splittedemail[1].split("@")[0];
    let span = document.createElement('span');
    name = firstname + " " + lastname;

    // show logged in user
    span.innerHTML = `Logged in as <strong>${name}</strong>`;
    user.innerHTML = "";
    user.appendChild(span); 

    // close modal
    document.querySelector("#close-modal").click();

    names.includes(name) ? showLeaveQButton() : showEnterQButton();

    showCrosses();
    showLogoutButton();
    hideLoginButton();
  }
}
function logout(){
  hideCrosses();
  hideLogoutButton();
  hideEnterQButton();
  hideLeaveQButton();
  showLoginButton();
  document.querySelector('#user').innerHTML = "";
  name = "";
}

function enterQ(){
  // DO NOTHING WHEN ALREADY IN Q
  let inQ = checkIfInQ()
  if (inQ) return;

  // ADD TO Q HAPPY PATH
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

  showLeaveQButton();
  hideEnterQButton();
}

function checkIfInQ(){
  return names.includes(name);
}

function leaveQ(){
  db.collection('queue').where("name", "==", name).get()
  .then(e => e.forEach(doc => deleteFromQ(doc.id)))
  .catch(e => console.log("An error occured: " + e));
  
  showEnterQButton();
  hideLeaveQButton();
}

function deleteFromQ(docid){
  db.collection('queue').doc(docid).delete().then( 
    _ => console.log("Document successfully deleted!"))
    .catch( err => console.error("Error removing document: ", err));
}
function isAuthorizedUser(){
  // DUMMY AUTHORIZATION
  var res = name.toLowerCase() == "frederik vogels" || name.toLowerCase() == "fréderik vogels";
  console.log(res);
  return res;
}

// BUTTONS
function showLoginButton(){
  $('#login-button').css('display', 'inline-block');
}
function hideLoginButton(){
  $('#login-button').css('display', 'none');
}
function showLogoutButton(){
  $('#logout-button').css('display', 'inline-block');
}
function hideLogoutButton(){
  $('#logout-button').css('display', 'none');
}
function showEnterQButton(){
  $('#enterQ-button').css('display', 'inline-block');
}
function hideEnterQButton(){
  $('#enterQ-button').css('display', 'none');
}
function showLeaveQButton(){
  $('#leaveQ-button').css('display', 'inline-block');
}
function hideLeaveQButton(){
  $('#leaveQ-button').css('display', 'none');
}
function showCrosses(){
  if (isAuthorizedUser()){
    var r = document.getElementsByClassName("cross");
    for(i = 0; i < r.length; i++){
      r[i].style.display = "block";
    }
  }
}
function hideCrosses(){
  var r = document.getElementsByClassName("cross");
  for(i = 0; i < r.length; i++){
    r[i].style.display = "none";
  }
}


function removeA(arr) {
  var what, a = arguments, L = a.length, ax;
  while (L > 1 && arr.length) {
      what = a[--L];
      while ((ax= arr.indexOf(what)) !== -1) {
          arr.splice(ax, 1);
      }
  }
  return arr;
}
