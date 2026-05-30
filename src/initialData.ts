import { Technician, WorkOrder } from './types';

export const INITIAL_TECHNICIANS: Technician[] = [
  {
    id: 'tech-1',
    name: 'S.M. Salman (Me)',
    phone: '+1 (555) 012-3400',
    status: 'Available',
    avatar: 'SM',
    rating: 4.95,
    skills: ['CCTV System Architect', 'IP Networking', 'Gaming PC Builds', 'OS Deployment']
  },
  {
    id: 'tech-2',
    name: 'Sabbir Rahman',
    phone: '+1 (555) 019-2831',
    status: 'On Site',
    avatar: 'SR',
    rating: 4.9,
    skills: ['PTZ Camera Calibration', 'Fiber Splicing', 'Laptop Motherboard Repair', 'Data Recovery']
  },
  {
    id: 'tech-3',
    name: 'Shimol',
    phone: '+1 (555) 014-9922',
    status: 'Available',
    avatar: 'SH',
    rating: 4.8,
    skills: ['NVR Config', 'Wireless AP Bridges', 'Windows Server Active Directory', 'PC Troubleshooting']
  },
  {
    id: 'tech-4',
    name: 'Salman',
    phone: '+1 (555) 017-8811',
    status: 'Available',
    avatar: 'SA',
    rating: 4.75,
    skills: ['CCTV Conduit Runs', 'Hardware Upgrades', 'Laptop Keyboard & LCD Replacements']
  }
];

export const getRelativeDate = (offsetDays: number): string => {
  const date = new Date('2026-05-30T10:51:11Z'); // Base on provided current local time
  date.setDate(date.getDate() + offsetDays);
  return date.toISOString().split('T')[0];
};

