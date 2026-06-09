// file: src/DriverDashboard.jsx
import { useState, useEffect } from 'react';

function DriverDashboard({ user, onLogout }) {
    const [deliveries, setDeliveries] = useState([]);
    const [myDeliveries, setMyDeliveries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [driverStatus, setDriverStatus] = useState('available'); // available, on_delivery
    const [currentLocation, setCurrentLocation] = useState('');
    const [menuOpen, setMenuOpen] = useState(false);

    // Mock data - will be replaced with API calls later
    useEffect(() => {
        // Simulate loading deliveries
        setTimeout(() => {
            setDeliveries([
                { id: 1, shop: "Ikeja Electronics", pickup: "Ikeja, Lagos", delivery: "Maryland, Lagos", distance: "5.2 km", fee: 1500, items: "Power Bank x 2" },
                { id: 2, shop: "Beauty World", pickup: "Victoria Island", delivery: "Lekki Phase 1", distance: "12 km", fee: 3000, items: "Face Mask x 5" },
                { id: 3, shop: "Tech Hub", pickup: "Yaba", delivery: "Surulere", distance: "4.5 km", fee: 1200, items: "Phone Charger x 3" },
            ]);
            setMyDeliveries([
                { id: 101, shop: "Ikeja Electronics", pickup: "Ikeja", delivery: "Ogowu", status: "in_transit", customer: "John Doe", eta: "15 min", fee: 1800 },
            ]);
            setLoading(false);
        }, 1000);
    }, []);

    const acceptDelivery = (delivery) => {
        alert(`You accepted delivery #${delivery.id} from ${delivery.shop}`);
        // Move from available to my deliveries
        setMyDeliveries([...myDeliveries, { ...delivery, status: 'assigned', customer: 'Pending', eta: 'Pick up soon' }]);
        setDeliveries(deliveries.filter(d => d.id !== delivery.id));
    };

    const updateStatus = (deliveryId, newStatus) => {
        setMyDeliveries(myDeliveries.map(d => 
            d.id === deliveryId ? { ...d, status: newStatus } : d
        ));
        
        let message = '';
        switch(newStatus) {
            case 'picked_up':
                message = 'Order picked up. Heading to customer.';
                break;
            case 'delivered':
                message = 'Order delivered! Payment will be processed.';
                break;
            default:
                message = `Status updated to ${newStatus}`;
        }
        alert(message);
    };

    const getStatusBadge = (status) => {
        const badges = {
            'assigned': { text: 'Assigned', color: '#eab308' },
            'picked_up': { text: 'Picked Up', color: '#3b82f6' },
            'in_transit': { text: 'In Transit', color: '#3b82f6' },
            'delivered': { text: 'Delivered', color: '#22c55e' }
        };
        const b = badges[status] || { text: status, color: '#6b7280' };
        return <span style={{ backgroundColor: b.color, color: 'white', padding: '2px 8px', borderRadius: '20px', fontSize: '11px' }}>{b.text}</span>;
    };

    // Today's earnings
    const todayEarnings = myDeliveries.filter(d => d.status === 'delivered').reduce((sum, d) => sum + d.fee, 0);
    const pendingEarnings = myDeliveries.filter(d => d.status !== 'delivered').reduce((sum, d) => sum + d.fee, 0);

    return (
        <div style={{ maxWidth: '500px', margin: '0 auto', padding: '16px', backgroundColor: '#f3f4f6', minHeight: '100vh' }}>
            {/* Header */}
            <div style={{ backgroundColor: '#2563eb', padding: '16px', borderRadius: '12px', marginBottom: '20px', position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 style={{ color: 'white', margin: 0, fontSize: '20px' }}>StockWise Driver</h1>
                        <p style={{ color: '#bfdbfe', margin: '5px 0 0 0', fontSize: '12px' }}>Welcome, {user?.business_name || user?.phone || 'Driver'}</p>
                    </div>
                    <button onClick={() => setMenuOpen(!menuOpen)} style={{ backgroundColor: 'transparent', border: 'none', fontSize: '28px', cursor: 'pointer', color: 'white', padding: '8px' }}>☰</button>
                </div>

                {/* Dropdown Menu */}
                {menuOpen && (
                    <div style={{ position: 'absolute', top: '70px', right: '10px', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', zIndex: 1000, width: '180px', overflow: 'hidden' }}>
                        <button onClick={() => { setMenuOpen(false); }} style={{ display: 'block', width: '100%', padding: '14px 16px', textAlign: 'left', border: 'none', backgroundColor: 'white', cursor: 'pointer', fontSize: '14px', borderBottom: '1px solid #eee' }}>🏠 Dashboard</button>
                        <button onClick={() => { setMenuOpen(false); alert('Earnings page coming soon'); }} style={{ display: 'block', width: '100%', padding: '14px 16px', textAlign: 'left', border: 'none', backgroundColor: 'white', cursor: 'pointer', fontSize: '14px', borderBottom: '1px solid #eee' }}>💰 Earnings</button>
                        <button onClick={() => { setMenuOpen(false); alert('Profile page coming soon'); }} style={{ display: 'block', width: '100%', padding: '14px 16px', textAlign: 'left', border: 'none', backgroundColor: 'white', cursor: 'pointer', fontSize: '14px', borderBottom: '1px solid #eee' }}>👤 Profile</button>
                        <div style={{ height: '1px', backgroundColor: '#ddd', margin: '5px 0' }}></div>
                        <button onClick={onLogout} style={{ display: 'block', width: '100%', padding: '14px 16px', textAlign: 'left', border: 'none', backgroundColor: '#fee2e2', color: '#dc2626', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' }}>🚪 Logout</button>
                    </div>
                )}
            </div>

            {/* Driver Status & Earnings */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
                <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '12px', flex: 1, textAlign: 'center' }}>
                    <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>Today's Earnings</p>
                    <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '5px 0 0 0' }}>₦{todayEarnings.toLocaleString()}</p>
                </div>
                <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '12px', flex: 1, textAlign: 'center' }}>
                    <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>Pending Earnings</p>
                    <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '5px 0 0 0', color: '#eab308' }}>₦{pendingEarnings.toLocaleString()}</p>
                </div>
            </div>

            {/* Driver Status Toggle */}
            <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '12px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <p style={{ fontWeight: 'bold', margin: 0 }}>Driver Status</p>
                    <p style={{ fontSize: '12px', color: '#666', margin: '5px 0 0 0' }}>{driverStatus === 'available' ? '✅ You are online and available' : '🚚 On a delivery'}</p>
                </div>
                <button 
                    onClick={() => setDriverStatus(driverStatus === 'available' ? 'on_delivery' : 'available')}
                    style={{ padding: '8px 16px', backgroundColor: driverStatus === 'available' ? '#22c55e' : '#eab308', color: 'white', border: 'none', borderRadius: '20px', cursor: 'pointer' }}
                >
                    {driverStatus === 'available' ? 'Go Offline' : 'Go Online'}
                </button>
            </div>

            {/* Available Deliveries */}
            <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '12px', marginBottom: '20px' }}>
                <h3 style={{ margin: '0 0 15px 0', fontSize: '18px' }}>📦 Available Deliveries</h3>
                {loading ? (
                    <p>Loading deliveries...</p>
                ) : deliveries.length === 0 ? (
                    <p style={{ textAlign: 'center', color: '#666', padding: '20px' }}>No deliveries available nearby. Check back later.</p>
                ) : (
                    deliveries.map(d => (
                        <div key={d.id} style={{ border: '1px solid #ddd', borderRadius: '10px', padding: '12px', marginBottom: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <p style={{ fontWeight: 'bold', margin: 0 }}>{d.shop}</p>
                                <p style={{ fontWeight: 'bold', color: '#22c55e', margin: 0 }}>₦{d.fee}</p>
                            </div>
                            <p style={{ fontSize: '13px', margin: '5px 0' }}>📦 {d.items}</p>
                            <p style={{ fontSize: '12px', color: '#666', margin: '5px 0' }}>📍 Pickup: {d.pickup}</p>
                            <p style={{ fontSize: '12px', color: '#666', margin: '5px 0' }}>🎯 Delivery: {d.delivery}</p>
                            <p style={{ fontSize: '12px', color: '#3b82f6', margin: '5px 0 10px 0' }}>📏 {d.distance}</p>
                            <button 
                                onClick={() => acceptDelivery(d)}
                                style={{ width: '100%', padding: '10px', backgroundColor: '#22c55e', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                            >
                                Accept Delivery
                            </button>
                        </div>
                    ))
                )}
            </div>

            {/* My Active Deliveries */}
            <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '12px' }}>
                <h3 style={{ margin: '0 0 15px 0', fontSize: '18px' }}>🚚 My Deliveries</h3>
                {myDeliveries.length === 0 ? (
                    <p style={{ textAlign: 'center', color: '#666', padding: '20px' }}>No active deliveries. Accept one above!</p>
                ) : (
                    myDeliveries.map(d => (
                        <div key={d.id} style={{ border: '1px solid #ddd', borderRadius: '10px', padding: '12px', marginBottom: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <p style={{ fontWeight: 'bold', margin: 0 }}>#{d.id} - {d.shop}</p>
                                {getStatusBadge(d.status)}
                            </div>
                            <p style={{ fontSize: '13px', margin: '5px 0' }}>📦 {d.items}</p>
                            <p style={{ fontSize: '12px', color: '#666', margin: '5px 0' }}>📍 Delivery: {d.delivery}</p>
                            <p style={{ fontSize: '12px', color: '#666', margin: '5px 0' }}>👤 Customer: {d.customer || 'Awaiting assignment'}</p>
                            <p style={{ fontSize: '12px', color: '#3b82f6', margin: '5px 0 10px 0' }}>⏱️ ETA: {d.eta || 'Calculating...'}</p>
                            
                            {/* Status Update Buttons */}
                            {d.status === 'assigned' && (
                                <button 
                                    onClick={() => updateStatus(d.id, 'picked_up')}
                                    style={{ width: '100%', padding: '10px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                                >
                                    📍 Mark as Picked Up
                                </button>
                            )}
                            {d.status === 'picked_up' && (
                                <button 
                                    onClick={() => updateStatus(d.id, 'delivered')}
                                    style={{ width: '100%', padding: '10px', backgroundColor: '#22c55e', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                                >
                                    ✅ Mark as Delivered
                                </button>
                            )}
                            {d.status === 'delivered' && (
                                <p style={{ textAlign: 'center', color: '#22c55e', margin: '10px 0 0 0', fontWeight: 'bold' }}>✅ Delivered - ₦{d.fee} earned</p>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* Smart Features for Drivers (Low-Data Mode) */}
            <div style={{ marginTop: '20px', fontSize: '12px', color: '#666', textAlign: 'center', padding: '12px', backgroundColor: '#f0fdf4', borderRadius: '12px' }}>
                <p style={{ margin: 0 }}>📡 Smart Dispatch | Optimized Routes | Offline Mode Active</p>
                <p style={{ margin: '5px 0 0 0', fontSize: '11px' }}>Data-saving mode: ON | Location updates every 5 min</p>
            </div>
        </div>
    );
}

export default DriverDashboard;