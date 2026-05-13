console.log("✅ NEW VERSION OF PREDICTOR LOADED - Version 2");
// Smart Inventory Prediction System

class SmartInventoryPredictor {
  constructor() {
    // Sales history for predictions (last 7 days of sales data)
    this.salesHistory = {
  // Fast sellers (will run out in 3-4 days) - ATRISK
  "Power Bank": [25, 24, 26, 23, 25, 24, 25],     // 100 stock ÷ 24 avg = 4 days left → ATRISK ✓
  "Iphone Charger": [30, 28, 32, 29, 31, 30, 29], // 100 stock ÷ 30 avg = 3 days left → ATRISK ✓
  "Face Mask": [35, 33, 37, 34, 36, 35, 34],      // 100 stock ÷ 35 avg = 3 days left → ATRISK ✓
  
  // Slow sellers (will last 10-14 days) - NOT ATRISK
  "Rechargeable Lamp": [4, 5, 3, 6, 4, 5, 4],     // 50 stock ÷ 4.5 avg = 11 days left → SAFE
  "Alarm Clock": [4, 3, 5, 4, 3, 5, 4],          // 50 stock ÷ 4 avg = 12 days left → SAFE
  "Wristwatch": [3, 4, 3, 5, 4, 3, 4]            // 50 stock ÷ 3.7 avg = 13 days left → SAFE
};
  }

  // Calculate average daily sales
  calculateAverageDailySales(productName) {
    let history = this.salesHistory[productName];
    
    if (!history) {
      const matchingKey = Object.keys(this.salesHistory).find(
        key => key.toLowerCase() === productName.toLowerCase()
      );
      history = this.salesHistory[matchingKey];
    }
    
    if (!history || history.length === 0) return 0;
    
    const sum = history.reduce((a, b) => a + b, 0);
    return +(sum / history.length).toFixed(1);
  }
  
  // Predict days until product runs out
  predictStockoutDays(productName, currentStock) {
    const avgDailySales = this.calculateAverageDailySales(productName);
    if (avgDailySales === 0) return "No sales data";
    
    const daysUntilStockout = Math.floor(currentStock / avgDailySales);
    return daysUntilStockout;
  }
  
  // Get smart reorder recommendation
  getReorderSuggestion(productName, currentStock, unitPrice) {
    const daysRemaining = this.predictStockoutDays(productName, currentStock);
    
    if (daysRemaining !== "No sales data" && daysRemaining < 14 && daysRemaining > 0) {
      const avgDailySales = this.calculateAverageDailySales(productName);
      const suggestedQuantity = Math.ceil(avgDailySales * 14);
      const estimatedCost = suggestedQuantity * unitPrice;
      
      return {
        alert: "⚠️ LOW STOCK WARNING",
        message: `${productName} will run out in ${daysRemaining} days`,
        suggestedOrder: suggestedQuantity,
        estimatedCost: `₦${estimatedCost.toLocaleString()}`,
        urgency: daysRemaining <= 3 ? "HIGH" : "MEDIUM"
      };
    }
    
    return {
      alert: "✅ STOCK HEALTHY",
      message: `${productName} has ${daysRemaining} days of stock remaining`,
      suggestedOrder: 0,
      estimatedCost: "₦0",
      urgency: "LOW"
    };
  }
  
  // Get all products that need reordering
  getReorderRecommendations(products) {
    const recommendations = [];
    
    for (const product of products) {
      const suggestion = this.getReorderSuggestion(
        product.name, 
        Number(product.quantity), 
        Number(product.price)
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
  
  // Calculate overall inventory health score (0-100)
  calculateHealthScore(products) {
  if (products.length === 0) return 0;
  
  let atRiskCount = 0;
  
  for (const product of products) {
    const daysRemaining = this.predictStockoutDays(product.name, Number(product.quantity));
    // Count products with less than 7 days of stock
    if (daysRemaining !== "No sales data" && daysRemaining < 7) {
      atRiskCount++;
    }
  }
  
  // Calculate percentage of products that are SAFE (not at risk)
  const safePercentage = ((products.length - atRiskCount) / products.length) * 100;
  
  return Math.floor(safePercentage);
}
}

export default new SmartInventoryPredictor();