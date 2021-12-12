var global_user = "";
$(document).ready(function () {
  const user = localStorage.getItem("sessionname");
  global_user = user;
  console.log(user);
  getnameforcurrentDrive();

  var usersRef = db.collection("users").doc(global_user);

  usersRef
    .get()
    .then((doc) => {
      if (doc.exists) {
        console.log(doc.data().name);
        console.log(doc.data().drives_assignned);
        getAllocatedDrives(doc.data().drives_assignned);
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    })
    .catch((error) => {
      console.log("Error getting document:", error);
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
firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();

function getAllocatedDrives(drives) {
  var lis = drives.split(",");
  lis.forEach(function (item) {
    getDriveDetaile(item);
  });
}

function getDriveDetaile(driveid) {
  document.getElementById("root").innerHTML = "";
  var driveRef = db
    .collection("drive" + "/" + driveid + "/" + "drive_details")
    .doc("details");
  driveRef
    .get()
    .then((doc) => {
      if (doc.exists) {
        console.log(doc.data().name);

        $("#root").append(
          ` <div class="max-w-sm rounded overflow-hidden shadow-lg">         <img           class="w-full"           src="https://www.mindmeister.com/blog/wp-content/uploads/2019/03/Document-Writing.png"           alt="Sunset in the mountains"         />         <div class="px-6 py-4">           <div class="font-bold text-xl mb-2">` +
            doc.data().name +
            `</div>           <p class="text-gray-700 text-base">             Lorem ipsum dolor sit amet, consectetur adipisicing elit.             Voluptatibus quia, nulla! Maiores et perferendis eaque,             exercitationem praesentium nihil.           </p>         </div>         <div class="px-6 pt-4 pb-2">           <span             class=" bg-blue-500
            hover:bg-blue-700
            text-white text-center
            py-2
            px-4
            rounded-full"      onClick = openDrive('` +
            driveid +
            `')       >Open</span           >         </div>       </div>`
        );
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    })
    .catch((error) => {
      console.log("Error getting document:", error);
    });
}

function openDrive(id) {
  //console.log("Opened:", id);
  localStorage.setItem("currDrive", id);
  window.location.replace("driveMain.html");
}

var new_drive_name = "drive-101";
function getnameforcurrentDrive() {
  var newname = "";
  var driveRef = db
    .collection("drive")
    .get()
    .then((querySnapshot) => {
      if (querySnapshot.size == 0) {
        new_drive_name = "drive-101";
      } else {
        querySnapshot.forEach((doc) => {
          newname = doc.id;
        });

        var serial = newname.split("-");
        var n1 = serial[0];
        var n2 = parseInt(serial[1]) + 1;
        n3 = n1 + "-" + n2;
        new_drive_name = n3;
      }
    })
    .catch((error) => {
      console.log("Error getting documents: ", error);
    });
}

const createNewDrive = async () => {
  await getnameforcurrentDrive();
  var name = new_drive_name;
  console.log("nn:", name);
  var ac_name = document.getElementById("drive_name").value;
  var u_name = "";
  var assigned_drives = "";
  var usersRef = db.collection("users").doc(global_user);

  usersRef
    .get()
    .then((doc) => {
      if (doc.exists) {
        u_name = doc.data().name;
        assigned_drives = doc.data().drives_assignned;
        addintodrivedetails();
        addintouser();
      } else {
        console.log("No such document!");
      }
    })
    .catch((error) => {
      console.log("Error getting document:", error);
    });

  function addintodrivedetails() {
    db.collection("drive")
      .doc(name)
      .set({
        created_on: new Date()
          .toLocaleString()
          .replace(/ /g, "")
          .replaceAll("/", "-")
          .replaceAll(",", "-"),
      });
    db.collection("drive" + "/" + name + "/" + "drive_details")
      .doc("details")
      .set({
        created_by: u_name,
        created_on: "",
        name: ac_name,
      })
      .then(() => {
        console.log("Document successfully written!");
      })
      .catch((error) => {
        console.error("Error writing document: ", error);
      });
  }
  function addintouser() {
    //adding new drive into user path
    if (assigned_drives.length != 0) {
      assigned_drives += "," + name;
    } else {
      assigned_drives = name;
    }

    console.log(assigned_drives);
    //uploading update data to user
    db.collection("users")
      .doc(global_user)
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

    getAllocatedDrives(assigned_drives);
  }
};

//signout
function Logout() {
  firebase
    .auth()
    .signOut()
    .then(() => {
      localStorage.setItem("sessionname", "");
      window.location.replace("../Login/Login.html");
    })
    .catch((error) => {
      console.log(error);
    });
}
