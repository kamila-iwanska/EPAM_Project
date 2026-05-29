import database from '../assets/data.json' with { type: 'json' };
const products = database.data;
let cartItems = [];
export function initializeState() {
    var _a;
    cartItems = JSON.parse((_a = localStorage.getItem('CART')) !== null && _a !== void 0 ? _a : '[]');
    handleCartChange();
}
function handleCartChange() {
    localStorage.setItem('CART', JSON.stringify(cartItems));
    const cartCounterEl = document.getElementById('cart-counter');
    if (cartCounterEl) {
        const totalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);
        cartCounterEl.textContent = totalQuantity > 0 ? totalQuantity.toString() : '';
    }
}
export function getAllCartItems() {
    return cartItems;
}
export function addToCart(productId, quantity) {
    const existingCartItem = cartItems.find((item) => item.productId === productId);
    if (existingCartItem) {
        existingCartItem.quantity += quantity;
    }
    else {
        cartItems.push({ productId, quantity });
    }
    handleCartChange();
}
export function removeFromCart(productId, quantity) {
    const existingCartItem = cartItems.find((item) => item.productId === productId);
    if (!existingCartItem)
        return;
    existingCartItem.quantity -= quantity;
    cartItems = cartItems.filter((item) => item.quantity > 0);
    handleCartChange();
}
export function clearCart() {
    cartItems = [];
    handleCartChange();
}
export function getProductById(productId) {
    return products.find((product) => product.id === productId) || null;
}
export function getProductsForBlock(block) {
    return products.filter((p) => p.blocks.includes(block));
}
export function getProductsFromCategory(category) {
    return products.filter((p) => p.category === category);
}
function doesProductMatchSize(product, size) {
    if (size == 'S-L') {
        if (!['S', 'M', 'L'].includes(product.size))
            return false;
    }
    else if (size === 'S, M, XL') {
        if (!['S', 'M', 'XL'].includes(product.size))
            return false;
    }
    else if (size && product.size !== size) {
        return false;
    }
    return true;
}
export function paginateProducts(args) {
    const filteredItems = products.filter((p) => {
        if (!doesProductMatchSize(p, args.size))
            return false;
        if (args.color && p.color !== args.color)
            return false;
        if (args.category && p.category !== args.category)
            return false;
        if (args.salesStatus && !p.salesStatus)
            return false;
        if (args.search && !p.name.toLowerCase().includes(args.search.toLowerCase()))
            return false;
        return true;
    });
    return {
        items: filteredItems
            .toSorted((a, b) => {
            switch (args.order) {
                case 'price-asc':
                    return a.price - b.price;
                case 'price-dsc':
                    return b.price - a.price;
                case 'popularity-dsc':
                    return b.popularity - a.popularity;
                case 'rating-dsc':
                    return b.rating - a.rating;
            }
        })
            .slice(args.offset, args.offset + args.limit),
        count: filteredItems.length,
    };
}
