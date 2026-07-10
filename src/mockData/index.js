// src/mockData/index.js

const firstNames = [
    'Aarav', 'Priya', 'Rohan', 'Ananya', 'Rahul', 'Sneha', 'Arjun', 'Kavya', 'Vikram', 'Meera', 
    'Sanjay', 'Aisha', 'Amit', 'Divya', 'Harsh', 'Neha', 'Rajesh', 'Shilpa', 'Vivek', 'Pooja', 
    'Sunil', 'Jyoti', 'Ramesh', 'Swati', 'Aditya', 'Ritu', 'Karan', 'Komal', 'Deepak', 'Sapna',
    'Abhishek', 'Monika', 'Vijay', 'Nisha', 'Alok', 'Preeti', 'Sandeep', 'Priyanka'
];

const lastNames = [
    'Sharma', 'Patel', 'Verma', 'Reddy', 'Kumar', 'Gupta', 'Mehta', 'Joshi', 'Singh', 'Nair', 
    'Desai', 'Khan', 'Rao', 'Iyer', 'Bhat', 'Patil', 'Saxena', 'Mishra', 'Choudhury', 'Sen',
    'Das', 'Trivedi', 'Bose', 'Chawla', 'Kapoor', 'Malhotra', 'Bhardwaj', 'Pillai', 'Shetty'
];

const classes = ['CS-A', 'CS-B', 'IT-A', 'IT-B', 'ECE-A', 'ECE-B', 'MECH-A', 'CIVIL', 'EEE'];
const departments = ['Computer Science', 'Information Technology', 'Electronics', 'Mechanical', 'Civil', 'Electrical', 'Administration', 'Finance', 'Human Resources', 'Accounts'];
const roles = ['Professor', 'Assistant Professor', 'Senior Lecturer', 'Lecturer', 'Lab Assistant'];
const staffRoles = ['Security Guard', 'Cafeteria Staff', 'Janitor', 'Bus Driver', 'Electrician', 'Gardener'];
const shifts = ['Morning', 'Evening', 'Night', 'Full Day'];
const statuses = ['Present', 'Absent', 'Late', 'Leave'];
const leaveTypes = ['Sick Leave', 'Casual Leave', 'Emergency Leave', 'Medical Leave', 'Vacation', 'Earned Leave'];
const leaveStatuses = ['Pending', 'Approved', 'Rejected'];
const inventoryItems = [
    { name: 'Projector', category: 'Electronics', price: 32000 },
    { name: 'Dell Latitude Laptop', category: 'Electronics', price: 65000 },
    { name: 'HP LaserJet Printer', category: 'Electronics', price: 18000 },
    { name: 'Whiteboard', category: 'Furniture', price: 3500 },
    { name: 'Laboratory Microscope', category: 'Lab Equipment', price: 12000 },
    { name: 'Office Ergonomic Chair', category: 'Furniture', price: 8500 },
    { name: 'Classroom Desk & Bench Set', category: 'Furniture', price: 6000 },
    { name: 'Chemistry Laboratory Kit', category: 'Lab Equipment', price: 4500 },
    { name: 'Physics Prism Kit', category: 'Lab Equipment', price: 2500 },
    { name: 'A4 Paper Pack (500 sheets)', category: 'Stationery', price: 350 },
    { name: 'Dry Erase Markers Pack', category: 'Stationery', price: 250 },
    { name: 'Dustbin', category: 'Furniture', price: 800 }
];
const feeTypes = ['Tuition Fee', 'Transport Fee', 'Hostel Fee', 'Library Fee', 'Examination Fee'];

// Utility to pick random element
const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomRange = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// 1. Generate 150 Students
export const mockStudents = Array.from({ length: 150 }, (_, i) => {
    const fname = pickRandom(firstNames);
    const lname = pickRandom(lastNames);
    const gender = ['Priya', 'Ananya', 'Sneha', 'Kavya', 'Meera', 'Aisha', 'Divya', 'Neha', 'Shilpa', 'Pooja', 'Jyoti', 'Swati', 'Ritu', 'Komal', 'Sapna', 'Monika', 'Nisha', 'Preeti', 'Priyanka'].includes(fname) ? 'Female' : 'Male';
    const attendance = randomRange(65, 100);
    const id = `STU${String(i + 1).padStart(3, '0')}`;
    
    // Parent Details
    const fatherFname = pickRandom(firstNames.filter(n => !['Priya', 'Ananya', 'Sneha', 'Kavya', 'Meera', 'Aisha', 'Divya', 'Neha', 'Shilpa', 'Pooja', 'Jyoti', 'Swati', 'Ritu', 'Komal', 'Sapna', 'Monika', 'Nisha', 'Preeti', 'Priyanka'].includes(n)));
    const motherFname = pickRandom(['Ananya', 'Sneha', 'Kavya', 'Meera', 'Neha', 'Shilpa', 'Pooja', 'Jyoti', 'Swati', 'Ritu', 'Komal', 'Preeti']);

    return {
        id,
        avatar: `https://i.pravatar.cc/150?img=${(i % 70) + 1}`,
        name: `${fname} ${lname}`,
        class: pickRandom(classes),
        roll: randomRange(1, 60),
        attendance,
        status: pickRandom(statuses),
        gender,
        parentName: `${fatherFname} ${lname}`,
        motherName: `${motherFname} ${lname}`,
        parentPhone: `+91 98765 ${randomRange(10000, 99999)}`,
        parentEmail: `${fname.toLowerCase()}.${lname.toLowerCase()}@parent.in`,
        address: `${randomRange(1, 100)}, Block ${pickRandom(['A', 'B', 'C', 'D'])}, Sector ${randomRange(1, 62)}, Noida, UP`,
        gpa: (randomRange(60, 100) / 10).toFixed(1),
        rank: randomRange(1, 60)
    };
});

