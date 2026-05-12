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

  const [products, setProducts] = useState(() => {
    const savedProducts = localStorage.getItem("products");
    return savedProducts ? JSON.parse(savedProducts) : [];
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [showMenu, setShowMenu] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    quantity: "",
    price: ""
  });

  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const addProduct = () => {

    if (
      !formData.name ||
      !formData.category ||
      !formData.quantity ||
      !formData.price
    ) {
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
    const updatedProducts = products.filter(
      (_, index) => index !== indexToDelete
    );
    setProducts(updatedProducts);
  };

  return (
    <div className="min-h-screen bg-gray-300 flex justify-center items-center p-4">
      <div className="w-full max-w-[390px] bg-white rounded-[40px] shadow-2xl p-5 min-h-[90vh] overflow-y-scroll">

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

        {/* COLLAPSIBLE MENU */}
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
              <button className="text-left text-blue-600 font-semibold">Home</button>
              <button className="text-left text-gray-600">Stock</button>
              <button className="text-left text-gray-600">Reports</button>
              <button className="text-left text-gray-600">More</button>
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
            <h2 className="text-lg font-semibold">VAT Estimate</h2>
            <p className="text-2xl mt-2 font-bold">
              ₦{products.reduce((total, product) =>
                total + (product.price * product.quantity * 0.075), 0).toFixed(2)}
            </p>
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
            
            {/* Stock Predictions */}
            <div className="bg-white p-3 rounded-lg">
              <p className="font-semibold mb-2">🔮 Stockout Predictions</p>
              {products.length === 0 ? (
                <p className="text-gray-400 text-sm">Add products to see predictions</p>
              ) : (
                products.map(product => {
                  const daysLeft = predictor.predictStockoutDays(product.name, Number(product.quantity));
                  return (
                    <div key={product.name} className="flex justify-between text-sm py-1">
                      <span>{product.name}</span>
                      <span className={daysLeft < 7 ? "text-red-500 font-bold" : "text-gray-600"}>
                        {daysLeft === "No sales data" ? "📈 Learning..." : `${daysLeft} days left`}
                      </span>
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
        </div>

        {/* ANALYTICS */}
        <div className="bg-white p-5 rounded-2xl shadow border mb-6">
          <h2 className="text-xl font-semibold mb-4">Inventory Analytics</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Total Inventory Value</span>
              <span className="font-bold">
                ₦{products.reduce((total, product) =>
                  total + (product.price * product.quantity), 0).toFixed(2)}
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
                <Bar dataKey="total" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* FORM */}
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
        <div className="bg-white p-5 rounded-2xl shadow border">
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

      </div>
    </div>
  );
}

export default App;