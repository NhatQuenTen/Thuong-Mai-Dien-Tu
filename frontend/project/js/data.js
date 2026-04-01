// DỮ LIỆU SẢN PHẨM ĐẦY ĐỦ - ĐÃ SỬA TÊN ẢNH
const products = [
    // ========== ĐIỆN THOẠI ==========
    // Apple iPhone
    {
        id: 1,
        name: "iPhone 16 Pro Max",
        price: 34990000,
        brand: "Apple",
        category: "phone",
        image: "assets/images/IP16.jpg",
        isNew: true,
        isSale: false,
        discount: 0,
        rating: 4.9
    },
    {
        id: 2,
        name: "iPhone 15 Pro",
        price: 28990000,
        brand: "Apple",
        category: "phone",
        image: "assets/images/IP15.jpg",
        isNew: false,
        isSale: true,
        discount: 15,
        rating: 4.8
    },
    {
        id: 3,
        name: "iPhone 14",
        price: 19990000,
        brand: "Apple",
        category: "phone",
        image: "assets/images/IP14.jpg",
        isNew: false,
        isSale: true,
        discount: 20,
        rating: 4.7
    },
    {
        id: 4,
        name: "iPhone 17 Pro",
        price: 35990000,
        brand: "Apple",
        category: "phone",
        image: "assets/images/IP17.jpg",
        isNew: true,
        isSale: false,
        discount: 0,
        rating: 4.9
    },
    
    // Samsung
    {
        id: 5,
        name: "Samsung Galaxy S24 Ultra",
        price: 28990000,
        brand: "Samsung",
        category: "phone",
        image: "assets/images/samsungS24U.jpg",
        isNew: true,
        isSale: false,
        discount: 0,
        rating: 4.9
    },
    {
        id: 6,
        name: "Samsung Galaxy S24+",
        price: 23990000,
        brand: "Samsung",
        category: "phone",
        image: "assets/images/SSS24P.jpg",
        isNew: true,
        isSale: false,
        discount: 0,
        rating: 4.8
    },
    {
        id: 7,
        name: "Samsung Galaxy S21",
        price: 12990000,
        brand: "Samsung",
        category: "phone",
        image: "assets/images/samsungS21.jpg",
        isNew: false,
        isSale: true,
        discount: 25,
        rating: 4.6
    },
    {
        id: 8,
        name: "Samsung Galaxy Z Fold 5",
        price: 35990000,
        brand: "Samsung",
        category: "phone",
        image: "assets/images/SSZF5.jpg",
        isNew: false,
        isSale: true,
        discount: 10,
        rating: 4.7
    },
    
    // Xiaomi
    {
        id: 9,
        name: "Xiaomi 14 Ultra",
        price: 22990000,
        brand: "Xiaomi",
        category: "phone",
        image: "assets/images/X14U.jpg",
        isNew: true,
        isSale: false,
        discount: 0,
        rating: 4.8
    },
    {
        id: 10,
        name: "Xiaomi 13T Pro",
        price: 15990000,
        brand: "Xiaomi",
        category: "phone",
        image: "assets/images/X13TP.jpg",
        isNew: false,
        isSale: true,
        discount: 15,
        rating: 4.7
    },
    
    // Google Pixel
    {
        id: 11,
        name: "Google Pixel 9 Pro",
        price: 27990000,
        brand: "Google",
        category: "phone",
        image: "assets/images/GP9P.jpg",
        isNew: true,
        isSale: false,
        discount: 0,
        rating: 4.8
    },
    
    // OnePlus
    {
        id: 12,
        name: "OnePlus 12",
        price: 21990000,
        brand: "OnePlus",
        category: "phone",
        image: "assets/images/OP12.jpg",
        isNew: true,
        isSale: false,
        discount: 0,
        rating: 4.7
    },
    
    // ========== MÁY TÍNH BẢNG ==========
    {
        id: 13,
        name: "iPad Pro 11 inch M4",
        price: 25990000,
        brand: "Apple",
        category: "tablet",
        image: "assets/images/iPadP11.jpg",
        isNew: true,
        isSale: false,
        discount: 0,
        rating: 4.9
    },
    {
        id: 14,
        name: "iPad Air 2024",
        price: 16990000,
        brand: "Apple",
        category: "tablet",
        image: "assets/images/iPadA2024.jpg",
        isNew: false,
        isSale: false,
        discount: 0,
        rating: 4.8
    },
    {
        id: 15,
        name: "Samsung Galaxy Tab S9 Ultra",
        price: 27990000,
        brand: "Samsung",
        category: "tablet",
        image: "assets/images/SSTS9U.jpg",
        isNew: true,
        isSale: false,
        discount: 0,
        rating: 4.8
    },
    {
        id: 16,
        name: "Samsung Galaxy Tab S9 FE",
        price: 11990000,
        brand: "Samsung",
        category: "tablet",
        image: "assets/images/SSTS9FE.jpg",
        isNew: false,
        isSale: true,
        discount: 10,
        rating: 4.6
    },
    {
        id: 17,
        name: "Xiaomi Pad 6",
        price: 8990000,
        brand: "Xiaomi",
        category: "tablet",
        image: "assets/images/XP6.jpg",
        isNew: false,
        isSale: true,
        discount: 15,
        rating: 4.7
    },
    
    // ========== LAPTOP ==========
    {
        id: 18,
        name: "MacBook Pro 14 inch M3",
        price: 42990000,
        brand: "Apple",
        category: "laptop",
        image: "assets/images/MP14.jpg",
        isNew: true,
        isSale: false,
        discount: 0,
        rating: 4.9
    },
    {
        id: 19,
        name: "MacBook Air M3",
        price: 29990000,
        brand: "Apple",
        category: "laptop",
        image: "assets/images/MA13.jpg",
        isNew: true,
        isSale: false,
        discount: 0,
        rating: 4.8
    },
    {
        id: 20,
        name: "Dell XPS 15",
        price: 38990000,
        brand: "Dell",
        category: "laptop",
        image: "assets/images/DXPS15.jpg",
        isNew: false,
        isSale: true,
        discount: 10,
        rating: 4.7
    },
    {
        id: 21,
        name: "ASUS ROG Zephyrus G14",
        price: 32990000,
        brand: "ASUS",
        category: "laptop",
        image: "assets/images/ASUS.jpg",
        isNew: true,
        isSale: false,
        discount: 0,
        rating: 4.8
    },
    {
        id: 22,
        name: "Lenovo Legion 5 Pro",
        price: 28990000,
        brand: "Lenovo",
        category: "laptop",
        image: "assets/images/LENOVO.jpg",
        isNew: false,
        isSale: true,
        discount: 12,
        rating: 4.7
    },
    {
        id: 23,
        name: "HP Spectre x360",
        price: 34990000,
        brand: "HP",
        category: "laptop",
        image: "assets/images/HP.jpg",
        isNew: false,
        isSale: false,
        discount: 0,
        rating: 4.6
    },
    
    // ========== TAI NGHE ==========
    {
        id: 24,
        name: "AirPods Pro 2",
        price: 4990000,
        brand: "Apple",
        category: "headphone",
        image: "assets/images/APP2.jpg",
        isNew: true,
        isSale: false,
        discount: 0,
        rating: 4.9
    },
    {
        id: 25,
        name: "Sony WH-1000XM5",
        price: 7990000,
        brand: "Sony",
        category: "headphone",
        image: "assets/images/SONY.jpg",
        isNew: true,
        isSale: false,
        discount: 0,
        rating: 4.9
    },
    {
        id: 26,
        name: "Bose QuietComfort Ultra",
        price: 8990000,
        brand: "Bose",
        category: "headphone",
        image: "assets/images/BOSE.jpg",
        isNew: true,
        isSale: true,
        discount: 10,
        rating: 4.8
    },
    {
        id: 27,
        name: "Samsung Galaxy Buds2 Pro",
        price: 3990000,
        brand: "Samsung",
        category: "headphone",
        image: "assets/images/SSB2P.jpg",
        isNew: false,
        isSale: true,
        discount: 15,
        rating: 4.7
    },
    {
        id: 28,
        name: "JBL Tune 760NC",
        price: 2490000,
        brand: "JBL",
        category: "headphone",
        image: "assets/images/JBL.jpg",
        isNew: false,
        isSale: true,
        discount: 20,
        rating: 4.6
    },
    
    // ========== LOA ==========
    {
        id: 29,
        name: "JBL Charge 5",
        price: 3590000,
        brand: "JBL",
        category: "speaker",
        image: "assets/images/JBLC5.jpg",
        isNew: false,
        isSale: false,
        discount: 0,
        rating: 4.7
    },
    {
        id: 30,
        name: "Sony SRS-XB43",
        price: 4990000,
        brand: "Sony",
        category: "speaker",
        image: "assets/images/SONYSRS.jpg",
        isNew: false,
        isSale: true,
        discount: 15,
        rating: 4.6
    },
    {
        id: 31,
        name: "Marshall Stanmore III",
        price: 10990000,
        brand: "Marshall",
        category: "speaker",
        image: "assets/images/MSIII.jpg",
        isNew: true,
        isSale: false,
        discount: 0,
        rating: 4.8
    },
    {
        id: 32,
        name: "Bose SoundLink Flex",
        price: 3990000,
        brand: "Bose",
        category: "speaker",
        image: "assets/images/BOSESF.jpg",
        isNew: false,
        isSale: false,
        discount: 0,
        rating: 4.7
    },
    {
        id: 33,
        name: "Harman Kardon Aura 4",
        price: 8990000,
        brand: "Harman Kardon",
        category: "speaker",
        image: "assets/images/HKA4.jpg",
        isNew: true,
        isSale: true,
        discount: 5,
        rating: 4.8
    },
    
    // ========== SMARTWATCH ==========
    {
        id: 34,
        name: "Apple Watch Ultra 2",
        price: 19990000,
        brand: "Apple",
        category: "watch",
        image: "assets/images/AWU2.jpg",
        isNew: true,
        isSale: false,
        discount: 0,
        rating: 4.9
    },
    {
        id: 35,
        name: "Apple Watch Series 9",
        price: 11990000,
        brand: "Apple",
        category: "watch",
        image: "assets/images/AWS9.jpg",
        isNew: false,
        isSale: true,
        discount: 10,
        rating: 4.8
    },
    {
        id: 36,
        name: "Samsung Galaxy Watch 6 Classic",
        price: 8990000,
        brand: "Samsung",
        category: "watch",
        image: "assets/images/SSW6C.jpg",
        isNew: false,
        isSale: true,
        discount: 15,
        rating: 4.7
    },
    {
        id: 37,
        name: "Garmin Fenix 7",
        price: 15990000,
        brand: "Garmin",
        category: "watch",
        image: "assets/images/GF7.jpg",
        isNew: false,
        isSale: false,
        discount: 0,
        rating: 4.8
    },
    {
        id: 38,
        name: "Xiaomi Watch 2 Pro",
        price: 4990000,
        brand: "Xiaomi",
        category: "watch",
        image: "assets/images/XW2P.jpg",
        isNew: true,
        isSale: false,
        discount: 0,
        rating: 4.6
    },
    
    // ========== PHỤ KIỆN ==========
    {
        id: 39,
        name: "Sạc dự phòng 20.000mAh",
        price: 899000,
        brand: "Anker",
        category: "accessory",
        image: "assets/images/ANKER.jpg",
        isNew: false,
        isSale: true,
        discount: 10,
        rating: 4.7
    },
    {
        id: 40,
        name: "Cáp sạc USB-C 2m",
        price: 299000,
        brand: "Baseus",
        category: "accessory",
        image: "assets/images/BASEUS.jpg",
        isNew: false,
        isSale: false,
        discount: 0,
        rating: 4.5
    },
    {
        id: 41,
        name: "Ốp lưng iPhone 15 Pro",
        price: 399000,
        brand: "Spigen",
        category: "accessory",
        image: "assets/images/SPIGEN.jpg",
        isNew: true,
        isSale: false,
        discount: 0,
        rating: 4.6
    },
    {
        id: 42,
        name: "Sạc không dây 15W",
        price: 699000,
        brand: "Belkin",
        category: "accessory",
        image: "assets/images/BELKIN.jpg",
        isNew: false,
        isSale: true,
        discount: 15,
        rating: 4.7
    },
    {
        id: 43,
        name: "Kính cường lực iPhone",
        price: 199000,
        brand: "Baseus",
        category: "accessory",
        image: "assets/images/CLBASEUS.jpg",
        isNew: false,
        isSale: false,
        discount: 0,
        rating: 4.5
    }
];

