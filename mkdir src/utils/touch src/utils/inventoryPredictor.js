// Smart Inventory Prediction System
// Paste this entire code into src/utils/inventoryPredictor.js

class SmartInventoryPredictor {
  constructor() {
    // Sample sales history (you'll replace this with real data later)
    this.salesHistory = {
      "Phone charger": [10, 12, 8, 11, 9, 13, 10], // last 7 days
      "Hair cream": [5, 4, 6, 5, 4, 5, 6],
      "Minn toothpaste": [8, 7, 9, 8, 7, 8, 9]
    };
  }

  // Calculate average daily sales (last 7 days)
  calculateAverageDailySales(productName) {
    const history = this.salesHistory[productName];
    if (!history || history.length === 0) return 0;
    
    const sum = history.reduce((a, b) => a + b, 0);
    return +(sum / history.length).toFixed(1);
  }
  
  // Predict days until stockout
  predictStockoutDays(productName, currentStock) {
    const avgDailySales = this.calculateAverageDailySales(productName);
    if (avgDailySales === 0) return "No sales data";
    
    const daysUntilStockout = Math.floor(currentStock / avgDailySales);
    return daysUntilStockout;
  }
  
  // Generate smart reorder suggestion
  getReorderSuggestion(productName, currentStock, unitPrice) {
    const daysRemaining = this.predictStockoutDays(productName, currentStock);
    
    // If less than 14 days of stock remaining and we have valid data
    if (daysRemaining !== "No sales data" && daysRemaining < 14 && daysRemaining > 0) {
      const avgDailySales = this.calculateAverageDailySales(productName);
      const suggestedQuantity = Math.ceil(avgDailySales * 14); // 2 weeks supply
      const estimatedCost = suggestedQuantity * unitPrice;
      
      return {
        alert: "⚠️ LOW STOCK WARNING",
        message: `"${productName}" will run out in ${daysRemaining} days`,
        suggestedOrder: suggestedQuantity,
        estimatedCost: `₦${estimatedCost.toLocaleString()}`,
        urgency: daysRemaining <= 3 ? "HIGH" : "MEDIUM"
      };
    }
    
    return {
      alert: "✅ STOCK HEALTHY",
      message: `"${productName}" has ${daysRemaining} days of stock remaining`,
      suggestedOrder: 0,
      estimatedCost: "₦0",
      urgency: "LOW"
    };
  }
  
  // Get all products needing reorder (dashboard view)
  getReorderRecommendations(products) {
    const recommendations = [];
    
    for (const product of products) {
      const suggestion = this.getReorderSuggestion(
        product.name, 
        product.quantity, 
        product.price
      );
      
      if (suggestion.alert.includes("LOW STOCK")) {
        recommendations.push({
          product: product.name,
          currentStock: product.quantity,
          ...suggestion
        });
      }
    }
    
    return recommendations;
  }
  
  // Calculate inventory health score (0-100)
  calculateHealthScore(products) {
    if (products.length === 0) return 0;
    
    let riskyProducts = 0;
    for (const product of products) {
      const daysRemaining = this.predictStockoutDays(product.name, product.quantity);
      if (daysRemaining !== "No sales data" && daysRemaining < 7) {
        riskyProducts++;
      }
    }
    
    const riskPercentage = (riskyProducts / products.length) * 100;
    const healthScore = Math.max(0, 100 - riskPercentage);
    
    return Math.floor(healthScore);
  }
}

// Export so you can use it in your components
export default new SmartInventoryPredictor();