import React, { useState } from 'react';
import { WorkOrder, Technician, ChecklistItem } from '../types';
import { Calendar, Clock, User, HardHat, AlertCircle, FilePlus, Sparkles, CheckSquare } from 'lucide-react';

interface NewOrderFormProps {
  technicians: Technician[];
  onAddOrder: (order: WorkOrder) => void;
  setActiveTab: (tab: string) => void;
}

const DEFAULT_TASKS: Record<string, string[]> = {
  Installation: [
    'Unpack security cameras & verify purchase catalog specs',
    'Run outdoor-grade UV-rated Cat6 cabling along conduit runs',
    'Securely mount weatherproof junction boxes and cameras',
    'Configure NVR firmware settings, network IP addressing, & subnets',
    'Configure remote P2P remote view feeds in mobile apps'
  ],
  Troubleshooting: [
    'Interview customer on symptoms (e.g. frame drop, static lines)',
    'Test PoE switch port power outputs and check Cat6 continuity',
    'Inspect outdoor weather enclosures/joints for corrosion',
    'Re-tighten mounts and test signal strength directly at source'
  ],
  Upgrades: [
    'Perform overall system configuration backup',
    'Swap out selected existing units with higher-resolution PTZ/Starlight digital models',
    'Install larger surveillance Grade-A storage drive (RAID config)',
    'Fine-tune lens zoom ranges and AI human/vehicle capture rules'
  ],
  Maintenance: [
    'Thorough cleaning of optical dome covers and clear outer lenses',
    'Inspect mounting bracket integrity & treat rust oxidation',
    'Verify UPS battery backup backup supply uptime load test',
    'Perform standard clean storage sweep and run HDD health scan'
  ]
};