// ========== HÀM TIỆN ÍCH ==========

// Lấy sản phẩm theo danh mục
function getProductsByCategory(category) {
    return products.filter(product => product.category === category);
}

// Lấy sản phẩm mới
function getNewProducts() {
    return products.filter(product => product.isNew === true);
}

// Lấy sản phẩm khuyến mãi
function getSaleProducts() {
    return products.filter(product => product.isSale === true);
}

// Lấy sản phẩm theo hãng
function getProductsByBrand(brand) {
    return products.filter(product => product.brand === brand);
}

// Lấy sản phẩm theo khoảng giá
function getProductsByPriceRange(minPrice, maxPrice) {
    return products.filter(product => product.price >= minPrice && product.price <= maxPrice);
}

// Format giá tiền
function formatPrice(price) {
    return price.toLocaleString('vi-VN') + '₫';
}

// Tính giá sau khuyến mãi
function getDiscountedPrice(product) {
    if (product.discount > 0) {
        return product.price * (100 - product.discount) / 100;
    }
    return product.price;
}

// Lấy tất cả danh mục
function getAllCategories() {
    const categories = [...new Set(products.map(p => p.category))];
    return categories;
}

// Lấy tất cả hãng
function getAllBrands() {
    const brands = [...new Set(products.map(p => p.brand))];
    return brands;
}

