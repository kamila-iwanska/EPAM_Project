import { initializeState, addToCart, getProductById, getProductsForBlock } from "./state.js";
import { initializeHeader } from "./header.js";

let quantity = 1;

function initializeProductView() {
  const searchParams = new URLSearchParams(window.location.search);
  const rawId = searchParams.get('id') ?? '';
  const product = getProductById(rawId) ?? getProductById('SU001')!;

  // PRODUCT INFO

  document.getElementById('product-name')!.textContent = product.name;
  document.getElementById('product-price')!.textContent = `$${product.price}`;
  document.getElementById('product-size')!.textContent = product.size;
  document.getElementById('product-color')!.textContent = product.color;
  document.getElementById('product-category')!.textContent = product.category;
  const productImageEl = document.getElementById('product-image') as HTMLImageElement;
  productImageEl.src = product.imageUrl;
  productImageEl.alt = product.imageUrl;

  const starEls = document.getElementById('product-rating')!.children;
  for (let i = 0; i < starEls.length; i++) {
    starEls[i].setAttribute('src', `/image/Product Card/${i < product.rating ? 'full' : 'empty'}-star.png`);
  }

  const quantityEl = document.getElementById('product-quantity')!;
  quantityEl.textContent = quantity.toString();

  // ADDING TO CART

  document.getElementById('product-minus')!.addEventListener('click', () => {
    if (quantity <= 1) return;
    quantity -= 1;
    quantityEl.textContent = quantity.toString();
  });

  document.getElementById('product-plus')!.addEventListener('click', () => {
    quantity += 1;
    quantityEl.textContent = quantity.toString();
  });

  document.getElementById('product-add-to-cart')!.addEventListener('click', () => addToCart(product.id, quantity));

  // TABS

  const tabButtonEls = document.querySelectorAll('.details-review-container > .buttons > button');
  const tabContentEls = document.querySelectorAll('.details-review-container > .selected-info > div');
  tabButtonEls.forEach((currentButtonEl, currentIndex) => {
    currentButtonEl.addEventListener('click', () => {
      for (let i = 0; i < tabContentEls.length; i++) {
        if (i === currentIndex) {
          tabButtonEls[i].classList.add('active');
          tabContentEls[i].classList.remove('hidden');
        } else {
          tabButtonEls[i].classList.remove('active');
          tabContentEls[i].classList.add('hidden');
        }
      }
    });
  });
  

  // SUBMITTING A REVIEW

  const reviewFormEl = document.getElementById('product-review-form') as HTMLFormElement;
  reviewFormEl.addEventListener('submit', (e) => {
    e.preventDefault();
    window.alert('Thank you for your review!');
  });

  // "YOU MAY ALSO LIKE" SECTION

  const recommendedEl = document.getElementById('product-recommended')!;
  const recommendedTemplateEl = document.getElementById('product-recommended-template') as HTMLTemplateElement;

  const products = getProductsForBlock('You May Also Like');
  for (const product of products) {
    const productEl = recommendedTemplateEl.content.cloneNode(true) as HTMLElement;

    productEl.querySelector('.recommended-name')!.textContent = product.name;
    productEl.querySelector('.recommended-price')!.textContent = `$${product.price}`;
    const productImageEl = productEl.querySelector('.recommended-image') as HTMLImageElement;
    productImageEl.src = product.imageUrl;
    productImageEl.alt = product.imageUrl;

    if (!product.salesStatus) {
      productEl.querySelector('.sale-badge')!.remove();
    }

    productEl.querySelector('.product-card')!.addEventListener('click', () => {
      window.location.href = `/product?id=${product.id}`;
    });

    productEl.querySelector('.recommended-add-to-cart')!.addEventListener('click', (e) => {
      e.stopPropagation();
      addToCart(product.id, 1);
    });

    recommendedEl.appendChild(productEl);
  }
}

initializeState();
initializeHeader();
initializeProductView();