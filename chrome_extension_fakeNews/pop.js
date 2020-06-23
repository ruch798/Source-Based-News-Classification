var firebaseConfig = {
  apiKey: "AIzaSyBEVfeRaHTbzsRYouJPWMsPtWHkTfTvWh0",
  authDomain: "extension-67.firebaseapp.com",
  databaseURL: "https://extension-67.firebaseio.com",
  projectId: "extension-67",
  storageBucket: "extension-67.appspot.com",
  messagingSenderId: "645693015780",
  appId: "1:645693015780:web:c2babebc71af59e6bf4ef1",
  measurementId: "G-4DF4D752YQ",
};
firebase.initializeApp(firebaseConfig);
firebase.analytics();

var db = firebase.firestore();

function isUserSignedIn() {
  return !!firebase.auth().currentUser;
}
function authStateObserver(user) {
  if (user) {
    $("#signin").hide();
    $("#checkPage").removeClass("hide");

    var fetchedURL = "URL_VALUE";
    var x;
    //fetches current url
    chrome.tabs.query(
      { active: true, windowId: chrome.windows.WINDOW_ID_CURRENT },
      function (tabs) {
          var exists=0;
        fetchedURL = tabs[0].url;
        $("#msg").text(tabs[0].url);
        console.log(fetchedURL);
        var fetchValue = db.collection("urls").where("url", "==", fetchedURL);
        fetchValue
          .get()
          .then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
              article = doc.data();
              // console.log(doc.id, " => ", doc.data());
              if (doc.exists) {
                //$("#msg2").text("URL exists");
                exists=1;
              }
            });
            if(exists==1){
                $("#msg2").text(article.type);
                 // console.log(article.type);
                // for (var prop in article) {
                //   console.log(Object.values(article));
                //  }
              }
              else{
                $("#msg2").text("URL has not been classified.");
              }
          })
          .catch(function (error) {
            console.log("Error getting documents: ", error);
          });
         
      }
    );
  } else {
    $("#msg2").text("Login to detect fake news!");
  }
}

function initFirebaseAuth() {
  // Listen to auth state changes.
  firebase.auth().onAuthStateChanged(authStateObserver);
}

function getUserName() {
  return firebase.auth().currentUser.displayName;
}
function getEmailId() {
  return firebase.auth().currentUser.email;
}

document.addEventListener(
  "DOMContentLoaded",
  function () {
    var checkPageButton = document.getElementById("detect");

    initFirebaseAuth();

    if (isUserSignedIn()) {
      user = firebase.auth().currentUser.displayName;
      alert(user + ", welcome! Now you can proceed!");
    }

    checkPageButton.addEventListener("click", function () {}, false);
  },
  false
);

document.addEventListener("DOMContentLoaded", function () {
  var checkPageButton = document.getElementById("signin");
  checkPageButton.addEventListener("click", function () {
    var provider = new firebase.auth.GoogleAuthProvider();

    firebase
      .auth()
      .signInWithPopup(provider)
      .then(function (result) {
       
        var token = result.credential.accessToken;
        var user = result.user;

        firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);

        alert("Hello " + user.displayName);

        // ...
      })
      .catch(function (error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        alert(errorCode);
        alert(errorMessage);
        var email = error.email;
        var credential = error.credential;
        // ...
      });
  });
});
