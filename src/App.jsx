import { useState, useEffect } from "react";
import predictor from './utils/inventoryPredictor';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

function App() {

  // PRODUCT STATE
  const [products, setProducts] = useState(() => {
    const savedProducts = localStorage.getItem("products");
    const defaultProducts = [
      { name: "Power Bank", category: "Electronics", quantity: "100", price: "25000", costPrice: "15000" },
      { name: "Iphone Charger", category: "Electronics", quantity: "100", price: "10000", costPrice: "6000" },
      { name: "Rechargeable Lamp", category: "Electronics", quantity: "50", price: "10500", costPrice: "6300" },
      { name: "Alarm Clock", category: "Electronics", quantity: "50", price: "100", costPrice: "60" },
      { name: "Wristwatch", category: "Electronics", quantity: "50", price: "20000", costPrice: "12000" },
      { name: "Face Mask", category: "Beauty", quantity: "100", price: "2000", costPrice: "1200" }
    ];
    
    if (savedProducts && JSON.parse(savedProducts).length > 0) {
      return JSON.parse(savedProducts);
    } else {
      return defaultProducts;
    }
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [showSuppliersModal, setShowSuppliersModal] = useState(false);
  const [showTaxModal, setShowTaxModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    quantity: "",
    price: "",
    costPrice: ""
  });

  // SUPPLIER STATE - WITH LOCALSTORAGE PERSISTENCE
  const [suppliers, setSuppliers] = useState(() => {
    const savedSuppliers = localStorage.getItem("suppliers");
    if (savedSuppliers) {
      return JSON.parse(savedSuppliers);
    }
    return [
      { id: 1, name: "Lagos Electronics Hub", product: "Power Bank, Iphone Charger", leadTime: "2 days", location: "Ikeja, Lagos" },
      { id: 2, name: "Beauty Distributors Ltd", product: "Face Mask", leadTime: "3 days", location: "Victoria Island, Lagos" },
      { id: 3, name: "Timepieces Nigeria", product: "Wristwatch, Alarm Clock", leadTime: "5 days", location: "Ajah, Lagos" },
      { id: 4, name: "Lighting Solutions NG", product: "Rechargeable Lamp", leadTime: "2 days", location: "Maryland, Lagos" }
    ];
  });

  // SUPPLIER MODAL STATE
  const [showAddSupplierModal, setShowAddSupplierModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [supplierForm, setSupplierForm] = useState({
    name: "",
    product: "",
    leadTime: "",
    location: ""
  });

  // SAVE TO LOCALSTORAGE
  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem("suppliers", JSON.stringify(suppliers));
  }, [suppliers]);

  // PRODUCT HANDLERS
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const addProduct = () => {
    if (!formData.name || !formData.category || !formData.quantity || !formData.price) {
      alert("Please fill all fields");
      return;
    }
    
    const newProduct = {
      ...formData,
      costPrice: formData.costPrice || (Number(formData.price) * 0.6).toString()
    };
    
    setProducts([...products, newProduct]);
    setFormData({
      name: "",
      category: "",
      quantity: "",
      price: "",
      costPrice: ""
    });
  };

  const startEdit = (product, index) => {
    setEditingProduct({ ...product, editIndex: index });
    setFormData({
      name: product.name,
      category: product.category,
      quantity: product.quantity,
      price: product.price,
      costPrice: product.costPrice || ""
    });
    setTimeout(() => {
      const formElement = document.getElementById('add-product-form');
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const saveEdit = () => {
    if (!formData.name || !formData.category || !formData.quantity || !formData.price) {
      alert("Please fill all fields");
      return;
    }
    
    const updatedProducts = [...products];
    updatedProducts[editingProduct.editIndex] = {
      name: formData.name,
      category: formData.category,
      quantity: formData.quantity,
      price: formData.price,
      costPrice: formData.costPrice || (Number(formData.price) * 0.6).toString()
    };
    setProducts(updatedProducts);
    setEditingProduct(null);
    setFormData({
      name: "",
      category: "",
      quantity: "",
      price: "",
      costPrice: ""
    });
  };

  const cancelEdit = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      category: "",
      quantity: "",
      price: "",
      costPrice: ""
    });
  };

  const deleteProduct = (indexToDelete) => {
    const updatedProducts = products.filter((_, index) => index !== indexToDelete);
    setProducts(updatedProducts);
  };

  // SUPPLIER HANDLERS
  const handleSupplierChange = (e) => {
    setSupplierForm({
      ...supplierForm,
      [e.target.name]: e.target.value
    });
  };

  const addSupplier = () => {
    if (!supplierForm.name || !supplierForm.product || !supplierForm.leadTime || !supplierForm.location) {
      alert("Please fill all supplier fields");
      return;
    }
    
    const newSupplier = {
      id: Date.now(),
      name: supplierForm.name,
      product: supplierForm.product,
      leadTime: supplierForm.leadTime,
      location: supplierForm.location
    };
    
    setSuppliers([...suppliers, newSupplier]);
    setSupplierForm({ name: "", product: "", leadTime: "", location: "" });
    setShowAddSupplierModal(false);
  };

  const startEditSupplier = (supplier) => {
    setEditingSupplier(supplier);
    setSupplierForm({
      name: supplier.name,
      product: supplier.product,
      leadTime: supplier.leadTime,
      location: supplier.location
    });
    setShowAddSupplierModal(true);
  };

  const saveEditSupplier = () => {
    if (!supplierForm.name || !supplierForm.product || !supplierForm.leadTime || !supplierForm.location) {
      alert("Please fill all supplier fields");
      return;
    }
    
    const updatedSuppliers = suppliers.map(supplier =>
      supplier.id === editingSupplier.id
        ? { ...supplier,
            name: supplierForm.name,
            product: supplierForm.product,
            leadTime: supplierForm.leadTime,
            location: supplierForm.location
          }
        : supplier
    );
    
    setSuppliers(updatedSuppliers);
    setEditingSupplier(null);
    setSupplierForm({ name: "", product: "", leadTime: "", location: "" });
    setShowAddSupplierModal(false);
  };

  const deleteSupplier = (id) => {
    if (window.confirm("Are you sure you want to delete this supplier?")) {
      const updatedSuppliers = suppliers.filter(supplier => supplier.id !== id);
      setSuppliers(updatedSuppliers);
    }
  };

  const cancelSupplierEdit = () => {
    setEditingSupplier(null);
    setSupplierForm({ name: "", product: "", leadTime: "", location: "" });
    setShowAddSupplierModal(false);
  };

  // CHART DATA
  const categoryData = Object.values(
    products.reduce((acc, product) => {
      if (!acc[product.category]) {
        acc[product.category] = {
          category: product.category,
          total: 0
        };
      }
      acc[product.category].total += Number(product.quantity);
      return acc;
    }, {})
  );

  // TAX CALCULATIONS
  const totalSales = products.reduce((total, p) => total + (Number(p.price) * Number(p.quantity)), 0);
  const totalCost = products.reduce((total, p) => total + ((Number(p.costPrice) || Number(p.price) * 0.6) * Number(p.quantity)), 0);
  const outputVat = products.reduce((total, p) => total + (Number(p.price) * Number(p.quantity) * 0.075), 0);
  const inputVat = products.reduce((total, p) => total + ((Number(p.costPrice) || Number(p.price) * 0.6) * Number(p.quantity) * 0.075), 0);
  const netVatPayable = outputVat - inputVat;
  const estimatedProfit = Math.floor(totalSales * 0.3);
  const citAmount = Math.floor(estimatedProfit * 0.2);

  // SCROLL FUNCTIONS
  const scrollToInventory = () => {
    const element = document.getElementById('inventory-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setShowMenu(false);
  };

  const scrollToAnalytics = () => {
    const element = document.getElementById('analytics-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setShowMenu(false);
  };

  const storeLocation = "Ikeja, Lagos Mainland";
  const tinNumber = "01234567-0001";
  const taxPeriod = "March 2026";

  return (
    <div className="min-h-screen bg-gray-300 flex justify-center items-center p-4">
      <div className="w-full max-w-[390px] bg-white rounded-[40px] shadow-2xl p-5 min-h-[90vh] overflow-y-scroll relative">

        {/* HEADER */}
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-blue-600 text-white w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-bold">S</div>
          <div>
            <h1 className="text-2xl font-extrabold text-gray-800">StockWise SSA</h1>
            <p className="text-sm text-gray-500">Smart Inventory Management</p>
          </div>
        </div>

        {/* LOCATION BANNER */}
        <div className="bg-blue-100 p-3 rounded-xl mb-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span>📍</span>
            <span className="text-sm font-semibold">Store Zone:</span>
            <span className="text-sm">{storeLocation}</span>
          </div>
          <div className="text-xs text-gray-500">🚚 Smart City Supply Chain Active</div>
        </div>

        {/* MENU BUTTON */}
        <div className="mb-6">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="bg-white shadow border rounded-xl px-4 py-3 w-full flex justify-between items-center"
          >
            <span className="font-semibold">Menu</span>
            <span className="text-xl">☰</span>
          </button>

          {showMenu && (
            <div className="bg-white shadow rounded-2xl mt-2 p-3 flex flex-col gap-3 border">
              <button onClick={() => {
                setShowMenu(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }} className="text-left text-blue-600 font-semibold">
                🏠 Dashboard
              </button>
              <button onClick={() => {
                scrollToInventory();
                setShowMenu(false);
              }} className="text-left text-gray-600">
                📋 Inventory
              </button>
              <button onClick={() => { 
                setShowSuppliersModal(true); 
                setShowMenu(false); 
              }} className="text-left text-gray-600">
                🚚 Suppliers
              </button>
              <button onClick={() => { 
                setShowTaxModal(true); 
                setShowMenu(false); 
              }} className="text-left text-gray-600">
                🏛️ Tax Report
              </button>
              <button onClick={() => {
                scrollToAnalytics();
                setShowMenu(false);
              }} className="text-left text-gray-600">
                📊 Analytics
              </button>
            </div>
          )}
        </div>

        {/* DASHBOARD */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="bg-blue-600 text-white p-5 rounded-2xl shadow-lg">
            <h2 className="text-lg font-semibold">Total Products</h2>
            <p className="text-2xl mt-2 font-bold">{products.length}</p>
          </div>
          <div className="bg-red-500 text-white p-5 rounded-2xl shadow-lg">
            <h2 className="text-lg font-semibold">Low Stock Items</h2>
            <p className="text-2xl mt-2 font-bold">{products.filter(p => p.quantity < 5).length}</p>
          </div>
          <div className="bg-green-600 text-white p-5 rounded-2xl shadow-lg">
            <h2 className="text-lg font-semibold">VAT (7.5%)</h2>
            <p className="text-2xl mt-2 font-bold">₦{outputVat.toFixed(2)}</p>
            <p className="text-xs mt-1 opacity-80">Output VAT collected</p>
          </div>
        </div>

        {/* ADD/EDIT PRODUCT FORM */}
        <div id="add-product-form" className="bg-white p-5 rounded-2xl shadow border mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingProduct ? "✏️ Edit Product" : "➕ Add Product"}
          </h2>
          <div className="flex flex-col gap-4">
            <input
              type="text"
              name="name"
              placeholder="Product Name"
              value={formData.name}
              onChange={handleChange}
              className="border p-3 rounded-lg"
            />
            <input
              type="text"
              name="category"
              placeholder="Category"
              value={formData.category}
              onChange={handleChange}
              className="border p-3 rounded-lg"
            />
            <input
              type="number"
              name="quantity"
              placeholder="Quantity"
              value={formData.quantity}
              onChange={handleChange}
              className="border p-3 rounded-lg"
            />
            <input
              type="number"
              name="price"
              placeholder="Selling Price (₦)"
              value={formData.price}
              onChange={handleChange}
              className="border p-3 rounded-lg"
            />
            <input
              type="number"
              name="costPrice"
              placeholder="Cost Price (₦)"
              value={formData.costPrice}
              onChange={handleChange}
              className="border p-3 rounded-lg"
            />
            {editingProduct ? (
              <div className="flex gap-2">
                <button onClick={saveEdit} className="bg-green-600 text-white p-3 rounded-lg font-semibold flex-1">✅ Save Changes</button>
                <button onClick={cancelEdit} className="bg-gray-400 text-white p-3 rounded-lg font-semibold flex-1">Cancel</button>
              </div>
            ) : (
              <button onClick={addProduct} className="bg-blue-600 text-white p-3 rounded-lg font-semibold">Add Product</button>
            )}
          </div>
        </div>

        {/* INVENTORY TABLE */}
        <div id="inventory-section" className="bg-white p-5 rounded-2xl shadow border mb-6">
          <h2 className="text-xl font-semibold mb-4">Inventory List</h2>
          <div className="mb-4">
            <input type="text" placeholder="Search products..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="border p-3 rounded-lg w-full" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Product</th><th className="text-left p-2">Category</th><th className="text-left p-2">Qty</th><th className="text-left p-2">Selling (₦)</th><th className="text-left p-2">Cost (₦)</th><th className="text-left p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())).map((product, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-2">{product.name}</td>
                    <td className="p-2">{product.category}</td>
                    <td className="p-2">{product.quantity < 5 ? <span className="text-red-500 font-bold">Low ({product.quantity})</span> : product.quantity}</td>
                    <td className="p-2">₦{product.price}</td>
                    <td className="p-2">₦{product.costPrice || 'N/A'}</td>
                    <td className="p-2">
                      <div className="flex gap-1">
                        <button onClick={() => startEdit(product, index)} className="bg-blue-500 text-white px-2 py-1 rounded-lg text-xs">Edit</button>
                        <button onClick={() => deleteProduct(index)} className="bg-red-500 text-white px-2 py-1 rounded-lg text-xs">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* SMART INSIGHTS */}
        <div className="bg-purple-50 p-5 rounded-2xl shadow border mb-6">
          <h2 className="text-xl font-semibold mb-4">🤖 Smart Inventory Insights</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center bg-white p-3 rounded-lg">
              <span>📊 Inventory Health Score</span>
              <span className="font-bold text-lg">{predictor.calculateHealthScore(products)}/100</span>
            </div>
            <div className="bg-white p-3 rounded-lg">
              <p className="font-semibold mb-2">🔮 Stockout Predictions</p>
              {products.map(product => {
                const daysLeft = predictor.predictStockoutDays(product.name, Number(product.quantity));
                const isAtRisk = daysLeft !== "No sales data" && daysLeft < 7;
                return (
                  <div key={product.name} className="flex justify-between text-sm py-1">
                    <span>{product.name}</span>
                    <span className={isAtRisk ? "text-red-500 font-bold" : "text-gray-600"}>
                      {daysLeft === "No sales data" ? "📈 Learning..." : `${daysLeft} days predicted (${product.quantity} units)`}
                    </span>
                  </div>
                );
              })}
            </div>
            
            {/* REORDER ALERTS */}
            {products.filter(product => {
              const daysLeft = predictor.predictStockoutDays(product.name, Number(product.quantity));
              return daysLeft !== "No sales data" && daysLeft < 7;
            }).length > 0 && (
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3 rounded-lg">
                <p className="font-semibold text-yellow-700 mb-2">⚠️ Reorder Alerts</p>
                {products.map(product => {
                  const daysLeft = predictor.predictStockoutDays(product.name, Number(product.quantity));
                  if (daysLeft !== "No sales data" && daysLeft < 7) {
                    return (
                      <div key={product.name} className="text-sm mt-2">
                        <p><strong>{product.name}</strong>: Only {daysLeft} days of stock remaining</p>
                        <p className="text-xs text-gray-600">Current stock: {product.quantity} units | Suggested reorder: {Math.ceil(Number(product.quantity) * 0.5)} units</p>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            )}
          </div>
          <div className="text-xs text-gray-400 text-center mt-3">* Predictions based on 7-day sales average. Actual dates may vary.</div>
        </div>

        {/* ANALYTICS */}
        <div id="analytics-section" className="bg-white p-5 rounded-2xl shadow border mb-6">
          <h2 className="text-xl font-semibold mb-4">Inventory Analytics</h2>
          <div className="space-y-3">
            <div className="flex justify-between"><span>Total Inventory Value (Selling)</span><span className="font-bold">₦{totalSales.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Total Cost Value</span><span className="font-bold">₦{totalCost.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Low Stock Products</span><span className="font-bold text-red-500">{products.filter(p => p.quantity < 5).length}</span></div>
            <div className="flex justify-between"><span>Total Units</span><span className="font-bold">{products.reduce((t, p) => t + Number(p.quantity), 0)}</span></div>
          </div>
        </div>

        {/* CHART */}
        <div className="bg-white p-5 rounded-2xl shadow border mb-6">
          <h2 className="text-xl font-semibold mb-4">Inventory Overview</h2>
          <div style={{ width: "100%", height: 250 }}>
            <ResponsiveContainer>
              <BarChart data={categoryData}><XAxis dataKey="category" /><YAxis /><Tooltip /><Bar dataKey="total" fill="#3b82f6" /></BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* SUPPLIERS MODAL */}
        {showSuppliersModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-[350px] w-full max-h-[80vh] overflow-y-auto">
              <div className="bg-green-600 text-white p-4 rounded-t-2xl flex justify-between items-center">
                <h2 className="font-semibold flex items-center gap-2">🚚 Smart City Supply Chain</h2>
                <button onClick={() => setShowSuppliersModal(false)} className="text-white text-xl font-bold">✕</button>
              </div>
              
              <div className="p-4">
                {/* Add Supplier Button */}
                <button
                  onClick={() => {
                    setEditingSupplier(null);
                    setSupplierForm({ name: "", product: "", leadTime: "", location: "" });
                    setShowAddSupplierModal(true);
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm w-full mb-3 flex items-center justify-center gap-2"
                >
                  ➕ Add New Supplier
                </button>
                
                {/* Suppliers List */}
                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                  {suppliers.length === 0 ? (
                    <div className="text-center text-gray-400 py-4">No suppliers yet. Click "Add New Supplier" to get started.</div>
                  ) : (
                    suppliers.map(supplier => (
                      <div key={supplier.id} className="bg-gray-50 p-3 rounded-lg border relative">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="font-bold">{supplier.name}</p>
                            <p className="text-sm text-gray-600">📦 Products: {supplier.product}</p>
                            <p className="text-sm text-gray-600">📍 {supplier.location}</p>
                            <p className="text-sm font-semibold text-green-600">⏱️ Lead Time: {supplier.leadTime}</p>
                          </div>
                          <div className="flex gap-1 ml-2">
                            <button
                              onClick={() => startEditSupplier(supplier)}
                              className="bg-blue-500 text-white px-2 py-1 rounded-lg text-xs"
                            >
                              ✏️ Edit
                            </button>
                            <button
                              onClick={() => deleteSupplier(supplier.id)}
                              className="bg-red-500 text-white px-2 py-1 rounded-lg text-xs"
                            >
                              🗑️ Del
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                
                <div className="mt-3 text-xs text-gray-500 text-center pt-2 border-t">
                  🌍 Integrated with Lagos Smart City Logistics Network
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ADD/EDIT SUPPLIER MODAL */}
        {showAddSupplierModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-[350px] w-full">
              <div className="bg-blue-600 text-white p-4 rounded-t-2xl flex justify-between items-center">
                <h2 className="font-semibold">
                  {editingSupplier ? "✏️ Edit Supplier" : "➕ Add New Supplier"}
                </h2>
                <button onClick={cancelSupplierEdit} className="text-white text-xl font-bold">✕</button>
              </div>
              
              <div className="p-4 space-y-3">
                <input
                  type="text"
                  name="name"
                  placeholder="Supplier Name"
                  value={supplierForm.name}
                  onChange={handleSupplierChange}
                  className="border p-3 rounded-lg w-full"
                />
                <input
                  type="text"
                  name="product"
                  placeholder="Products Supplied"
                  value={supplierForm.product}
                  onChange={handleSupplierChange}
                  className="border p-3 rounded-lg w-full"
                />
                <input
                  type="text"
                  name="leadTime"
                  placeholder="Lead Time (e.g., 2 days)"
                  value={supplierForm.leadTime}
                  onChange={handleSupplierChange}
                  className="border p-3 rounded-lg w-full"
                />
                <input
                  type="text"
                  name="location"
                  placeholder="Location (e.g., Ikeja, Lagos)"
                  value={supplierForm.location}
                  onChange={handleSupplierChange}
                  className="border p-3 rounded-lg w-full"
                />
                
                <div className="flex gap-2">
                  <button
                    onClick={editingSupplier ? saveEditSupplier : addSupplier}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm flex-1"
                  >
                    {editingSupplier ? "✅ Save Changes" : "➕ Add Supplier"}
                  </button>
                  <button
                    onClick={cancelSupplierEdit}
                    className="bg-gray-400 text-white px-4 py-2 rounded-lg text-sm flex-1"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAX MODAL */}
        {showTaxModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-[350px] w-full max-h-[80vh] overflow-y-auto">
              <div className="bg-yellow-600 text-white p-4 rounded-t-2xl flex justify-between items-center">
                <h2 className="font-semibold">🏛️ Nigerian Tax Report (FIRS)</h2>
                <button onClick={() => setShowTaxModal(false)} className="text-white text-xl font-bold">✕</button>
              </div>
              <div className="p-4 space-y-3">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex justify-between"><span>TIN:</span><span>{tinNumber}</span></div>
                  <div className="flex justify-between mt-1"><span>Period:</span><span>{taxPeriod}</span></div>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="font-semibold mb-2">VAT Summary (7.5%)</p>
                  <div className="flex justify-between"><span>Output VAT:</span><span>₦{outputVat.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span>Input VAT:</span><span>₦{inputVat.toLocaleString()}</span></div>
                  <div className="flex justify-between font-bold text-green-600 pt-1 border-t mt-1">
                    <span>Net Payable to FIRS:</span>
                    <span>₦{netVatPayable.toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="font-semibold mb-2">Company Income Tax (CIT)</p>
                  <div className="flex justify-between"><span>Estimated Profit:</span><span>₦{estimatedProfit.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span>CIT (20%):</span><span>₦{citAmount.toLocaleString()}</span></div>
                </div>
                
                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="flex justify-between"><span>📋 Filing Status:</span><span className="text-green-700 font-bold">✅ Up to Date</span></div>
                  <div className="flex justify-between mt-1"><span>📅 Next Filing Due:</span><span>April 30, 2026</span></div>
                </div>
                
                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      const report = `TAX REPORT - ${taxPeriod}\n\nTIN: ${tinNumber}\nPeriod: ${taxPeriod}\n\nVAT SUMMARY (7.5%)\nOutput VAT Collected: ₦${outputVat.toLocaleString()}\nInput VAT Paid: ₦${inputVat.toLocaleString()}\nNet VAT Payable to FIRS: ₦${netVatPayable.toLocaleString()}\n\nCOMPANY INCOME TAX\nEstimated Profit: ₦${estimatedProfit.toLocaleString()}\nCIT (20%): ₦${citAmount.toLocaleString()}\n\nFiling Status: Up to Date\nNext Filing Due: April 30, 2026\n\nGenerated by StockWise SSA - Smart Inventory Management System`;
                      const blob = new Blob([report], { type: 'text/plain' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = 'tax_report.txt';
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm flex-1"
                  >
                    📄 Download Report
                  </button>
                  <button 
                    onClick={() => alert("Submitting tax report to FIRS...")}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm flex-1"
                  >
                    📤 Submit to FIRS
                  </button>
                </div>
                
                <div className="text-xs text-gray-400 text-center pt-2 border-t">
                  🏛️ Integrated with Federal Inland Revenue Service (FIRS)
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;