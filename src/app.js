let products = [];

// Fetch products data
async function fetchProducts() {
  try {
    const response = await fetch("products.json");
    const data = await response.json();
    products = data;
    addDataToHTML();
  } catch (error) {
    console.error("Error fetching products:", error);
  }
}

// Call the fetchProducts function
fetchProducts();

// Function to add product data to HTML
function addDataToHTML() {
  const foodMenuHTML = document.querySelector(".food-menu");

  // Template for the menu heading
  const menuHeadingTemplate = `
    <div class="heading">
      <h1>&mdash; Menu &mdash;</h1>
      <h7>Explore all flavors of coffee with us. There is always a new cup worth experiencing.</h7>
    </div>
  `;

  foodMenuHTML.innerHTML = menuHeadingTemplate;

  // Check if products data is available
  if (products.length > 0) {
    products.forEach((product) => {
      const newProduct = createProductElement(product);
      foodMenuHTML.appendChild(newProduct);
    });
  }
}

// Function to create a product element
function createProductElement(product) {
  const newProduct = document.createElement("div");
  newProduct.classList.add("food-items");
  newProduct.innerHTML = `
    <img src="${product.image}" />
    <div class="details">
      <div class="details-sub">
        <h5>${product.name}</h5>
        <h5 class="price">${product.price}k</h5>
      </div>
      <p>${product.description}</p>
      <button onclick="addCart(${product.id})">Add to Cart</button>
    </div>
  `;
  return newProduct;
}

let wishList = [];

// Function to get wishList from cookies
function checkCart() {
  const cookieValue = document.cookie
    .split("; ")
    .find((row) => row.startsWith("wishlist="));
  if (cookieValue) {
    wishList = JSON.parse(cookieValue.split("=")[1]);
  }
}

// Call checkCart function
checkCart();

// Function to add a product to the cart
function addCart(productId) {
  const productCopy = JSON.parse(JSON.stringify(products));
  const existingProduct = wishList.find((product) => product.id === productId);

  if (!existingProduct) {
    const dataProduct = productCopy.find((product) => product.id == productId);

    if (dataProduct) {
      dataProduct.quantity = 1;
      wishList.push(dataProduct);
    }
  } else {
    existingProduct.quantity++;
  }

  // Set cookie with updated wishList
  const expirationDate = new Date(
    "Thu, 31 Dec 2023 23:59:59 UTC"
  ).toUTCString();
  document.cookie = `wishlist=${JSON.stringify(
    wishList
  )}; expires=${expirationDate}; path=/`;

  // Update HTML
  addCartToHTML();
}

// Function to update the HTML with wishList items
function addCartToHTML() {
  const wishListHTML = document.querySelector(".wishlist");
  wishListHTML.innerHTML = "";

  let totalQuantity = 0;
  let totalPrice = 0;

  if (wishList.length === 0) {
    // If wishlist is empty, display a message
    wishListHTML.innerHTML = "<p>Your wishlist is empty.</p>";
  } else {
    wishList.forEach((product) => {
      if (product) {
        const newCart = document.createElement("div");
        newCart.classList.add("item");
        newCart.innerHTML = `
          <img src="${product.image}" alt="${product.name}" />
          <div class="content">
            <div class="name">${product.name}</div>
            <div class="price">${product.price * product.quantity}</div>
            <div class="quantity">
              <button onclick="removeItem(${product.id})" class="btn">-</button>
              <span class="value">${product.quantity}</span>
              <button onclick="addItem(${product.id})" class="btn">+</button>
              <button onclick="removeItemFromWishlist(${
                product.id
              })" class="btn">&#128465;</button>
            </div>
          </div>
        `;
        wishListHTML.appendChild(newCart);
        totalQuantity += product.quantity;
        totalPrice += product.price * product.quantity;
      }
    });
  }

  // Update total quantity and total price in the HTML
  const totalHTML = document.querySelector(".totalQuantity");
  totalHTML.textContent = totalQuantity;

  const totalPriceHTML = document.querySelector(".totalPrice");
  totalPriceHTML.textContent = `${totalPrice}`;
}

// Function to remove one quantity of an item from the wishlist
function removeItem(productId) {
  const existingProduct = wishList.find((product) => product.id === productId);
  if (existingProduct) {
    existingProduct.quantity--;

    if (existingProduct.quantity === 0) {
      // If quantity becomes zero, remove the item from the wishlist
      removeItemFromWishlist(productId);
    } else {
      // Update cookie and HTML
      updateWishlist();
    }
  }
}

// Function to remove an item from the cart and wishlist
function removeItemFromWishlist(productId) {
  const productIndex = wishList.findIndex(
    (product) => product.id === productId
  );
  if (productIndex !== -1) {
    wishList.splice(productIndex, 1);
    // Update cookie and HTML
    updateWishlist();
  }
}

// Function to add an item to the cart
function addItem(productId) {
  const existingProduct = wishList.find((product) => product.id === productId);
  if (existingProduct) {
    existingProduct.quantity++;

    // Update cookie and HTML
    updateWishlist();
  }
}

// Function to update wishlist in the cookie and HTML
function updateWishlist() {
  const expirationDate = new Date(
    "Thu, 31 Dec 2023 23:59:59 UTC"
  ).toUTCString();
  document.cookie = `wishlist=${JSON.stringify(
    wishList
  )}; expires=${expirationDate}; path=/`;
  addCartToHTML();
}

// Initial call to update HTML
addCartToHTML();
