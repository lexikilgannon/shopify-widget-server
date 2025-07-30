window.CheckoutPlusLoaded = true;
console.log("✅ Checkout Plus script loaded");

const insuranceVariantId = 44612488200364;

const checkoutButton = document.querySelector("#checkout");

if (!checkoutButton) {
  console.log("❌ Checkout button not found");
} else {
  console.log("✅ Checkout button found");

  const plusButton = document.createElement("button");
  plusButton.innerText = "Checkout Plus (with insurance)";
  plusButton.style.backgroundColor = "#222";
  plusButton.style.color = "white";
  plusButton.style.border = "none";
  plusButton.style.padding = "12px";
  plusButton.style.marginBottom = "10px";
  plusButton.style.width = "100%";
  plusButton.style.fontWeight = "bold";
  plusButton.style.cursor = "pointer";

  plusButton.onclick = async () => {
    console.log("🛒 Adding insurance to cart...");

    await fetch("/cart/add.js", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        id: insuranceVariantId,
        quantity: 1,
      }),
    });

    window.location.href = "/checkout";
  };

  checkoutButton.parentNode.insertBefore(plusButton, checkoutButton);
}

// 🔽 Drawer logic moved OUTSIDE the if/else blocks
function injectIntoCartDrawer() {
  const drawer = document.querySelector("cart-drawer, .cart-drawer, #CartDrawer");
  if (!drawer) return;

  const checkoutButton = drawer.querySelector("#CartDrawer-Checkout");
  if (!checkoutButton) {
    console.log("❌ Cart drawer checkout button not found");
    return;
  }

  if (drawer.querySelector("#checkout-plus-button")) {
    console.log("🔁 Checkout Plus button already exists in drawer");
    return;
  }

  const plusButton = document.createElement("button");
  plusButton.id = "checkout-plus-button";
  plusButton.innerText = "Checkout Plus (with insurance)";
  plusButton.className = checkoutButton.className;
  plusButton.style.backgroundColor = "#1a1a1a";
  plusButton.style.marginBottom = "10px";

  plusButton.onclick = async () => {
    await fetch("/cart/add.js", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        id: insuranceVariantId,
        quantity: 1,
      }),
    });

    window.location.href = "/checkout";
  };

  checkoutButton.parentNode.insertBefore(plusButton, checkoutButton);
}

const observer = new MutationObserver(() => {
  injectIntoCartDrawer();
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});
