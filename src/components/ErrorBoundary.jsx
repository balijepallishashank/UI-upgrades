import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Unhandled UI Exception caught by ErrorBoundary:', error, errorInfo);
    }

    handleReload = () => {
        window.location.reload();
    };

    handleGoHome = () => {
        this.setState({ hasError: false, error: null });
        window.location.href = '/dashboard';
    };

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justify: 'center',
                    minHeight: '80vh',
                    padding: '40px 20px',
                    textAlign: 'center',
                    color: 'var(--text-primary)'
                }}>
                    <div style={{
                        background: 'var(--card-white)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '24px',
                        padding: '48px 36px',
                        maxWidth: '520px',
                        width: '100%',
                        boxShadow: 'var(--glass-shadow)',
                        backdropFilter: 'blur(16px)'
                    }}>
                        <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
                        <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>
                            Something Went Wrong
                        </h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6, marginBottom: '24px' }}>
                            An unexpected error occurred while rendering this page. The system caught it safely to prevent application failure.
                        </p>
                        {this.state.error?.message && (
                            <div style={{
                                background: 'var(--bg-color)',
                                border: '1px solid var(--border-color)',
                                borderRadius: '10px',
                                padding: '12px 16px',
                                marginBottom: '24px',
                                fontSize: '12px',
                                fontFamily: 'monospace',
                                color: '#EF4444',
                                textAlign: 'left',
                                overflowX: 'auto'
                            }}>
                                {this.state.error.message}
                            </div>
                        )}
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                            <button
                                className="btn-primary"
                                onClick={this.handleGoHome}
                                style={{ padding: '11px 24px', fontSize: '14px' }}
                            >
                                🏠 Return to Dashboard
                            </button>
                            <button
                                className="btn-white"
                                onClick={this.handleReload}
                                style={{ padding: '11px 24px', fontSize: '14px' }}
                            >
                                🔄 Refresh Page
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