// 2. Generate 60 Employees
export const mockEmployees = Array.from({ length: 60 }, (_, i) => {
    const fname = pickRandom(firstNames);
    const lname = pickRandom(lastNames);
    const gender = ['Priya', 'Ananya', 'Sneha', 'Kavya', 'Meera', 'Aisha', 'Divya', 'Neha', 'Shilpa', 'Pooja', 'Jyoti', 'Swati', 'Ritu', 'Komal', 'Sapna', 'Monika', 'Nisha', 'Preeti', 'Priyanka'].includes(fname) ? 'Female' : 'Male';
    const dept = pickRandom(departments.slice(0, 7)); // Academic and Admin
    const id = `EMP${String(i + 1).padStart(3, '0')}`;
    
    return {
        id,
        avatar: `https://i.pravatar.cc/150?img=${((i + 35) % 70) + 1}`,
        name: `${fname} ${lname}`,
        department: dept,
        role: i === 0 ? 'Director' : i < 6 ? 'Head of Department' : pickRandom(roles),
        status: pickRandom(['Present', 'Absent', 'Late', 'On Leave']),
        gender,
        phone: `+91 99887 ${randomRange(10000, 99999)}`,
        email: `${fname.toLowerCase()}.${lname.toLowerCase()}@institution.edu.in`,
        experience: `${randomRange(2, 25)} Years`,
        performanceScore: randomRange(80, 98),
        publications: randomRange(0, 15)
    };
});

// 3. Generate 40 Support Staff
export const mockStaff = Array.from({ length: 40 }, (_, i) => {
    const fname = pickRandom(firstNames);
    const lname = pickRandom(lastNames);
    const id = `STF${String(i + 1).padStart(3, '0')}`;
    
    return {
        id,
        avatar: `https://i.pravatar.cc/150?img=${((i + 15) % 70) + 1}`,
        name: `${fname} ${lname}`,
        role: pickRandom(staffRoles),
        shift: pickRandom(shifts),
        status: pickRandom(['Present', 'Absent', 'Late']),
        phone: `+91 91234 ${randomRange(10000, 99999)}`,
        assignedArea: `Block ${pickRandom(['A', 'B', 'C', 'D'])}, Floor ${randomRange(0, 3)}`
    };
});

// 4. Generate 250 Attendance Records
const generateAttendanceRecords = () => {
    const records = [];
    const date = '2026-07-06';
    // Let's create logs for 150 students + 60 employees + 40 staff = 250 records
    let recordIndex = 1;
    
    // Students
    mockStudents.forEach((student, index) => {
        const timeIn = student.status === 'Present' ? '08:45 AM' : student.status === 'Late' ? '09:15 AM' : '--';
        const timeOut = student.status === 'Present' || student.status === 'Late' ? '03:30 PM' : '--';
        records.push({
            id: `ATT${String(recordIndex++).padStart(4, '0')}`,
            avatar: student.avatar,
            name: student.name,
            role: 'Student',
            classOrDept: student.class,
            date,
            timeIn,
            timeOut,
            status: student.status
        });
    });

    // Employees
    mockEmployees.forEach((emp, index) => {
        const timeIn = emp.status === 'Present' ? '08:50 AM' : emp.status === 'Late' ? '09:20 AM' : '--';
        const timeOut = emp.status === 'Present' || emp.status === 'Late' ? '04:30 PM' : '--';
        records.push({
            id: `ATT${String(recordIndex++).padStart(4, '0')}`,
            avatar: emp.avatar,
            name: emp.name,
            role: 'Employee',
            classOrDept: emp.department,
            date,
            timeIn,
            timeOut,
            status: emp.status === 'On Leave' ? 'Leave' : emp.status
        });
    });

    // Support Staff
    mockStaff.forEach((stf, index) => {
        const timeIn = stf.status === 'Present' ? '07:55 AM' : stf.status === 'Late' ? '08:30 AM' : '--';
        const timeOut = stf.status === 'Present' || stf.status === 'Late' ? '04:00 PM' : '--';
        records.push({
            id: `ATT${String(recordIndex++).padStart(4, '0')}`,
            avatar: stf.avatar,
            name: stf.name,
            role: 'Staff',
            classOrDept: stf.role,
            date,
            timeIn,
            timeOut,
            status: stf.status
        });
    });

    return records;
};

export const mockAttendance = generateAttendanceRecords();

// 5. Generate 60 Leave Requests
export const mockLeave = Array.from({ length: 60 }, (_, i) => {
    const applicantType = pickRandom(['Student', 'Employee', 'Staff']);
    let name = '';
    let avatar = '';
    let classOrDept = '';

    if (applicantType === 'Student') {
        const s = mockStudents[i % mockStudents.length];
        name = s.name;
        avatar = s.avatar;
        classOrDept = s.class;
    } else if (applicantType === 'Employee') {
        const e = mockEmployees[i % mockEmployees.length];
        name = e.name;
        avatar = e.avatar;
        classOrDept = e.department;
    } else {
        const sf = mockStaff[i % mockStaff.length];
        name = sf.name;
        avatar = sf.avatar;
        classOrDept = sf.role;
    }

    const duration = randomRange(1, 5);
    const startDate = `2026-07-${String(randomRange(7, 28)).padStart(2, '0')}`;

    return {
        id: `LV${String(i + 1).padStart(3, '0')}`,
        avatar,
        name,
        role: applicantType,
        classOrDept,
        type: pickRandom(leaveTypes),
        startDate,
        duration: `${duration} ${duration > 1 ? 'Days' : 'Day'}`,
        reason: pickRandom([
            'Viral fever and doctor advised bed rest.',
            'Attending cousin\'s wedding ceremony in home town.',
            'Urgent domestic work at home.',
            'Not feeling well, severe headache.',
            'Going out of station with family.',
            'Renewing driver\'s license and passport.'
        ]),
        status: pickRandom(leaveStatuses)
    };
});