// Đếm số lượng sản phẩm theo danh mục
function getProductCountByCategory() {
    const count = {};
    products.forEach(product => {
        const categoryMap = {
            'phone': '📱 Điện thoại',
            'tablet': '📟 Máy tính bảng',
            'laptop': '💻 Laptop',
            'headphone': '🎧 Tai nghe',
            'speaker': '🔊 Loa',
            'watch': '⌚ Smartwatch',
            'accessory': '🔌 Phụ kiện'
        };
        const displayName = categoryMap[product.category] || product.category;
        count[displayName] = (count[displayName] || 0) + 1;
    });
    return count;
}

// Tìm kiếm sản phẩm
function searchProducts(keyword) {
    return products.filter(product => 
        product.name.toLowerCase().includes(keyword.toLowerCase()) ||
        product.brand.toLowerCase().includes(keyword.toLowerCase())
    );
}

// Sắp xếp sản phẩm
function sortProducts(products, sortBy) {
    const sorted = [...products];
    switch(sortBy) {
        case 'price_asc':
            return sorted.sort((a, b) => a.price - b.price);
        case 'price_desc':
            return sorted.sort((a, b) => b.price - a.price);
        case 'name_asc':
            return sorted.sort((a, b) => a.name.localeCompare(b.name));
        case 'rating_desc':
            return sorted.sort((a, b) => b.rating - a.rating);
        default:
            return sorted;
    }
}

// Export cho Node.js (nếu cần)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        products,
        getProductsByCategory,
        getNewProducts,
        getSaleProducts,
        getProductsByBrand,
        getProductsByPriceRange,
        formatPrice,
        getDiscountedPrice,
        getAllCategories,
        getAllBrands,
        getProductCountByCategory,
        searchProducts,
        sortProducts
    };
}

// Log thông tin
console.log('Đã load dữ liệu sản phẩm!');
console.log(`Tổng số sản phẩm: ${products.length}`);
console.log(`Phân loại:`, getProductCountByCategory());