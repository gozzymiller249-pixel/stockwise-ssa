// file: src/Dashboard.jsx
import { useState, useEffect } from 'react';
import { getProducts, addProduct, deleteProduct, getTransactions, recordStockIn, recordStockOut } from './services/api';
import TaxReport from './TaxReport';
import SupplierManagement from './SupplierManagement';
import PurchaseOrder from './PurchaseOrder';
import CameraScanner from './CameraScanner';
import DemandForecast from './DemandForecast';
import OfflineSync from './OfflineSync';
import SmartCity from './SmartCity';
import FIRSTax from './FIRSTax';
import PaymentGateway from './PaymentGateway';

function Dashboard({ user, onLogout }) {
    const [products, setProducts] = useState([]);
    const [showCameraScanner, setShowCameraScanner] = useState(false);
    const [loading, setLoading] = useState(true);
    const [transactions, setTransactions] = useState([]);
    const [transactionLoading, setTransactionLoading] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState('');
    const [transactionQuantity, setTransactionQuantity] = useState('');
    const [transactionType, setTransactionType] = useState('out');
    const [transactionPrice, setTransactionPrice] = useState('');
    const [menuOpen, setMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('dashboard');
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        quantity: '',
        price: '',
        costPrice: '',
        barcode: ''
    });

    useEffect(() => {
        loadProducts();
        loadTransactions();
    }, []);

    const loadProducts = async () => {
        setLoading(true);
        try {
            const productList = await getProducts();
            setProducts(productList);
        } catch (error) {
            console.error('Error loading products:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadTransactions = async () => {
        setTransactionLoading(true);
        try {
            const transactionList = await getTransactions();
            setTransactions(transactionList);
        } catch (error) {
            console.error('Error loading transactions:', error);
        } finally {
            setTransactionLoading(false);
        }
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.price) {
            alert('Please enter product name and selling price');
            return;
        }
        try {
            const result = await addProduct(formData);
            if (result.success) {
                alert('Product added successfully!');
                setFormData({ name: '', category: '', quantity: '', price: '', costPrice: '', barcode: '' });
                loadProducts();
            } else {
                alert(result.message);
            }
        } catch (error) {
            alert('Failed to add product: ' + error.message);
        }
    };

    const handleDeleteProduct = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await deleteProduct(id);
                loadProducts();
            } catch (error) {
                alert('Failed to delete product: ' + error.message);
            }
        }
    };

    const startEditProduct = (product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            category: product.category || '',
            quantity: product.quantity,
            price: product.selling_price,
            costPrice: product.cost_price || '',
            barcode: product.barcode || ''
        });
    };

    const updateProduct = async () => {
        if (!formData.name || !formData.price) {
            alert('Please enter product name and selling price');
            return;
        }
        try {
            const response = await fetch(`http://172.20.10.2/mima/api/test_product.php?id=${editingProduct.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    category: formData.category,
                    quantity: parseInt(formData.quantity),
                    selling_price: parseFloat(formData.price),
                    cost_price: parseFloat(formData.costPrice),
                    barcode: formData.barcode || null
                })
            });
            const result = await response.json();
            if (result.success) {
                alert('Product updated successfully!');
                setEditingProduct(null);
                setFormData({ name: '', category: '', quantity: '', price: '', costPrice: '', barcode: '' });
                loadProducts();
            } else {
                alert(result.message);
            }
        } catch (error) {
            alert('Failed to update product: ' + error.message);
        }
    };

    const handleTransaction = async () => {
        if (!selectedProduct || !transactionQuantity || transactionQuantity <= 0) {
            alert('Please select a product and enter quantity');
            return;
        }
        try {
            let result;
            if (transactionType === 'in') {
                result = await recordStockIn(selectedProduct, parseInt(transactionQuantity), transactionPrice);
            } else {
                result = await recordStockOut(selectedProduct, parseInt(transactionQuantity), transactionPrice);
            }
            if (result.success) {
                alert(`Transaction recorded! New stock: ${result.new_stock} units. VAT: ₦${result.vat_amount}`);
                loadProducts();
                loadTransactions();
                setSelectedProduct('');
                setTransactionQuantity('');
                setTransactionPrice('');
            } else {
                alert(result.message);
            }
        } catch (error) {
            alert('Failed to record transaction: ' + error.message);
        }
    };

    const menuItems = [
        { id: 'dashboard', name: '🏠 Dashboard' },
        { id: 'suppliers', name: '🚚 Suppliers' },
        { id: 'purchase_orders', name: '📦 Purchase Orders' },
        { id: 'demand_forecast', name: '🤖 Demand Forecast' },
        { id: 'smart_city', name: '🌐 Smart City' },
        { id: 'firs_tax', name: '🏛️ FIRS Tax' },
        { id: 'tax_report', name: '📄 Tax Report' },
        { id: 'payment', name: '💳 Payment Gateway' },
        { id: 'offline_sync', name: '🔄 Offline Sync' },
        { id: 'barcode', name: '📷 Scan Barcode' }
    ];

    const renderSection = () => {
        switch(activeSection) {
            case 'dashboard':
                return (
                    <>
                        {/* Add/Edit Product Form */}
                        <div style={{ backgroundColor: '#f9fafb', padding: '16px', borderRadius: '10px', marginBottom: '20px' }}>
                            <h3 style={{ marginBottom: '15px', fontSize: '18px' }}>{editingProduct ? '✏️ Edit Product' : '➕ Add New Product'}</h3>
                            <form onSubmit={editingProduct ? (e) => { e.preventDefault(); updateProduct(); } : handleAddProduct}>
                                <input type="text" placeholder="Product Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} style={{ width: '100%', padding: '12px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '16px' }} required />
                                <input type="text" placeholder="Category" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} style={{ width: '100%', padding: '12px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '16px' }} />
                                <input type="number" placeholder="Quantity" value={formData.quantity} onChange={(e) => setFormData({ ...formData, quantity: e.target.value })} style={{ width: '100%', padding: '12px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '16px' }} />
                                <input type="number" placeholder="Selling Price (₦)" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} style={{ width: '100%', padding: '12px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '16px' }} required />
                                <input type="number" placeholder="Cost Price (₦)" value={formData.costPrice} onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })} style={{ width: '100%', padding: '12px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '16px' }} />
                                <input type="text" placeholder="Barcode (optional)" value={formData.barcode} onChange={(e) => setFormData({ ...formData, barcode: e.target.value })} style={{ width: '100%', padding: '12px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '16px' }} />
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button type="submit" style={{ flex: 1, padding: '14px', backgroundColor: editingProduct ? '#3b82f6' : '#22c55e', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>
                                        {editingProduct ? 'Update Product' : 'Add Product'}
                                    </button>
                                    {editingProduct && (
                                        <button type="button" onClick={() => { setEditingProduct(null); setFormData({ name: '', category: '', quantity: '', price: '', costPrice: '', barcode: '' }); }} style={{ flex: 1, padding: '14px', backgroundColor: '#6b7280', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>

                        {/* Products List */}
                        <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '10px', marginBottom: '20px', border: '1px solid #ddd' }}>
                            <h3 style={{ marginBottom: '15px', fontSize: '18px' }}>📦 Products</h3>
                            {loading ? <p>Loading...</p> : products.length === 0 ? <p>No products yet.</p> : (
                                <div style={{ overflowX: 'auto' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '500px' }}>
                                        <thead>
                                            <tr style={{ backgroundColor: '#f3f4f6' }}>
                                                <th style={{ padding: '10px', textAlign: 'left' }}>Name</th>
                                                <th style={{ padding: '10px', textAlign: 'left' }}>Qty</th>
                                                <th style={{ padding: '10px', textAlign: 'left' }}>Price</th>
                                                <th style={{ padding: '10px', textAlign: 'left', width: '130px' }}>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {products.map(p => (
                                                <tr key={p.id} style={{ borderBottom: '1px solid #ddd' }}>
                                                    <td style={{ padding: '10px' }}>{p.name}</td>
                                                    <td style={{ padding: '10px' }}>{p.quantity}</td>
                                                    <td style={{ padding: '10px' }}>₦{p.selling_price}</td>
                                                    <td style={{ padding: '10px' }}>
                                                        <div style={{ display: 'flex', gap: '8px', flexDirection: 'row', alignItems: 'center' }}>
                                                            <button onClick={() => startEditProduct(p)} style={{ backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '5px', padding: '6px 12px', fontSize: '12px', cursor: 'pointer', minWidth: '50px' }}>Edit</button>
                                                            <button onClick={() => handleDeleteProduct(p.id)} style={{ backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '5px', padding: '6px 12px', fontSize: '12px', cursor: 'pointer', minWidth: '50px' }}>Del</button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                        {/* Stock Movement */}
                        <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '10px', marginBottom: '20px', border: '1px solid #ddd' }}>
                            <h3 style={{ marginBottom: '15px', fontSize: '18px' }}>📊 Stock Movement</h3>
                            <select value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)} style={{ width: '100%', padding: '12px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '16px' }}>
                                <option value="">Select Product</option>
                                {products.map(p => <option key={p.id} value={p.id}>{p.name} (Stock: {p.quantity})</option>)}
                            </select>
                            <select value={transactionType} onChange={(e) => setTransactionType(e.target.value)} style={{ width: '100%', padding: '12px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '16px' }}>
                                <option value="out">Sale (Stock Out)</option>
                                <option value="in">Purchase (Stock In)</option>
                            </select>
                            <input type="number" placeholder="Quantity" value={transactionQuantity} onChange={(e) => setTransactionQuantity(e.target.value)} style={{ width: '100%', padding: '12px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '16px' }} />
                            <input type="number" placeholder="Unit Price (₦)" value={transactionPrice} onChange={(e) => setTransactionPrice(e.target.value)} style={{ width: '100%', padding: '12px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '16px' }} />
                            <button onClick={handleTransaction} style={{ width: '100%', padding: '14px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>Record Transaction</button>
                        </div>

                        {/* Recent Transactions */}
                        <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '10px', border: '1px solid #ddd' }}>
                            <h3 style={{ marginBottom: '15px', fontSize: '18px' }}>📋 Recent Transactions</h3>
                            {transactionLoading ? <p>Loading...</p> : transactions.length === 0 ? <p>No transactions yet.</p> : (
                                <div style={{ overflowX: 'auto' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '500px' }}>
                                        <thead>
                                            <tr style={{ backgroundColor: '#f3f4f6' }}>
                                                <th style={{ padding: '10px', textAlign: 'left' }}>Date</th>
                                                <th style={{ padding: '10px', textAlign: 'left' }}>Product</th>
                                                <th style={{ padding: '10px', textAlign: 'left' }}>Type</th>
                                                <th style={{ padding: '10px', textAlign: 'left' }}>Qty</th>
                                                <th style={{ padding: '10px', textAlign: 'left' }}>VAT</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {transactions.slice(0, 10).map(t => (
                                                <tr key={t.id} style={{ borderBottom: '1px solid #ddd' }}>
                                                    <td style={{ padding: '10px' }}>{new Date(t.transaction_date).toLocaleDateString()}</td>
                                                    <td style={{ padding: '10px' }}>{t.product_name}</td>
                                                    <td style={{ padding: '10px' }}>{t.type === 'in' ? '📥 In' : '📤 Out'}</td>
                                                    <td style={{ padding: '10px' }}>{t.quantity}</td>
                                                    <td style={{ padding: '10px' }}>₦{t.vat_amount}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </>
                );
            case 'suppliers':
                return <SupplierManagement />;
            case 'purchase_orders':
                return <PurchaseOrder />;
            case 'demand_forecast':
                return <DemandForecast />;
            case 'offline_sync':
                return <OfflineSync />;
            case 'smart_city':
                return <SmartCity />;
            case 'firs_tax':
                return <FIRSTax />;
            case 'payment':
                return <PaymentGateway />;
            case 'tax_report':
                return <TaxReport />;
            case 'barcode':
                return (
                    <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px' }}>
                        <h3 style={{ marginBottom: '15px' }}>📷 Scan Barcode</h3>
                        
                        <button
                            onClick={() => setShowCameraScanner(true)}
                            style={{
                                width: '100%',
                                padding: '14px',
                                backgroundColor: '#22c55e',
                                color: 'white',
                                border: 'none',
                                borderRadius: '10px',
                                fontSize: '16px',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                marginBottom: '20px'
                            }}
                        >
                            📸 Open Camera Scanner
                        </button>
                        
                        <p style={{ textAlign: 'center', marginBottom: '15px', color: '#666' }}>— OR —</p>
                        
                        <p>Enter barcode number manually:</p>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            const barcode = e.target.barcode.value;
                            if (barcode) {
                                const product = products.find(p => p.barcode === barcode);
                                if (product) {
                                    alert(`Found: ${product.name}\nStock: ${product.quantity}\nPrice: ₦${product.selling_price}`);
                                    setActiveSection('dashboard');
                                    setEditingProduct(product);
                                    setFormData({
                                        name: product.name,
                                        category: product.category || '',
                                        quantity: product.quantity,
                                        price: product.selling_price,
                                        costPrice: product.cost_price || '',
                                        barcode: product.barcode || ''
                                    });
                                } else {
                                    alert('Product not found. You can add it manually.');
                                }
                                e.target.barcode.value = '';
                            }
                        }}>
                            <input
                                name="barcode"
                                type="text"
                                placeholder="Enter barcode number"
                                style={{
                                    width: '100%',
                                    padding: '14px',
                                    fontSize: '16px',
                                    border: '2px solid #3b82f6',
                                    borderRadius: '10px',
                                    marginBottom: '15px'
                                }}
                            />
                            <button
                                type="submit"
                                style={{
                                    width: '100%',
                                    padding: '14px',
                                    backgroundColor: '#3b82f6',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '10px',
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                    cursor: 'pointer'
                                }}
                            >
                                Search Barcode
                            </button>
                        </form>
                        <p style={{ fontSize: '12px', color: '#666', marginTop: '15px', textAlign: 'center' }}>
                            When you add a product, you can assign a barcode number.
                        </p>
                    </div>
                );
            default:
                return <Dashboard />;
        }
    };

    return (
        <div style={{ maxWidth: '500px', margin: '0 auto', padding: '16px', backgroundColor: '#f3f4f6', minHeight: '100vh' }}>
            {/* Header with Hamburger Menu */}
            <div style={{ backgroundColor: '#2563eb', padding: '16px', borderRadius: '12px', marginBottom: '20px', position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 style={{ color: 'white', margin: 0, fontSize: '20px' }}>StockWise SSA</h1>
                        <p style={{ color: '#bfdbfe', margin: '5px 0 0 0', fontSize: '12px' }}>Welcome, {user?.business_name || user?.phone}</p>
                    </div>
                    <button onClick={() => setMenuOpen(!menuOpen)} style={{ backgroundColor: 'transparent', border: 'none', fontSize: '28px', cursor: 'pointer', color: 'white', padding: '8px' }}>☰</button>
                </div>

                {/* Dropdown Menu */}
                {menuOpen && (
                    <div style={{ position: 'absolute', top: '70px', right: '10px', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', zIndex: 1000, width: '220px', overflow: 'hidden' }}>
                        {menuItems.map(item => (
                            <button
                                key={item.id}
                                onClick={() => { setActiveSection(item.id); setMenuOpen(false); }}
                                style={{ display: 'block', width: '100%', padding: '14px 16px', textAlign: 'left', border: 'none', backgroundColor: activeSection === item.id ? '#e0e7ff' : 'white', cursor: 'pointer', fontSize: '14px', borderBottom: '1px solid #eee' }}
                            >
                                {item.name}
                            </button>
                        ))}
                        <div style={{ height: '1px', backgroundColor: '#ddd', margin: '5px 0' }}></div>
                        <button
                            onClick={() => { onLogout(); setMenuOpen(false); }}
                            style={{ display: 'block', width: '100%', padding: '14px 16px', textAlign: 'left', border: 'none', backgroundColor: '#fee2e2', color: '#dc2626', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' }}
                        >
                            🚪 Logout
                        </button>
                    </div>
                )}
            </div>

            {/* Active Section Content */}
            {renderSection()}

            {/* Camera Scanner Modal */}
            {showCameraScanner && (
                <CameraScanner
                    onScan={(barcode) => {
                        const product = products.find(p => p.barcode === barcode);
                        if (product) {
                            alert(`Found: ${product.name}\nStock: ${product.quantity}\nPrice: ₦${product.selling_price}`);
                            setActiveSection('dashboard');
                            setEditingProduct(product);
                            setFormData({
                                name: product.name,
                                category: product.category || '',
                                quantity: product.quantity,
                                price: product.selling_price,
                                costPrice: product.cost_price || '',
                                barcode: product.barcode || ''
                            });
                        } else {
                            alert('Product not found. You can add it manually.');
                        }
                        setShowCameraScanner(false);
                    }}
                    onClose={() => setShowCameraScanner(false)}
                />
            )}
        </div>
    );
}

export default Dashboard;