// 6. Generate 120 Fee Records & Ledger Transactions
export const mockFinanceDueList = mockStudents.slice(0, 80).map((student, i) => {
    const feeType = pickRandom(feeTypes);
    const amount = randomRange(5, 50) * 1000;
    
    return {
        id: `INV-${randomRange(202600, 202699)}-${i}`,
        student: student.name,
        class: student.class,
        category: feeType,
        amount: `₹${amount.toLocaleString('en-IN')}`,
        numericAmount: amount,
        dueDate: `2026-07-${String(randomRange(10, 25)).padStart(2, '0')}`,
        status: pickRandom(['Overdue', 'Pending', 'Partial'])
    };
});

export const mockFeeTransactions = Array.from({ length: 120 }, (_, i) => {
    const student = mockStudents[i % mockStudents.length];
    const amount = randomRange(2, 45) * 1000;
    
    return {
        id: `TXN-${randomRange(88000, 99000)}-${i}`,
        student: student.name,
        class: student.class,
        desc: `${pickRandom(feeTypes)} - Semester ${pickRandom(['I', 'II', 'III', 'IV', 'V', 'VI'])}`,
        amount: amount,
        method: pickRandom(['UPI (GPay/PhonePe)', 'NetBanking', 'Credit Card', 'Cash']),
        date: `2026-07-${String(randomRange(1, 6)).padStart(2, '0')}`
    };
});

export const mockFeeStructure = [
    { id: 'F01', category: 'Tuition Fee', amount: '₹45,000', numericAmount: 45000, frequency: 'Per Semester', mandatory: true },
    { id: 'F02', category: 'Hostel Fee', amount: '₹25,000', numericAmount: 25000, frequency: 'Per Semester', mandatory: false },
    { id: 'F03', category: 'Transport Fee', amount: '₹12,000', numericAmount: 12000, frequency: 'Annually', mandatory: false },
    { id: 'F04', category: 'Examination Fee', amount: '₹2,500', numericAmount: 2500, frequency: 'Per Semester', mandatory: true },
    { id: 'F05', category: 'Library Security Deposit', amount: '₹5,000', numericAmount: 5000, frequency: 'One Time (Refundable)', mandatory: true },
];

// 7. Generate 100 Inventory Items
export const mockInventory = Array.from({ length: 100 }, (_, i) => {
    const rawItem = inventoryItems[i % inventoryItems.length];
    const stock = randomRange(5, 120);
    const status = stock < 15 ? 'Low Stock' : stock === 0 ? 'Out of Stock' : 'In Stock';
    
    return {
        id: `INV-${String(i + 1).padStart(3, '0')}`,
        item: rawItem.name,
        category: rawItem.category,
        stock,
        status,
        price: rawItem.price,
        totalValue: stock * rawItem.price,
        lastRestocked: `2026-06-${String(randomRange(10, 28)).padStart(2, '0')}`
    };
});

export const mockInventoryRequests = Array.from({ length: 25 }, (_, i) => {
    const dept = pickRandom(departments);
    const item = pickRandom(inventoryItems).name;
    const qty = randomRange(1, 10);
    
    return {
        id: `REQ-${String(i + 1).padStart(3, '0')}`,
        item,
        department: dept,
        quantity: qty,
        status: pickRandom(['Pending', 'Approved', 'Rejected']),
        date: `2026-07-0${randomRange(1, 6)}`
    };
});

// 8. Generate 50 Audit Logs
export const mockAuditLogs = Array.from({ length: 50 }, (_, i) => {
    const time = new Date();
    time.setMinutes(time.getMinutes() - (i * 25));
    const emp = mockEmployees[i % mockEmployees.length];
    
    return {
        id: `AUD-${String(i + 1000).padStart(4, '0')}`,
        user: emp.name,
        role: emp.role,
        action: pickRandom([
            'Logged in successfully',
            'Modified tuition fee structure',
            'Approved student leave application',
            'Registered a new student profile',
            'Deleted outdated inventory log',
            'Exported June Finance spreadsheet',
            'Disbursed monthly faculty payroll',
            'Updated class CS-A attendance log',
            'Broadcast PTM reminder via SMS'
        ]),
        module: pickRandom(['Authentication', 'Finance', 'Leaves', 'Students', 'System Logs', 'Reports', 'Attendance', 'Communication']),
        timestamp: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' (' + time.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ')',
        ip: `192.168.1.${randomRange(10, 254)}`,
        device: pickRandom(['Chrome / Windows 11', 'Safari / macOS Sonoma', 'Firefox / Ubuntu Linux', 'Edge / Windows 10', 'Chrome / Android 14'])
    };
});

// Chart & Statistics Aggregations
export const departmentDistributionData = [
    { name: 'Computer Science', value: 85, color: '#22C55E' },
    { name: 'Info Tech', value: 62, color: '#3B82F6' },
    { name: 'Electronics', value: 45, color: '#F59E0B' },
    { name: 'Mechanical', value: 38, color: '#8B5CF6' },
    { name: 'Civil', value: 24, color: '#EC4899' },
    { name: 'Administration', value: 18, color: '#14B8A6' }
];

export const employeeGrowthData = [
    { month: 'Jan', count: 180 }, { month: 'Feb', count: 195 }, { month: 'Mar', count: 205 },
    { month: 'Apr', count: 220 }, { month: 'May', count: 235 }, { month: 'Jun', count: 250 }
];

export const weeklyAttendanceData = [
    { day: 'Mon', present: 225, absent: 25 }, 
    { day: 'Tue', present: 235, absent: 15 },
    { day: 'Wed', present: 218, absent: 32 }, 
    { day: 'Thu', present: 240, absent: 10 },
    { day: 'Fri', present: 212, absent: 38 }
];

export const collectionTrendData = [
    { day: '1st', amount: 85000 }, { day: '5th', amount: 150000 }, { day: '10th', amount: 340000 },
    { day: '15th', amount: 220000 }, { day: '20th', amount: 120000 }, { day: '25th', amount: 480000 }
];

export const leaveAnalyticsData = [
    { month: 'Jan', leaves: 15 },
    { month: 'Feb', leaves: 28 },
    { month: 'Mar', leaves: 12 },
    { month: 'Apr', leaves: 22 },
    { month: 'May', leaves: 45 },
    { month: 'Jun', leaves: 18 }
];

