// file: src/SupplierManagement.jsx
import { useState, useEffect } from 'react';
import { getSuppliers, addSupplier, updateSupplier, deleteSupplier } from './services/api';

function SupplierManagement() {
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingSupplier, setEditingSupplier] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        contact_person: '',
        phone: '',
        email: '',
        location: '',
        lead_time_days: 3
    });

    useEffect(() => {
        loadSuppliers();
    }, []);

    const loadSuppliers = async () => {
        setLoading(true);
        try {
            const supplierList = await getSuppliers();
            setSuppliers(supplierList);
        } catch (error) {
            console.error('Error loading suppliers:', error);
            alert('Failed to load suppliers: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.name) {
            alert('Please enter supplier name');
            return;
        }

        try {
            if (editingSupplier) {
                await updateSupplier(editingSupplier.id, formData);
                alert('Supplier updated successfully!');
            } else {
                await addSupplier(formData);
                alert('Supplier added successfully!');
            }
            setFormData({ name: '', contact_person: '', phone: '', email: '', location: '', lead_time_days: 3 });
            setShowForm(false);
            setEditingSupplier(null);
            loadSuppliers();
        } catch (error) {
            alert('Failed to save supplier: ' + error.message);
        }
    };

    const handleEdit = (supplier) => {
        setEditingSupplier(supplier);
        setFormData({
            name: supplier.name,
            contact_person: supplier.contact_person || '',
            phone: supplier.phone || '',
            email: supplier.email || '',
            location: supplier.location || '',
            lead_time_days: supplier.lead_time_days || 3
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this supplier?')) {
            try {
                await deleteSupplier(id);
                alert('Supplier deleted successfully!');
                loadSuppliers();
            } catch (error) {
                alert('Failed to delete supplier: ' + error.message);
            }
        }
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingSupplier(null);
        setFormData({ name: '', contact_person: '', phone: '', email: '', location: '', lead_time_days: 3 });
    };

    return (
        <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '10px', marginBottom: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>🚚 Smart City Supply Chain - Suppliers</h2>
                <button 
                    onClick={() => setShowForm(true)}
                    style={{ padding: '8px 16px', backgroundColor: '#22c55e', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                >
                    ➕ Add Supplier
                </button>
            </div>

            {/* Add/Edit Supplier Form */}
            {showForm && (
                <div style={{ backgroundColor: '#f9fafb', padding: '20px', borderRadius: '10px', marginBottom: '20px' }}>
                    <h3>{editingSupplier ? '✏️ Edit Supplier' : '➕ Add New Supplier'}</h3>
                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                            <div>
                                <label>Supplier Name *</label>
                                <input 
                                    type="text" 
                                    value={formData.name} 
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '5px' }}
                                    required
                                />
                            </div>
                            <div>
                                <label>Contact Person</label>
                                <input 
                                    type="text" 
                                    value={formData.contact_person} 
                                    onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                                    style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '5px' }}
                                />
                            </div>
                            <div>
                                <label>Phone</label>
                                <input 
                                    type="tel" 
                                    value={formData.phone} 
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '5px' }}
                                />
                            </div>
                            <div>
                                <label>Email</label>
                                <input 
                                    type="email" 
                                    value={formData.email} 
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '5px' }}
                                />
                            </div>
                            <div>
                                <label>Location (Smart City Zone)</label>
                                <input 
                                    type="text" 
                                    value={formData.location} 
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    placeholder="e.g., Ikeja, Lagos"
                                    style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '5px' }}
                                />
                            </div>
                            <div>
                                <label>Lead Time (days)</label>
                                <input 
                                    type="number" 
                                    value={formData.lead_time_days} 
                                    onChange={(e) => setFormData({ ...formData, lead_time_days: e.target.value })}
                                    style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '5px' }}
                                />
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button type="submit" style={{ padding: '8px 16px', backgroundColor: '#22c55e', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                                {editingSupplier ? 'Save Changes' : 'Add Supplier'}
                            </button>
                            <button type="button" onClick={handleCancel} style={{ padding: '8px 16px', backgroundColor: '#6b7280', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Suppliers Table */}
            {loading ? (
                <p>Loading suppliers...</p>
            ) : suppliers.length === 0 ? (
                <p>No suppliers yet. Click "Add Supplier" to get started.</p>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f3f4f6', borderBottom: '2px solid #ddd' }}>
                            <th style={{ padding: '10px', textAlign: 'left' }}>Name</th>
                            <th style={{ padding: '10px', textAlign: 'left' }}>Contact</th>
                            <th style={{ padding: '10px', textAlign: 'left' }}>Location</th>
                            <th style={{ padding: '10px', textAlign: 'left' }}>Lead Time</th>
                            <th style={{ padding: '10px', textAlign: 'left', width: '130px' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {suppliers.map((supplier) => (
                            <tr key={supplier.id} style={{ borderBottom: '1px solid #ddd' }}>
                                <td style={{ padding: '10px' }}><strong>{supplier.name}</strong></td>
                                <td style={{ padding: '10px' }}>
                                    {supplier.contact_person && <div>{supplier.contact_person}</div>}
                                    {supplier.phone && <div style={{ fontSize: '12px', color: '#666' }}>{supplier.phone}</div>}
                                </td>
                                <td style={{ padding: '10px' }}>{supplier.location || '-'}</td>
                                <td style={{ padding: '10px' }}>{supplier.lead_time_days} days</td>
                                <td style={{ padding: '10px' }}>
    <div style={{ display: 'flex', gap: '8px', flexDirection: 'row', alignItems: 'center' }}>
        <button onClick={() => handleEdit(supplier)} style={{ backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '5px', padding: '6px 12px', fontSize: '12px', cursor: 'pointer', minWidth: '50px' }}>Edit</button>
        <button onClick={() => handleDelete(supplier.id)} style={{ backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '5px', padding: '6px 12px', fontSize: '12px', cursor: 'pointer', minWidth: '50px' }}>Del</button>
    </div>
</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            
            <div style={{ marginTop: '15px', fontSize: '12px', color: '#666', textAlign: 'center' }}>
                🌍 Connected to Lagos Smart City Logistics Network | Real-time supply chain visibility
            </div>
        </div>
    );
}

export default SupplierManagement;