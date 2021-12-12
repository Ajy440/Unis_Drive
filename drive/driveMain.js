var g_active_drive = "";
$(document).ready(function () {
  const active_drive = localStorage.getItem("currDrive");
  g_active_drive = active_drive;
  document.getElementById("drivenamep").innerHTML =
    "<h3><b>" + localStorage.getItem("currDriveName") + "</b></h3>";
  document.getElementById("uploadeAlert").style.visibility = "hidden";
  console.log(g_active_drive);
  getUserPermission();
  renderMedia();
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
firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();
var storage = firebase.storage().ref();

function uploadHandler() {
  document.getElementById("uploadeAlert").style.visibility = "visible";
  let media = document.getElementById("uploader").files[0];
  var fileName =
    "Image-" +
    new Date()
      .toLocaleString()
      .replace(/ /g, "")
      .replaceAll("/", "-")
      .replaceAll(",", "-");
  var imageRef = storage.child(g_active_drive + "/" + fileName);
  var uploadTask = imageRef.put(media);
  uploadTask.on(
    "state_changed",
    (snapshot) => {
      var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log("Upload is " + progress + "% done");
      document.getElementById("uploadProgress").style.width = progress + "%";
      switch (snapshot.state) {
        case firebase.storage.TaskState.PAUSED: // or 'paused'
          console.log("Upload is paused");
          break;
        case firebase.storage.TaskState.RUNNING: // or 'running'
          console.log("Upload is running");
          break;
      }
    },
    (error) => {
      console.log("Failed to upload file");
    },
    () => {
      uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
        console.log("File available at", downloadURL);
        document.getElementById("uploadeAlert").style.visibility = "hidden";
        addFileinfotodb(downloadURL, fileName);
      });
    }
  );
}

function addFileinfotodb(url, fileName) {
  var tempName = "media" + new Date().toLocaleString();
  var driveRef = db
    .collection("drive" + "/" + g_active_drive + "/" + "media")
    .doc(
      new Date()
        .toLocaleString()
        .replace(/ /g, "")
        .replaceAll("/", "-")
        .replaceAll(",", "-")
    )
    .set({
      name: fileName,
      url: url,
    })
    .then(() => {
      console.log("Document successfully written!");
      renderMedia();
    })
    .catch((error) => {
      console.error("Error writing document: ", error);
    });
}

function renderMedia() {
  //
  var driveRef = db
    .collection("drive" + "/" + g_active_drive + "/" + "media")
    .get()
    .then((querySnapshot) => {
      if (querySnapshot.size == 0) {
        document.getElementById("root").innerHTML = "";
        console.log("empty");
        $("#root").append(`<div
       class="col-span-5"
       id="nofiles"
       style="
         height: 95vh;
         background-image: url(../noimage.png);
         background-size: contain;
         background-repeat: no-repeat;
       "
     >`);
      } else {
        document.getElementById("root").innerHTML = "";
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          console.log(doc.id, " => ", doc.data().name);
          $("#root").append(
            ` <div class="max-w-sm rounded overflow-hidden shadow-lg">         <img           class="w-full"           src=` +
              doc.data().url +
              `           alt="Sunset in the mountains"         />         <div class="px-6 py-4">           <div class="font-bold text-xl mb-2">` +
              doc.data().name +
              `</div>      </div>         <div class="px-6 pt-4 pb-2">           <span             class="               inline-block               bg-gray-200               rounded-full               px-3               py-1               text-sm               font-semibold               text-gray-700               mr-2               mb-2             "             >#photography</span           >           <span             class="               inline-block               bg-gray-200               rounded-full               px-3               py-1               text-sm               font-semibold               text-gray-700               mr-2               mb-2             "             >#travel</span           > <a href="#" class="deleteBtn bg-red-500 hover:bg-red-700 text-white text-center py-2 px-4 rounded-full " onClick=deleteHandler('` +
              doc.id +
              `','` +
              doc.data().name +
              `')>
            Delete
          </a>   </div>       </div>`
          );
        });
        getUserPermission();
      }
    })
    .catch((error) => {
      console.log("Error getting documents: ", error);
    });
}

