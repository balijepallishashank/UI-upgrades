import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import EmptyState from './EmptyState';
import Skeleton from './Skeleton';

const DataTable = ({ title, columns, data, isLoading, onRowClick }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredData = data.filter(row => {
        if (!searchTerm) return true;
        return Object.values(row).some(val => 
            String(val).toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    return (
        <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
            <div style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)' }}>
                <h2 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--text-primary)' }}>{title}</h2>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <div className="search-bar" style={{ position: 'relative' }}>
                        <Search size={16} color="var(--text-secondary)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                        <input 
                            type="text" 
                            placeholder="Search..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ 
                                padding: '8px 16px 8px 36px', 
                                borderRadius: '8px', 
                                border: '1px solid var(--border-color)', 
                                background: 'var(--bg-color)', 
                                color: 'var(--text-primary)',
                                outline: 'none',
                                fontSize: '13px'
                            }} 
                        />
                    </div>
                    <button className="btn-white" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                        <Filter size={16} /> Filters
                    </button>
                </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: 'var(--bg-color)', borderBottom: '1px solid var(--border-color)' }}>
                            {columns.map((col, idx) => (
                                <th key={idx} style={{ padding: '16px 24px', textAlign: 'left', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            [...Array(5)].map((_, rowIndex) => (
                                <tr key={rowIndex} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                    {columns.map((_, colIndex) => (
                                        <td key={colIndex} style={{ padding: '16px 24px' }}>
                                            <Skeleton height="16px" width={colIndex === 0 ? "70%" : "40%"} />
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : filteredData.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length} style={{ padding: '24px' }}>
                                    <EmptyState 
                                        title={`No ${title} Found`} 
                                        message="There are no records matching your search criteria." 
                                        icon="📭"
                                    />
                                </td>
                            </tr>
                        ) : (
                            filteredData.map((row, rowIndex) => (
                                <tr 
                                    key={rowIndex} 
                                    onClick={() => onRowClick && onRowClick(row)}
                                    style={{ 
                                        borderBottom: '1px solid var(--border-color)', 
                                        transition: 'background 0.2s', 
                                        cursor: onRowClick ? 'pointer' : 'default' 
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-color)'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                >
                                    {columns.map((col, colIndex) => (
                                        <td key={colIndex} style={{ padding: '16px 24px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                                            {col.render ? col.render(row) : row[col.accessor]}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DataTable;
