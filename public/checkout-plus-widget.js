// Flag
window.CheckoutPlusLoaded = true;
console.log("✅ Checkout Plus script loaded");

// Your insurance variant
const insuranceVariantId = 44612488200364;

// Shared handler
async function addInsuranceThenCheckout() {
  await fetch("/cart/add.js", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ id: insuranceVariantId, quantity: 1 }),
  });
  window.location.href = "/checkout";
}

function makePlusButton(className) {
  const btn = document.createElement("button");
  btn.id = "checkout-plus-button";
  btn.innerText = "Checkout Plus (with insurance)";
  if (className) btn.className = className;
  btn.style.marginBottom = "10px";
  btn.onclick = addInsuranceThenCheckout;
  return btn;
}

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
  const drawer = document.querySelector("cart-drawer, .cart-drawer, #CartDrawer");
  if (!drawer) return;

  const checkoutButton = drawer.querySelector("#CartDrawer-Checkout");
  if (!checkoutButton) {
    // Drawer might still be hydrating; observer will try again.
    return;
  }
  if (drawer.querySelector("#checkout-plus-button")) return;

  const plusButton = makePlusButton(checkoutButton.className);
  checkoutButton.parentNode.insertBefore(plusButton, checkoutButton);
  console.log("✅ Injected Checkout Plus in cart drawer.");
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