export const mockNotifications = [
    { id: 'N01', icon: '🏆', title: 'Annual Sports Meet 2026', message: 'Registrations are open for track events and inter-college football tournament.', date: '10 minutes ago', status: 'Unread' },
    { id: 'N02', icon: '👨‍🏫', title: 'Parent Teacher Meeting', message: 'PtM scheduled for first-year engineering students this Saturday at 10 AM.', date: '3 hours ago', status: 'Unread' },
    { id: 'N03', icon: '💰', title: 'Fee Defaulters Alert', message: 'Outstanding dues notice has been sent to 45 students with over 30 days delay.', date: '1 day ago', status: 'Read' },
    { id: 'N04', icon: '📦', title: 'Low Stock Notification', message: 'Office Ergonomic Chairs and laboratory prisms are below reorder threshold.', date: '2 days ago', status: 'Read' }
];

export const mockSMS = [
    { id: 'S01', recipient: 'Parents (CS-A)', message: 'Dear Parent, your ward was marked absent today, July 6. Please contact coordinator.', status: 'Sent', date: '2026-07-06' },
    { id: 'S02', recipient: 'All Staff', message: 'Reminder: Monthly review meet in main seminar hall at 4 PM today.', status: 'Sent', date: '2026-07-06' },
    { id: 'S03', recipient: 'Aarav Sharma (Parent)', message: 'Fee Due: First installment of tuition fee is outstanding. Due date July 15.', status: 'Sent', date: '2026-07-05' }
];

export const mockHolidays = [
    { id: 'H01', date: '26 Jan', name: 'Republic Day', type: 'National Holiday', icon: '🇮🇳' },
    { id: 'H02', date: '15 Aug', name: 'Independence Day', type: 'National Holiday', icon: '🇮🇳' },
    { id: 'H03', date: '02 Oct', name: 'Gandhi Jayanti', type: 'National Holiday', icon: '🇮🇳' },
    { id: 'H04', date: '24 Oct', name: 'Diwali Festival', type: 'Public Holiday', icon: '🪔' },
    { id: 'H05', date: '25 Dec', name: 'Christmas Day', type: 'Public Holiday', icon: '🎄' }
];

export const mockClasses = [
    { id: 'C01', name: 'CS-A', section: 'A', stream: 'Computer Science', teacher: 'Dr. Anita Rao', teacherId: 'EMP001', students: 45, performance: '92%', subjects: ['Data Structures', 'DBMS', 'OS', 'Computer Networks', 'Python Programming', 'Mathematics'] },
    { id: 'C02', name: 'CS-B', section: 'B', stream: 'Computer Science', teacher: 'Prof. S. Kumar', teacherId: 'EMP002', students: 40, performance: '85%', subjects: ['Data Structures', 'DBMS', 'OS', 'Computer Networks', 'Java Programming', 'Mathematics'] },
    { id: 'C03', name: 'IT-A', section: 'A', stream: 'Information Technology', teacher: 'Mrs. Priya Sen', teacherId: 'EMP003', students: 38, performance: '90%', subjects: ['Web Technology', 'Software Engineering', 'Cloud Computing', 'Cyber Security', 'Python', 'Statistics'] },
    { id: 'C04', name: 'IT-B', section: 'B', stream: 'Information Technology', teacher: 'Mr. Vikram Mehta', teacherId: 'EMP004', students: 35, performance: '87%', subjects: ['Web Technology', 'Software Engineering', 'Cloud Computing', 'AI & ML', 'React JS', 'Statistics'] },
    { id: 'C05', name: 'ECE-A', section: 'A', stream: 'Electronics', teacher: 'Dr. Ramesh Nair', teacherId: 'EMP005', students: 42, performance: '84%', subjects: ['Digital Electronics', 'Signal Processing', 'VLSI Design', 'Embedded Systems', 'Microprocessors', 'Physics'] },
    { id: 'C06', name: 'MECH-A', section: 'A', stream: 'Mechanical', teacher: 'Prof. Alok Trivedi', teacherId: 'EMP006', students: 44, performance: '81%', subjects: ['Thermodynamics', 'Fluid Mechanics', 'Engineering Drawing', 'Manufacturing Processes', 'Strength of Materials', 'Mathematics'] },
];

export const mockDepartments = [
    { id: 'D01', name: 'Computer Science', employees: 15, performance: 94, head: 'Dr. Anita Rao', openPositions: 2 },
    { id: 'D02', name: 'Information Technology', employees: 12, performance: 89, head: 'Prof. S. Kumar', openPositions: 1 },
    { id: 'D03', name: 'Electronics & Comm.', employees: 10, performance: 91, head: 'Mrs. Priya Sen', openPositions: 3 },
    { id: 'D04', name: 'Mechanical Engineering', employees: 8, performance: 88, head: 'Dr. Ramesh Nair', openPositions: 2 }
];

