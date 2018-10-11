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
      price: "",
      picURL: "",
      productPicture: []
    };
  },
  created: function() {
    var storageRef = firebase.storage();
  },
  methods: {
    signOut: function() {
      firebase.auth().signOut().then(function() {
        console.log('Signed Out');
        router.push("#");
      }, function(error) {
        console.error('Sign Out Error', error);
      });
    },
    readURL: function() {
      this.productPicture = document.getElementById("productPicture").files[0];
      console.log(this.productPicture.name);
      var storageRef = firebase.storage().ref(this.productPicture.name).put(this.productPicture);
      storageRef.on('state_changed', function(snapshot) {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded

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
      //must save the download URL here
      storageRef.snapshot.ref.getDownloadURL().then(function(downloadURL) {
          console.log(downloadURL);
          this.picURL = downloadURL;
          //create the url in the database
          var params = {link: this.picURL};
          axios.post("/urls", params).then(function(response) {
            console.log(response.data);
          });
        });
      axios.get("/urls").then(function(response) {
        this.picURL = response.data.link;
        console.log(this.picURL);
      }.bind(this));

    },


    createProduct: function() {
      console.log('click');
      


    //   var params = {
    //     name: this.name,
    //     description: this.description,
    //     price: this.price
    //   };
    //   axios.post("/products", params).then(function(response) {
    //     response = response.data;
    //     console.log(response);
    //   }.bind(this));
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