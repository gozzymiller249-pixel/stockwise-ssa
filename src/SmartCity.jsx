// file: src/SmartCity.jsx
import { useState, useEffect } from 'react';
import { 
    getSmartCityStatus, 
    getSmartCityNodes, 
    getDemandSignals, 
    broadcastStockToSmartCity,
    getRestockRequests,
    updateDeliveryStatus
} from './services/api';

function SmartCity() {
    const [status, setStatus] = useState(null);
    const [nodes, setNodes] = useState([]);
    const [demandSignals, setDemandSignals] = useState([]);
    const [restockRequests, setRestockRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [broadcasting, setBroadcasting] = useState(false);

    useEffect(() => {
        loadSmartCityData();
    }, []);

    const loadSmartCityData = async () => {
        setLoading(true);
        try {
            const statusData = await getSmartCityStatus();
            const nodesData = await getSmartCityNodes();
            const signalsData = await getDemandSignals();
            const requestsData = await getRestockRequests();
            
            setStatus(statusData);
            setNodes(nodesData.nodes || []);
            setDemandSignals(signalsData.demand_signals || []);
            setRestockRequests(requestsData.restock_requests || []);
        } catch (error) {
            console.error('Error loading Smart City data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleBroadcast = async () => {
        setBroadcasting(true);
        try {
            const result = await broadcastStockToSmartCity();
            alert(result.message + '\nLow stock alerts: ' + result.low_stock_alerts);
            loadSmartCityData();
        } catch (error) {
            alert('Broadcast failed: ' + error.message);
        } finally {
            setBroadcasting(false);
        }
    };

    const handleUpdateStatus = async (ref) => {
        try {
            const result = await updateDeliveryStatus(ref);
            alert(`Delivery ${ref}: ${result.status}\nLocation: ${result.location}\nETA: ${result.estimated_arrival}`);
            loadSmartCityData();
        } catch (error) {
            alert('Update failed: ' + error.message);
        }
    };

    const getSignalColor = (forecast) => {
        if (forecast === 'HIGH DEMAND') return '#ef4444';
        if (forecast === 'LOW DEMAND') return '#eab308';
        return '#22c55e';
    };

    return (
        <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '10px', marginBottom: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>🌐 Smart City Supply Chain (CBSCSC)</h2>
                <button 
                    onClick={handleBroadcast}
                    disabled={broadcasting}
                    style={{ padding: '8px 16px', backgroundColor: '#0891b2', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                >
                    {broadcasting ? 'Broadcasting...' : '📡 Broadcast Stock'}
                </button>
            </div>

            {/* Status Banner */}
            {status && (
                <div style={{ backgroundColor: '#f0fdf4', padding: '15px', borderRadius: '10px', marginBottom: '20px', textAlign: 'center' }}>
                    <p>✅ {status.message}</p>
                    <p style={{ fontSize: '12px', marginTop: '5px' }}>🌍 Connected to {status.city || 'Lagos Smart City Network'}</p>
                </div>
            )}

            {loading ? (
                <p>Loading Smart City data...</p>
            ) : (
                <>
                    {/* Demand Signals */}
                    {demandSignals.length > 0 && (
                        <div style={{ marginBottom: '20px' }}>
                            <h3>📊 Demand Signals from Smart City</h3>
                            {demandSignals.map(signal => (
                                <div key={signal.signal_id} style={{ 
                                    backgroundColor: getSignalColor(signal.forecast), 
                                    color: 'white', 
                                    padding: '15px', 
                                    borderRadius: '8px', 
                                    marginBottom: '10px' 
                                }}>
                                    <p style={{ fontWeight: 'bold', margin: 0 }}>{signal.forecast} - {signal.category}</p>
                                    <p style={{ margin: '5px 0 0 0', fontSize: '14px' }}>{signal.message}</p>
                                    <p style={{ margin: '5px 0 0 0', fontSize: '11px' }}>Multiplier: {signal.multiplier}x</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Smart City Nodes */}
                    {nodes.length > 0 && (
                        <div style={{ marginBottom: '20px' }}>
                            <h3>🏪 Smart City Network Nodes</h3>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ backgroundColor: '#f3f4f6', borderBottom: '2px solid #ddd' }}>
                                        <th style={{ padding: '10px', textAlign: 'left' }}>Node ID</th>
                                        <th style={{ padding: '10px', textAlign: 'left' }}>Name</th>
                                        <th style={{ padding: '10px', textAlign: 'left' }}>Location</th>
                                        <th style={{ padding: '10px', textAlign: 'left' }}>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {nodes.map(node => (
                                        <tr key={node.node_id} style={{ borderBottom: '1px solid #ddd' }}>
                                            <td style={{ padding: '10px' }}>{node.node_id}</td>
                                            <td style={{ padding: '10px' }}>{node.name}</td>
                                            <td style={{ padding: '10px' }}>{node.location}</td>
                                            <td style={{ padding: '10px' }}>
                                                <span style={{ backgroundColor: node.status === 'active' ? '#22c55e' : '#eab308', color: 'white', padding: '2px 8px', borderRadius: '4px', fontSize: '12px' }}>
                                                    {node.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Restock Requests */}
                    {restockRequests.length > 0 && (
                        <div>
                            <h3>🚚 Active Restock Requests</h3>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ backgroundColor: '#f3f4f6', borderBottom: '2px solid #ddd' }}>
                                        <th style={{ padding: '10px', textAlign: 'left' }}>PO Number</th>
                                        <th style={{ padding: '10px', textAlign: 'left' }}>Supplier</th>
                                        <th style={{ padding: '10px', textAlign: 'left' }}>Status</th>
                                        <th style={{ padding: '10px', textAlign: 'left' }}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {restockRequests.map(request => (
                                        <tr key={request.id} style={{ borderBottom: '1px solid #ddd' }}>
                                            <td style={{ padding: '10px' }}>{request.po_number}</td>
                                            <td style={{ padding: '10px' }}>{request.supplier_name || '-'}</td>
                                            <td style={{ padding: '10px' }}>{request.status}</td>
                                            <td style={{ padding: '10px' }}>
                                                <button 
                                                    onClick={() => handleUpdateStatus(request.po_number)}
                                                    style={{ padding: '5px 10px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                                                >
                                                    Check Status
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {demandSignals.length === 0 && nodes.length === 0 && restockRequests.length === 0 && (
                        <p style={{ textAlign: 'center', padding: '40px' }}>No Smart City data available. Click "Broadcast Stock" to sync with the network.</p>
                    )}
                </>
            )}

            <div style={{ marginTop: '15px', fontSize: '12px', color: '#666', textAlign: 'center' }}>
                🔗 CBSCSC Stub | Simulated Smart City Supply Chain Integration | Lagos Smart City Network
            </div>
        </div>
    );
}

export default SmartCity;