export const INITIAL_WORK_ORDERS: WorkOrder[] = [
  {
    id: 'WO-101',
    customerName: 'Marcus Aurelius (Apex Hub)',
    customerPhone: '+1 (555) 839-2041',
    customerAddress: 'Conduit Sector 7, Outer Industrial Zone',
    serviceDate: getRelativeDate(0), // Today
    timeSlot: '09:00 AM - 11:30 AM',
    technicianId: 'tech-1', // S.M. Salman
    jobType: 'CCTV Installation',
    description: 'Complete home security CCTV setup. Install 4 high-definition dome cameras at key entry points and connect to a 4-channel NVR with mobile P2P access configuration.',
    priority: 'High',
    status: 'In Progress',
    createdAt: getRelativeDate(-2),
    checklist: [
      { id: 'c1', text: 'Unpack dome cameras & verify specs', completed: true },
      { id: 'c2', text: 'Mount physical brackets & cameras on eaves', completed: true },
      { id: 'c3', text: 'Run outdoor-grade UV-rated Cat6 lines to NVR', completed: false },
      { id: 'c4', text: 'Terminate RJ45 and configure remote viewing on smartphone', completed: false }
    ],
    notes: [
      {
        id: 'n1',
        text: 'Customer requested clean white conduit runs along the outer gutters to minimize visible cabling.',
        timestamp: '2026-05-29T14:30:00Z',
        author: 'S.M. Salman (Me)'
      }
    ]
  },
  {
    id: 'WO-102',
    customerName: 'Elena Rostova (Elena\'s Bakery)',
    customerPhone: '+1 (555) 123-5566',
    customerAddress: '402 Main St, Historic Center',
    serviceDate: getRelativeDate(0), // Today
    timeSlot: '04:30 PM - 07:00 PM',
    technicianId: 'tech-2', // Sabbir Rahman
    jobType: 'Laptop Service',
    description: 'Baker’s main order system laptop is performing extremely slowly. Needs SSD Upgrade (clone existing 1TB HDD to 1TB NVMe SSD) and full internal dust cleaning & thermal paste replacement.',
    priority: 'Medium',
    status: 'Pending',
    createdAt: getRelativeDate(-1),
    checklist: [
      { id: 'c5', text: 'Complete sector backup of old mechanical HDD', completed: true },
      { id: 'c6', text: 'Disassemble laptop housing & clean out fan system', completed: false },
      { id: 'c7', text: 'Apply premium thermal paste to CPU/GPU die', completed: false },
      { id: 'c8', text: 'Install M.2 NVMe SSD and boot-test performance', completed: false }
    ],
    notes: []
  },
  {
    id: 'WO-103',
    customerName: 'Downtown Logistics Depot',
    customerPhone: '+1 (555) 902-1133',
    customerAddress: 'Warehouse B, 500 Industrial Parkway',
    serviceDate: getRelativeDate(1), // Tomorrow
    timeSlot: '11:30 AM - 02:00 PM',
    technicianId: 'tech-4', // Salman
    jobType: 'CCTV Installation',
    description: 'Mount 8 outdoor active-deterrence bullet cameras on high warehouse eaves. Integrate with 16-channel AI NVR. Set up intrusion detection rules.',
    priority: 'High',
    status: 'Pending',
    createdAt: getRelativeDate(-4),
    checklist: [
      { id: 'c9', text: 'Rent and verify scissor lift availability', completed: true },
      { id: 'c10', text: 'Mount weatherproof junction boxes securely', completed: false },
      { id: 'c11', text: 'Configure smart analytics crossing line detection zones', completed: false },
      { id: 'c12', text: 'Set up automatic email alerts and alarm triggers', completed: false }
    ],
    notes: [
      {
        id: 'n2',
        text: 'Bring safety harness. Check-in with security desk before driving inside the bay area.',
        timestamp: '2026-05-28T09:15:00Z',
        author: 'Salman'
      }
    ]
  },
  {
    id: 'WO-104',
    customerName: 'Frank Castle',
    customerPhone: '+1 (555) 293-4921',
    customerAddress: '12 Valley Forge Rd, Industrial Dockside',
    serviceDate: getRelativeDate(0), // Today
    timeSlot: '02:00 PM - 04:30 PM',
    technicianId: 'tech-3', // Shimol
    jobType: 'PC Service',
    description: 'Server PC experiencing blue-screen errors (BSOD) multiple times inside the office terminal. Need to test RAM channels, parse minidump files, and check CPU voltage/temperatures under stress.',
    priority: 'High',
    status: 'Completed',
    createdAt: getRelativeDate(0),
    checklist: [
      { id: 'c13', text: 'Test RAM sticks individually using MemTest86 tool', completed: true },
      { id: 'c14', text: 'Extract Windows Minidump files to identify error codes', completed: true },
      { id: 'c15', text: 'Replace faulty 8GB DDR4 RAM stick and run stress test', completed: true }
    ],
    notes: [
      {
        id: 'n3',
        text: 'Identified corrupted RAM channel. Swapped with a new 16GB stick. System stabilized and completed 2-hour burn-in trial.',
        timestamp: '2026-05-30T14:10:00Z',
        author: 'Shimol'
      }
    ]
  },
  {
    id: 'WO-105',
    customerName: 'Vance Office Supplies',
    customerPhone: '+1 (555) 883-9911',
    customerAddress: '1725 Slough Avenue, Suite 210',
    serviceDate: getRelativeDate(2), // In 2 days
    timeSlot: '09:00 AM - 11:30 AM',
    technicianId: 'unassigned', // Standby
    jobType: 'PC Service',
    description: 'Assemble and deploy 5 custom office desktop computer systems. Install components, perform cable management, load corporate Windows image, & join active network domain.',
    priority: 'Low',
    status: 'Pending',
    createdAt: getRelativeDate(-1),
    checklist: [
      { id: 'c16', text: 'Assemble hardware in chassis & test POST boot', completed: false },
      { id: 'c17', text: 'Deploy master clean Windows image via PXE network boot', completed: false },
      { id: 'c18', text: 'Configure user profiles & security software', completed: false }
    ],
    notes: []
  }
];