// Timetable Data — per class/section weekly schedule
export const mockTimetableData = {
    'CS-A': {
        Monday:    [{ subject: 'Data Structures', teacher: 'Dr. Anita Rao', alt: '' }, { subject: 'DBMS', teacher: 'Prof. S. Kumar', alt: '' }, { subject: 'OS', teacher: 'Mrs. Priya Sen', alt: '' }, { subject: 'Python Programming', teacher: 'Mr. Vikram Mehta', alt: '' }, { subject: 'Mathematics', teacher: 'Dr. Ramesh Nair', alt: '' }, { subject: 'Library', teacher: '', alt: '' }],
        Tuesday:   [{ subject: 'Computer Networks', teacher: 'Mrs. Priya Sen', alt: '' }, { subject: 'Data Structures Lab', teacher: 'Dr. Anita Rao', alt: '' }, { subject: 'Data Structures Lab', teacher: 'Dr. Anita Rao', alt: '' }, { subject: 'DBMS', teacher: 'Prof. S. Kumar', alt: '' }, { subject: 'Mathematics', teacher: 'Dr. Ramesh Nair', alt: '' }, { subject: 'Sports', teacher: '', alt: '' }],
        Wednesday: [{ subject: 'OS', teacher: 'Mrs. Priya Sen', alt: '' }, { subject: 'Python Programming', teacher: 'Mr. Vikram Mehta', alt: '' }, { subject: 'Computer Networks', teacher: 'Mrs. Priya Sen', alt: '' }, { subject: 'DBMS Lab', teacher: 'Prof. S. Kumar', alt: '' }, { subject: 'DBMS Lab', teacher: 'Prof. S. Kumar', alt: '' }, { subject: 'Mathematics', teacher: 'Dr. Ramesh Nair', alt: '' }],
        Thursday:  [{ subject: 'Data Structures', teacher: 'Dr. Anita Rao', alt: '' }, { subject: 'OS', teacher: 'Mrs. Priya Sen', alt: '' }, { subject: 'Mathematics', teacher: 'Dr. Ramesh Nair', alt: '' }, { subject: 'Python Programming', teacher: 'Mr. Vikram Mehta', alt: '' }, { subject: 'Computer Networks', teacher: 'Mrs. Priya Sen', alt: '' }, { subject: 'Seminar', teacher: '', alt: '' }],
        Friday:    [{ subject: 'DBMS', teacher: 'Prof. S. Kumar', alt: '' }, { subject: 'Mathematics', teacher: 'Dr. Ramesh Nair', alt: '' }, { subject: 'Data Structures', teacher: 'Dr. Anita Rao', alt: '' }, { subject: 'Python Lab', teacher: 'Mr. Vikram Mehta', alt: '' }, { subject: 'Python Lab', teacher: 'Mr. Vikram Mehta', alt: '' }, { subject: 'Project Work', teacher: 'Dr. Anita Rao', alt: '' }],
        Saturday:  [{ subject: 'Tutorial: DS', teacher: 'Dr. Anita Rao', alt: '' }, { subject: 'Tutorial: DBMS', teacher: 'Prof. S. Kumar', alt: '' }, { subject: 'Tutorial: OS', teacher: 'Mrs. Priya Sen', alt: '' }, { subject: '', teacher: '', alt: '' }, { subject: '', teacher: '', alt: '' }, { subject: '', teacher: '', alt: '' }],
    },
    'CS-B': {
        Monday:    [{ subject: 'Java Programming', teacher: 'Prof. S. Kumar', alt: '' }, { subject: 'DBMS', teacher: 'Dr. Anita Rao', alt: '' }, { subject: 'Mathematics', teacher: 'Dr. Ramesh Nair', alt: '' }, { subject: 'Data Structures', teacher: 'Mrs. Priya Sen', alt: '' }, { subject: 'OS', teacher: 'Mr. Vikram Mehta', alt: '' }, { subject: 'Library', teacher: '', alt: '' }],
        Tuesday:   [{ subject: 'Computer Networks', teacher: 'Mr. Vikram Mehta', alt: '' }, { subject: 'Java Lab', teacher: 'Prof. S. Kumar', alt: '' }, { subject: 'Java Lab', teacher: 'Prof. S. Kumar', alt: '' }, { subject: 'DBMS', teacher: 'Dr. Anita Rao', alt: '' }, { subject: 'Mathematics', teacher: 'Dr. Ramesh Nair', alt: '' }, { subject: 'Sports', teacher: '', alt: '' }],
        Wednesday: [{ subject: 'Data Structures', teacher: 'Mrs. Priya Sen', alt: '' }, { subject: 'OS', teacher: 'Mr. Vikram Mehta', alt: '' }, { subject: 'Java Programming', teacher: 'Prof. S. Kumar', alt: '' }, { subject: 'DBMS Lab', teacher: 'Dr. Anita Rao', alt: '' }, { subject: 'DBMS Lab', teacher: 'Dr. Anita Rao', alt: '' }, { subject: 'Mathematics', teacher: 'Dr. Ramesh Nair', alt: '' }],
        Thursday:  [{ subject: 'DBMS', teacher: 'Dr. Anita Rao', alt: '' }, { subject: 'Data Structures', teacher: 'Mrs. Priya Sen', alt: '' }, { subject: 'Computer Networks', teacher: 'Mr. Vikram Mehta', alt: '' }, { subject: 'Java Programming', teacher: 'Prof. S. Kumar', alt: '' }, { subject: 'Mathematics', teacher: 'Dr. Ramesh Nair', alt: '' }, { subject: 'Seminar', teacher: '', alt: '' }],
        Friday:    [{ subject: 'OS', teacher: 'Mr. Vikram Mehta', alt: '' }, { subject: 'Mathematics', teacher: 'Dr. Ramesh Nair', alt: '' }, { subject: 'Computer Networks', teacher: 'Mr. Vikram Mehta', alt: '' }, { subject: 'DS Lab', teacher: 'Mrs. Priya Sen', alt: '' }, { subject: 'DS Lab', teacher: 'Mrs. Priya Sen', alt: '' }, { subject: 'Project Work', teacher: 'Prof. S. Kumar', alt: '' }],
        Saturday:  [{ subject: 'Tutorial: Java', teacher: 'Prof. S. Kumar', alt: '' }, { subject: 'Tutorial: DBMS', teacher: 'Dr. Anita Rao', alt: '' }, { subject: '', teacher: '', alt: '' }, { subject: '', teacher: '', alt: '' }, { subject: '', teacher: '', alt: '' }, { subject: '', teacher: '', alt: '' }],
    },
};

