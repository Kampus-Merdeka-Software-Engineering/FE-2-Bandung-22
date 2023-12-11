// Deklarasikan variabel atau konstanta untuk menyimpan link API
const apiUrl = "https://be-2-bandung-22-production.up.railway.app";

// Kemudian, gunakan variabel ini dalam fetch atau permintaan API lainnya
async function fetchData() {
  try {
    const response = await fetch(`${apiUrl}/data`);
    const data = await response.json();
    // Lakukan sesuatu dengan data yang diterima
    console.log(data);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// Contoh penggunaan
fetchData();

let products = [];

// Fetch products data
async function fetchmenu() {
  try {
    const response = await fetch(`${apiUrl}/menu`);
    const data = await response.json();
    menu = data;
    addDataToHTML();
  } catch (error) {
    console.error("Error fetching products:", error);
  }
}

// Call the fetchProducts function
fetchmenu();

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
  if (menu.length > 0) {
    menu.forEach((menus) => {
      const newmenu = createProductElement(menus);
      foodMenuHTML.appendChild(newmenu);
    });
  }
}

// Function to create a product element
function createProductElement(menus) {
  const newmenu = document.createElement("div");
  newmenu.classList.add("food-items");
  newmenu.innerHTML = `
    <img src="${menus.image}" />
    <div class="details">
      <div class="details-sub">
        <h5>${menus.name}</h5>
        <h5 class="price">${menus.price}k</h5>
      </div>
      <p>${menus.description}</p>
      <button onclick="addCart(${menus.id})">Add to Cart</button>
    </div>
  `;
  return newmenu;
}

let wishList = [];

// Function to save wishlist to the database using POST
function saveWishlistToDatabasePOST() {
    const url = 'save_wishlist.php';
  
    fetch(`${apiUrl}/menu`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(wishList),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Wishlist saved to database:', data);
  
      // Update HTML after successfully saving to database
      // (you may want to customize this based on your application flow)
      if (data.status === 'success') {
        alert('Wishlist saved successfully!');
        // Additional actions or UI updates
      } else {
        alert('Error saving wishlist to the database.');
      }
    })
    .catch(error => console.error('Error saving wishlist:', error));
  }
  

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
function addCart(menusId) {
  const menusCopy = JSON.parse(JSON.stringify(menu));
  const existingmenus = wishList.find((menus) => menus.id === menusId);

  if (!existingmenus) {
    const datamenus = menusCopy.find((menus) => menus.id == menusId);

    if (datamenus) {
      datamenus.quantity = 1;
      wishList.push(datamenus);
    }
  } else {
    existingmenus.quantity++;
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
    wishList.forEach((menus) => {
      if (menus) {
        const newCart = document.createElement("div");
        newCart.classList.add("item");
        newCart.innerHTML = `
          <img src="${menus.image}" alt="${menus.name}" />
          <div class="content">
            <div class="name">${menus.name}</div>
            <div class="price">${menus.price * menus.quantity}</div>
            <div class="quantity">
              <button onclick="removeItem(${menus.id})" class="btn">-</button>
              <span class="value">${menus.quantity}</span>
              <button onclick="addItem(${menus.id})" class="btn">+</button>
              <button onclick="removeItemFromWishlist(${
                menus.id
              })" class="btn">&#128465;</button>
            </div>
          </div>
        `;
        wishListHTML.appendChild(newCart);
        totalQuantity += menus.quantity;
        totalPrice += menus.price * menus.quantity;
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
function removeItem(menusId) {
  const existingmenus = wishList.find((menus) => menus.id === menusId);
  if (existingmenus) {
    existingmenus.quantity--;

    if (existingmenus.quantity === 0) {
      // If quantity becomes zero, remove the item from the wishlist
      removeItemFromWishlist(menusId);
    } else {
      // Update cookie and HTML
      updateWishlist();
    }
  }
}

// Function to remove an item from the cart and wishlist
function removeItemFromWishlist(menusId) {
  const menusIndex = wishList.findIndex(
    (menus) => menus.id === menusId
  );
  if (menusIndex !== -1) {
    wishList.splice(menusIndex, 1);
    // Update cookie and HTML
    updateWishlist();
  }
}

// Function to add an item to the cart
function addItem(menusId) {
  const existingmenus = wishList.find((menus) => menus.id === menusId);
  if (existingmenus) {
    existingmenus.quantity++;

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
