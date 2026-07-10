import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Lazy-loaded pages — each loads only when first visited (code splitting)
const Dashboard    = lazy(() => import('../pages/Dashboard'));
const Students     = lazy(() => import('../pages/Students'));
const Employees    = lazy(() => import('../pages/Employees'));
const Staff        = lazy(() => import('../pages/Staff'));
const Departments  = lazy(() => import('../pages/Departments'));
const Attendance   = lazy(() => import('../pages/Attendance'));
const Leave        = lazy(() => import('../pages/Leave'));
const Holidays     = lazy(() => import('../pages/Holidays'));
const Timetable    = lazy(() => import('../pages/Timetable'));
const Homework     = lazy(() => import('../pages/Homework'));
const Exams        = lazy(() => import('../pages/Exams'));
const Classes      = lazy(() => import('../pages/Classes'));
const Communication = lazy(() => import('../pages/Communication'));
const Finance      = lazy(() => import('../pages/Finance'));
const DuesList     = lazy(() => import('../pages/DuesList'));
const FeeStructure = lazy(() => import('../pages/FeeStructure'));
const Inventory    = lazy(() => import('../pages/Inventory'));
const Reports      = lazy(() => import('../pages/Reports'));
const Audit        = lazy(() => import('../pages/Audit'));
const Settings     = lazy(() => import('../pages/Settings'));
const Profile      = lazy(() => import('../pages/Profile'));

const PageLoader = () => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
        <div style={{ width: 40, height: 40, borderRadius: '50%', border: '3px solid var(--border-color)', borderTopColor: 'var(--primary-dark)', animation: 'spin 0.7s linear infinite' }} />
    </div>
);

const AnimatedRoutes = () => {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <Suspense fallback={<PageLoader />}>
                <Routes location={location} key={location.pathname}>
                    <Route index element={<Navigate to="/dashboard" replace />} />
                    <Route path="dashboard" element={<Dashboard />} />

                    {/* People Management */}
                    <Route path="students" element={<Students />} />
                    <Route path="employees" element={<Employees />} />
                    <Route path="staff" element={<Staff />} />
                    <Route path="departments" element={<Departments />} />

                    {/* Operations */}
                    <Route path="attendance" element={<Attendance />} />
                    <Route path="leave" element={<Leave />} />
                    <Route path="holidays" element={<Holidays />} />

                    {/* Academics */}
                    <Route path="timetable" element={<Timetable />} />
                    <Route path="homework" element={<Homework />} />
                    <Route path="exams" element={<Exams />} />
                    <Route path="classes" element={<Classes />} />

                    {/* Communication */}
                    <Route path="communication" element={<Communication />} />
                    <Route path="reports" element={<Reports />} />

                    {/* Finance & Operations */}
                    <Route path="finance" element={<Finance />} />
                    <Route path="dues-list" element={<DuesList />} />
                    <Route path="fee-structure" element={<FeeStructure />} />
                    <Route path="inventory" element={<Inventory />} />
                    <Route path="audit" element={<Audit />} />

                    {/* Settings & Profile */}
                    <Route path="settings" element={<Settings />} />
                    <Route path="profile" element={<Profile />} />

                    {/* 404 – redirect unknown paths back to dashboard */}
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
            </Suspense>
        </AnimatePresence>
    );
};

export default AnimatedRoutes;

