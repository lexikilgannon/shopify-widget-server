(function () {
  if (!window.location.pathname.includes('/cart')) return;

  const insuranceVariantId = 44612488200364;

  function createWidget() {
    const container = document.createElement('div');
    container.style.marginTop = '20px';
    container.innerHTML = `
      <p style="margin-bottom: 10px;">✔ Add insurance to your order for $4.99</p>
      <button id="checkout-plus-btn" style="background: black; color: white; padding: 10px 20px; font-weight: bold;">Checkout Plus</button>
      <button id="standard-checkout-btn" style="margin-top: 10px; background: none; border: 1px solid #ccc; padding: 8px 20px;">Checkout Without Insurance</button>
    `;

    const cartForm = document.querySelector('form[action="/cart"]');
    if (cartForm) cartForm.parentNode.insertBefore(container, cartForm.nextSibling);

    document.getElementById('checkout-plus-btn').onclick = async function () {
      await fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: insuranceVariantId, quantity: 1 }),
      });
      window.location.href = '/checkout';
    };

    document.getElementById('standard-checkout-btn').onclick = function () {
      window.location.href = '/checkout';
    };
  }

  document.addEventListener('DOMContentLoaded', createWidget);

  window.CheckoutPlusLoaded = true;
  console.log("Checkout Plus script loaded");

})();
