var LogInPage = {
  template: "#log-in-page",
  data: function() {
    return {
      message: "Welcome to Vue.js!",
      user: "something",
      email: "",
      signUpEmail: "",
      name: "",
      password: "",
      signUpPassword: "",
      passwordConfirmation: "",
      errors: []
    };
  },
  created: function() {
  },
  methods: {
    login: function() {
      var params = {
        auth: { email: this.email, password: this.password }
      };
      axios
        .post("/user_token", params)
        .then(function(response) {
          axios.defaults.headers.common["Authorization"] =
            "Bearer " + response.data.jwt;
          localStorage.setItem("jwt", response.data.jwt);
          router.push("/products");
        })
        .catch(
          function(error) {
            this.errors = ["Invalid email or password."];
            this.email = "";
            this.password = "";
          }.bind(this)
        );
    },
    signUp: function() {
      var params = {
        name: this.name,
        email: this.signUpEmail,
        password: this.signUpPassword,
        password_confirmation: this.passwordConfirmation
      };
      axios
        .post("/users", params)
        .then(function(response) {
          console.log(response.data);
          var newParams = {user_id: response.data.id};
          axios.post('/carts', newParams).then(function(response) {
            location.reload();
          }).catch(function(errors) {
            this.errors = errors.response.data.error;
            console.log(this.errors);
          });
        })
        .catch(
          function(error) {
            this.errors = error.response.data.errors;
          }.bind(this)
        );
    }
  },
  computed: {}
};

var LogOutPage = {
  created: function() {
    axios.defaults.headers.common["Authorization"] = undefined;
    localStorage.removeItem("jwt");
    router.push("/products");
  }
};

var ProductsPage = {
  template: "#products-page",
  data: function() {
    return {
      allProducts: [],
      sortedProducts: []
    };
  },
  created: function() {
    axios.get("/products").then(function(response) {
      this.allProducts = response.data;
      this.sortedProducts = this.allProducts;
    }.bind(this));
  },
  methods: {
    showAll: function() {
      this.sortedProducts = this.allProducts;
    },
    sortNecklaces: function() {
      this.clearSorted();
      var x = this.allProducts;
      for (var i = 0; i < x.length; i++) {
        if (x[i].category === "Necklace" ) {
          this.sortedProducts.push(x[i]);
        }
      }
    },
    sortBracelets: function() {
      this.clearSorted();
      var x = this.allProducts;
      for (var i = 0; i < x.length; i++) {
        if (x[i].category === "Bracelet" ) {
          this.sortedProducts.push(x[i]);
        }
      }
    },
    sortEarrings: function() {
      this.clearSorted();
      var x = this.allProducts;
      for (var i = 0; i < x.length; i++) {
        if (x[i].category === "Earring" ) {
          this.sortedProducts.push(x[i]);
        }
      }
    },
    sortRings: function() {
      this.clearSorted();
      var x = this.allProducts;
      for (var i = 0; i < x.length; i++) {
        if (x[i].category === "Ring" ) {
          this.sortedProducts.push(x[i]);
        }
      }
    },
    clearSorted: function() {
      this.sortedProducts = [];
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
          category: parseInt(this.category, 10), //change the value from a string to an Integer
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

var ProductsUpdatePage = {
  template: "#products-update-page",
  data: function() {
    return {
      message: "Update Page",
      product: [],
      newName: "",
      newDescription: "",
      newCategory: "",
      newPrice: "",
      errors: []
    };
  },
  created: function() {
    axios.get("/products/" + this.$route.params.id).then(function(response) {
      console.log(response.data);
      this.product = response.data;

      this.setName(this.product.name);
      this.setDescription(this.product.description);
      this.setCategory(this.product.category); //category is set, but the radio is not changed
      this.setPrice(this.product.price);



    }.bind(this)).catch(function(errors) {
      this.errors = errors.response.data.error;
    }.bind(this));
  },
  methods: {
    readURL: function() { //this function will upload a picture, and provide a download link to be used later
      var pictureFile = document.getElementById("productPicture").files[0];
      console.log(pictureFile);
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
    updateProduct: function() {
      var params = {
        name: this.name,
        description: this.description,
        category: this.category,
        price: this.price
      };
    },

    setName: function(name) {
      this.newName = name;
    },

    setDescription: function(description) {
      this.newDescription = description;
    },

    setCategory: function(category) {
      this.newCategory = category;
      console.log("Category: " + category);
      document.getElementById(category).checked = true;
    },

    setPrice: function(price) {
      this.newPrice = price;
    },
  },
  computed: {
  }
};

var ProductsShowPage = {
  template: "#products-show-page",
  data: function() {
    return {
      message: "Welcome to Product Show!",
      productId: parseInt(this.$route.params.id, 10), //parseInt() turns the '12' that is returned by the route.id into an integer
      product:[],
      errors: []
    };
  },
  created: function() {
    axios.get('/products/' + this.productId).then(function(response) {
      this.product = response.data;
    }.bind(this));
  },
  methods: {
    addToCart: function() {
      var params = {product_id: this.productId, amount: 1};
      axios.post('/carted_products', params).then(function(response) {
        console.log('Added To Cart');
        router.push('/products');
      }).catch(function(errors) {
        this.errors = errors.response.data.error;
        console.log(this.errors);
        router.push('/login');
      });
    }
  },
  computed: {}
};

var CartsPage = {
  template: "#carts-page",
  data: function() {
    return {
      message: "Welcome to Your Cart!",
      cart: {carted_products: {}},
      errors: []
    }; 
  },
  created: function() {
    axios.get("/carts/myCart").then(function(response) {
      this.cart = response.data;
      paypal.Button.render({
        env: 'sandbox', // sandbox | production
        client: {
          sandbox:    'AdQij7EboA4tscs1G4qs00ZITvyydfVhKUsdnAYTHAeIrxYFp-7sN9kixqu3QmiqpkPULSP5H9qMSNtW',
          production: '<insert production client id>'
        },
        commit: true,
        payment: function(data, actions) {
          return actions.payment.create({
            payment: {
              transactions: [
                {
                  amount: { total: response.data.total, currency: 'USD' }
                }
              ]
            }
          });
        },

        // onAuthorize() is called when the buyer approves the payment
        onAuthorize: function(data, actions) {

          // Make a call to the REST api to execute the payment
          return actions.payment.execute().then(function() {
            window.alert('Payment Complete!');
          });
        }
      }, '#paypal-button-container');
    }.bind(this)).catch(function(errors) {
      this.errors = errors.response.data.error;
      router.push('/login');
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
    },
    completePayment: function() {
      console.log('starting payment');
      var x = document.scripts.namedItem('pay-pal');
      console.log(x);
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
           { path: "/login", component: LogInPage }, 
           { path: "/logout", component: LogOutPage }, 
           { path: "/products", component: ProductsPage },
           { path: "/products/:id", component: ProductsShowPage },
           { path: "/products/:id/update", component: ProductsUpdatePage },
           { path: "/products/search", component: ProductSearchPage },
           { path: "/products-create", component: ProductsCreatePage },
           // { path: "/cart", component: CartPage },
           { path: "/carts", component: CartsPage }
           ],
  scrollBehavior: function(to, from, savedPosition) {
    return { x: 0, y: 0 };
  }
});

var app = new Vue({
  el: "#vue-app",
  router: router,
  created: function() {
    var jwt = localStorage.getItem("jwt");
    if (jwt) {
      axios.defaults.headers.common["Authorization"] = jwt;
    }
  }
});