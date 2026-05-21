// file: src/OfflineSync.jsx
import { useState, useEffect } from 'react';
import { getPendingSyncItems, processSync, addToOfflineQueue } from './services/api';

function OfflineSync() {
    const [pendingItems, setPendingItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState(false);

    useEffect(() => {
        loadPendingItems();
    }, []);

    const loadPendingItems = async () => {
        setLoading(true);
        try {
            const items = await getPendingSyncItems();
            setPendingItems(items);
        } catch (error) {
            console.error('Error loading pending items:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSync = async () => {
    if (pendingItems.length === 0) {
        alert('No pending items to sync');
        return;
    }
    
    setSyncing(true);
    try {
        // Prepare items with queue_id
        const itemsToSync = pendingItems.map(item => ({
            queue_id: item.id,
            table_name: item.table_name,
            operation: item.operation,
            data: JSON.parse(item.data)
        }));
        
        const result = await processSync(itemsToSync);
        if (result.success) {
            alert(`Sync complete! ${result.synced} items synced, ${result.failed} failed.`);
            loadPendingItems();
            // Reload products to show newly synced items
            window.location.reload();
        } else {
            alert('Sync failed: ' + result.message);
        }
    } catch (error) {
        alert('Sync error: ' + error.message);
    } finally {
        setSyncing(false);
    }
};

    const simulateOfflineAdd = async () => {
        // Simulate adding a product while offline
        const offlineData = {
            name: 'Offline Test Product ' + new Date().getTime(),
            category: 'Test',
            quantity: 10,
            selling_price: 1000,
            cost_price: 600,
            reorder_level: 5
        };
        
        try {
            const result = await addToOfflineQueue('create', 'products', offlineData);
            if (result.success) {
                alert('Product added to offline queue. Will sync when online.');
                loadPendingItems();
            } else {
                alert('Failed to add to queue: ' + result.message);
            }
        } catch (error) {
            alert('Error: ' + error.message);
        }
    };

    return (
        <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '10px', marginBottom: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>🔄 Offline Sync</h2>
                <div>
                    <button 
                        onClick={simulateOfflineAdd}
                        style={{ marginRight: '10px', padding: '8px 16px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                    >
                        Simulate Offline Add
                    </button>
                    <button 
                        onClick={handleSync}
                        disabled={syncing || pendingItems.length === 0}
                        style={{ padding: '8px 16px', backgroundColor: '#22c55e', color: 'white', border: 'none', borderRadius: '5px', cursor: syncing ? 'not-allowed' : 'pointer', opacity: pendingItems.length === 0 ? 0.5 : 1 }}
                    >
                        {syncing ? 'Syncing...' : `Sync Now (${pendingItems.length} items)`}
                    </button>
                </div>
            </div>

            {loading ? (
                <p>Loading pending items...</p>
            ) : pendingItems.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#f9fafb', borderRadius: '10px' }}>
                    <p>✅ No pending sync items</p>
                    <p style={{ fontSize: '14px', color: '#666' }}>Click "Simulate Offline Add" to test offline functionality.</p>
                </div>
            ) : (
                <div>
                    <p>{pendingItems.length} item(s) waiting to sync</p>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f3f4f6', borderBottom: '2px solid #ddd' }}>
                                <th style={{ padding: '10px', textAlign: 'left' }}>Operation</th>
                                <th style={{ padding: '10px', textAlign: 'left' }}>Table</th>
                                <th style={{ padding: '10px', textAlign: 'left' }}>Created</th>
                                <th style={{ padding: '10px', textAlign: 'left' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pendingItems.map(item => (
                                <tr key={item.id} style={{ borderBottom: '1px solid #ddd' }}>
                                    <td style={{ padding: '10px' }}>{item.operation}</td>
                                    <td style={{ padding: '10px' }}>{item.table_name}</td>
                                    <td style={{ padding: '10px' }}>{new Date(item.created_at).toLocaleString()}</td>
                                    <td style={{ padding: '10px' }}>
                                        <span style={{ backgroundColor: '#eab308', color: 'white', padding: '2px 8px', borderRadius: '4px', fontSize: '12px' }}>pending</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            
            <div style={{ marginTop: '15px', fontSize: '12px', color: '#666', textAlign: 'center' }}>
                📱 Offline-first design | Data stored locally when offline, synced when connection restored
            </div>
        </div>
    );
}

export default OfflineSync;