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
      name: "",
      description: "",
      uploadProgress: "",
      price: "",
      category: "",
      errors: []
    };
  },
  created: function() {
    //makes sure that there are no other picture urls in the system. So we arent constantly storing them. No need
    axios.delete('/urls');
  },
  methods: {

    readURL: function() { //this function will upload a picture, and provide a download link to be used later
      var pictureFile = document.getElementById("productPicture").files[0];
      //contact the firebase storage server
      var ref = firebase.storage().ref();
      var upload = ref.child(pictureFile.name).put(pictureFile);

      //provides information on upload progress (usefull for really big picture files)
      upload.on('state_changed', function(snapshot) {
        //this is used to display the upload progress of the image
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        document.getElementById('picProgressBar').style.width = progress + "%";
        document.getElementById('picProgressBar').innerHTML = progress.toFixed(2) + "%";
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
    },
    createProduct: function() { //creates the product in the database
      //grabs the url for the picture that was stored in readURL above
      axios.get("/urls").then(function(response) {
        var link = response.data.link;
        //create params
        var params = {
          name: this.name,
          description: this.description,
          price: this.price,
          category: parseInt(this.category, 10),
          download_url: link
        };
        //create the 'product' in the database
        axios.post("/products", params).then(function(response) {
          response = response.data;
          //remove the URL instance from the database
          axios.delete('/urls');
          router.push("/products");
          //catches errors
        }).catch(function(errors) { 
          // The product was not created, but the picture is still stored in Firebase, so I should come back to this at some point
          this.errors.push("Product Not Created");
          this.errors = errors.response.data.errors;
          console.log(errors.response.data.errors);
        }.bind(this));
      }.bind(this)).catch(function(errors) {
        //did not have an error that was raised to correctly say that the link was missing, so I mad my own
        var error = "No photo detected";
        this.errors.push(error);
      }.bind(this));

    }
  },
  computed: {
  }
};

var ProductShowPage = {
  template: "#product-show-page",
  data: function() {
    return {
      message: "Welcome to Product Show!",
      productId: parseInt(this.$route.params.id, 10) //parseInt() turns the '12' that is returned by the route.id into an integer
    };
  },
  created: function() {
  },
  methods: {
    addToCart: function() {
      //create the initial params outside of the firebase function, otherwise you cant access the returned data from Vue.js
      var params = {product_id: this.productId, amount: 1};
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {  //if logged in
          var uid = user.uid;
          var cartParams = {uid: user.uid};
          //use the uid to find your cart
          axios.post("/carts", cartParams).then(function(response) {
            params['cart_id'] = response.data.id;
            // creates the carted_product
            axios.post('/carted_products', params).then(function(response) {
              // console.log("Added To Cart");
            }).catch(function(errors) { //if a cartedProduct already exists, then the page will just update the product
              // console.log("CartedProduct Already Exists");
              //this is the update function
              axios.patch('/carted_products/' + params['product_id'], params).then(function(response) {
                // console.log("Updated CartedProduct");
              }).catch(function(errors) {
                // prints any errors to console
                // console.log(errors.response.data.error);
              });
            });
          }.bind(this));
        } else { //redirect to the signin page if you are not already logged in
          console.log("No one is logged in");
          router.push("/signin");
        }
      }.bind(this));
    }
  },
  computed: {}
};

var CartPage = {
  template: "#cart-page",
  data: function() {
    return {
    };
  },
  created: function() {
    //when the page loads, checks to see if they have a cart
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {  //if logged in, create a user
        var uid = user.uid;
        var params = {uid: user.uid};
        //the database will check first to make sure a cart doesnt exist yet
        axios.post("/carts", params).then(function(response) {
          console.log(response.data);
          router.push("/carts/" + uid);
        }.bind(this));
      } else {
        console.log("No one is logged in");
        router.push("/signin");
      }
    });
  },
  methods: {  },
  computed: {}
};

