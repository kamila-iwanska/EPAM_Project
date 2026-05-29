import { initializeState, getAllCartItems, getProductById, clearCart, addToCart, removeFromCart } from "./state.js";
import { initializeHeader } from "./header.js";

function initializeCartView() {
  document.getElementById('cart-clear-cart')!.addEventListener('click', () => {
    if (getAllCartItems().length === 0) return;
    clearCart();
    render();
    window.alert('Your cart is empty. Use the catalog to add new items.')
  });

  document.getElementById('cart-checkout')!.addEventListener('click', () => {
    if (getAllCartItems().length === 0) return;
    clearCart();
    render();
    window.alert('Thank you for your purchase.')
  });

  render();
}

function render() {
  const bodyEl = document.getElementById('cart-body')!;
  const templateEl = document.getElementById('cart-template') as HTMLTemplateElement;

  let subTotal = 0;

  bodyEl.innerHTML = '';
  for (const cartItem of getAllCartItems()) {
    const product = getProductById(cartItem.productId)!;

    subTotal += product.price * cartItem.quantity;

    const newRowEl = templateEl.content.cloneNode(true) as HTMLTableRowElement;
    const newRowImageEl = newRowEl.querySelector('.cart-template-image') as HTMLImageElement;
    newRowImageEl.src = product.imageUrl;
    newRowImageEl.alt = product.imageUrl;
    newRowEl.querySelector('.cart-template-name')!.textContent = product.name;
    newRowEl.querySelector('.cart-template-price')!.textContent = `$${product.price}`;
    newRowEl.querySelector('.cart-template-quantity')!.textContent = cartItem.quantity.toString();
    newRowEl.querySelector('.cart-template-total')!.textContent = `$${product.price * cartItem.quantity}`;
    newRowEl.querySelector('.cart-template-minus')!.addEventListener('click', () => {
      removeFromCart(product.id, 1);
      render();
    })
    newRowEl.querySelector('.cart-template-plus')!.addEventListener('click', () => {
      addToCart(product.id, 1);
      render();
    });
    newRowEl.querySelector('.cart-template-trash')!.addEventListener('click', () => {
      removeFromCart(product.id, Infinity);
      render();
    })
    bodyEl.appendChild(newRowEl);
  }

  const discount = subTotal > 3000 ? Math.round(subTotal * 0.1) : 0;
  const shipping = subTotal > 0 ? 30 : 0;
  const total = subTotal - discount + shipping;

  document.getElementById('cart-subtotal')!.textContent = `$${subTotal}`;
  document.getElementById('cart-discount')!.textContent = `$${discount}`;
  document.getElementById('cart-shipping')!.textContent = `$${shipping}`;
  document.getElementById('cart-total')!.textContent = `$${total}`;
}

initializeState();
initializeHeader();
initializeCartView();