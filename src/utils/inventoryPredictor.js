// Smart Inventory Prediction System

class SmartInventoryPredictor {
  constructor() {
    // Sales history for predictions (last 7 days of sales data)
    this.salesHistory = {
  "Power Bank": [15, 14, 16, 13, 15, 14, 15],
  "Iphone Charger": [12, 11, 13, 10, 12, 11, 12],
  "Rechargeable Lamp": [8, 7, 9, 8, 7, 8, 9],
  "Alarm Clock": [5, 6, 5, 4, 5, 6, 5],
  "Wristwatch": [3, 4, 3, 5, 4, 3, 4],
  "Face Mask": [20, 18, 22, 19, 21, 20, 19]
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
    
    let totalScore = 0;
    for (const product of products) {
      const daysRemaining = this.predictStockoutDays(product.name, Number(product.quantity));
      if (daysRemaining !== "No sales data" && typeof daysRemaining === 'number') {
        const score = Math.min(100, (daysRemaining / 30) * 100);
        totalScore += score;
      } else {
        totalScore += 50;
      }
    }
    
    return Math.floor(totalScore / products.length);
  }
}

export default new SmartInventoryPredictor();