const navbarNav = document.querySelector(".navbar-nav");
const hamburger = document.querySelector("#hamburger-menu");
const shoppingCart = document.querySelector(".shopping-cart");
const shoppingCartButton = document.querySelector("#shopping-cart-button");

document.querySelector("#hamburger-menu").onclick = () => {
  navbarNav.classList.toggle("active");
};

document.addEventListener("click", function (e) {
  if (!hamburger.contains(e.target) && !navbarNav.contains(e.target)) {
    navbarNav.classList.remove("active");
  }

  if (
    !shoppingCartButton.contains(e.target) &&
    !shoppingCart.contains(e.target)
  ) {
    shoppingCart.classList.remove("active");
  }
});

document.querySelector("#shopping-cart-button").onclick = (e) => {
  shoppingCart.classList.toggle("active");
  e.preventDefault();
};

// Prevent closing shopping cart when clicking inside it
shoppingCart.addEventListener("click", function (e) {
  e.stopPropagation(); // Prevent the click event from reaching the document
});

const hm = document.getElementById("hm");
const sc = document.getElementById("sc");

document.addEventListener("click", function (e) {
  // Check if hm exists and e.target is not within the "hm" element and not within the "navbarNav" element
  if (
    hm &&
    !hm.contains(e.target) &&
    navbarNav &&
    !navbarNav.contains(e.target)
  ) {
    navbarNav.classList.remove("active");
  }

  // Check if sc exists and e.target is not within the "sc" element and not within the "shoppingCart" element
  if (
    sc &&
    !sc.contains(e.target) &&
    shoppingCart &&
    !shoppingCart.contains(e.target)
  ) {
    shoppingCart.classList.remove("active");
  }
});

// New functions for close and checkout buttons
function closeShoppingCart() {
  shoppingCart.classList.remove("active");
}

// function checkout() {
//   // Add your checkout logic here
//   alert("Checkout logic goes here!");
//   // You can redirect to a checkout page or perform other checkout actions
// }

function checkout() {
  // Using confirmation alert from SweetAlert2 with additional information
  Swal.fire({
    title: "Are you sure?",
    text: 'Click "Yes, Checkout!" to proceed to payment process.',
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, Checkout!",
    cancelButtonText: "Cancel",
  }).then((result) => {
    if (result.isConfirmed) {
      // Display additional information before the checkout logic
      Swal.fire({
        title: "Choose an option",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Dine-In",
        cancelButtonText: "Takeaway",
      }).then((optionResult) => {
        if (optionResult.isConfirmed) {
          // Logic for Dine-In
          Swal.fire("Dine-In selected", "", "success");
          // Redirect to Dine-In page
          window.location.href = "dinein.html";
        } else if (optionResult.dismiss === Swal.DismissReason.cancel) {
          // Logic for Takeaway
          Swal.fire("Takeaway selected", "", "success");
          // Redirect to Takeaway page
          window.location.href = "takeaway.html";
        }
      });
    } else {
      // Other actions if the user cancels
      Swal.fire("Checkout canceled", "", "info");
    }
  });
}

// Attach the checkout function to the button click event
document.getElementById("checkoutButton").addEventListener("click", checkout);

const wrapper = document.querySelector(".wrapper");
const carousel = document.querySelector(".carousel");
const firstCardWidth = carousel.querySelector(".card").offsetWidth;
const arrowBtns = document.querySelectorAll(".wrapper i");
const carouselChildrens = [...carousel.children];

let isDragging = false,
  isAutoPlay = true,
  startX,
  startScrollLeft,
  timeoutId;

// Get the number of cards that can fit in the carousel at once
let cardPerView = Math.round(carousel.offsetWidth / firstCardWidth);

// Insert copies of the last few cards to beginning of carousel for infinite scrolling
carouselChildrens
  .slice(-cardPerView)
  .reverse()
  .forEach((card) => {
    carousel.insertAdjacentHTML("afterbegin", card.outerHTML);
  });

// Insert copies of the first few cards to end of carousel for infinite scrolling
carouselChildrens.slice(0, cardPerView).forEach((card) => {
  carousel.insertAdjacentHTML("beforeend", card.outerHTML);
});

// Scroll the carousel at appropriate postition to hide first few duplicate cards on Firefox
carousel.classList.add("no-transition");
carousel.scrollLeft = carousel.offsetWidth;
carousel.classList.remove("no-transition");

// Add event listeners for the arrow buttons to scroll the carousel left and right
arrowBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    carousel.scrollLeft += btn.id == "left" ? -firstCardWidth : firstCardWidth;
  });
});

const dragStart = (e) => {
  isDragging = true;
  carousel.classList.add("dragging");
  // Records the initial cursor and scroll position of the carousel
  startX = e.pageX;
  startScrollLeft = carousel.scrollLeft;
};

const dragging = (e) => {
  if (!isDragging) return; // if isDragging is false return from here
  // Updates the scroll position of the carousel based on the cursor movement
  carousel.scrollLeft = startScrollLeft - (e.pageX - startX);
};

const dragStop = () => {
  isDragging = false;
  carousel.classList.remove("dragging");
};

const infiniteScroll = () => {
  // If the carousel is at the beginning, scroll to the end
  if (carousel.scrollLeft === 0) {
    carousel.classList.add("no-transition");
    carousel.scrollLeft = carousel.scrollWidth - 2 * carousel.offsetWidth;
    carousel.classList.remove("no-transition");
  }
  // If the carousel is at the end, scroll to the beginning
  else if (
    Math.ceil(carousel.scrollLeft) ===
    carousel.scrollWidth - carousel.offsetWidth
  ) {
    carousel.classList.add("no-transition");
    carousel.scrollLeft = carousel.offsetWidth;
    carousel.classList.remove("no-transition");
  }

  // Clear existing timeout & start autoplay if mouse is not hovering over carousel
  clearTimeout(timeoutId);
  if (!wrapper.matches(":hover")) autoPlay();
};

const autoPlay = () => {
  if (window.innerWidth < 800 || !isAutoPlay) return; // Return if window is smaller than 800 or isAutoPlay is false
  // Autoplay the carousel after every 2500 ms
  timeoutId = setTimeout(() => (carousel.scrollLeft += firstCardWidth), 1500);
};
autoPlay();

carousel.addEventListener("mousedown", dragStart);
carousel.addEventListener("mousemove", dragging);
document.addEventListener("mouseup", dragStop);
carousel.addEventListener("scroll", infiniteScroll);
wrapper.addEventListener("mouseenter", () => clearTimeout(timeoutId));
wrapper.addEventListener("mouseleave", autoPlay);
document.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname === "/index.html") {
    // fetchProducts();
  }
});
