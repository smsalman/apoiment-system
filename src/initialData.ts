import { Technician, WorkOrder } from './types';

export const INITIAL_TECHNICIANS: Technician[] = [
  {
    id: 'tech-1',
    name: 'Alex Rivera',
    phone: '+1 (555) 019-2831',
    status: 'Available',
    avatar: 'AR',
    rating: 4.9,
    skills: ['IP Cameras', 'Fiber Splicing', 'LPR Systems']
  },
  {
    id: 'tech-2',
    name: 'David Chen',
    phone: '+1 (555) 014-9922',
    status: 'On Site',
    avatar: 'DC',
    rating: 4.8,
    skills: ['PTZ Cameras', 'NVR Config', 'Fortress Security']
  },
  {
    id: 'tech-3',
    name: 'Marcus Johnson',
    phone: '+1 (555) 017-8811',
    status: 'Offline',
    avatar: 'MJ',
    rating: 4.7,
    skills: ['Wireless Bridges', 'Coaxial Wiring', 'Analog HD']
  },
  {
    id: 'tech-4',
    name: 'Sarah Connor',
    phone: '+1 (555) 012-3344',
    status: 'Available',
    avatar: 'SC',
    rating: 4.95,
    skills: ['Access Control', 'Thermal Imaging', 'IP Networking']
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
    customerName: 'Marcus Aurelius',
    customerPhone: '+1 (555) 839-2041',
    customerAddress: '742 Evergreen Terrace, Sector 7',
    serviceDate: getRelativeDate(0), // Today
    timeSlot: '09:00 AM - 11:30 AM',
    technicianId: 'tech-1',
    jobType: 'Installation',
    description: 'Complete home security CCTV setup. Install 4 high-definition dome cameras at key entry points and connect to a 4-channel NVR with mobile access configuration.',
    priority: 'High',
    status: 'In Progress',
    createdAt: getRelativeDate(-2),
    checklist: [
      { id: 'c1', text: 'Unpack dome cameras & verify specs', completed: true },
      { id: 'c2', text: 'Mount physical brackets & cameras on eaves', completed: true },
      { id: 'c3', text: 'Run outdoor-grade shielded Cat6 lines to NVR', completed: false },
      { id: 'c4', text: 'Terminate RJ45 and configure remote viewing on smartphone', completed: false }
    ],
    notes: [
      {
        id: 'n1',
        text: 'Customer requested clean white conduit runs along the outer gutters to minimize visible cabling.',
        timestamp: '2026-05-29T14:30:00Z',
        author: 'Alex Rivera'
      }
    ]
  },
  {
    id: 'WO-102',
    customerName: 'Elena Rostova',
    customerPhone: '+1 (555) 123-5566',
    customerAddress: '402 Main St, Historic Center (Elena\'s Bakery)',
    serviceDate: getRelativeDate(0), // Today
    timeSlot: '04:30 PM - 06:00 PM',
    technicianId: 'tech-1', // Also Alex later in the day
    jobType: 'Maintenance',
    description: 'Blurry image on Camera 1 (front entrance dome). Need to inspect, clean lens, check dome housing seals, or replace casing if vandalized or scratched.',
    priority: 'Low',
    status: 'Pending',
    createdAt: getRelativeDate(-1),
    checklist: [
      { id: 'c5', text: 'Inspect lens cover for scratches or condensation', completed: false },
      { id: 'c6', text: 'Clean inner lens with microfiber cloth & anti-fog spray', completed: false },
      { id: 'c7', text: 'Perform focus alignment check via app client', completed: false }
    ],
    notes: []
  },
  {
    id: 'WO-103',
    customerName: 'Apex Logistics Depot',
    customerPhone: '+1 (555) 902-1133',
    customerAddress: 'Warehouse B, 500 Industrial Parkway',
    serviceDate: getRelativeDate(1), // Tomorrow
    timeSlot: '10:00 AM - 02:00 PM',
    technicianId: 'tech-4',
    jobType: 'Installation',
    description: 'Mount 8 outdoor active-deterrence bullet cameras on high warehouse eaves. Integrate with 16-channel AI NVR. Set up intrusion zone rules.',
    priority: 'Medium',
    status: 'Pending',
    createdAt: getRelativeDate(-4),
    checklist: [
      { id: 'c8', text: 'Rent and verify scissor lift availability', completed: true },
      { id: 'c9', text: 'Mount 8 cameras in heavy-duty junction boxes', completed: false },
      { id: 'c10', text: 'Configure smart analytics crossing line detection zones', completed: false },
      { id: 'c11', text: 'Configure siren & strobe light schedules', completed: false }
    ],
    notes: [
      {
        id: 'n2',
        text: 'Must wear OSHA-approved hard hat and harness. Check-in with depot manager Arthur before driving onto the lot.',
        timestamp: '2026-05-28T09:15:00Z',
        author: 'Sarah Connor'
      }
    ]
  },
  {
    id: 'WO-104',
    customerName: 'Frank Castle',
    customerPhone: '+1 (555) 293-4921',
    customerAddress: '12 Valley Forge Rd, Industrial Dockside',
    serviceDate: getRelativeDate(0), // Today
    timeSlot: '01:00 PM - 03:00 PM',
    technicianId: 'tech-2',
    jobType: 'Troubleshooting',
    description: 'Loss of signal intermittently on outer fence cameras. Test cabling, check PoE voltage drops, and test RJ45 terminations in wet junction boxes.',
    priority: 'High',
    status: 'Completed',
    createdAt: getRelativeDate(0),
    checklist: [
      { id: 'c12', text: 'Measure cable length and signal impedance with tester', completed: true },
      { id: 'c13', text: 'Re-terminate corroded copper connector at junction box 4', completed: true },
      { id: 'c14', text: 'Apply dielectric silicone gel for moisture prevention', completed: true }
    ],
    notes: [
      {
        id: 'n3',
        text: 'Cabling was heavily oxidized due to sea-salt air. Installed premium IP67 waterproof couplers and applied shielding gel.',
        timestamp: '2026-05-30T14:10:00Z',
        author: 'David Chen'
      }
    ]
  },
  {
    id: 'WO-105',
    customerName: 'Vance Refrigeration',
    customerPhone: '+1 (555) 883-9911',
    customerAddress: '1725 Slough Avenue, Suite 210',
    serviceDate: getRelativeDate(2), // In 2 days
    timeSlot: '09:00 AM - 11:00 AM',
    technicianId: 'unassigned',
    jobType: 'Upgrades',
    description: 'Intergate their existing analog coaxial camera line with hybrid DVR encoders. Setup cloud storage mirroring client.',
    priority: 'Low',
    status: 'Pending',
    createdAt: getRelativeDate(-1),
    checklist: [
      { id: 'c15', text: 'Verify coaxial BNC terminations are clean', completed: false },
      { id: 'c16', text: 'Install 8-channel hybrid DVR/encoder rack mount', completed: false }
    ],
    notes: []
  }
];
