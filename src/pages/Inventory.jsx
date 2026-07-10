import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Box, ShoppingCart, AlertTriangle, ArrowRight, Edit, Trash2,
    Filter, Search, CheckCircle, XCircle, Plus, FileText, Download
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import PageTransition from '../components/PageTransition';
import SegmentedControl from '../components/SegmentedControl';
import DataTable from '../components/DataTable';
import AnimatedNumber from '../components/AnimatedNumber';
import Badge from '../components/Badge';
import { useToast } from '../contexts/ToastContext';
import { mockInventory, mockInventoryRequests, mockVendors } from '../mockData';

const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } }
};

const KPICard = ({ title, value, icon: Icon, color, subtext }) => (
    <motion.div 
        variants={itemVariants}
        className="card"
        style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}
        whileHover={{ y: -4, scale: 1.01 }}
    >
        <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: color }}>
            <Icon size={20} />
        </div>
        <div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '2px' }}>{title}</p>
            <h3 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text-primary)' }}>
                {typeof value === 'number' ? <AnimatedNumber value={value} /> : value}
            </h3>
            {subtext && <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>{subtext}</p>}
        </div>
    </motion.div>
);

const stockData = [
    { name: 'Electronics', value: 450, color: '#3B82F6' },
    { name: 'Furniture', value: 850, color: '#22C55E' },
    { name: 'Stationery', value: 1200, color: '#F59E0B' },
    { name: 'Lab Equip', value: 300, color: '#EC4899' },
];

