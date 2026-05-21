// file: src/BarcodeScanner.jsx
import { useState, useEffect } from 'react';

function BarcodeScanner({ onScan, onClose }) {
    const [scanning, setScanning] = useState(true);
    const [error, setError] = useState('');

    // Simple input-based barcode scanner (no camera permission needed)
    // This works on all phones without asking for camera access
    const handleManualBarcode = (e) => {
        e.preventDefault();
        const barcode = e.target.barcode.value;
        if (barcode) {
            onScan(barcode);
            e.target.barcode.value = '';
        }
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.9)',
            zIndex: 2000,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '20px'
        }}>
            <div style={{
                backgroundColor: 'white',
                borderRadius: '20px',
                padding: '20px',
                width: '100%',
                maxWidth: '350px',
                textAlign: 'center'
            }}>
                <h3 style={{ marginBottom: '15px' }}>📷 Scan Barcode</h3>
                
                <p style={{ fontSize: '14px', color: '#666', marginBottom: '15px' }}>
                    Type or paste the barcode number below
                </p>
                
                <form onSubmit={handleManualBarcode}>
                    <input
                        name="barcode"
                        type="text"
                        placeholder="Enter barcode number"
                        autoFocus
                        style={{
                            width: '100%',
                            padding: '12px',
                            fontSize: '16px',
                            border: '2px solid #3b82f6',
                            borderRadius: '10px',
                            marginBottom: '15px'
                        }}
                    />
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                            type="submit"
                            style={{
                                flex: 1,
                                padding: '12px',
                                backgroundColor: '#3b82f6',
                                color: 'white',
                                border: 'none',
                                borderRadius: '10px',
                                fontSize: '16px',
                                cursor: 'pointer'
                            }}
                        >
                            Search
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            style={{
                                flex: 1,
                                padding: '12px',
                                backgroundColor: '#6b7280',
                                color: 'white',
                                border: 'none',
                                borderRadius: '10px',
                                fontSize: '16px',
                                cursor: 'pointer'
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
                
                <p style={{ fontSize: '12px', color: '#999', marginTop: '15px' }}>
                    Note: Camera scanning requires HTTPS. For demo, enter barcode manually.
                </p>
            </div>
        </div>
    );
}

export default BarcodeScanner;