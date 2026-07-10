import React from 'react';
import PageTransition from '../components/PageTransition';
import { useToast } from '../contexts/ToastContext';
import { User, Mail, Shield, Key, History, Save } from 'lucide-react';

const Profile = () => {
    const { addToast } = useToast();

    const handleSaveProfile = (e) => {
        e.preventDefault();
        addToast({ type: 'success', title: 'Profile Updated', message: 'Your profile details have been saved.' });
    };

    const handleUpdatePassword = (e) => {
        e.preventDefault();
        addToast({ type: 'success', title: 'Password Changed', message: 'Your login credentials have been updated.' });
    };

    return (
        <PageTransition>
            <div className="dashboard-header" style={{ marginBottom: '32px' }}>
                <div>
                    <h1 style={{ fontSize: '28px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span>👤</span> My Profile
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
                        Manage your personal account, security preferences, and view access logs.
                    </p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '32px' }}>
                {/* User card and Details */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div className="card" style={{ padding: '32px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <img 
                            src="https://i.pravatar.cc/150?img=33" 
                            alt="Admin avatar" 
                            style={{ width: '96px', height: '96px', borderRadius: '50%', border: '4px solid var(--primary-light)', marginBottom: '16px' }}
                        />
                        <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)' }}>Dr. Anita Rao</h2>
                        <span style={{ fontSize: '12px', background: 'var(--primary-light)', color: 'var(--primary-dark)', padding: '4px 12px', borderRadius: '12px', marginTop: '8px', fontWeight: 600 }}>
                            Super Admin
                        </span>
                        
                        <div style={{ width: '100%', marginTop: '32px', display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-secondary)' }}>
                                <Mail size={16} />
                                <span style={{ fontSize: '14px' }}>anita.rao@titus.edu</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-secondary)' }}>
                                <Shield size={16} />
                                <span style={{ fontSize: '14px' }}>Role: System Administrator</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Edit Form & Password Form */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    {/* Details form */}
                    <div className="card" style={{ padding: '28px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <User size={20} color="var(--primary-dark)" /> Personal Information
                        </h3>
                        <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '8px' }}>First Name</label>
                                    <input type="text" defaultValue="Anita" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '8px' }}>Last Name</label>
                                    <input type="text" defaultValue="Rao" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }} />
                                </div>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '8px' }}>Phone Number</label>
                                <input type="text" defaultValue="+91 98765 43210" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }} />
                            </div>
                            <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', justifySelf: 'flex-start', gap: '8px', width: 'fit-content' }}>
                                <Save size={16} /> Save Changes
                            </button>
                        </form>
                    </div>

                    {/* Change Password */}
                    <div className="card" style={{ padding: '28px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Key size={20} color="var(--primary-dark)" /> Change Password
                        </h3>
                        <form onSubmit={handleUpdatePassword} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '8px' }}>Current Password</label>
                                <input type="password" placeholder="••••••••" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }} />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '8px' }}>New Password</label>
                                    <input type="password" placeholder="••••••••" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '8px' }}>Confirm Password</label>
                                    <input type="password" placeholder="••••••••" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }} />
                                </div>
                            </div>
                            <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', justifySelf: 'flex-start', gap: '8px', width: 'fit-content' }}>
                                <Key size={16} /> Update Password
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </PageTransition>
    );
};

export default Profile;