const Inventory = () => {
    const location = useLocation();
    const { addToast } = useToast();
    
    const [activeTab, setActiveTab] = useState('overview');
    
    useEffect(() => {
        if (location.state?.tab) {
            setActiveTab(location.state.tab);
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);

    const [stockSearch, setStockSearch] = useState('');
    const [adjustingItem, setAdjustingItem] = useState(null);
    const [newQty, setNewQty] = useState('');
    
    // Add Item Form State
    const [formData, setFormData] = useState({
        item: '', category: 'Electronics', stock: '', price: ''
    });

    useEffect(() => {
        if (location.state?.tab) {
            let targetTab = location.state.tab;
            if (targetTab === 'add-stock') {
                targetTab = 'add';
            }
            setActiveTab(targetTab);
            if (location.state.search) {
                setStockSearch(location.state.search);
            }
        }
    }, [location]);

    const handleFormChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAddItemSubmit = (e) => {
        e.preventDefault();
        if (!formData.item || !formData.stock || !formData.price) {
            addToast({ type: 'error', title: 'Submission Failed', message: 'Please fill in all mandatory fields.' });
            return;
        }
        addToast({ type: 'success', title: 'Asset Added', message: `${formData.item} has been registered in the catalog.` });
        setActiveTab('stock');
        setFormData({ item: '', category: 'Electronics', stock: '', price: '' });
    };

    const triggerAdjustStock = (item) => {
        setAdjustingItem(item);
        setNewQty(item.stock);
    };

    const saveStockAdjustment = () => {
        if (adjustingItem) {
            addToast({ 
                type: 'success', 
                title: 'Quantity Adjusted', 
                message: `Updated stock level of ${adjustingItem.item} to ${newQty} units.` 
            });
            setAdjustingItem(null);
        }
    };

    const mainTabs = [
        { id: 'overview', label: '📦 Overview' },
        { id: 'stock', label: '📋 Assets & Stock' },
        { id: 'requests', label: '🔄 Requests' },
        { id: 'vendors', label: '🤝 Vendors' },
        { id: 'add', label: '➕ Add Asset' }
    ];

    const inventoryColumns = [
        { header: 'Asset ID', accessor: 'id' },
        { header: 'Item Name', accessor: 'item', render: (row) => <strong style={{ color: 'var(--text-primary)', fontSize: '13px' }}>{row.item}</strong> },
        { header: 'Category', accessor: 'category' },
        { header: 'Stock Units', accessor: 'stock', render: (row) => <span style={{ fontWeight: 600, color: row.stock < 15 ? 'var(--danger)' : 'var(--text-primary)' }}>{row.stock} Units</span> },
        { header: 'Estimated Value', accessor: 'totalValue', render: (row) => <span>₹{row.totalValue.toLocaleString('en-IN')}</span> },
        { header: 'Status', accessor: 'status', render: (row) => <Badge type={row.status === 'In Stock' ? 'Success' : row.status === 'Low Stock' ? 'Warning' : 'Absent'} text={row.status} /> },
        { header: 'Actions', accessor: 'action', render: (row) => (
            <button className="btn-white" style={{ padding: '4px 10px', fontSize: '11px' }} onClick={() => triggerAdjustStock(row)}>
                Adjust Qty
            </button>
        ) }
    ];

    const filteredInventory = mockInventory.filter(item => 
        item.item.toLowerCase().includes(stockSearch.toLowerCase())
    );

    const vendorColumns = [
        { header: 'Vendor ID', accessor: 'id' },
        { header: 'Vendor Name', accessor: 'name', render: (row) => <strong style={{ color: 'var(--text-primary)', fontSize: '13px' }}>{row.name}</strong> },
        { header: 'Category', accessor: 'category' },
        { header: 'Contact Person', accessor: 'contact' },
        { header: 'Phone', accessor: 'phone', render: (row) => <span style={{ fontFamily: 'monospace' }}>{row.phone}</span> },
        { header: 'Email', accessor: 'email' },
        { header: 'Rating', accessor: 'rating', render: (row) => <span style={{ fontWeight: 600, color: 'var(--primary-dark)' }}>⭐ {row.rating}</span> },
        { header: 'Status', accessor: 'status', render: (row) => <Badge type={row.status === 'Active' ? 'Success' : 'Warning'} text={row.status} /> },
    ];

    return (
        <PageTransition>
            {/* Title */}
            <div className="dashboard-header" style={{ marginBottom: '20px' }}>
                <div>
                    <h1 style={{ fontSize: '26px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span>📦</span> Inventory Center
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
                        Reconcile department requests, audit physical stock, evaluate depreciation, and register new assets.
                    </p>
                </div>
                {activeTab !== 'add' && (
                    <button className="btn-primary" onClick={() => setActiveTab('add')}>
                        Register Asset
                    </button>
                )}
            </div>

            <SegmentedControl tabs={mainTabs} activeTab={activeTab} onTabChange={setActiveTab} />

            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                >
                    {/* 1. OVERVIEW */}
                    {activeTab === 'overview' && (
                        <div>
                            {/* KPI Grid */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '24px' }}>
                                <KPICard title="Total Asset Items" value={100} icon={Box} color="#3B82F6" subtext="In institutional catalogs" />
                                <KPICard title="Total Inventory Value" value="₹12.5L" icon={ShoppingCart} color="#22C55E" subtext="Acquisitions cost basis" />
                                <KPICard title="Low Stock Warns" value={14} icon={AlertTriangle} color="#F59E0B" subtext="Reorder threshold hit" />
                                <KPICard title="Categories Active" value={4} icon={Filter} color="#8B5CF6" subtext="Electronics, Lab, Furniture..." />
                            </div>

                            {/* Main split */}
                            <div className="responsive-split-grid">
                                {/* Category Distribution chart */}
                                <div className="card" style={{ padding: '24px' }}>
                                    <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '16px' }}>Stock Distribution by Category</h3>
                                    <div style={{ height: '240px' }}>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={stockData}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} />
                                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} />
                                                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--glass-shadow)' }} />
                                                <Bar dataKey="value" name="Total Units" radius={[4, 4, 0, 0]}>
                                                    {stockData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                                    ))}
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* Low Stock Alert panel */}
                                <div className="card" style={{ padding: '20px' }}>
                                    <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '12px', color: 'var(--danger)' }}>Low Stock Checklist</h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        {mockInventory.filter(i => i.stock < 15).slice(0, 4).map((inv, idx) => (
                                            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: '6px', borderBottom: '1px solid var(--border-color)' }}>
                                                <div>
                                                    <strong style={{ display: 'block', fontSize: '12px' }}>{inv.item}</strong>
                                                    <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Only {inv.stock} units left</span>
                                                </div>
                                                <Badge type="Warning" text="Reorder" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 2. ASSETS & STOCK */}
                    {activeTab === 'stock' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {/* Search Filter Bar */}
                            <div className="card" style={{ padding: '16px', display: 'flex', gap: '12px', alignItems: 'center' }}>
                                <Search size={18} color="var(--text-secondary)" />
                                <input 
                                    type="text" 
                                    placeholder="Filter by Asset Name..." 
                                    value={stockSearch} 
                                    onChange={(e) => setStockSearch(e.target.value)}
                                    style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: '13px', color: 'var(--text-primary)' }}
                                />
                                {stockSearch && (
                                    <button onClick={() => setStockSearch('')} style={{ padding: '4px 8px', fontSize: '11px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>Clear</button>
                                )}
                            </div>

                            <DataTable 
                                title="Assets Roster"
                                columns={inventoryColumns}
                                data={filteredInventory}
                                isLoading={false}
                            />

                            {/* Stock Adjustment Modal */}
                            {adjustingItem && (
                                <div className="glass-modal-overlay">
                                    <div className="glass-modal-content" style={{ maxWidth: '400px', padding: '24px' }}>
                                        <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>Adjust Stock Units</h3>
                                        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                                            Item: <strong>{adjustingItem.item}</strong>
                                        </p>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                                            <label style={{ fontSize: '12px', fontWeight: 600 }}>Quantity (Units)</label>
                                            <input 
                                                type="number" 
                                                value={newQty}
                                                onChange={(e) => setNewQty(e.target.value)}
                                                style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-color)' }}
                                            />
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                                            <button className="btn-white" style={{ padding: '8px 16px', fontSize: '13px' }} onClick={() => setAdjustingItem(null)}>Cancel</button>
                                            <button className="btn-primary" style={{ padding: '8px 16px', fontSize: '13px' }} onClick={saveStockAdjustment}>Save Changes</button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* 3. REQUESTS & TRANSACTIONS */}
                    {activeTab === 'requests' && (
                        <div className="responsive-split-grid-alt">
                            {/* Stock Requests list */}
                            <div className="card" style={{ padding: '24px' }}>
                                <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '16px' }}>Department Supply Requests</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {mockInventoryRequests.map((req, idx) => (
                                        <div key={idx} style={{ padding: '12px', border: '1px solid var(--border-color)', borderRadius: '10px', background: 'var(--bg-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div>
                                                <strong style={{ fontSize: '13px', display: 'block' }}>{req.item} (Qty: {req.quantity})</strong>
                                                <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Dept: {req.department} • Date: {req.date}</span>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                {req.status === 'Pending' ? (
                                                    <div style={{ display: 'flex', gap: '4px' }}>
                                                        <button 
                                                            style={{ padding: '4px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary-dark)' }}
                                                            onClick={() => addToast({ type: 'success', title: 'Supply Approved', message: `Approved ${req.item} request.` })}
                                                        >
                                                            <CheckCircle size={16} />
                                                        </button>
                                                        <button 
                                                            style={{ padding: '4px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)' }}
                                                            onClick={() => addToast({ type: 'error', title: 'Supply Rejected', message: `Rejected ${req.item} request.` })}
                                                        >
                                                            <XCircle size={16} />
                                                        </button>
                                                    </div>
                                                ) : <Badge type={req.status === 'Approved' ? 'Success' : 'Absent'} text={req.status} />}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Recent stock transaction records */}
                            <div className="card" style={{ padding: '24px' }}>
                                <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '16px' }}>Roster Stock Transactions</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {[
                                        { item: 'Office Ergonomic Chair', qty: '-4 units', dept: 'Accounts Dept', date: 'July 06' },
                                        { item: 'Dry Erase Markers Pack', qty: '-12 units', dept: 'IT Dept', date: 'July 05' },
                                        { item: 'Dell Latitude Laptop', qty: '+10 units', dept: 'System Inbound', date: 'July 05' },
                                        { item: 'Chemistry Laboratory Kit', qty: '-2 units', dept: 'Physics Lab', date: 'July 04' }
                                    ].map((tx, idx) => (
                                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', pb: '6px', borderBottom: idx < 3 ? '1px solid var(--border-color)' : 'none' }}>
                                            <div>
                                                <strong>{tx.item}</strong>
                                                <span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '10px' }}>{tx.dept} • {tx.date}</span>
                                            </div>
                                            <span style={{ fontWeight: 600, color: tx.qty.includes('-') ? 'var(--danger)' : 'var(--success)' }}>{tx.qty}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 3. VENDORS */}
                    {activeTab === 'vendors' && (
                        <div>
                            <DataTable 
                                title="Institution Suppliers & Vendors Directory" 
                                columns={vendorColumns} 
                                data={mockVendors} 
                                isLoading={false} 
                            />
                        </div>
                    )}

                    {/* 4. ADD ASSET */}
                    {activeTab === 'add' && (
                        <div className="card" style={{ padding: '28px', maxWidth: '650px', margin: '0 auto' }}>
                            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '20px' }}>Register New Asset</h3>
                            <form onSubmit={handleAddItemSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div>
                                    <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Asset Item Name *</label>
                                    <input type="text" name="item" placeholder="e.g. Laboratory Spectrometer" value={formData.item} onChange={handleFormChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }} required />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <div>
                                        <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Category</label>
                                        <select name="category" value={formData.category} onChange={handleFormChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }}>
                                            <option>Electronics</option>
                                            <option>Furniture</option>
                                            <option>Lab Equipment</option>
                                            <option>Stationery</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Initial Stock Qty *</label>
                                        <input type="number" name="stock" placeholder="e.g. 50" value={formData.stock} onChange={handleFormChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-color)' }} required />
                                    </div>
                                </div>
                                <div>
                                    <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Unit Price (₹) *</label>
                                    <input type="number" name="price" placeholder="e.g. 1500" value={formData.price} onChange={handleFormChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-color)' }} required />
                                </div>
                                <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '8px' }}>
                                    Add Asset to Catalog
                                </button>
                            </form>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </PageTransition>
    );
};

export default Inventory;
