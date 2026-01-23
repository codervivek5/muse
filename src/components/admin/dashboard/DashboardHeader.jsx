import React from 'react';
import { LogOut } from 'lucide-react';

const DashboardHeader = ({ currentUser, handleLogout }) => {
    return (
        <header className="dashboard-header">
            <h1 className="dashboard-title">Curator Dashboard</h1>
            <div className="user-controls">
                <span className="user-email">{currentUser?.email}</span>
                <button onClick={handleLogout} className="logout-btn">
                    <LogOut size={18} /> Logout
                </button>
            </div>
        </header>
    );
};

export default DashboardHeader;