// Homework Data
export const mockHomework = [
    { id: 'HW001', class: 'CS-A', subject: 'Data Structures', title: 'Binary Tree Traversal Problems', description: 'Solve 10 binary tree problems from chapter 6. Include inorder, preorder and postorder traversals.', assignedBy: 'Dr. Anita Rao', assignedDate: '2026-07-01', dueDate: '2026-07-07', status: 'Active', submissions: 38, total: 45 },
    { id: 'HW002', class: 'CS-A', subject: 'DBMS', title: 'Normalization Worksheet', description: 'Normalize the given relations to 3NF. Show all intermediate steps with FDs.', assignedBy: 'Prof. S. Kumar', assignedDate: '2026-07-02', dueDate: '2026-07-08', status: 'Active', submissions: 22, total: 45 },
    { id: 'HW003', class: 'CS-B', subject: 'Java Programming', title: 'Collection Framework Exercises', description: 'Implement 5 programs using ArrayList, HashMap, LinkedList, TreeMap, and Stack. Include main method demos.', assignedBy: 'Prof. S. Kumar', assignedDate: '2026-07-01', dueDate: '2026-07-06', status: 'Overdue', submissions: 31, total: 40 },
    { id: 'HW004', class: 'IT-A', subject: 'Web Technology', title: 'Responsive Portfolio Page', description: 'Create a personal portfolio webpage using HTML5, CSS Grid, and Flexbox. Must be mobile responsive.', assignedBy: 'Mrs. Priya Sen', assignedDate: '2026-06-28', dueDate: '2026-07-05', status: 'Overdue', submissions: 35, total: 38 },
    { id: 'HW005', class: 'ECE-A', subject: 'Digital Electronics', title: 'Logic Gate Minimization', description: 'Use K-map to minimize Boolean expressions from Exercise Set B (Q1–Q15).', assignedBy: 'Dr. Ramesh Nair', assignedDate: '2026-07-03', dueDate: '2026-07-10', status: 'Active', submissions: 5, total: 42 },
    { id: 'HW006', class: 'CS-A', subject: 'Mathematics', title: 'Probability Practice Set', description: 'Solve probability problems from unit 4 — Baye\'s theorem and conditional probability exercises.', assignedBy: 'Dr. Ramesh Nair', assignedDate: '2026-07-04', dueDate: '2026-07-11', status: 'Active', submissions: 0, total: 45 },
    { id: 'HW007', class: 'IT-B', subject: 'Cloud Computing', title: 'AWS vs Azure Comparison Report', description: 'Write a 3-page technical report comparing AWS EC2 and Azure VMs. Include pricing, SLA, and use cases.', assignedBy: 'Mr. Vikram Mehta', assignedDate: '2026-06-30', dueDate: '2026-07-04', status: 'Completed', submissions: 35, total: 35 },
    { id: 'HW008', class: 'MECH-A', subject: 'Thermodynamics', title: 'Carnot Cycle Problems', description: 'Solve 8 Carnot cycle problems from textbook page 140–155. Show P-V diagrams for each.', assignedBy: 'Prof. Alok Trivedi', assignedDate: '2026-07-03', dueDate: '2026-07-09', status: 'Active', submissions: 12, total: 44 },
];

// Exam Data
export const mockExams = [
    { id: 'EX001', name: 'Unit Test I', type: 'Unit Test', class: 'CS-A', subject: 'Data Structures', date: '2026-07-15', time: '10:00 AM', duration: '2 Hours', room: 'Hall A', maxMarks: 50, examiner: 'Dr. Anita Rao', status: 'Upcoming' },
    { id: 'EX002', name: 'Unit Test I', type: 'Unit Test', class: 'CS-A', subject: 'DBMS', date: '2026-07-16', time: '10:00 AM', duration: '2 Hours', room: 'Hall A', maxMarks: 50, examiner: 'Prof. S. Kumar', status: 'Upcoming' },
    { id: 'EX003', name: 'Unit Test I', type: 'Unit Test', class: 'CS-A', subject: 'OS', date: '2026-07-17', time: '10:00 AM', duration: '2 Hours', room: 'Hall A', maxMarks: 50, examiner: 'Mrs. Priya Sen', status: 'Upcoming' },
    { id: 'EX004', name: 'Mid-Semester Exam', type: 'Mid-Sem', class: 'CS-B', subject: 'Java Programming', date: '2026-07-20', time: '09:00 AM', duration: '3 Hours', room: 'Hall B', maxMarks: 100, examiner: 'Prof. S. Kumar', status: 'Upcoming' },
    { id: 'EX005', name: 'Unit Test I', type: 'Unit Test', class: 'IT-A', subject: 'Web Technology', date: '2026-07-15', time: '02:00 PM', duration: '2 Hours', room: 'Hall C', maxMarks: 50, examiner: 'Mrs. Priya Sen', status: 'Upcoming' },
    { id: 'EX006', name: 'Practical Exam', type: 'Practical', class: 'CS-A', subject: 'Python Lab', date: '2026-07-12', time: '09:00 AM', duration: '3 Hours', room: 'Lab 1', maxMarks: 50, examiner: 'Mr. Vikram Mehta', status: 'Upcoming' },
    { id: 'EX007', name: 'Unit Test I', type: 'Unit Test', class: 'ECE-A', subject: 'Digital Electronics', date: '2026-07-08', time: '10:00 AM', duration: '2 Hours', room: 'Hall D', maxMarks: 50, examiner: 'Dr. Ramesh Nair', status: 'Completed' },
    { id: 'EX008', name: 'Viva Voce', type: 'Viva', class: 'MECH-A', subject: 'Thermodynamics', date: '2026-07-06', time: '11:00 AM', duration: '1 Hour', room: 'Room 201', maxMarks: 25, examiner: 'Prof. Alok Trivedi', status: 'Completed' },
];

