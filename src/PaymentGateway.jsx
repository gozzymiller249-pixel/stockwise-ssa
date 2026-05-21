// file: src/PaymentGateway.jsx
import { useState, useEffect } from 'react';
import { getBanks, initializePayment, verifyPayment, initiateTransfer, getPaymentTransactions } from './services/api';

function PaymentGateway() {
    const [banks, setBanks] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [paymentAmount, setPaymentAmount] = useState('');
    const [paymentEmail, setPaymentEmail] = useState('');
    const [transferBank, setTransferBank] = useState('');
    const [transferAccount, setTransferAccount] = useState('');
    const [transferAmount, setTransferAmount] = useState('');
    const [paymentResult, setPaymentResult] = useState(null);
    const [transferResult, setTransferResult] = useState(null);

    useEffect(() => {
        loadBanks();
        loadTransactions();
    }, []);

    const loadBanks = async () => {
        try {
            const result = await getBanks();
            if (result.success) {
                setBanks(result.banks);
            }
        } catch (error) {
            console.error('Error loading banks:', error);
        }
    };

    const loadTransactions = async () => {
        try {
            const result = await getPaymentTransactions();
            if (result.success) {
                setTransactions(result.transactions);
            }
        } catch (error) {
            console.error('Error loading transactions:', error);
        }
    };

    const handleInitializePayment = async () => {
        if (!paymentAmount || !paymentEmail) {
            alert('Please enter amount and email');
            return;
        }
        
        setLoading(true);
        try {
            const result = await initializePayment(paymentAmount, paymentEmail, { type: 'inventory_purchase' });
            setPaymentResult(result);
            alert(`✅ Payment initialized!\nReference: ${result.reference}\nAmount: ₦${result.amount}\n\nClick OK to simulate verification`);
            
            // Simulate verification
            const verifyResult = await verifyPayment(result.reference);
            alert(`✅ Payment ${verifyResult.status}!\nReference: ${verifyResult.reference}\nAmount: ₦${verifyResult.amount}\nFee: ₦${verifyResult.fees}`);
            
            loadTransactions();
            setPaymentAmount('');
            setPaymentEmail('');
        } catch (error) {
            alert('Payment failed: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleInitiateTransfer = async () => {
        if (!transferBank || !transferAccount || !transferAmount) {
            alert('Please select bank, enter account number and amount');
            return;
        }
        
        setLoading(true);
        try {
            const result = await initiateTransfer(transferBank, transferAccount, transferAmount);
            setTransferResult(result);
            alert(`✅ ${result.message}\nTransfer Reference: ${result.transfer_reference}\nStatus: ${result.status}\nAmount: ₦${result.amount}\nFee: ₦${result.fee}`);
            loadTransactions();
            setTransferBank('');
            setTransferAccount('');
            setTransferAmount('');
        } catch (error) {
            alert('Transfer failed: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '10px', marginBottom: '30px' }}>
            <h2>💰 Payment Gateway (Paystack/Flutterwave Stub)</h2>
            
            {/* Initialize Payment Section */}
            <div style={{ backgroundColor: '#f9fafb', padding: '15px', borderRadius: '10px', marginBottom: '20px' }}>
                <h3>💳 Make a Payment</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                    <div>
                        <label>Amount (₦)</label>
                        <input 
                            type="number" 
                            value={paymentAmount} 
                            onChange={(e) => setPaymentAmount(e.target.value)}
                            placeholder="Enter amount"
                            style={{ width: '100%', padding: '10px', marginTop: '5px', border: '1px solid #ddd', borderRadius: '5px' }}
                        />
                    </div>
                    <div>
                        <label>Email</label>
                        <input 
                            type="email" 
                            value={paymentEmail} 
                            onChange={(e) => setPaymentEmail(e.target.value)}
                            placeholder="customer@example.com"
                            style={{ width: '100%', padding: '10px', marginTop: '5px', border: '1px solid #ddd', borderRadius: '5px' }}
                        />
                    </div>
                </div>
                <button 
                    onClick={handleInitializePayment}
                    disabled={loading}
                    style={{ padding: '10px 20px', backgroundColor: '#22c55e', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                >
                    Pay Now
                </button>
                {paymentResult && (
                    <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#f0fdf4', borderRadius: '5px' }}>
                        <p><strong>Reference:</strong> {paymentResult.reference}</p>
                        <p><strong>Amount:</strong> ₦{paymentResult.amount}</p>
                    </div>
                )}
            </div>

            {/* Bank Transfer Section */}
            <div style={{ backgroundColor: '#f9fafb', padding: '15px', borderRadius: '10px', marginBottom: '20px' }}>
                <h3>🏦 Bank Transfer to Supplier</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                    <div>
                        <label>Select Bank</label>
                        <select 
                            value={transferBank} 
                            onChange={(e) => setTransferBank(e.target.value)}
                            style={{ width: '100%', padding: '10px', marginTop: '5px', border: '1px solid #ddd', borderRadius: '5px' }}
                        >
                            <option value="">Select Bank</option>
                            {banks.map(bank => (
                                <option key={bank.code} value={bank.code}>{bank.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label>Account Number</label>
                        <input 
                            type="text" 
                            value={transferAccount} 
                            onChange={(e) => setTransferAccount(e.target.value)}
                            placeholder="Enter account number"
                            style={{ width: '100%', padding: '10px', marginTop: '5px', border: '1px solid #ddd', borderRadius: '5px' }}
                        />
                    </div>
                    <div>
                        <label>Amount (₦)</label>
                        <input 
                            type="number" 
                            value={transferAmount} 
                            onChange={(e) => setTransferAmount(e.target.value)}
                            placeholder="Enter amount"
                            style={{ width: '100%', padding: '10px', marginTop: '5px', border: '1px solid #ddd', borderRadius: '5px' }}
                        />
                    </div>
                </div>
                <button 
                    onClick={handleInitiateTransfer}
                    disabled={loading}
                    style={{ padding: '10px 20px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                >
                    Initiate Transfer
                </button>
                {transferResult && (
                    <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#f0fdf4', borderRadius: '5px' }}>
                        <p><strong>Transfer Reference:</strong> {transferResult.transfer_reference}</p>
                        <p><strong>Status:</strong> {transferResult.status}</p>
                        <p><strong>Amount:</strong> ₦{transferResult.amount}</p>
                        <p><strong>Fee:</strong> ₦{transferResult.fee}</p>
                    </div>
                )}
            </div>

            {/* Recent Transactions */}
            {transactions.length > 0 && (
                <div>
                    <h3>📋 Recent Payment Transactions</h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f3f4f6', borderBottom: '2px solid #ddd' }}>
                                <th style={{ padding: '10px', textAlign: 'left' }}>Reference</th>
                                <th style={{ padding: '10px', textAlign: 'left' }}>Amount</th>
                                <th style={{ padding: '10px', textAlign: 'left' }}>Status</th>
                                <th style={{ padding: '10px', textAlign: 'left' }}>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map(t => (
                                <tr key={t.id} style={{ borderBottom: '1px solid #ddd' }}>
                                    <td style={{ padding: '10px' }}>{t.reference}</td>
                                    <td style={{ padding: '10px' }}>₦{t.amount}</td>
                                    <td style={{ padding: '10px' }}>
                                        <span style={{ 
                                            backgroundColor: t.status === 'success' ? '#22c55e' : t.status === 'pending' ? '#eab308' : '#ef4444', 
                                            color: 'white', 
                                            padding: '2px 8px', 
                                            borderRadius: '4px', 
                                            fontSize: '12px' 
                                        }}>
                                            {t.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '10px' }}>{new Date(t.created_at).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <div style={{ marginTop: '15px', fontSize: '12px', color: '#666', textAlign: 'center' }}>
                💳 Paystack/Flutterwave Stub | Simulated payment gateway for supplier payments
            </div>
        </div>
    );
}

export default PaymentGateway;