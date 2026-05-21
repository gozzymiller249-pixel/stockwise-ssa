// file: src/CameraScanner.jsx
import { useState, useEffect } from 'react';
import { BrowserMultiFormatReader } from '@zxing/library';

function CameraScanner({ onScan, onClose }) {
    const [error, setError] = useState('');
    const [scanning, setScanning] = useState(true);

    useEffect(() => {
        const codeReader = new BrowserMultiFormatReader();
        const videoElement = document.getElementById('scanner-video');

        if (videoElement && scanning) {
            codeReader.decodeFromVideoDevice(null, videoElement, (result, err) => {
                if (result) {
                    const barcode = result.getText();
                    codeReader.reset();
                    onScan(barcode);
                    onClose();
                }
                if (err && !err.name?.includes('NotFoundException')) {
                    console.error(err);
                }
            });
        }

        return () => {
            codeReader.reset();
        };
    }, [scanning, onScan, onClose]);

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'black',
            zIndex: 2000,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <video
                id="scanner-video"
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                }}
            />
            <button
                onClick={onClose}
                style={{
                    position: 'absolute',
                    bottom: '30px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    padding: '14px 30px',
                    backgroundColor: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    zIndex: 2001
                }}
            >
                Cancel
            </button>
            {error && (
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    color: 'white',
                    padding: '20px',
                    borderRadius: '10px',
                    textAlign: 'center'
                }}>
                    {error}
                </div>
            )}
            <p style={{
                position: 'absolute',
                top: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                color: 'white',
                backgroundColor: 'rgba(0,0,0,0.6)',
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '14px',
                zIndex: 2001
            }}>
                Point camera at barcode
            </p>
        </div>
    );
}

export default CameraScanner;