// Exam Results
export const mockExamResults = [
    { id: 'R001', examId: 'EX007', studentId: 'STU001', studentName: 'Aarav Sharma', class: 'ECE-A', subject: 'Digital Electronics', marksObtained: 44, maxMarks: 50, grade: 'A+', remarks: 'Excellent' },
    { id: 'R002', examId: 'EX007', studentId: 'STU002', studentName: 'Priya Patel', class: 'ECE-A', subject: 'Digital Electronics', marksObtained: 38, maxMarks: 50, grade: 'A', remarks: 'Good' },
    { id: 'R003', examId: 'EX007', studentId: 'STU003', studentName: 'Rohan Verma', class: 'ECE-A', subject: 'Digital Electronics', marksObtained: 31, maxMarks: 50, grade: 'B', remarks: 'Satisfactory' },
    { id: 'R004', examId: 'EX007', studentId: 'STU004', studentName: 'Ananya Reddy', class: 'ECE-A', subject: 'Digital Electronics', marksObtained: 18, maxMarks: 50, grade: 'F', remarks: 'Needs Improvement' },
    { id: 'R005', examId: 'EX007', studentId: 'STU005', studentName: 'Rahul Kumar', class: 'ECE-A', subject: 'Digital Electronics', marksObtained: 42, maxMarks: 50, grade: 'A+', remarks: 'Excellent' },
    { id: 'R006', examId: 'EX008', studentId: 'STU010', studentName: 'Sanjay Gupta', class: 'MECH-A', subject: 'Thermodynamics', marksObtained: 22, maxMarks: 25, grade: 'A+', remarks: 'Outstanding' },
    { id: 'R007', examId: 'EX008', studentId: 'STU011', studentName: 'Aisha Mehta', class: 'MECH-A', subject: 'Thermodynamics', marksObtained: 19, maxMarks: 25, grade: 'A', remarks: 'Good' },
    { id: 'R008', examId: 'EX008', studentId: 'STU012', studentName: 'Amit Joshi', class: 'MECH-A', subject: 'Thermodynamics', marksObtained: 14, maxMarks: 25, grade: 'C', remarks: 'Average' },
];

// ─── NEW MOCK DATA FOR MISSING FEATURES ───────────────────────────────────────

// Upcoming Events
export const mockEvents = [
    { id: 'EV001', title: 'Annual Sports Meet', date: '2026-07-12', type: 'Sports', icon: '🏆', description: 'Inter-college football and track events. All students must register by July 10.', venue: 'Sports Ground' },
    { id: 'EV002', title: 'Parent Teacher Meeting', date: '2026-07-14', type: 'Academic', icon: '👨‍🏫', description: 'PTM for first-year engineering students. 10:00 AM in the main seminar hall.', venue: 'Seminar Hall A' },
    { id: 'EV003', title: 'Unit Test I — CS-A', date: '2026-07-15', type: 'Exam', icon: '📝', description: 'Unit Test I for CS-A: Data Structures & DBMS. Hall A, 10:00 AM.', venue: 'Hall A' },
    { id: 'EV004', title: 'Independence Day Celebration', date: '2026-08-15', type: 'National Holiday', icon: '🇮🇳', description: 'Flag hoisting ceremony at 8:00 AM. All staff and students must attend.', venue: 'Main Ground' },
    { id: 'EV005', title: 'Tech Fest 2026', date: '2026-08-20', type: 'Cultural', icon: '💻', description: 'Annual technology festival. Paper presentations, hackathon, and robotics competition.', venue: 'Campus Wide' },
    { id: 'EV006', title: 'Mid-Semester Exams Begin', date: '2026-07-20', type: 'Exam', icon: '🎓', description: 'Mid-semester examinations for all departments. Timetable issued separately.', venue: 'Multiple Halls' },
];

// Employee Birthdays (for widget)
export const mockBirthdays = [
    { id: 'B001', name: 'Dr. Anita Rao', role: 'Head of Dept.', department: 'Computer Science', avatar: 'https://i.pravatar.cc/150?img=36', dob: '2026-07-06', type: 'Birthday' },
    { id: 'B002', name: 'Prof. S. Kumar', role: 'Professor', department: 'Computer Science', avatar: 'https://i.pravatar.cc/150?img=37', dob: '2026-07-07', type: 'Birthday' },
    { id: 'B003', name: 'Mrs. Priya Sen', role: 'Senior Lecturer', department: 'IT', avatar: 'https://i.pravatar.cc/150?img=49', dob: '2026-07-08', type: 'Birthday' },
    { id: 'B004', name: 'Mr. Vikram Mehta', role: 'Lecturer', department: 'IT', avatar: 'https://i.pravatar.cc/150?img=52', dob: '2026-07-06', type: 'Work Anniversary', years: 5 },
    { id: 'B005', name: 'Dr. Ramesh Nair', role: 'Professor', department: 'Electronics', avatar: 'https://i.pravatar.cc/150?img=60', dob: '2026-07-10', type: 'Birthday' },
];

// Payroll / Salary Data
export const mockPayroll = mockEmployees.map((emp, i) => {
    const basic = (randomRange(30, 90)) * 1000;
    const hra = Math.round(basic * 0.4);
    const da = Math.round(basic * 0.12);
    const ta = randomRange(2, 6) * 1000;
    const grossPay = basic + hra + da + ta;
    const pf = Math.round(basic * 0.12);
    const tax = Math.round(grossPay * 0.08);
    const netPay = grossPay - pf - tax;
    return {
        id: `PAY-${String(i + 1).padStart(3, '0')}`,
        employeeId: emp.id,
        name: emp.name,
        avatar: emp.avatar,
        department: emp.department,
        role: emp.role,
        month: 'June 2026',
        basic,
        hra,
        da,
        ta,
        grossPay,
        pf,
        tax,
        netPay,
        status: pickRandom(['Paid', 'Paid', 'Paid', 'Pending']),
        paidOn: '2026-06-30',
        bankAccount: `XXXX XXXX ${randomRange(1000, 9999)}`,
        ifsc: `HDFC${randomRange(1000000, 9999999)}`,
    };
});

