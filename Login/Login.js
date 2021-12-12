$(document).ready(function () {
  console.log("ready!");
  hideload();

  $(".loginForm").submit(function (e) {
    e.preventDefault();
    loginHandler();
  });
});

const firebaseConfig = {
  apiKey: "AIzaSyDd6r94nAuytLFJJJQxNaxSLD8HPbpmYEw",
  authDomain: "gallery-test-a2c0b.firebaseapp.com",
  projectId: "gallery-test-a2c0b",
  storageBucket: "gallery-test-a2c0b.appspot.com",
  messagingSenderId: "524108794255",
  appId: "1:524108794255:web:a5f299429fbdb3925d23fa",
  measurementId: "${config.measurementId}",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
//const analytics = getAnalytics(app);

function loginHandler() {
  var email = document.getElementById("uname").value;
  var password = document.getElementById("pass").value;
  showload();
  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in
      var user = userCredential.user;
      hideload();
      console.log(user);
      // ...
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      hideload();
      console.log(errorCode, errorMessage);
    });
}

function showload() {
  document.getElementById("lg").style.visibility = "visible";
}

function hideload() {
  document.getElementById("lg").style.visibility = "hidden";
}

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    // User is signed in.
    alert(user.email);
    localStorage.setItem("sessionname", user.email);
    window.location.replace("../drive/index.html");
  } else {
  }
});
