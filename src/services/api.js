// API service for connecting React app to LAMP backend

export const API_URL = import.meta.env.VITE_API_URL || '/api';

// Helper function to handle API responses
const handleResponse = async (response) => {
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
    }
    return data;
};

// Login user
export const login = async (phone, password) => {
    const response = await fetch(`${API_URL}/test_login.php`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone, password })
    });
    const data = await handleResponse(response);
    
    if (data.success && data.token) {
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
    }
    return data;
};

// Get all products
export const getProducts = async () => {
    const response = await fetch(`${API_URL}/test_mock_products.php`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
    const data = await handleResponse(response);
    return data.products || [];
};

// Add a new product
export const addProduct = async (product) => {
    const response = await fetch(`${API_URL}/test_product.php`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: product.name,
            category: product.category,
            quantity: parseInt(product.quantity) || 0,
            selling_price: parseFloat(product.price) || 0,
            cost_price: parseFloat(product.costPrice) || 0,
            reorder_level: 10
        })
    });
    return handleResponse(response);
};

// Delete a product
export const deleteProduct = async (id) => {
    const response = await fetch(`${API_URL}/test_product.php?id=${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        }
    });
    return handleResponse(response);
};

// Get all inventory transactions
export const getTransactions = async () => {
    const response = await fetch(`${API_URL}/test_transaction.php`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
    const data = await handleResponse(response);
    return data.transactions || [];
};

// Record stock in (purchase)
export const recordStockIn = async (product_id, quantity, unit_price) => {
    const response = await fetch(`${API_URL}/test_transaction.php`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            product_id: product_id,
            type: 'in',
            quantity: quantity,
            unit_price: unit_price
        })
    });
    return handleResponse(response);
};

// Record stock out (sale)
export const recordStockOut = async (product_id, quantity, unit_price) => {
    const response = await fetch(`${API_URL}/test_transaction.php`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            product_id: product_id,
            type: 'out',
            quantity: quantity,
            unit_price: unit_price
        })
    });
    return handleResponse(response);
};

// Get tax report for a period
export const getTaxReport = async (period) => {
    const url = period ? `${API_URL}/test_tax.php?period=${period}` : `${API_URL}/test_tax.php`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
    return handleResponse(response);
};

// Get all suppliers
export const getSuppliers = async () => {
    const response = await fetch(`${API_URL}/test_supplier.php`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
    const data = await handleResponse(response);
    return data.suppliers || [];
};

// Add new supplier
export const addSupplier = async (supplier) => {
    const response = await fetch(`${API_URL}/test_supplier.php`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(supplier)
    });
    return handleResponse(response);
};

// Update supplier
export const updateSupplier = async (id, supplier) => {
    const response = await fetch(`${API_URL}/test_supplier.php?id=${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(supplier)
    });
    return handleResponse(response);
};

// Delete supplier
export const deleteSupplier = async (id) => {
    const response = await fetch(`${API_URL}/test_supplier.php?id=${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        }
    });
    return handleResponse(response);
};

// Get all purchase orders
export const getPurchaseOrders = async () => {
    const response = await fetch(`${API_URL}/test_purchase_order.php`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
    const data = await handleResponse(response);
    return data.purchase_orders || [];
};

// Create new purchase order
export const createPurchaseOrder = async (supplier_id, items, status = 'draft') => {
    const response = await fetch(`${API_URL}/test_purchase_order.php`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            supplier_id: supplier_id,
            items: items,
            status: status
        })
    });
    return handleResponse(response);
};

// Update purchase order status
export const updatePurchaseOrderStatus = async (id, status) => {
    const response = await fetch(`${API_URL}/test_purchase_order.php?id=${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: status })
    });
    return handleResponse(response);
};