// Leave Balance per Employee
export const mockLeaveBalance = mockEmployees.slice(0, 30).map((emp, i) => {
    const casualTotal = 12, sickTotal = 10, earnedTotal = 15, emergencyTotal = 3;
    const casualUsed = randomRange(0, 8);
    const sickUsed = randomRange(0, 6);
    const earnedUsed = randomRange(0, 10);
    const emergencyUsed = randomRange(0, 2);
    return {
        id: emp.id,
        name: emp.name,
        avatar: emp.avatar,
        department: emp.department,
        role: emp.role,
        casual: { total: casualTotal, used: casualUsed, remaining: casualTotal - casualUsed },
        sick: { total: sickTotal, used: sickUsed, remaining: sickTotal - sickUsed },
        earned: { total: earnedTotal, used: earnedUsed, remaining: earnedTotal - earnedUsed },
        emergency: { total: emergencyTotal, used: emergencyUsed, remaining: emergencyTotal - emergencyUsed },
        totalUsed: casualUsed + sickUsed + earnedUsed + emergencyUsed,
        totalEntitled: casualTotal + sickTotal + earnedTotal + emergencyTotal,
    };
});

// Scholarship Data
export const mockScholarships = [
    { id: 'SCH001', name: 'Merit Excellence Award', criteria: 'GPA ≥ 9.0', amount: '₹50,000', frequency: 'Annual', recipients: 12, status: 'Active', applicants: 45, deadline: '2026-08-01' },
    { id: 'SCH002', name: 'Need-Based Financial Aid', criteria: 'Family income < ₹3 LPA', amount: '₹35,000', frequency: 'Annual', recipients: 28, status: 'Active', applicants: 84, deadline: '2026-07-20' },
    { id: 'SCH003', name: 'Sports Achievement Grant', criteria: 'State/National level sport', amount: '₹25,000', frequency: 'Annual', recipients: 6, status: 'Active', applicants: 18, deadline: '2026-07-30' },
    { id: 'SCH004', name: 'Research Fellowship', criteria: 'Published research paper', amount: '₹40,000', frequency: 'Annual', recipients: 4, status: 'Closed', applicants: 22, deadline: '2026-06-30' },
    { id: 'SCH005', name: 'SC/ST Reservation Aid', criteria: 'SC/ST Category students', amount: '₹30,000', frequency: 'Annual', recipients: 35, status: 'Active', applicants: 60, deadline: '2026-08-15' },
];

// Vendor / Supplier Data
export const mockVendors = [
    { id: 'VEN001', name: 'TechSupply India Pvt Ltd', contact: 'Rajesh Gupta', phone: '+91 98765 43210', email: 'sales@techsupply.in', category: 'Electronics', lastOrder: '2026-06-25', totalOrders: 18, status: 'Active', rating: 4.5 },
    { id: 'VEN002', name: 'FurniWorld Solutions', contact: 'Priya Sharma', phone: '+91 87654 32109', email: 'orders@furniworld.com', category: 'Furniture', lastOrder: '2026-06-10', totalOrders: 12, status: 'Active', rating: 4.2 },
    { id: 'VEN003', name: 'LabEquip Co.', contact: 'Dr. Arun Patel', phone: '+91 76543 21098', email: 'support@labequip.co.in', category: 'Lab Equipment', lastOrder: '2026-05-28', totalOrders: 9, status: 'Active', rating: 4.8 },
    { id: 'VEN004', name: 'StatioMart', contact: 'Meena Joshi', phone: '+91 65432 10987', email: 'bulk@stationmart.in', category: 'Stationery', lastOrder: '2026-07-01', totalOrders: 24, status: 'Active', rating: 3.9 },
    { id: 'VEN005', name: 'CleanCare Services', contact: 'Sunil Das', phone: '+91 54321 09876', email: 'contracts@cleancare.in', category: 'Maintenance', lastOrder: '2026-06-15', totalOrders: 6, status: 'Inactive', rating: 3.5 },
];

// Email Delivery Status (for Communication page)
export const mockEmailDelivery = [
    { id: 'EM001', subject: 'PTM Announcement — Saturday 10 AM', recipient: 'All Parents (CS-A)', sent: 45, delivered: 43, opened: 38, bounced: 2, date: '2026-07-05' },
    { id: 'EM002', subject: 'Fee Payment Reminder — July Installment', recipient: 'Defaulters List (28)', sent: 28, delivered: 27, opened: 19, bounced: 1, date: '2026-07-04' },
    { id: 'EM003', subject: 'Tech Fest 2026 Registration Open', recipient: 'All Students', sent: 150, delivered: 148, opened: 102, bounced: 2, date: '2026-07-03' },
    { id: 'EM004', subject: 'Monthly Salary Disbursement Notice', recipient: 'All Employees', sent: 60, delivered: 60, opened: 55, bounced: 0, date: '2026-06-30' },
    { id: 'EM005', subject: 'Unit Test I Timetable', recipient: 'Students (CS-A, CS-B)', sent: 85, delivered: 83, opened: 71, bounced: 2, date: '2026-07-02' },
];

// Scheduled Reports
export const mockScheduledReports = [
    { id: 'SR001', name: 'Daily Attendance Register', frequency: 'Daily', nextRun: '2026-07-07 06:00 AM', lastRun: '2026-07-06 06:00 AM', recipients: 'admin@institution.edu.in', status: 'Active' },
    { id: 'SR002', name: 'Weekly Fee Collection Summary', frequency: 'Weekly', nextRun: '2026-07-13', lastRun: '2026-07-06', recipients: 'finance@institution.edu.in', status: 'Active' },
    { id: 'SR003', name: 'Monthly Payroll Report', frequency: 'Monthly', nextRun: '2026-08-01', lastRun: '2026-07-01', recipients: 'hr@institution.edu.in', status: 'Active' },
    { id: 'SR004', name: 'Inventory Low Stock Alert', frequency: 'Weekly', nextRun: '2026-07-13', lastRun: '2026-07-06', recipients: 'inventory@institution.edu.in', status: 'Paused' },
    { id: 'SR005', name: 'Student GPA Summary', frequency: 'Monthly', nextRun: '2026-08-01', lastRun: '2026-07-01', recipients: 'academic@institution.edu.in', status: 'Active' },
];

