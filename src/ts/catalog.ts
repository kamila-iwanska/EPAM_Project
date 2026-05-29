import { addToCart, getProductsFromCategory, initializeState, paginateProducts } from "./state.js";
import { initializeHeader } from "./header.js";
import { Category, Color, Order, Size } from "./types.js";

const limit = 12;
const sizeEl = document.getElementById('size') as HTMLSelectElement;
const colorEl = document.getElementById('color') as HTMLSelectElement;
const categoryEl = document.getElementById('category') as HTMLSelectElement;
const salesEl = document.getElementById('sales') as HTMLInputElement;
const orderEl = document.getElementById('order') as HTMLSelectElement;
const searchEl = document.getElementById('search') as HTMLInputElement;
const prevPageEl = document.getElementById('catalog-prev-page')!;
const nextPageEl = document.getElementById('catalog-next-page')!;

let page = 1;

function initializeCatalogView() {
  // TOP SETS

  const topSetsEl = document.getElementById('catalog-top-sets')!;
  const topSetsTemplateEl = document.getElementById('catalog-top-sets-template') as HTMLTemplateElement;

  const topSets = getProductsFromCategory('luggage sets');
  for (const topSet of topSets) {
    const topSetEl = topSetsTemplateEl.content.cloneNode(true) as HTMLElement;
    topSetEl.querySelector('.catalog-top-set-name')!.textContent = topSet.name;
    topSetEl.querySelector('.catalog-top-set-price')!.textContent = `$${topSet.price}`;
    const topSetImageEl = topSetEl.querySelector('.catalog-top-set-image') as HTMLImageElement;
    topSetImageEl.src = topSet.imageUrl;
    topSetImageEl.alt = topSet.imageUrl;

    const starEls = topSetEl.querySelector('.catalog-top-set-rating')!.children;
    for (let i = 0; i < starEls.length; i++) {
      starEls[i].setAttribute('src', `/image/Catalog Page/star-${i < topSet.rating ? 'full' : 'empty'}-small.png`);
    }
    
    topSetsEl.appendChild(topSetEl);
  }

  // FILTERS

  [sizeEl, colorEl, categoryEl, salesEl, orderEl].forEach((el) => {
    el.addEventListener('change', () => {
      page = 1;
      render();
    });
  });

  searchEl.addEventListener('input', () => {
    page = 1;
    render();
  });

  document.getElementById('catalog-clear-filters')!.addEventListener('click', () => {
    sizeEl.value = '';
    colorEl.value = '';
    categoryEl.value = '';
    salesEl.checked = false;
    orderEl.value = 'price-asc';
    searchEl.value = '';

    render();
  });

  const hideFiltersEl = document.getElementById('catalog-hide-filters')!;
  hideFiltersEl.addEventListener('click', () => {
    const filtersEl = document.getElementById('catalog-filters')!;
    if (filtersEl.classList.contains('hidden')) {
      filtersEl.classList.remove('hidden');
      hideFiltersEl.textContent = 'HIDE FILTERS';
    } else {
      filtersEl.classList.add('hidden');
      hideFiltersEl.textContent = 'SHOW FILTERS';
    }
  });

  // PAGINATION

  prevPageEl.addEventListener('click', () => {
    if (page > 0) page -= 1;
    render();
  });

  nextPageEl.addEventListener('click', () => {
    page += 1;
    render();
  });

  render();
}

function render() {
  // GET PRODUCTS

  const offset = (page - 1) * limit;
  const { items, count } = paginateProducts({
    size: (sizeEl.value as Size) || undefined,
    color: (colorEl.value as Color) || undefined,
    category: (categoryEl.value as Category) || undefined,
    salesStatus: salesEl.checked,
    order: orderEl.value as Order,
    search: searchEl.value,
    limit,
    offset,
  });

  document.getElementById('catalog-showing')!.textContent =
    count > 0 ? `Showing ${offset + 1}-${offset + items.length} Of ${count} Results` : 'Product not found';

  // RENDER PRODUCTS

  const productsEl = document.getElementById('catalog-products')!;
  const productsTemplateEl = document.getElementById('catalog-products-template') as HTMLTemplateElement;

  productsEl.innerHTML = '';
  for (const product of items) {
    const productEl = productsTemplateEl.content.cloneNode(true) as HTMLElement;
    const productImageEl = productEl.querySelector('.catalog-product-image') as HTMLImageElement;
    productImageEl.src = product.imageUrl;
    productImageEl.alt = product.name;
    productEl.querySelector('.catalog-product-name')!.textContent = product.name;
    productEl.querySelector('.catalog-product-price')!.textContent = `$${product.price}`;

    if (!product.salesStatus) {
      productEl.querySelector('.sale-badge')!.remove();
    }

    productEl.querySelector('.product-card')!.addEventListener('click', () => {
      window.location.href = `/product?id=${product.id}`;
    });

    productEl.querySelector('.catalog-product-add-to-cart')!.addEventListener('click', (e) => {
      e.stopPropagation();
      addToCart(product.id, 1);
    });

    productsEl.appendChild(productEl);
  }

  // RENDER PAGINATION

  prevPageEl.classList.toggle('hidden', page === 1);
  nextPageEl.classList.toggle('hidden', offset + limit >= count);

  const pageButtonsEl = document.getElementById('catalog-page-buttons')!;
  pageButtonsEl.innerHTML = '';
  const totalPages = Math.ceil(count / limit);
  for (let i = 1; i <= totalPages; i++) {
    const pageButtonEl = document.createElement('button');
    pageButtonEl.textContent = i.toString();
    pageButtonEl.classList.toggle('active', i === page);
    pageButtonEl.addEventListener('click', () => {
      page = i;
      render();
    });
    pageButtonsEl.appendChild(pageButtonEl);
  }
}

initializeState();
initializeHeader();
initializeCatalogView();