// Delete purchase order (only if draft)
export const deletePurchaseOrder = async (id) => {
    const response = await fetch(`${API_URL}/test_purchase_order.php?id=${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        }
    });
    return handleResponse(response);
};

// Get demand forecast
export const getDemandForecast = async () => {
    const response = await fetch(`${API_URL}/test_forecast.php`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
    const data = await handleResponse(response);
    return data.forecasts || [];
};

// Add item to offline queue (for when offline)
export const addToOfflineQueue = async (operation, table_name, data) => {
    const response = await fetch(`${API_URL}/test_sync.php`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            operation: operation,
            table_name: table_name,
            data: data
        })
    });
    return handleResponse(response);
};

// Get pending sync items
export const getPendingSyncItems = async () => {
    const response = await fetch(`${API_URL}/test_sync.php`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
    const data = await handleResponse(response);
    return data.pending_items || [];
};

// Process sync (send pending items to server)
export const processSync = async (items) => {
    const response = await fetch(`${API_URL}/test_sync_process.php`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items: items })
    });
    return handleResponse(response);
};

// CBSCSC - Smart City Supply Chain API Stub

// Get Smart City network status
export const getSmartCityStatus = async () => {
    const response = await fetch(`${API_URL}/test_cbscsc.php`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
    return handleResponse(response);
};

// Get Smart City nodes
export const getSmartCityNodes = async () => {
    const response = await fetch(`${API_URL}/test_cbscsc.php?action=nodes`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
    return handleResponse(response);
};

// Get demand signals from Smart City
export const getDemandSignals = async () => {
    const response = await fetch(`${API_URL}/test_cbscsc.php?action=demand_signals`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
    return handleResponse(response);
};

// Submit restock request to Smart City
export const submitRestockRequest = async (product_id, quantity) => {
    const response = await fetch(`${API_URL}/test_cbscsc.php?action=restock_request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id, quantity })
    });
    return handleResponse(response);
};

// Broadcast stock levels to Smart City
export const broadcastStockToSmartCity = async () => {
    const response = await fetch(`${API_URL}/test_cbscsc.php?action=broadcast_stock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    });
    return handleResponse(response);
};

// Get restock requests status
export const getRestockRequests = async () => {
    const response = await fetch(`${API_URL}/test_cbscsc.php?action=restock_requests`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
    return handleResponse(response);
};

// Update delivery status
export const updateDeliveryStatus = async (supply_chain_ref) => {
    const response = await fetch(`${API_URL}/test_cbscsc.php?action=delivery_status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ supply_chain_ref })
    });
    return handleResponse(response);
};

// FIRS TaxPro-Max API Stub

// Validate TIN with FIRS
export const validateTIN = async (tin) => {
    const response = await fetch(`${API_URL}/test_firs.php?action=tin_validation&tin=${tin}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
    return handleResponse(response);
};

// Get current VAT rates
export const getVatRates = async () => {
    const response = await fetch(`${API_URL}/test_firs.php?action=vat_rates`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
    return handleResponse(response);
};

// Generate FIRS e-invoice
export const generateEInvoice = async (invoiceData) => {
    const response = await fetch(`${API_URL}/test_firs.php?action=generate_invoice`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invoice_data: invoiceData })
    });
    return handleResponse(response);
};

// Submit electronic stock ledger to FIRS
export const submitStockLedger = async (period_start, period_end) => {
    const response = await fetch(`${API_URL}/test_firs.php?action=submit_ledger`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ period_start, period_end })
    });
    return handleResponse(response);
};

// Submit monthly VAT return
export const submitVatReturn = async (period) => {
    const response = await fetch(`${API_URL}/test_firs.php?action=submit_vat_return`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ period })
    });
    return handleResponse(response);
};

// Get filing status
export const getFilingStatus = async (period) => {
    const response = await fetch(`${API_URL}/test_firs.php?action=filing_status&period=${period}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
    return handleResponse(response);
};

// Paystack/Flutterwave Payment Stub

// Get list of banks
export const getBanks = async () => {
    const response = await fetch(`${API_URL}/test_payment.php?action=banks`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
    return handleResponse(response);
};

// Initialize payment
export const initializePayment = async (amount, email, metadata = {}) => {
    const response = await fetch(`${API_URL}/test_payment.php?action=initialize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, email, metadata })
    });
    return handleResponse(response);
};

// Verify payment
export const verifyPayment = async (reference) => {
    const response = await fetch(`${API_URL}/test_payment.php?action=verify&reference=${reference}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reference })
    });
    return handleResponse(response);
};

// Initiate bank transfer
export const initiateTransfer = async (bank_code, account_number, amount, narration = 'Supplier Payment') => {
    const response = await fetch(`${API_URL}/test_payment.php?action=transfer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bank_code, account_number, amount, narration })
    });
    return handleResponse(response);
};

// Get payment transactions
export const getPaymentTransactions = async () => {
    const response = await fetch(`${API_URL}/test_payment.php?action=transactions`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
    return handleResponse(response);
};