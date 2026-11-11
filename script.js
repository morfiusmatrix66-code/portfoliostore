// База данных товаров 
const products = [
    { id: 1, name: "Iphone 18 Ultra", price: 145000, category: "phones", img: "https://avatars.mds.yandex.net/i?id=c71930ee86e6a230589169b346fc828b_l-9098008-images-thumbs&n=13" },
    { id: 2, name: "Samsung Galaxy S24 Ultra", price: 125000, category: "phones", img: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80" },
    { id: 3, name: "MacBook Air M3", price: 135000, category: "laptops", img: "https://i.ytimg.com/vi/jQ4f0ad1toA/maxresdefault.jpg" },
    { id: 4, name: "ASUS ROG Strix G16", price: 180000, category: "laptops", img: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=500&q=80" },
    { id: 5, name: "Sony WH-1000XM5", price: 35000, category: "audio", img: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500&q=80" },
    { id: 6, name: "Apple Watch Ultra 2", price: 85000, category: "watches", img: "https://images.unsplash.com/photo-1558126319-c9feecbf57ee?w=500&q=80" },
    { id: 7, name: "iPad Pro 12.9", price: 110000, category: "tablets", img: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&q=80" },
    { id: 8, name: "Canon EOS R6 Mark II", price: 220000, category: "cameras", img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&q=80" },
    { id: 9, name: "PlayStation 5 Slim", price: 55000, category: "gaming", img: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500&q=80" },
    { id: 10, name: "Xbox Series X", price: 52000, category: "gaming", img: "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=500&q=80" },
    { id: 11, name: "DJI Mini 4 Pro", price: 95000, category: "drones", img: "https://images.unsplash.com/photo-1579829366248-204fe8413f31?w=500&q=80" },
    { id: 12, name: "Logitech MX Master 3S", price: 12000, category: "accessories", img: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&q=80" }
];

let cart = [];

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    renderProducts('all');
    updateCartUI();
});

// Рендер товаров
function renderProducts(filter) {
    const container = document.getElementById('products-container');
    container.innerHTML = '';
    
    const filtered = filter === 'all' ? products : products.filter(p => p.category === filter);
    
    filtered.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${product.img}" class="product-img" alt="${product.name}">
            <div class="product-info">
                <div class="product-title">${product.name}</div>
                <div class="product-price">${product.price.toLocaleString()} ₽</div>
                <button class="add-to-cart" onclick="addToCart(${product.id})">В корзину</button>
            </div>
        `;
        container.appendChild(card);
    });
}

// Фильтрация
function filterProducts(category, btn) {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    if(btn) btn.classList.add('active');
    renderProducts(category);
}

// Добавление в корзину
function addToCart(id) {
    const product = products.find(p => p.id === id);
    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    updateCartUI();
    showNotification(`Товар "${product.name}" добавлен!`);
}

// Удаление из корзины
function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartUI();
}

// Изменение количества
function changeQuantity(id, change) {
    const item = cart.find(item => item.id === id);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(id);
        } else {
            updateCartUI();
        }
    }
}

// Обновление интерфейса корзины
function updateCartUI() {
    const cartCount = document.getElementById('cart-count');
    const cartItems = document.getElementById('cart-items');
    const totalPriceEl = document.getElementById('total-price');
    
    // Общее количество товаров
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.innerText = totalCount;
    
    // Список товаров
    cartItems.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align:center; color:#999;">Корзина пуста</p>';
    } else {
        cart.forEach(item => {
            total += item.price * item.quantity;
            cartItems.innerHTML += `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <div class="cart-item-title">${item.name}</div>
                        <div class="cart-item-price">${item.price.toLocaleString()} ₽</div>
                    </div>
                    <div class="cart-controls">
                        <button onclick="changeQuantity(${item.id}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="changeQuantity(${item.id}, 1)">+</button>
                        <button class="remove-btn" onclick="removeFromCart(${item.id})">&times;</button>
                    </div>
                </div>
            `;
        });
    }
    
    totalPriceEl.innerText = total.toLocaleString();
}

// Открытие/закрытие корзины
function toggleCart() {
    const modal = document.getElementById('cart-modal');
    modal.classList.toggle('open');
}
// Уведомления
function showNotification(message) {
    const notif = document.createElement('div');
    notif.className = 'notification';
    notif.innerText = message;
    document.body.appendChild(notif);
    
    setTimeout(() => {
        notif.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notif.classList.remove('show');
        setTimeout(() => notif.remove(), 300);
    }, 2000);
}
// Универсальная функция плавного скролла
function scrollToSection(id) {
    const element = document.getElementById(id);
    if (element) {
        const headerOffset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}