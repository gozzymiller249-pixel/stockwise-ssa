// file: src/CustomerDashboard.jsx
import { useState, useEffect } from 'react';

function CustomerDashboard({ user, onLogout }) {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [orders, setOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [showCart, setShowCart] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [checkoutAddress, setCheckoutAddress] = useState('');
    const [showCheckout, setShowCheckout] = useState(false);
    const [requestItem, setRequestItem] = useState('');
    const [showRequest, setShowRequest] = useState(false);

    // Mock product data - will be replaced with API calls later
    useEffect(() => {
        setTimeout(() => {
            setProducts([
                { id: 1, name: "Power Bank 10000mAh", category: "Electronics", price: 25000, shop: "Ikeja Electronics", shopId: 1, location: "Ikeja", stock: 45, image: null },
                { id: 2, name: "iPhone Charger", category: "Electronics", price: 10000, shop: "Ikeja Electronics", shopId: 1, location: "Ikeja", stock: 120, image: null },
                { id: 3, name: "Face Mask (50pcs)", category: "Beauty", price: 2000, shop: "Beauty World", shopId: 2, location: "Victoria Island", stock: 100, image: null },
                { id: 4, name: "Hair Cream", category: "Beauty", price: 3500, shop: "Beauty World", shopId: 2, location: "Victoria Island", stock: 50, image: null },
                { id: 5, name: "Rechargeable Lamp", category: "Electronics", price: 10500, shop: "Ikeja Electronics", shopId: 1, location: "Ikeja", stock: 30, image: null },
                { id: 6, name: "Wristwatch", category: "Accessories", price: 20000, shop: "Timepieces", shopId: 3, location: "Ajah", stock: 25, image: null },
            ]);
            setOrders([
                { id: 1001, date: "2026-06-09", items: [{ name: "Power Bank", quantity: 1, price: 25000 }], total: 25000, status: "delivered", tracking: null },
                { id: 1002, date: "2026-06-10", items: [{ name: "Face Mask", quantity: 2, price: 2000 }], total: 4000, status: "in_transit", tracking: "Driver assigned - ETA 25 min" },
            ]);
            setLoading(false);
        }, 800);
    }, []);

    // Categories for filtering
    const categories = ['all', ...new Set(products.map(p => p.category))];

    // Filter products by search and category
    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              p.shop.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    // Add to cart
    const addToCart = (product) => {
        const existingItem = cart.find(item => item.id === product.id);
        if (existingItem) {
            setCart(cart.map(item =>
                item.id === product.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            ));
        } else {
            setCart([...cart, { ...product, quantity: 1 }]);
        }
        alert(`Added ${product.name} to cart`);
    };

    // Remove from cart
    const removeFromCart = (productId) => {
        setCart(cart.filter(item => item.id !== productId));
    };

    // Update quantity in cart
    const updateQuantity = (productId, newQuantity) => {
        if (newQuantity <= 0) {
            removeFromCart(productId);
        } else {
            setCart(cart.map(item =>
                item.id === productId
                    ? { ...item, quantity: newQuantity }
                    : item
            ));
        }
    };

    // Calculate cart total
    const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = cartTotal > 0 ? 1500 : 0;
    const grandTotal = cartTotal + deliveryFee;

    // Place order
    const placeOrder = () => {
        if (!checkoutAddress) {
            alert('Please enter your delivery address');
            return;
        }
        
        const newOrder = {
            id: Date.now(),
            date: new Date().toLocaleDateString(),
            items: cart.map(item => ({ name: item.name, quantity: item.quantity, price: item.price })),
            total: grandTotal,
            status: 'pending',
            tracking: 'Order confirmed. Awaiting driver assignment.'
        };
        
        setOrders([newOrder, ...orders]);
        setCart([]);
        setCheckoutAddress('');
        setShowCheckout(false);
        setShowCart(false);
        alert(`Order placed! Order #${newOrder.id} total: ₦${grandTotal.toLocaleString()}`);
    };

    // Request an item
    const submitRequest = () => {
        if (!requestItem) {
            alert('Please enter the item you are looking for');
            return;
        }
        alert(`Request submitted: "${requestItem}". Shops will be notified.`);
        setRequestItem('');
        setShowRequest(false);
    };

    // Track order (simulate)
    const trackOrder = (orderId) => {
        const order = orders.find(o => o.id === orderId);
        if (order && order.tracking) {
            alert(`Order #${orderId}: ${order.tracking}`);
        } else {
            alert(`Order #${orderId}: Processing. You will receive updates soon.`);
        }
    };

    // Get status badge color
    const getStatusBadge = (status) => {
        const badges = {
            'pending': { text: 'Pending', color: '#eab308' },
            'confirmed': { text: 'Confirmed', color: '#3b82f6' },
            'in_transit': { text: 'In Transit', color: '#3b82f6' },
            'delivered': { text: 'Delivered', color: '#22c55e' }
        };
        const b = badges[status] || { text: status, color: '#6b7280' };
        return <span style={{ backgroundColor: b.color, color: 'white', padding: '2px 8px', borderRadius: '20px', fontSize: '11px' }}>{b.text}</span>;
    };

    return (
        <div style={{ maxWidth: '500px', margin: '0 auto', padding: '16px', backgroundColor: '#f3f4f6', minHeight: '100vh' }}>
            {/* Header */}
            <div style={{ backgroundColor: '#2563eb', padding: '16px', borderRadius: '12px', marginBottom: '20px', position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 style={{ color: 'white', margin: 0, fontSize: '20px' }}>StockWise Customer</h1>
                        <p style={{ color: '#bfdbfe', margin: '5px 0 0 0', fontSize: '12px' }}>Welcome, {user?.business_name || user?.phone || 'Customer'}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <button onClick={() => { setShowCart(!showCart); setShowCheckout(false); }} style={{ backgroundColor: 'transparent', border: 'none', fontSize: '22px', cursor: 'pointer', color: 'white', position: 'relative' }}>
                            🛒
                            {cart.length > 0 && <span style={{ position: 'absolute', top: '-5px', right: '-10px', backgroundColor: '#ef4444', color: 'white', borderRadius: '50%', width: '18px', height: '18px', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{cart.length}</span>}
                        </button>
                        <button onClick={() => setMenuOpen(!menuOpen)} style={{ backgroundColor: 'transparent', border: 'none', fontSize: '28px', cursor: 'pointer', color: 'white', padding: '8px' }}>☰</button>
                    </div>
                </div>

                {/* Dropdown Menu */}
                {menuOpen && (
                    <div style={{ position: 'absolute', top: '70px', right: '10px', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', zIndex: 1000, width: '200px', overflow: 'hidden' }}>
                        <button onClick={() => { setMenuOpen(false); setShowCart(false); }} style={{ display: 'block', width: '100%', padding: '14px 16px', textAlign: 'left', border: 'none', backgroundColor: 'white', cursor: 'pointer', fontSize: '14px', borderBottom: '1px solid #eee' }}>🏠 Shop</button>
                        <button onClick={() => { setMenuOpen(false); setShowCart(false); alert('My Orders'); }} style={{ display: 'block', width: '100%', padding: '14px 16px', textAlign: 'left', border: 'none', backgroundColor: 'white', cursor: 'pointer', fontSize: '14px', borderBottom: '1px solid #eee' }}>📦 My Orders</button>
                        <button onClick={() => { setMenuOpen(false); setShowRequest(true); }} style={{ display: 'block', width: '100%', padding: '14px 16px', textAlign: 'left', border: 'none', backgroundColor: 'white', cursor: 'pointer', fontSize: '14px', borderBottom: '1px solid #eee' }}>💡 Request Item</button>
                        <div style={{ height: '1px', backgroundColor: '#ddd', margin: '5px 0' }}></div>
                        <button onClick={onLogout} style={{ display: 'block', width: '100%', padding: '14px 16px', textAlign: 'left', border: 'none', backgroundColor: '#fee2e2', color: '#dc2626', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' }}>🚪 Logout</button>
                    </div>
                )}
            </div>

            {/* Cart Modal */}
            {showCart && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1001, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
                    <div style={{ backgroundColor: 'white', borderRadius: '16px', maxWidth: '400px', width: '100%', maxHeight: '80vh', overflow: 'auto' }}>
                        <div style={{ padding: '16px', borderBottom: '1px solid #ddd', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ margin: 0 }}>🛒 Your Cart ({cart.length} items)</h3>
                            <button onClick={() => { setShowCart(false); setShowCheckout(false); }} style={{ backgroundColor: 'transparent', border: 'none', fontSize: '24px', cursor: 'pointer' }}>✕</button>
                        </div>
                        <div style={{ padding: '16px' }}>
                            {cart.length === 0 ? (
                                <p style={{ textAlign: 'center', color: '#666' }}>Your cart is empty</p>
                            ) : (
                                <>
                                    {cart.map(item => (
                                        <div key={item.id} style={{ borderBottom: '1px solid #eee', padding: '10px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div style={{ flex: 2 }}>
                                                <p style={{ fontWeight: 'bold', margin: 0 }}>{item.name}</p>
                                                <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>{item.shop}</p>
                                                <p style={{ fontSize: '12px', fontWeight: 'bold', margin: '5px 0 0 0' }}>₦{item.price.toLocaleString()}</p>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} style={{ width: '28px', height: '28px', backgroundColor: '#e5e7eb', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>-</button>
                                                <span style={{ width: '30px', textAlign: 'center' }}>{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} style={{ width: '28px', height: '28px', backgroundColor: '#e5e7eb', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>+</button>
                                                <button onClick={() => removeFromCart(item.id)} style={{ backgroundColor: 'transparent', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#ef4444' }}>🗑️</button>
                                            </div>
                                        </div>
                                    ))}
                                    <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '2px solid #ddd' }}>
                                        <p><strong>Subtotal:</strong> ₦{cartTotal.toLocaleString()}</p>
                                        <p><strong>Delivery Fee:</strong> ₦{deliveryFee.toLocaleString()}</p>
                                        <p style={{ fontSize: '18px', fontWeight: 'bold' }}><strong>Total:</strong> ₦{grandTotal.toLocaleString()}</p>
                                        {!showCheckout ? (
                                            <button onClick={() => setShowCheckout(true)} style={{ width: '100%', padding: '12px', backgroundColor: '#22c55e', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', marginTop: '10px' }}>Proceed to Checkout</button>
                                        ) : (
                                            <div style={{ marginTop: '10px' }}>
                                                <textarea placeholder="Your delivery address (e.g., 12, Unity Road, Ikeja, Lagos)" value={checkoutAddress} onChange={(e) => setCheckoutAddress(e.target.value)} rows="3" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '10px' }}></textarea>
                                                <div style={{ display: 'flex', gap: '10px' }}>
                                                    <button onClick={() => setShowCheckout(false)} style={{ flex: 1, padding: '10px', backgroundColor: '#6b7280', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Back</button>
                                                    <button onClick={placeOrder} style={{ flex: 1, padding: '10px', backgroundColor: '#22c55e', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Place Order</button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Request Item Modal */}
            {showRequest && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1001, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
                    <div style={{ backgroundColor: 'white', borderRadius: '16px', maxWidth: '350px', width: '100%', padding: '20px' }}>
                        <h3 style={{ margin: '0 0 15px 0' }}>💡 Request an Item</h3>
                        <p style={{ fontSize: '14px', color: '#666', marginBottom: '15px' }}>Can't find what you're looking for? Let us know and nearby shops will be notified.</p>
                        <input type="text" placeholder="e.g., Wireless Earphones, Laptop, etc." value={requestItem} onChange={(e) => setRequestItem(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '15px' }} />
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button onClick={() => setShowRequest(false)} style={{ flex: 1, padding: '10px', backgroundColor: '#6b7280', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
                            <button onClick={submitRequest} style={{ flex: 1, padding: '10px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Submit Request</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Search and Filter */}
            <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '12px', marginBottom: '20px' }}>
                <input type="text" placeholder="🔍 Search products or shops..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '10px' }} />
                <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '5px' }}>
                    {categories.map(cat => (
                        <button key={cat} onClick={() => setSelectedCategory(cat)} style={{ padding: '6px 12px', backgroundColor: selectedCategory === cat ? '#3b82f6' : '#e5e7eb', color: selectedCategory === cat ? 'white' : '#333', border: 'none', borderRadius: '20px', cursor: 'pointer', fontSize: '12px', whiteSpace: 'nowrap' }}>
                            {cat === 'all' ? 'All' : cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Products Grid */}
            <div style={{ marginBottom: '20px' }}>
                <h3 style={{ margin: '0 0 15px 0', fontSize: '18px' }}>🛍️ Available Products</h3>
                {loading ? (
                    <p>Loading products...</p>
                ) : filteredProducts.length === 0 ? (
                    <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', textAlign: 'center' }}>
                        <p>No products found. Try a different search or category.</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {filteredProducts.map(product => (
                            <div key={product.id} style={{ backgroundColor: 'white', padding: '16px', borderRadius: '12px', border: '1px solid #eee' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                    <div style={{ flex: 1 }}>
                                        <p style={{ fontWeight: 'bold', margin: '0 0 5px 0' }}>{product.name}</p>
                                        <p style={{ fontSize: '12px', color: '#666', margin: '0 0 5px 0' }}>🏪 {product.shop} • 📍 {product.location}</p>
                                        <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#22c55e', margin: '5px 0' }}>₦{product.price.toLocaleString()}</p>
                                        <p style={{ fontSize: '11px', color: product.stock < 20 ? '#ef4444' : '#666', margin: 0 }}>{product.stock < 20 ? `⚠️ Only ${product.stock} left` : `In stock: ${product.stock}`}</p>
                                    </div>
                                    <button onClick={() => addToCart(product)} style={{ padding: '8px 16px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Add to Cart</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* My Recent Orders */}
            <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '12px' }}>
                <h3 style={{ margin: '0 0 15px 0', fontSize: '18px' }}>📦 My Recent Orders</h3>
                {orders.length === 0 ? (
                    <p style={{ textAlign: 'center', color: '#666', padding: '20px' }}>No orders yet. Start shopping!</p>
                ) : (
                    orders.slice(0, 5).map(order => (
                        <div key={order.id} style={{ border: '1px solid #eee', borderRadius: '10px', padding: '12px', marginBottom: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <p style={{ fontWeight: 'bold', margin: 0 }}>Order #{order.id}</p>
                                {getStatusBadge(order.status)}
                            </div>
                            <p style={{ fontSize: '12px', color: '#666', margin: '5px 0' }}>📅 {order.date}</p>
                            <p style={{ fontSize: '12px', margin: '5px 0' }}>{order.items.map(i => `${i.name} x${i.quantity}`).join(', ')}</p>
                            <p style={{ fontSize: '14px', fontWeight: 'bold', margin: '5px 0 10px 0' }}>Total: ₦{order.total.toLocaleString()}</p>
                            <button onClick={() => trackOrder(order.id)} style={{ padding: '6px 12px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>Track Order</button>
                        </div>
                    ))
                )}
            </div>

            {/* Smart Features for Consumers (Low-Data Mode) */}
            <div style={{ marginTop: '20px', fontSize: '12px', color: '#666', textAlign: 'center', padding: '12px', backgroundColor: '#f0fdf4', borderRadius: '12px' }}>
                <p style={{ margin: 0 }}>📱 Low-Data Mode | Browse with text-only | Works offline</p>
                <p style={{ margin: '5px 0 0 0', fontSize: '11px' }}>Smart recommendations based on your browsing | Request any item</p>
            </div>
        </div>
    );
}

export default CustomerDashboard;