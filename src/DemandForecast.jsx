// file: src/DemandForecast.jsx
import { useState, useEffect } from 'react';
import { getDemandForecast } from './services/api';

function DemandForecast() {
    const [forecasts, setForecasts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadForecasts();
    }, []);

    const loadForecasts = async () => {
        setLoading(true);
        try {
            const data = await getDemandForecast();
            setForecasts(data);
        } catch (error) {
            console.error('Error loading forecasts:', error);
        } finally {
            setLoading(false);
        }
    };

    const getRiskColor = (risk) => {
        switch(risk) {
            case 'CRITICAL': return '#ef4444';
            case 'HIGH': return '#f97316';
            case 'MEDIUM': return '#eab308';
            default: return '#22c55e';
        }
    };

    const getRiskIcon = (risk) => {
        switch(risk) {
            case 'CRITICAL': return '🔴';
            case 'HIGH': return '🟠';
            case 'MEDIUM': return '🟡';
            default: return '🟢';
        }
    };

    const getHealthScore = () => {
        if (forecasts.length === 0) return 100;
        const criticalCount = forecasts.filter(f => f.risk_level === 'CRITICAL').length;
        const highCount = forecasts.filter(f => f.risk_level === 'HIGH').length;
        const score = 100 - ((criticalCount * 25) + (highCount * 10));
        return Math.max(0, Math.min(100, score));
    };

    return (
        <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '10px', marginBottom: '30px' }}>
            <h2>🤖 Smart Demand Forecast</h2>
            
            {/* Health Score */}
            {!loading && forecasts.length > 0 && (
                <div style={{ backgroundColor: '#f0fdf4', padding: '15px', borderRadius: '10px', marginBottom: '20px', textAlign: 'center' }}>
                    <p style={{ fontSize: '14px', color: '#666' }}>Inventory Health Score</p>
                    <p style={{ fontSize: '36px', fontWeight: 'bold', margin: '5px 0' }}>{getHealthScore()}%</p>
                    <p style={{ fontSize: '12px', color: '#666' }}>
                        {getHealthScore() >= 80 ? '✅ Healthy' : getHealthScore() >= 50 ? '⚠️ Needs Attention' : '🔴 Critical - Reorder Soon'}
                    </p>
                </div>
            )}

            {loading ? (
                <p>Loading forecast data...</p>
            ) : forecasts.length === 0 ? (
                <p>No products found. Add products and record transactions to see forecasts.</p>
            ) : (
                <div>
                    {forecasts.map(forecast => (
                        <div key={forecast.product_id} style={{ 
                            border: `2px solid ${getRiskColor(forecast.risk_level)}`, 
                            borderRadius: '10px', 
                            padding: '15px', 
                            marginBottom: '15px',
                            backgroundColor: '#f9fafb'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                <div>
                                    <h3 style={{ margin: 0 }}>{getRiskIcon(forecast.risk_level)} {forecast.product_name}</h3>
                                    <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#666' }}>{forecast.category || 'Uncategorized'}</p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <span style={{ backgroundColor: getRiskColor(forecast.risk_level), color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '12px' }}>
                                        {forecast.risk_level} RISK
                                    </span>
                                </div>
                            </div>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginTop: '15px' }}>
                                <div>
                                    <p style={{ fontSize: '11px', color: '#666', margin: 0 }}>Current Stock</p>
                                    <p style={{ fontSize: '20px', fontWeight: 'bold', margin: '5px 0 0 0' }}>{forecast.current_stock} units</p>
                                </div>
                                <div>
                                    <p style={{ fontSize: '11px', color: '#666', margin: 0 }}>Weekly Sales (7 days)</p>
                                    <p style={{ fontSize: '20px', fontWeight: 'bold', margin: '5px 0 0 0' }}>{forecast.weekly_sales} units</p>
                                </div>
                                <div>
                                    <p style={{ fontSize: '11px', color: '#666', margin: 0 }}>Predicted Weekly Demand</p>
                                    <p style={{ fontSize: '20px', fontWeight: 'bold', margin: '5px 0 0 0' }}>{forecast.predicted_weekly_demand} units</p>
                                </div>
                            </div>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '10px' }}>
                                <div>
                                    <p style={{ fontSize: '11px', color: '#666', margin: 0 }}>Days Until Stockout</p>
                                    <p style={{ fontSize: '18px', fontWeight: 'bold', margin: '5px 0 0 0', color: forecast.days_remaining <= 7 ? '#ef4444' : '#333' }}>
                                        {forecast.days_remaining === 999 ? 'Unlimited' : `${forecast.days_remaining} days`}
                                    </p>
                                </div>
                                <div>
                                    <p style={{ fontSize: '11px', color: '#666', margin: 0 }}>Confidence Score</p>
                                    <p style={{ fontSize: '18px', fontWeight: 'bold', margin: '5px 0 0 0' }}>{forecast.confidence_score}%</p>
                                </div>
                            </div>
                            
                            {forecast.suggested_order > 0 && (
                                <div style={{ backgroundColor: '#fef3c7', padding: '10px', borderRadius: '8px', marginTop: '15px' }}>
                                    <p style={{ margin: 0, fontWeight: 'bold' }}>⚠️ Reorder Suggestion</p>
                                    <p style={{ margin: '5px 0 0 0', fontSize: '14px' }}>
                                        Order {forecast.suggested_order} units to maintain {forecast.reorder_threshold} days of safety stock.
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
            
            <div style={{ marginTop: '15px', fontSize: '12px', color: '#666', textAlign: 'center' }}>
                📊 Forecast based on 7-day moving average | Confidence: High (70% weekly, 30% monthly)
            </div>
        </div>
    );
}

export default DemandForecast;