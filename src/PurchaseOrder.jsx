// file: src/PurchaseOrder.jsx
import { useState, useEffect } from 'react';
import { getProducts } from './services/api';
import { getSuppliers } from './services/api';
import { getPurchaseOrders, createPurchaseOrder, updatePurchaseOrderStatus, deletePurchaseOrder } from './services/api';

function PurchaseOrder() {
    const [suppliers, setSuppliers] = useState([]);
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [selectedSupplier, setSelectedSupplier] = useState('');
    const [cart, setCart] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState('');
    const [orderQuantity, setOrderQuantity] = useState('');
    const [orderUnitPrice, setOrderUnitPrice] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const supplierList = await getSuppliers();
            const productList = await getProducts();
            const orderList = await getPurchaseOrders();
            setSuppliers(supplierList);
            setProducts(productList);
            setOrders(orderList);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const addToCart = () => {
        if (!selectedProduct || !orderQuantity) {
            alert('Select product and enter quantity');
            return;
        }
        const product = products.find(p => p.id == selectedProduct);
        const price = orderUnitPrice || product.selling_price;
        setCart([...cart, {
            product_id: parseInt(selectedProduct),
            product_name: product.name,
            quantity: parseInt(orderQuantity),
            unit_price: parseFloat(price)
        }]);
        setSelectedProduct('');
        setOrderQuantity('');
        setOrderUnitPrice('');
    };

    const removeFromCart = (index) => {
        const newCart = [...cart];
        newCart.splice(index, 1);
        setCart(newCart);
    };

    const submitOrder = async () => {
        if (!selectedSupplier || cart.length === 0) {
            alert('Select supplier and add items');
            return;
        }
        try {
            const result = await createPurchaseOrder(selectedSupplier, cart, 'submitted');
            if (result.success) {
                alert('Order created!');
                setCart([]);
                setSelectedSupplier('');
                setShowForm(false);
                loadData();
            } else {
                alert(result.message);
            }
        } catch (error) {
            alert('Error: ' + error.message);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            const result = await updatePurchaseOrderStatus(id, status);
            if (result.success) {
                alert('Status updated');
                loadData();
            } else {
                alert(result.message);
            }
        } catch (error) {
            alert('Error: ' + error.message);
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            'draft': '#6b7280',
            'submitted': '#eab308',
            'in_transit': '#3b82f6',
            'delivered': '#22c55e',
            'cancelled': '#ef4444'
        };
        return colors[status] || '#6b7280';
    };

    return (
        <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '10px', marginBottom: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>📦 Purchase Orders</h2>
                <button onClick={() => setShowForm(!showForm)} style={{ padding: '8px 16px', backgroundColor: '#22c55e', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                    {showForm ? 'Cancel' : '+ New Order'}
                </button>
            </div>

            {showForm && (
                <div style={{ backgroundColor: '#f9fafb', padding: '20px', borderRadius: '10px', marginBottom: '20px' }}>
                    <h3>Create Purchase Order</h3>
                    <select value={selectedSupplier} onChange={(e) => setSelectedSupplier(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '5px' }}>
                        <option value="">Select Supplier</option>
                        {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                    
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                        <select value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)} style={{ flex: 2, padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}>
                            <option value="">Select Product</option>
                            {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                        <input type="number" placeholder="Qty" value={orderQuantity} onChange={(e) => setOrderQuantity(e.target.value)} style={{ flex: 1, padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }} />
                        <input type="number" placeholder="Price" value={orderUnitPrice} onChange={(e) => setOrderUnitPrice(e.target.value)} style={{ flex: 1, padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }} />
                        <button onClick={addToCart} style={{ padding: '10px 20px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Add</button>
                    </div>

                    {cart.length > 0 && (
                        <div style={{ marginBottom: '10px' }}>
                            <h4>Items:</h4>
                            {cart.map((item, idx) => (
                                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', backgroundColor: 'white', marginBottom: '5px', borderRadius: '5px' }}>
                                    <span>{item.product_name} x {item.quantity}</span>
                                    <span>₦{item.quantity * item.unit_price}</span>
                                    <button onClick={() => removeFromCart(idx)} style={{ backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>Remove</button>
                                </div>
                            ))}
                        </div>
                    )}

                    <button onClick={submitOrder} disabled={cart.length === 0 || !selectedSupplier} style={{ padding: '10px 20px', backgroundColor: '#22c55e', color: 'white', border: 'none', borderRadius: '5px', cursor: cart.length === 0 || !selectedSupplier ? 'not-allowed' : 'pointer' }}>Submit Order</button>
                </div>
            )}

            {loading ? (
                <p>Loading...</p>
            ) : orders.length === 0 ? (
                <p>No purchase orders yet.</p>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f3f4f6', borderBottom: '2px solid #ddd' }}>
                            <th style={{ padding: '10px', textAlign: 'left' }}>PO Number</th>
                            <th style={{ padding: '10px', textAlign: 'left' }}>Supplier</th>
                            <th style={{ padding: '10px', textAlign: 'left' }}>Total</th>
                            <th style={{ padding: '10px', textAlign: 'left' }}>Status</th>
                            <th style={{ padding: '10px', textAlign: 'left' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order.id} style={{ borderBottom: '1px solid #ddd' }}>
                                <td style={{ padding: '10px' }}>{order.po_number}</td>
                                <td style={{ padding: '10px' }}>{order.supplier_name || '-'}</td>
                                <td style={{ padding: '10px' }}>₦{order.total_amount}</td>
                                <td style={{ padding: '10px' }}>
                                    <span style={{ backgroundColor: getStatusColor(order.status), color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>{order.status}</span>
                                </td>
                                <td style={{ padding: '10px' }}>
                                    {order.status === 'submitted' && (
                                        <button onClick={() => updateStatus(order.id, 'in_transit')} style={{ marginRight: '5px', padding: '5px 10px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>In Transit</button>
                                    )}
                                    {order.status === 'in_transit' && (
                                        <button onClick={() => updateStatus(order.id, 'delivered')} style={{ padding: '5px 10px', backgroundColor: '#22c55e', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Deliver</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default PurchaseOrder;