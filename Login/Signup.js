$(document).ready(function () {
  console.log("ready!");

  $(".signupForm").submit(function (e) {
    e.preventDefault();
    singupHandler();
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

function singupHandler() {
  var email = document.getElementById("email").value;
  var password = document.getElementById("pass").value;
  var namex = document.getElementById("name").value;
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in
      var user = userCredential.user;
      console.log(user);

      //adding into db
      var db = firebase.firestore();
      db.collection("users")
        .doc(email)
        .set({
          drives_assignned: "",
          name: namex,
        })
        .then(() => {
          console.log("Document successfully written!");
          window.location.replace("Login.html");
        })
        .catch((error) => {
          console.error("Error writing document: ", error);
        });

      //end

      //
      // ...
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorMessage);
      // ..
    });
}
