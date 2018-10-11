var SignInPage = {
  template: "#sign-in-page",
  data: function() {
    return {
      message: "Welcome to Vue.js!",
      user: "something"
    };
  },
  created: function() {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        console.log(user);
      } else {
        console.log("No one is logged in");
      }
    });
  },
  methods: {
    signOut: function() {
      firebase.auth().signOut().then(function() {
        console.log('Signed Out');
      }, function(error) {
        console.error('Sign Out Error', error);
      });
    }
  },
  computed: {}
};

var SignOutPage = {
  template: "#sign-out-page",
  data: function() {
    return {
      message: "Welcome to Vue.js!"
    };
  },
  created: function() {
    firebase.auth().signOut().then(function() {
      console.log('Signed Out');
      router.push("/products");
    }, function(error) {
      console.error('Sign Out Error', error);
    });
  },
  methods: {},
  computed: {}
};

var ProductsPage = {
  template: "#products-page",
  data: function() {
    return {
      products: ""
    };
  },
  created: function() {
    axios.get("/products").then(function(response) {
      this.products = response.data;
    }.bind(this));
  },
  methods: {
    signOut: function() {
      firebase.auth().signOut().then(function() {
        console.log('Signed Out');
      }, function(error) {
        console.error('Sign Out Error', error);
      });
    }
  },
  computed: {}
};

var ProductsCreatePage = {
  template: "#products-create-page",
  data: function() {
    return {
      something: "words",
      name: "",
      description: "",
      uploadProgress: "",
      price: "",
      errors: ""
    };
  },
  created: function() {
    var storageRef = firebase.storage();
  },
  methods: {

    readURL: function() { //this function will upload a picture, and provide a download link to be used later
      console.log('Starting function');
      var pictureFile = document.getElementById("productPicture").files[0];
      //contact the firebase storage server
      var ref = firebase.storage().ref();
      var upload = ref.child(pictureFile.name).put(pictureFile);

      //provides information on upload progress (usefull for really big picture files)
      upload.on('state_changed', function(snapshot) {
        //this is used to display the upload progress of the image
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
        case firebase.storage.TaskState.PAUSED: // or 'paused'
          console.log('Upload is paused');
          break;
        case firebase.storage.TaskState.RUNNING: // or 'running'
          // console.log('Upload is running');
          break;
        }
      });

      //this gets the download URL from the snapshot, and then saves it in the database
      upload.then(function(snap) {
        var url = snap.ref.getDownloadURL().then(function(url) {
          //change the picture for the preview
          var previewPic = document.getElementById('previewPic');
          previewPic.src = url;
          //upload the download link to the database
          var params = {link: url};
          axios.post("/urls", params).then(function(response) {
            console.log(response.data.link);
          }.bind(this));
        });
      });













      // var storageRef = firebase.storage().ref().child(pictureFile.name);




      // storageRef.put(pictureFile).on('state_changed', function(snapshot) {
      //   //this is used to display the upload progress of the image
      //   var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      //   console.log('Upload is ' + progress + '% done');
      //   switch (snapshot.state) {
      //   case firebase.storage.TaskState.PAUSED: // or 'paused'
      //     console.log('Upload is paused');
      //     break;
      //   case firebase.storage.TaskState.RUNNING: // or 'running'
      //     // console.log('Upload is running');
      //     break;
      //   }
      // });
      // //must save the download URL outside of this little function
      // storageRef.getDownloadURL().then(function(downloadURL) {
        
      //   //create the url in the database
      //   var params = {link: downloadURL};
      //   axios.post("/urls", params).then(function(response) {
      //     //the link is stored as a URL item in the database
      //     this.picURL = response.data.link;
      //     //now changing the pic in the preview window so you know you picked the right one
      //     var previewPic = document.getElementById('previewPic');
      //     previewPic.src = this.picURL;
      //     console.log('Actual Pic Link: ' + this.picURL); //the one returned when url was saved
      //   });
      // }).then(function() {
      //   console.log('then');
      //   //retrieve the URL from the database since we are now outside of the Snapshot functions
      //   axios.get("/urls").then(function(response) {
      //     //set the link for us to access now
      //     this.picURL = response.data.link;
      //     console.log("Retrieved from database: " + this.picURL);
      //   }.bind(this));
      // });

    },
    createProduct: function() {
      axios.get("/urls").then(function(response) {
        var link = response.data.link;
        var params = {
          name: this.name,
          description: this.description,
          price: this.price,
          download_url: link
        };
        axios.post("/products", params).then(function(response) {
          response = response.data;
          console.log(response);
        }).catch(function(errors) { 
          this.errors = errors.response.data.errors;
          console.log(errors.response.data.errors);
        }.bind(this));
      }.bind(this));

    }
  },
  computed: {}
};

var router = new VueRouter({
  routes: [
           { path: "/signin", component: SignInPage }, 
           { path: "/signout", component: SignOutPage }, 
           { path: "/products", component: ProductsPage },
           { path: "/products-create", component: ProductsCreatePage }
           ],
  scrollBehavior: function(to, from, savedPosition) {
    return { x: 0, y: 0 };
  }
});

var app = new Vue({
  el: "#vue-app",
  router: router
});