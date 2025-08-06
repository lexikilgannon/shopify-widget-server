// Flag
window.CheckoutPlusLoaded = true;
console.log("✅ Checkout Plus script loaded");

// Your insurance variant
const insuranceVariantId = 44612488200364;

// Shared handler
async function addInsuranceThenCheckout() {
  try {
    const response = await fetch("/cart/add.js", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        items: [
          {
            id: insuranceVariantId,
            quantity: 1,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("❌ Failed to add insurance:", errorData);
      return;
    }

    const data = await response.json();
    console.log("✅ Insurance added to cart:", data);

    // ✅ Now that insurance is in cart, redirect
    window.location.href = "/checkout";
  } catch (err) {
    console.error("❌ Error adding insurance to cart:", err);
  }
}

function makePlusButton(className) {
  const btn = document.createElement("button");
  btn.id = "checkout-plus-button";
  btn.innerText = "Checkout Plus (with insurance)";
  if (className) btn.className = className;
  btn.style.marginBottom = "10px";
  btn.style.display = "block";
  btn.style.width = "100%";
  btn.onclick = addInsuranceThenCheckout;

  const fallbackLink = document.createElement("a");
  fallbackLink.href = "/checkout";
  fallbackLink.textContent = "Checkout without premium";
  fallbackLink.style.display = "block";
  fallbackLink.style.marginTop = "5px";
  fallbackLink.style.textAlign = "center";
  fallbackLink.style.fontSize = "14px";
  fallbackLink.style.color = "#666";
  fallbackLink.style.textDecoration = "underline";
  fallbackLink.style.cursor = "pointer";

  // Create a wrapper to control layout
  const wrapper = document.createElement("div");
  wrapper.style.display = "flex";
  wrapper.style.flexDirection = "column";
  wrapper.style.gap = "8px";
  wrapper.style.width = "100%";
  wrapper.appendChild(btn);
  wrapper.appendChild(fallbackLink);

  return wrapper;
}

/*
function makePlusButton(className) {
  const btn = document.createElement("button");
  btn.id = "checkout-plus-button";
  btn.innerText = "Checkout Plus (with insurance)";
  btn.style.display = "block";
  btn.style.width = "100%"; // optional but helps on narrow containers
  if (className) btn.className = className;
  btn.style.marginBottom = "10px";
  btn.onclick = addInsuranceThenCheckout;
  // Defer demotion logic slightly to wait for DOM render
  setTimeout(() => demoteDefaultCheckoutButton(btn), 50);
  demoteDefaultCheckoutButton(btn);

    // Create a wrapper to control layout
  const wrapper = document.createElement("div");
  wrapper.style.display = "flex";
  wrapper.style.flexDirection = "column";
  wrapper.style.gap = "8px";
  wrapper.style.width = "100%";
  wrapper.appendChild(btn);
  wrapper.appendChild(fallbackLink);

  return wrapper;
}

function demoteDefaultCheckoutButton(customButtonElement) {
  const originalCheckoutButton = document.querySelector("#CartDrawer-Checkout") || document.querySelector("#checkout");
  console.log("Demoting button... Found:", originalCheckoutButton);

  if (originalCheckoutButton) {
    originalCheckoutButton.style.display = "none";

    const fallbackLink = document.createElement("a");
    fallbackLink.href = "/checkout";
    fallbackLink.textContent = "Checkout without premium";
    fallbackLink.style.display = "block";
    fallbackLink.style.marginTop = "10px";
    fallbackLink.style.textAlign = "center";
    fallbackLink.style.fontSize = "14px";
    fallbackLink.style.color = "#666";
    fallbackLink.style.textDecoration = "underline";
    fallbackLink.style.cursor = "pointer";

    customButtonElement.insertAdjacentElement("afterend", fallbackLink);
  }
  
}*/

// --- Cart page injection (#checkout) ---
(function injectOnCartPage() {
  const checkoutButton = document.querySelector("#checkout");
  if (!checkoutButton) {
    console.log("ℹ️ Cart page checkout not found (this is fine if you're using the drawer).");
    return;
  }
  if (document.getElementById("checkout-plus-button")) return;
  const plusButton = makePlusButton(checkoutButton.className);
  checkoutButton.parentNode.insertBefore(plusButton, checkoutButton);
  console.log("✅ Injected Checkout Plus on cart page.");
})();

// --- Drawer injection (#CartDrawer-Checkout) ---
function injectIntoCartDrawer() {
  console.log("🔍 Attempting to inject into cart drawer...");

  const drawer = document.querySelector("cart-drawer, .cart-drawer, #CartDrawer");
  if (!drawer) {
    console.log("❌ Drawer element not found.");
    return;
  }

  const checkoutButton = drawer.querySelector("#CartDrawer-Checkout");
  if (!checkoutButton) {
    console.log("❌ Checkout button not found inside drawer.");
    console.log("👁 Drawer HTML preview:", drawer.innerHTML.slice(0, 300));
    return;
  }

  if (drawer.querySelector("#checkout-plus-button")) {
    console.log("🔁 Checkout Plus button already injected.");
    return;
  }

  console.log("✅ Injecting Checkout Plus in cart drawer...");

  const plusButton = makePlusButton(checkoutButton.className);
  checkoutButton.parentNode.insertBefore(plusButton, checkoutButton);

}


// Observe DOM changes so we can inject after the drawer renders/re-renders
const observer = new MutationObserver(() => {
  // Small delay lets the drawer finish hydrating
  setTimeout(injectIntoCartDrawer, 150);
});

observer.observe(document.body, { childList: true, subtree: true });

// Also try once after DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(injectIntoCartDrawer, 150);
});