var CartsPage = {
  template: "#carts-page",
  data: function() {
    return {
      message: "Welcome to Your Cart!",
      cart: [],
      uid: this.$route.params.id
    }; 
  },
  created: function() {
    axios.get("/carts/" + this.uid).then(function(response) {
      this.cart = response.data.carted_products;

    }.bind(this));
  },
  methods: {
    removeFromCart: function(amount, id) {
      var params = {amount: amount};
      axios.patch("/carted_products/" + id, params).then(function(response) {
        // console.log(response.data);
        location.reload();
      }).catch(function(errors) {
        errors = errors.response.data.error;
        console.log(errors);
      }.bind(this));

      console.log("amount: " + amount);
      console.log("id: " + id);
    },
    changeCartedAmount: function(product) {
      // set the values to update, and get the Id of the product
      var id = product.id;
      var params = {amount: document.getElementById('cartedProduct' + id).value};
      // update the carted product, if the amount is 0, it will be deleted
      axios.patch("/carted_products/" + id, params).then(function(response) {
        response = response.data;
        console.log(response);
        location.reload();
      }).catch(function(errors) { //sends out the errors if there are errors
        errors = errors.response.data.error;
        console.log(errors);
      }.bind(this));
      console.log(params);
    }
  },
  computed: {}
};

var ProductSearchPage = {
  template: "#product-search-page",
  data: function() {
    return {
    };
  },
  created: function() {
  },
  methods: {  },
  computed: {}
};

var HomePage = {
  template: "#home-page",
  data: function() {
    return {
      message: 'Welcome to the Home page',
      products: [],
      featuredProducts: []
    };
  },
  created: function() {
    axios.get("/products").then(function(response) {
      this.products = response.data;
      for (var i = 0; i <= 2; i++) {
        this.featuredProducts.push(this.products[i]);
      }
    }.bind(this));
  },
  methods: {
    shiftProductsRight: function() {
      var rightFeatured = this.featuredProducts[2] ;
      var indexAtProducts = this.products.indexOf(rightFeatured);
      var endOfProducts = this.products.length - 1;
      // find if at the end of the list
      if (indexAtProducts !== endOfProducts) {
        // This removes all featuredProducts, and the replaces them with the next ones
        this.featuredProducts.pop();
        this.featuredProducts.pop();
        this.featuredProducts.pop();
        this.featuredProducts.push(this.products[indexAtProducts - 1]);
        this.featuredProducts.push(this.products[indexAtProducts]);
        this.featuredProducts.push(this.products[indexAtProducts + 1]);
        console.log('Not at the end yet');
      }
    },
    shiftProductsLeft: function() {
      var leftFeatured = this.featuredProducts[0] ;
      var indexAtProducts = this.products.indexOf(leftFeatured);
      var startOfProducts = 0;
      // find if at the end of the list
      if (indexAtProducts !== startOfProducts) {
        // removes the old, and then populates with the next ones
        this.featuredProducts.pop();
        this.featuredProducts.pop();
        this.featuredProducts.pop();
        this.featuredProducts.push(this.products[indexAtProducts - 1]);
        this.featuredProducts.push(this.products[indexAtProducts]);
        this.featuredProducts.push(this.products[indexAtProducts + 1]);
      }
    }
  },
  computed: {
  }
};

var router = new VueRouter({
  routes: [
           { path: "/", component: HomePage }, 
           { path: "/signin", component: SignInPage }, 
           { path: "/signout", component: SignOutPage }, 
           { path: "/products", component: ProductsPage },
           { path: "/products/:id", component: ProductShowPage },
           { path: "/products/search", component: ProductSearchPage },
           { path: "/products-create", component: ProductsCreatePage },
           { path: "/cart", component: CartPage },
           { path: "/carts/:id", component: CartsPage }
           ],
  scrollBehavior: function(to, from, savedPosition) {
    return { x: 0, y: 0 };
  }
});

var app = new Vue({
  el: "#vue-app",
  router: router
});