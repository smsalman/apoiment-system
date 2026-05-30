export interface Technician {
  id: string;
  name: string;
  phone: string;
  status: 'Available' | 'On Site' | 'Offline';
  avatar: string;
  rating: number;
  skills: string[];
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface WorkOrderNote {
  id: string;
  text: string;
  timestamp: string;
  author: string;
}

export interface WorkOrder {
  id: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  serviceDate: string; // YYYY-MM-DD
  timeSlot: string; // e.g., "09:00 AM - 11:00 AM"
  technicianId: string; // ID of Technician or "unassigned"
  jobType: 'Installation' | 'Troubleshooting' | 'Upgrades' | 'Maintenance';
  description: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';
  createdAt: string;
  checklist: ChecklistItem[];
  notes: WorkOrderNote[];
}
