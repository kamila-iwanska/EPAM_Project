import { addToCart, getProductsForBlock, initializeState } from "./state.js";
import { initializeHeader } from "./header.js";
const blocks = [
    {
        parentId: 'home-selected-products',
        block: 'Selected Products',
    },
    {
        parentId: 'home-new-products-arrival',
        block: 'New Products Arrival',
    }
];
function initializeHomeView() {
    const productTemplateEl = document.getElementById("home-product-template");
    blocks.forEach(({ parentId, block }) => {
        const products = getProductsForBlock(block);
        products.forEach((product) => {
            const productEl = productTemplateEl.content.cloneNode(true);
            const productImageEl = productEl.querySelector('.home-product-image');
            productImageEl.src = product.imageUrl;
            productImageEl.alt = product.name;
            productEl.querySelector('.home-product-name').textContent = product.name;
            productEl.querySelector('.home-product-price').textContent = `$${product.price}`;
            if (!product.salesStatus) {
                productEl.querySelector('.sale-badge').remove();
            }
            productEl.querySelector('.product-card').addEventListener('click', () => {
                window.location.href = `/product?id=${product.id}`;
            });
            productEl.querySelector('.home-product-add-to-cart').addEventListener('click', (e) => {
                e.stopPropagation();
                addToCart(product.id, 1);
            });
            document.getElementById(parentId).appendChild(productEl);
        });
    });
}
initializeState();
initializeHeader();
initializeHomeView();