export default function NewOrderForm({ technicians, onAddOrder, setActiveTab }: NewOrderFormProps) {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [serviceDate, setServiceDate] = useState('2026-05-30'); // Base matching current local date
  const [timeSlot, setTimeSlot] = useState('09:00 AM - 11:30 AM');
  const [technicianId, setTechnicianId] = useState('unassigned');
  const [jobType, setJobType] = useState<'Installation' | 'Troubleshooting' | 'Upgrades' | 'Maintenance'>('Installation');
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [description, setDescription] = useState('');
  const [customChecklistItems, setCustomChecklistItems] = useState<string[]>([]);
  const [newCustomTask, setNewCustomTask] = useState('');
  const [error, setError] = useState('');

  // Auto generated preview based on Job Type
  const autoTasks = DEFAULT_TASKS[jobType] || [];

  const handleAddCustomTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomTask.trim()) return;
    setCustomChecklistItems([...customChecklistItems, newCustomTask.trim()]);
    setNewCustomTask('');
  };

  const handleRemoveCustomTask = (index: number) => {
    setCustomChecklistItems(customChecklistItems.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!customerName.trim()) {
      setError('Please provide a customer name.');
      return;
    }
    if (!customerPhone.trim()) {
      setError('Please provide a contact phone number.');
      return;
    }
    if (!customerAddress.trim()) {
      setError('Please provide the physical installation address.');
      return;
    }
    if (!description.trim()) {
      setError('Please enter a brief job scope description.');
      return;
    }

    // Combine default auto checklist items with user's custom checklist items
    const checklist: ChecklistItem[] = [
      ...autoTasks.map((text, idx) => ({
        id: `auto-${idx}-${Date.now()}`,
        text,
        completed: false
      })),
      ...customChecklistItems.map((text, idx) => ({
        id: `custom-${idx}-${Date.now()}`,
        text,
        completed: false
      }))
    ];

    const randomID = `WO-${Math.floor(100 + Math.random() * 900)}`;

    const newOrder: WorkOrder = {
      id: randomID,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerAddress: customerAddress.trim(),
      serviceDate,
      timeSlot,
      technicianId,
      jobType,
      description: description.trim(),
      priority,
      status: 'Pending',
      createdAt: new Date().toISOString().split('T')[0],
      checklist,
      notes: []
    };

    onAddOrder(newOrder);

    // Reset Form
    setCustomerName('');
    setCustomerPhone('');
    setCustomerAddress('');
    setTechnicianId('unassigned');
    setJobType('Installation');
    setPriority('Medium');
    setDescription('');
    setCustomChecklistItems([]);
    
    // Send to Orders List Tab to see the action item
    setActiveTab('orders');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-28">
      {/* Visual Tile */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-lg flex items-center gap-4 relative overflow-hidden">
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl">
          <FilePlus className="h-6 w-6" />
        </div>
        <div>
          <h2 className="font-bold text-lg">Dispatch Creator</h2>
          <p className="text-xs text-slate-400">Deploy installation crews and configure default task lists instantly.</p>
        </div>
        <div className="absolute right-0 bottom-0 opacity-5">
          <CheckSquare className="w-32 h-32 text-emerald-400" />
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3.5 rounded-xl flex items-center gap-2 text-xs">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-5">
        {/* Core details */}
        <div className="space-y-4">
          <h3 className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold">1. Customer Contact & Location</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Customer / Owner Name *</label>
              <input 
                type="text" 
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Martha Cooper"
                className="w-full text-sm border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-emerald-500 font-sans"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Phone Number *</label>
              <input 
                type="tel" 
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full text-sm border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Installation Site Address *</label>
            <input 
              type="text" 
              value={customerAddress}
              onChange={(e) => setCustomerAddress(e.target.value)}
              placeholder="742 Evergreen Terrace, Sector 7"
              className="w-full text-sm border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Schedule settings */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h3 className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold">2. Date & Scheduling Slot</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Service Date *
              </label>
              <input 
                type="date" 
                value={serviceDate}
                onChange={(e) => setServiceDate(e.target.value)}
                className="w-full text-sm border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                Dispatch Time Window *
              </label>
              <select 
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                className="w-full text-sm border border-slate-200 bg-white rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-emerald-500 font-mono"
              >
                <option value="09:00 AM - 11:30 AM">09:00 AM - 11:30 AM (Morning Run)</option>
                <option value="11:30 AM - 02:00 PM">11:30 AM - 02:00 PM (Midday Run)</option>
                <option value="02:00 PM - 04:30 PM">02:00 PM - 04:30 PM (Afternoon Run)</option>
                <option value="04:30 PM - 07:00 PM">04:30 PM - 07:00 PM (Sunset Run)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Job Parameters */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h3 className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold">3. Installation Task Spec</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Job Operation Type *</label>
              <select 
                value={jobType}
                onChange={(e) => setJobType(e.target.value as any)}
                className="w-full text-sm border border-slate-200 bg-white rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-emerald-500 font-mono"
              >
                <option value="Installation">🎥 Installation</option>
                <option value="Troubleshooting">🛠️ Troubleshooting</option>
                <option value="Upgrades">🚀 Upgrades</option>
                <option value="Maintenance">🧹 Maintenance</option>
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-slate-400" />
                Serviceman Dispatch *
              </label>
              <select 
                value={technicianId}
                onChange={(e) => setTechnicianId(e.target.value)}
                className="w-full text-sm border border-slate-200 bg-white rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-emerald-500"
              >
                <option value="unassigned">⚠️ Unassigned (Standby Pool)</option>
                {technicians.map((tech) => (
                  <option key={tech.id} value={tech.id}>
                     {tech.name} ({tech.status})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Urgency Priority *</label>
              <div className="flex gap-2">
                {(['Low', 'Medium', 'High'] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`flex-1 text-center text-xs py-2.5 rounded-xl border font-semibold font-mono transition-all duration-100 ${
                      priority === p 
                        ? p === 'High' 
                          ? 'bg-rose-50 text-rose-700 border-rose-400 shadow-sm'
                          : p === 'Medium'
                          ? 'bg-amber-50 text-amber-700 border-amber-400 shadow-sm'
                          : 'bg-sky-50 text-sky-700 border-sky-400 shadow-sm'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Detailed Technical Scope of Work *</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Mount 4 analog bullet dome cameras around the perimeter. Run RJ45/coaxial lines back to front-entrance reception kiosk. Configure local video encoding..."
              className="w-full text-sm border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-emerald-500 h-24 resize-none"
            />
          </div>
        </div>

        {/* Automations Preview & Custom additions */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/60 text-left space-y-3">
          <div className="flex items-center justify-between text-slate-800">
            <span className="text-xs font-bold font-mono tracking-wider text-slate-600 flex items-center gap-1.5 uppercase">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Smart Dispatch Checklist Template
            </span>
          </div>

          <p className="text-[11px] text-slate-500 leading-relaxed font-sans">
            Choosing <span className="font-semibold text-slate-800">"{jobType}"</span> triggers auto-generation of specialized technical steps upon dispatching:
          </p>

          <div className="space-y-1.5 pl-1">
            {autoTasks.map((taskStr, index) => (
              <div key={index} className="flex items-start gap-2 text-xs text-slate-700 font-mono">
                <span className="text-emerald-500 text-xs shrink-0 mt-0.5 font-bold">✓</span>
                <span className="flex-1">{taskStr}</span>
              </div>
            ))}
          </div>

          {/* Add custom tasks to generated template */}
          <div className="border-t border-slate-200 pt-3 mt-3 space-y-3">
            <label className="block text-xs font-semibold text-slate-700">Add Extra Custom Steps (Optional)</label>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={newCustomTask}
                onChange={(e) => setNewCustomTask(e.target.value)}
                placeholder="e.g. Bring extra 100ft drum reel of Cat6 UV-rated outdoor cable"
                className="flex-1 text-xs border border-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:border-emerald-500 bg-white"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAddCustomTask(e);
                  }
                }}
              />
              <button 
                type="button"
                onClick={handleAddCustomTask}
                className="bg-slate-900 text-white font-mono text-xs px-3.5 py-1.5 rounded-xl hover:bg-slate-800 transition shrink-0"
              >
                + Append
              </button>
            </div>

            {/* Custom Tasks Pills */}
            {customChecklistItems.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {customChecklistItems.map((task, i) => (
                  <span key={i} className="inline-flex items-center gap-1 bg-slate-950 text-slate-100 font-mono text-[10px] px-2.5 py-1 rounded-lg border border-slate-800">
                    <span className="truncate max-w-[200px]">{task}</span>
                    <button 
                      type="button" 
                      onClick={() => handleRemoveCustomTask(i)}
                      className="text-rose-400 font-bold hover:text-rose-200 ml-1 cursor-pointer focus:outline-none"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-3 justify-end pt-2">
          <button 
            type="button"
            onClick={() => setActiveTab('dashboard')}
            className="text-xs font-semibold text-slate-600 hover:text-slate-800 px-5 py-3 rounded-xl border border-slate-200 bg-white transition cursor-pointer"
          >
            Cancel
          </button>
          
          <button 
            type="submit"
            className="text-xs font-bold font-mono tracking-wider bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-6 py-3 rounded-xl shadow-md transform hover:scale-[1.01] active:scale-[0.99] transition cursor-pointer flex items-center justify-center gap-2"
          >
            Deploy Work Order Run
          </button>
        </div>
      </form>
    </div>
  );
}