function deleteHandler(id, storageName) {
  console.log(storageName);
  var desertRef = storage.child(g_active_drive + "/" + storageName);

  //Delete the file
  desertRef
    .delete()
    .then(() => {
      console.log("Image deleted");
    })
    .catch((error) => {
      console.error(error);
    });

  //delete data
  db.collection("drive" + "/" + g_active_drive + "/" + "media")
    .doc(id)
    .delete()
    .then(() => {
      console.log("Document successfully deleted!");
      renderMedia();
    })
    .catch((error) => {
      console.error("Error removing document: ", error);
    });
}

function navigatetoDriveMenu() {
  window.location.replace("index.html");
}

//list of access
function loadaccesslist() {
  document.getElementById("accesslist").innerHTML = "";
  db.collection("drive" + "/" + g_active_drive + "/" + "users")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        $("#accesslist").append(
          "<p>" + doc.id + "=>" + doc.data().accessType + "</p>"
        );
      });
      getUserPermission();
    })
    .catch((error) => {
      console.log("Error getting documents: ", error);
    });
}

//access

function giveRightstoUser() {
  var username = document.getElementById("usertoaccess").value;
  var e = document.getElementById("access");
  var accessType = e.options[e.selectedIndex].text;
  const active_drive = localStorage.getItem("currDrive");
  console.log(username, accessType, active_drive);

  //change drive properties
  db.collection("drive" + "/" + active_drive + "/" + "users")
    .doc(username)
    .set({
      accessType: accessType,
    })
    .then(() => {
      console.log("Document successfully written!");
    })
    .catch((error) => {
      console.error("Error writing document: ", error);
    });

  //change user properties
  //var global_user = localStorage.getItem("sessionname");
  var usersRef = db.collection("users").doc(username);
  var assigned_drives = "";
  var u_name = "";

  usersRef
    .get()
    .then((doc) => {
      if (doc.exists) {
        u_name = doc.data().name;
        assigned_drives = doc.data().drives_assignned;
        addintouser();
      } else {
        console.log("No such document!");
      }
    })
    .catch((error) => {
      console.log("Error getting document:", error);
    });

  function addintouser() {
    //adding new drive into user path
    if (assigned_drives.length != 0) {
      assigned_drives += "," + g_active_drive;
    } else {
      assigned_drives = g_active_drive;
    }

    console.log(assigned_drives);
    //uploading update data to user
    db.collection("users")
      .doc(username)
      .set({
        name: u_name,
        drives_assignned: assigned_drives,
      })
      .then(() => {
        console.log("Document successfully written!");
      })
      .catch((error) => {
        console.error("Error writing document: ", error);
      });
  }
}

//restricting elements based on access
function getUserPermission() {
  db.collection("drive" + "/" + g_active_drive + "/" + "users")
    .doc(localStorage.getItem("sessionname"))
    .get()
    .then((doc) => {
      if (doc.exists) {
        console.log("Document data:", doc.data().accessType);
        if (doc.data().accessType == "Read") {
          revokeModifications("Read");
        } else if (doc.data().accessType == "Read_Upload") {
          revokeModifications("Read_Upload");
        }
      } else {
        // doc.data() will be undefined in this case
        // console.log("No such document!");
      }
    })
    .catch((error) => {
      console.log("Error getting document:", error);
    });
}

//revoking
function revokeModifications(type) {
  if (type === "Read") {
    document.getElementById("modal-toggle").style.visibility = "hidden";
    document.getElementById("modal-toggle").remove();
    document.getElementById("uploader").style.visibility = "hidden";
    document.getElementById("uploader").remove();
    var items = document.getElementsByClassName("deleteBtn");
    for (var i = 0; i < items.length; i++) {
      items[i].style.visibility = "hidden";
      items[i].remove();
    }
  } else if (type === "Read_Upload") {
    document.getElementById("modal-toggle").style.visibility = "hidden";
    document.getElementById("modal-toggle").remove();
    document.getElementsByClassName("deleteBtn").style.visibility = "hidden";
    document.getElementsByClassName("deleteBtn").remove();
    var items = document.getElementsByClassName("deleteBtn");
    for (var i = 0; i < items.length; i++) {
      items[i].style.visibility = "hidden";
      items[i].remove();
    }
  }
}
