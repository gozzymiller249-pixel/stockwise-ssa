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
      { name: "Power Bank", category: "Electronics", quantity: "100", price: "25000" },
      { name: "Iphone Charger", category: "Electronics", quantity: "100", price: "10000" },
      { name: "Rechargeable Lamp", category: "Electronics", quantity: "50", price: "10500" },
      { name: "Alarm Clock", category: "Electronics", quantity: "50", price: "100" },
      { name: "Wristwatch", category: "Electronics", quantity: "50", price: "20000" },
      { name: "Face Mask", category: "Beauty", quantity: "100", price: "2000" }
    ];
    
    if (savedProducts && JSON.parse(savedProducts).length > 0) {
      return JSON.parse(savedProducts);
    } else {
      return defaultProducts;
    }
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  
  // MODAL STATES
  const [showSuppliersModal, setShowSuppliersModal] = useState(false);
  const [showTaxModal, setShowTaxModal] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    quantity: "",
    price: ""
  });

  // SUPPLIERS STATE - Smart City Supply Chain
  const [suppliers] = useState([
    { id: 1, name: "Lagos Electronics Hub", product: "Power Bank, Iphone Charger", leadTime: "2 days", location: "Ikeja, Lagos" },
    { id: 2, name: "Beauty Distributors Ltd", product: "Face Mask", leadTime: "3 days", location: "Victoria Island, Lagos" },
    { id: 3, name: "Timepieces Nigeria", product: "Wristwatch, Alarm Clock", leadTime: "5 days", location: "Ajah, Lagos" },
    { id: 4, name: "Lighting Solutions NG", product: "Rechargeable Lamp", leadTime: "2 days", location: "Maryland, Lagos" }
  ]);

  // STORE LOCATION - Smart City Integration
  const [storeLocation] = useState("Ikeja, Lagos Mainland");

  // TAX STATE - Nigerian Tax System
  const [tinNumber] = useState("01234567-0001");
  const [taxPeriod] = useState("March 2026");

  // SAVE TO LOCALSTORAGE
  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

  // FORM HANDLERS
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
    setProducts([...products, formData]);
    setFormData({
      name: "",
      category: "",
      quantity: "",
      price: ""
    });
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

  const deleteProduct = (indexToDelete) => {
    const updatedProducts = products.filter((_, index) => index !== indexToDelete);
    setProducts(updatedProducts);
  };

  // TAX CALCULATIONS
  const totalSales = products.reduce((total, p) => total + (Number(p.price) * Number(p.quantity)), 0);
  const vatCollected = products.reduce((total, p) => total + (Number(p.price) * Number(p.quantity) * 0.075), 0);
  const estimatedProfit = Math.floor(totalSales * 0.3);
  const citAmount = Math.floor(estimatedProfit * 0.2);

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
  return (
    <div className="min-h-screen bg-gray-300 flex justify-center items-center p-4">
      <div className="w-full max-w-[390px] bg-white rounded-[40px] shadow-2xl p-5 min-h-[90vh] overflow-y-scroll relative">

        {/* HEADER */}
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-blue-600 text-white w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-bold">
            S
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-gray-800">
              StockWise SSA
            </h1>
            <p className="text-sm text-gray-500">
              Smart Inventory Management
            </p>
          </div>
        </div>

        {/* LOCATION BANNER - Smart City Integration */}
        <div className="bg-blue-100 p-3 rounded-xl mb-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span>📍</span>
            <span className="text-sm font-semibold">Store Zone:</span>
            <span className="text-sm">{storeLocation}</span>
          </div>
          <div className="text-xs text-gray-500">
            <span>🚚 Smart City Supply Chain Active</span>
          </div>
        </div>

        {/* COLLAPSIBLE MENU BUTTON */}
        <div className="mb-6">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="bg-white shadow border rounded-xl px-4 py-3 w-full flex justify-between items-center"
          >
            <span className="font-semibold">Menu</span>
            <span className="text-xl">☰</span>
          </button>

                    {/* DROPDOWN MENU */}
          {showMenu && (
            <div className="bg-white shadow rounded-2xl mt-2 p-3 flex flex-col gap-3 border">
              <button 
                onClick={() => {
                  setShowMenu(false);
                }}
                className="text-left text-blue-600 font-semibold"
              >
                🏠 Home
              </button>
              <button 
                onClick={() => {
                  scrollToInventory();
                }}
                className="text-left text-gray-600"
              >
                📦 Stock
              </button>
              <button 
                onClick={() => {
                  setShowSuppliersModal(true);
                  setShowMenu(false);
                }}
                className="text-left text-gray-600"
              >
                🚚 Suppliers (Smart City)
              </button>
              <button 
                onClick={() => {
                  setShowTaxModal(true);
                  setShowMenu(false);
                }}
                className="text-left text-gray-600"
              >
                🏛️ Tax Report (FIRS)
              </button>
              <button 
                onClick={() => {
                  scrollToAnalytics();
                }}
                className="text-left text-gray-600"
              >
                📈 Reports
              </button>
            </div>
          )}
        </div>

        {/* DASHBOARD - Three Cards */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="bg-blue-600 text-white p-5 rounded-2xl shadow-lg">
            <h2 className="text-lg font-semibold">Total Products</h2>
            <p className="text-2xl mt-2 font-bold">{products.length}</p>
          </div>

          <div className="bg-red-500 text-white p-5 rounded-2xl shadow-lg">
            <h2 className="text-lg font-semibold">Low Stock Items</h2>
            <p className="text-2xl mt-2 font-bold">
              {products.filter(product => product.quantity < 5).length}
            </p>
          </div>

          <div className="bg-green-600 text-white p-5 rounded-2xl shadow-lg">
            <h2 className="text-lg font-semibold">VAT Collection (7.5%)</h2>
            <p className="text-2xl mt-2 font-bold">
              ₦{vatCollected.toFixed(2)}
            </p>
            <p className="text-xs mt-1 opacity-80">To be remitted to FIRS</p>
          </div>
        </div>
        {/* ADD PRODUCT FORM */}
        <div className="bg-white p-5 rounded-2xl shadow border mb-6">
          <h2 className="text-xl font-semibold mb-4">Add Product</h2>
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
              placeholder="Price"
              value={formData.price}
              onChange={handleChange}
              className="border p-3 rounded-lg"
            />
            <button
              onClick={addProduct}
              className="bg-blue-600 text-white p-3 rounded-lg font-semibold"
            >
              Add Product
            </button>
          </div>
        </div>

        {/* INVENTORY TABLE */}
        <div id="inventory-section" className="bg-white p-5 rounded-2xl shadow border">
          <h2 className="text-xl font-semibold mb-4">Inventory List</h2>
          
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border p-3 rounded-lg w-full"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Product</th>
                  <th className="text-left p-2">Category</th>
                  <th className="text-left p-2">Qty</th>
                  <th className="text-left p-2">Price</th>
                  <th className="text-left p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {products
                  .filter(product =>
                    product.name.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((product, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-2">{product.name}</td>
                      <td className="p-2">{product.category}</td>
                      <td className="p-2">
                        {product.quantity < 5 ? (
                          <span className="text-red-500 font-bold">
                            Low ({product.quantity})
                          </span>
                        ) : (
                          product.quantity
                        )}
                      </td>
                      <td className="p-2">₦{product.price}</td>
                      <td className="p-2">
                        <button
                          onClick={() => deleteProduct(index)}
                          className="bg-red-500 text-white px-2 py-1 rounded-lg text-xs"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
        
                {/* SMART INSIGHTS - Purple Section */}
        <div className="bg-purple-50 p-5 rounded-2xl shadow border mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            🤖 Smart Inventory Insights
          </h2>
          
          <div className="space-y-3">
            {/* Inventory Health Score */}
            <div className="flex justify-between items-center bg-white p-3 rounded-lg">
              <span>📊 Inventory Health Score</span>
              <span className="font-bold text-lg">{predictor.calculateHealthScore(products)}/100</span>
            </div>
            
            {/* Stock Predictions - Shows both days predicted AND current stock */}
            <div className="bg-white p-3 rounded-lg">
              <p className="font-semibold mb-2">🔮 Stockout Predictions</p>
              {products.length === 0 ? (
                <p className="text-gray-400 text-sm">Add products to see predictions</p>
              ) : (
                products.map(product => {
                  const daysLeft = predictor.predictStockoutDays(product.name, Number(product.quantity));
                  const currentStock = Number(product.quantity);
                  return (
                    <div key={product.name} className="flex justify-between items-center text-sm py-1">
                      <span>{product.name}</span>
                      <div className="text-right">
                        <span className={daysLeft < 7 ? "text-red-500 font-bold" : "text-gray-600"}>
                          {daysLeft === "No sales data" ? "📈 Learning..." : `${daysLeft} days predicted`}
                        </span>
                        <span className="text-gray-400 text-xs ml-2">
                          ({currentStock} units)
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            
            {/* Reorder Alerts */}
            {predictor.getReorderRecommendations(products).length > 0 && (
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3 rounded-lg">
                <p className="font-semibold text-yellow-700">⚠️ Reorder Alerts</p>
                {predictor.getReorderRecommendations(products).map(rec => (
                  <div key={rec.product} className="text-sm mt-1">
                    <p><strong>{rec.product}</strong>: {rec.message}</p>
                    <p className="text-xs text-gray-600">Suggested: {rec.suggestedOrder} units</p>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Disclaimer - Predictions are not guarantees */}
          <div className="text-xs text-gray-400 text-center mt-3 pt-2 border-t border-purple-200">
            * Predictions based on 7-day sales average. Actual stockout dates may vary due to demand changes.
          </div>
          
          <div className="text-xs text-gray-500 text-center mt-1">
            🌍 Smart City Integration | Lagos Supply Chain Network | FIRS Tax Compliant
          </div>
        </div>

        {/* ANALYTICS */}
        <div id="analytics-section" className="bg-white p-5 rounded-2xl shadow border mb-6">
          <h2 className="text-xl font-semibold mb-4">Inventory Analytics</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Total Inventory Value</span>
              <span className="font-bold">
                ₦{totalSales.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Low Stock Products</span>
              <span className="font-bold text-red-500">
                {products.filter(product => product.quantity < 5).length}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Total Units</span>
              <span className="font-bold">
                {products.reduce((total, product) =>
                  total + Number(product.quantity), 0)}
              </span>
            </div>
          </div>
        </div>

        {/* CHART */}
        <div className="bg-white p-5 rounded-2xl shadow border mb-6">
          <h2 className="text-xl font-semibold mb-4">Inventory Overview</h2>
          <div style={{ width: "100%", height: 250 }}>
            <ResponsiveContainer>
              <BarChart data={categoryData}>
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* SUPPLIERS MODAL (POPUP) */}
        {showSuppliersModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-[350px] w-full max-h-[80vh] overflow-y-auto">
              <div className="bg-green-600 text-white p-4 rounded-t-2xl flex justify-between items-center">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  🚚 Smart City Supply Chain
                </h2>
                <button 
                  onClick={() => setShowSuppliersModal(false)}
                  className="text-white text-2xl font-bold"
                >
                  ✕
                </button>
              </div>
              
              <div className="p-4 space-y-3">
                {suppliers.map(supplier => (
                  <div key={supplier.id} className="bg-gray-50 p-3 rounded-lg border">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold">{supplier.name}</p>
                        <p className="text-sm text-gray-600">Products: {supplier.product}</p>
                        <p className="text-sm text-gray-600">📍 {supplier.location}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-green-600">Lead Time: {supplier.leadTime}</p>
                        <p className="text-xs text-gray-400">Smart City Verified</p>
                      </div>
                    </div>
                  </div>
                ))}
                
                <div className="mt-3 text-xs text-gray-500 text-center pt-2 border-t">
                  🌍 Integrated with Lagos Smart City Logistics Network
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAX REPORT MODAL (POPUP) */}
        {showTaxModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-[350px] w-full max-h-[80vh] overflow-y-auto">
              <div className="bg-yellow-600 text-white p-4 rounded-t-2xl flex justify-between items-center">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  🏛️ Nigerian Tax Report (FIRS)
                </h2>
                <button 
                  onClick={() => setShowTaxModal(false)}
                  className="text-white text-2xl font-bold"
                >
                  ✕
                </button>
              </div>
              
              <div className="p-4 space-y-3">
                {/* TIN Information */}
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex justify-between">
                    <span className="font-semibold">Tax ID (TIN):</span>
                    <span>{tinNumber}</span>
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="font-semibold">Tax Period:</span>
                    <span>{taxPeriod}</span>
                  </div>
                </div>
                
                {/* Tax Calculations */}
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="font-semibold mb-2">Tax Summary</p>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Total Sales (excl. VAT):</span>
                      <span>₦{totalSales.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>VAT Collected (7.5%):</span>
                      <span className="font-bold">₦{vatCollected.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-green-600 font-bold">
                      <span>Payable to FIRS:</span>
                      <span>₦{vatCollected.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                
                {/* Company Income Tax */}
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="font-semibold mb-2">Company Income Tax (CIT)</p>
                  <div className="flex justify-between text-sm">
                    <span>Estimated Annual Profit:</span>
                    <span>₦{estimatedProfit.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>CIT Rate (20%):</span>
                    <span>₦{citAmount.toLocaleString()}</span>
                  </div>
                </div>
                
                {/* Filing Status */}
                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span>📋 Filing Status:</span>
                    <span className="font-bold text-green-700">✅ Up to Date</span>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span>📅 Next Filing Due:</span>
                    <span>April 30, 2026</span>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button 
                    onClick={() => alert("Tax report would download as PDF")}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm flex-1"
                  >
                    Download PDF
                  </button>
                  <button 
                    onClick={() => alert("Submitting tax report to FIRS...")}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm flex-1"
                  >
                    Submit to FIRS
                  </button>
                </div>
                
                <div className="text-xs text-gray-500 text-center pt-2">
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