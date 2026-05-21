// file: src/FIRSTax.jsx
import { useState, useEffect } from 'react';
import { 
    validateTIN, 
    getVatRates, 
    generateEInvoice,
    submitStockLedger,
    submitVatReturn,
    getFilingStatus
} from './services/api';

function FIRSTax() {
    const [tin, setTin] = useState('');
    const [tinValidated, setTinValidated] = useState(false);
    const [tinMessage, setTinMessage] = useState('');
    const [vatRates, setVatRates] = useState(null);
    const [period, setPeriod] = useState(() => {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    });
    const [ledgerResult, setLedgerResult] = useState(null);
    const [vatReturnResult, setVatReturnResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [filingStatus, setFilingStatus] = useState(null);

    useEffect(() => {
        loadVatRates();
    }, []);

    const loadVatRates = async () => {
        try {
            const rates = await getVatRates();
            setVatRates(rates);
        } catch (error) {
            console.error('Error loading VAT rates:', error);
        }
    };

    const handleValidateTIN = async () => {
        if (!tin) {
            alert('Please enter a TIN');
            return;
        }
        setLoading(true);
        try {
            const result = await validateTIN(tin);
            setTinValidated(result.success);
            setTinMessage(result.message);
            if (result.success) {
                alert(`✅ TIN Validated!\nBusiness: ${result.business_name}\nStatus: ${result.status}`);
            } else {
                alert(`❌ ${result.message}`);
            }
        } catch (error) {
            alert('Validation failed: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitLedger = async () => {
        const startDate = period + '-01';
        const endDate = new Date(new Date(startDate).getFullYear(), new Date(startDate).getMonth() + 1, 0).toISOString().split('T')[0];
        
        setLoading(true);
        try {
            const result = await submitStockLedger(startDate, endDate);
            setLedgerResult(result);
            alert(`✅ ${result.message}\nSubmission ID: ${result.submission_id}\nOutput VAT: ₦${result.vat_summary.output_vat}\nNet Payable: ₦${result.vat_summary.net_vat_payable}`);
            
            // Load filing status
            const status = await getFilingStatus(period);
            setFilingStatus(status);
        } catch (error) {
            alert('Submission failed: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitVatReturn = async () => {
        setLoading(true);
        try {
            const result = await submitVatReturn(period);
            setVatReturnResult(result);
            alert(`✅ ${result.message}\nSubmission ID: ${result.submission_id}\nNext filing due: ${result.next_filing_due}`);
        } catch (error) {
            alert('Submission failed: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCheckFilingStatus = async () => {
        setLoading(true);
        try {
            const result = await getFilingStatus(period);
            setFilingStatus(result);
            alert(`Filing Status: ${result.filing_status}\nSubmission ID: ${result.submission_id || 'N/A'}`);
        } catch (error) {
            alert('Check failed: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateEInvoice = async () => {
        const sampleInvoice = {
            invoice_number: 'INV-' + Date.now(),
            date: new Date().toISOString(),
            customer_name: 'Test Customer',
            items: [{ description: 'Test Product', quantity: 1, unit_price: 10000 }]
        };
        
        try {
            const result = await generateEInvoice(sampleInvoice);
            alert(`✅ E-Invoice Generated!\nUIR: ${result.uir}\nInvoice Number: ${result.invoice_number}\nStatus: ${result.status}`);
        } catch (error) {
            alert('Generation failed: ' + error.message);
        }
    };

    return (
        <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '10px', marginBottom: '30px' }}>
            <h2>🏛️ FIRS TaxPro-Max Integration (Sandbox)</h2>
            
            {/* TIN Validation */}
            <div style={{ backgroundColor: '#f9fafb', padding: '15px', borderRadius: '10px', marginBottom: '20px' }}>
                <h3>Tax Identification Number (TIN) Validation</h3>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <input 
                        type="text" 
                        placeholder="Enter TIN (e.g., 0123456789012)" 
                        value={tin} 
                        onChange={(e) => setTin(e.target.value)}
                        style={{ flex: 2, padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
                    />
                    <button 
                        onClick={handleValidateTIN}
                        disabled={loading}
                        style={{ padding: '10px 20px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                    >
                        Validate TIN
                    </button>
                </div>
                {tinMessage && (
                    <p style={{ marginTop: '10px', color: tinValidated ? 'green' : 'red' }}>{tinMessage}</p>
                )}
            </div>

            {/* VAT Rates */}
            {vatRates && (
                <div style={{ backgroundColor: '#f0fdf4', padding: '15px', borderRadius: '10px', marginBottom: '20px' }}>
                    <h3>Current VAT Rates (FIRS)</h3>
                    <p><strong>VAT Rate:</strong> {vatRates.vat_rate}%</p>
                    <p><strong>Effective From:</strong> {vatRates.effective_from}</p>
                    <p><strong>Exempt Categories:</strong> {vatRates.exempt_categories.join(', ')}</p>
                </div>
            )}

            {/* Period Selection */}
            <div style={{ backgroundColor: '#f9fafb', padding: '15px', borderRadius: '10px', marginBottom: '20px' }}>
                <h3>Tax Period</h3>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <input 
                        type="month" 
                        value={period} 
                        onChange={(e) => setPeriod(e.target.value)}
                        style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
                    />
                    <button 
                        onClick={handleCheckFilingStatus}
                        disabled={loading}
                        style={{ padding: '10px 20px', backgroundColor: '#6b7280', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                    >
                        Check Filing Status
                    </button>
                </div>
                {filingStatus && (
                    <div style={{ marginTop: '10px', padding: '10px', backgroundColor: filingStatus.filing_status === 'submitted' ? '#f0fdf4' : '#fef3c7', borderRadius: '5px' }}>
                        <p><strong>Filing Status:</strong> {filingStatus.filing_status}</p>
                        {filingStatus.submission_id && <p><strong>Submission ID:</strong> {filingStatus.submission_id}</p>}
                        {filingStatus.submitted_at && <p><strong>Submitted:</strong> {new Date(filingStatus.submitted_at).toLocaleString()}</p>}
                    </div>
                )}
            </div>

            {/* Actions */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                <button 
                    onClick={handleGenerateEInvoice}
                    style={{ padding: '12px', backgroundColor: '#8b5cf6', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                >
                    📄 Generate E-Invoice (Test)
                </button>
                <button 
                    onClick={handleSubmitLedger}
                    disabled={loading}
                    style={{ padding: '12px', backgroundColor: '#eab308', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                >
                    📊 Submit Stock Ledger
                </button>
                <button 
                    onClick={handleSubmitVatReturn}
                    disabled={loading}
                    style={{ padding: '12px', backgroundColor: '#22c55e', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                >
                    📑 Submit VAT Return
                </button>
            </div>

            {/* Results */}
            {ledgerResult && (
                <div style={{ backgroundColor: '#f0fdf4', padding: '15px', borderRadius: '10px', marginBottom: '10px' }}>
                    <h4>Ledger Submission Result</h4>
                    <p>Submission ID: {ledgerResult.submission_id}</p>
                    <p>Status: {ledgerResult.status}</p>
                    <p>Output VAT: ₦{ledgerResult.vat_summary?.output_vat}</p>
                    <p>Input VAT: ₦{ledgerResult.vat_summary?.input_vat}</p>
                    <p><strong>Net Payable: ₦{ledgerResult.vat_summary?.net_vat_payable}</strong></p>
                </div>
            )}

            {vatReturnResult && (
                <div style={{ backgroundColor: '#f0fdf4', padding: '15px', borderRadius: '10px' }}>
                    <h4>VAT Return Result</h4>
                    <p>Submission ID: {vatReturnResult.submission_id}</p>
                    <p>Status: {vatReturnResult.status}</p>
                    <p>Next Filing Due: {vatReturnResult.next_filing_due}</p>
                </div>
            )}

            <div style={{ marginTop: '15px', fontSize: '12px', color: '#666', textAlign: 'center' }}>
                🏛️ FIRS TaxPro-Max Sandbox | Simulated API for Nigerian Tax Compliance
            </div>
        </div>
    );
}

export default FIRSTax;