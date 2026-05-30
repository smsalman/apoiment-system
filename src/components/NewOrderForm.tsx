import React, { useState } from 'react';
import { WorkOrder, Technician, ChecklistItem } from '../types';
import { Calendar, Clock, User, HardHat, AlertCircle, FilePlus, Sparkles, CheckSquare } from 'lucide-react';

interface NewOrderFormProps {
  technicians: Technician[];
  onAddOrder: (order: WorkOrder) => void;
  setActiveTab: (tab: string) => void;
  themeStyle?: 'slate' | 'cyber' | 'steel' | 'solar';
}

const DEFAULT_TASKS: Record<string, string[]> = {
  'CCTV Installation': [
    'Unpack security cameras & verify purchase catalog specs',
    'Run outdoor-grade UV-rated Cat6 cabling along conduit runs',
    'Securely mount weatherproof junction boxes and cameras',
    'Configure NVR firmware settings, network IP addressing, & subnets',
    'Configure remote P2P remote view feeds in mobile apps'
  ],
  'CCTV Service': [
    'Interview customer on symptoms (e.g. video offline, night-vision failure)',
    'Test PoE switch port power outputs and check Cat6 cabling impedance',
    'Inspect outdoor weather enclosures/joints for rust or moisture',
    'Polishing/cleaning of optical dome covers and clear outer lenses'
  ],
  'Laptop Service': [
    'Complete system backup to prevent user personal database loss',
    'Disassemble chassis housing & clean heat sinks using compressed air',
    'Re-apply premium high-performance CPU & GPU thermal compounds',
    'Install core system component replacements (RAM/SSD upgrades)'
  ],
  'PC Service': [
    'Perform diagnostic benchmarks and check core component temperatures',
    'Identify and resolve blue screen stability crashes (BSOD minidump)',
    'Configure operating system software, software drivers & system security updates',
    'Load standard corporate software suite image'
  ],
  Installation: [
    'Unpack items and verify user custom specifications',
    'Deploy hardware brackets & run solid cable connections',
    'Configure system address settings & network routing subnets',
    'Complete setup run tests & show client status feeds'
  ],
  Troubleshooting: [
    'Inspect local hardware components for visual stress or diagnostic failures',
    'Run diagnostic software scans & assess component configurations',
    'Isolate hardware defects and plan modular element swap-outs'
  ],
  Upgrades: [
    'Perform overall settings config backup to keep configurations safe',
    'Swap legacy older element components with newly certified replacements',
    'Rebuild unit chassis & configure optimal performance modes'
  ],
  Maintenance: [
    'Thorough cleaning of dust components & casing surfaces',
    'Inspect mechanical structural parts for rust or fatigue failures',
    'Scan and optimize operating files to recover drive capacity'
  ]
};

export default function NewOrderForm({ technicians, onAddOrder, setActiveTab, themeStyle = 'slate' }: NewOrderFormProps) {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [serviceDate, setServiceDate] = useState('2026-05-30'); // Base matching current local date
  const [timeSlot, setTimeSlot] = useState('09:00 AM - 11:30 AM');
  const [technicianId, setTechnicianId] = useState('unassigned');
  const [jobType, setJobType] = useState<
    | 'CCTV Installation'
    | 'CCTV Service'
    | 'Laptop Service'
    | 'PC Service'
    | 'Installation'
    | 'Troubleshooting'
    | 'Upgrades'
    | 'Maintenance'
  >('CCTV Installation');
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [description, setDescription] = useState('');
  const [customChecklistItems, setCustomChecklistItems] = useState<string[]>([]);
  const [newCustomTask, setNewCustomTask] = useState('');
  const [error, setError] = useState('');

  // Unified theme styling configurations
  const config = {
    slate: {
      card: "bg-white border border-slate-150 shadow-sm text-slate-900",
      formHeader: "bg-slate-900 text-white shadow-md",
      headerTag: "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400",
      label: "text-slate-700",
      input: "bg-white border border-slate-200 text-slate-900 focus:ring-emerald-500 focus:border-emerald-500",
      pill: "bg-slate-50 text-slate-700 border border-slate-100",
      accentText: "text-emerald-600",
      textDark: "text-slate-900",
      textMuted: "text-slate-500",
      borderLine: "border-slate-100",
      buttonPrimary: "bg-slate-900 hover:bg-slate-800 text-white"
    },
    cyber: {
      card: "bg-slate-900 border border-slate-800 text-slate-100 shadow-md",
      formHeader: "bg-slate-950 border border-slate-800 text-slate-100 shadow-lg",
      headerTag: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 font-mono",
      label: "text-slate-300 font-mono text-[11px]",
      input: "bg-slate-950 border border-slate-850 text-emerald-400 focus:ring-emerald-550 focus:border-emerald-500 font-mono",
      pill: "bg-slate-950 text-slate-300 border border-slate-800",
      accentText: "text-emerald-400",
      textDark: "text-[#10b981] font-mono",
      textMuted: "text-slate-400 font-mono",
      borderLine: "border-slate-850",
      buttonPrimary: "bg-emerald-500 text-slate-950 hover:bg-emerald-400 font-bold font-mono"
    },
    steel: {
      card: "bg-white border border-teal-150 text-slate-900 shadow-sm",
      formHeader: "bg-teal-900 text-teal-100 shadow-md",
      headerTag: "bg-teal-500/25 text-teal-200 border border-teal-600/35",
      label: "text-slate-800 font-medium",
      input: "bg-white border border-teal-150 text-slate-900 focus:ring-teal-500 focus:border-teal-500",
      pill: "bg-teal-50 text-teal-950 border border-teal-100",
      accentText: "text-teal-700",
      textDark: "text-teal-950 font-medium",
      textMuted: "text-teal-800/80",
      borderLine: "border-teal-100/60",
      buttonPrimary: "bg-teal-700 hover:bg-teal-850 text-white font-medium"
    },
    solar: {
      card: "bg-white border border-amber-205 text-amber-950 shadow-2xs",
      formHeader: "bg-[#2d1c0c] text-amber-50 border border-[#3d2714]",
      headerTag: "bg-[#3d2714] text-amber-250 border border-amber-900/30",
      label: "text-[#3c2a15] font-medium",
      input: "bg-white border border-amber-200 text-amber-950 focus:ring-amber-500 focus:border-amber-500",
      pill: "bg-[#faf6f0] text-amber-900 border border-[#eae0d0]",
      accentText: "text-amber-800",
      textDark: "text-[#2d1c0c] font-bold",
      textMuted: "text-[#785429]",
      borderLine: "border-amber-100/60",
      buttonPrimary: "bg-amber-800 hover:bg-amber-900 text-white font-bold"
    }
  }[themeStyle] || {
    card: "bg-white border border-slate-150 shadow-sm text-slate-900",
    formHeader: "bg-slate-900 text-white shadow-md",
    headerTag: "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400",
    label: "text-slate-700",
    input: "bg-white border border-slate-200 text-slate-900 focus:ring-emerald-500 focus:border-emerald-500",
    pill: "bg-slate-50 text-slate-700 border border-slate-100",
    accentText: "text-emerald-600",
    textDark: "text-slate-900",
    textMuted: "text-slate-500",
    borderLine: "border-slate-100",
    buttonPrimary: "bg-slate-900 hover:bg-slate-850 text-white"
  };

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
      <div className={`rounded-2xl p-5 shadow-lg flex items-center gap-4 relative overflow-hidden transition-all duration-300 ${config.formHeader}`}>
        <div className={`p-3 rounded-xl shrink-0 ${config.headerTag}`}>
          <FilePlus className="h-6 w-6" />
        </div>
        <div>
          <h2 className="font-bold text-lg">Dispatch Creator</h2>
          <p className="text-xs opacity-80">Deploy installation crews and configure default task lists instantly.</p>
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

      <form onSubmit={handleSubmit} className={`rounded-2xl p-5 space-y-5 transition-all duration-300 ${config.card}`}>
        {/* Core details */}
        <div className="space-y-4">
          <h3 className={`text-xs font-mono uppercase tracking-widest font-bold ${config.textMuted}`}>1. Customer Contact & Location</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={`block text-xs font-semibold mb-1 ${config.label}`}>Customer / Owner Name *</label>
              <input 
                type="text" 
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Martha Cooper"
                className={`w-full text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-1 ${config.input}`}
              />
            </div>
            <div>
              <label className={`block text-xs font-semibold mb-1 ${config.label}`}>Contact Phone Number *</label>
              <input 
                type="tel" 
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className={`w-full text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-1 ${config.input}`}
              />
            </div>
          </div>

          <div>
            <label className={`block text-xs font-semibold mb-1 ${config.label}`}>Installation Site Address *</label>
            <input 
              type="text" 
              value={customerAddress}
              onChange={(e) => setCustomerAddress(e.target.value)}
              placeholder="742 Evergreen Terrace, Sector 7"
              className={`w-full text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-1 ${config.input}`}
            />
          </div>
        </div>

        {/* Schedule settings */}
        <div className={`space-y-4 pt-4 border-t ${config.borderLine}`}>
          <h3 className={`text-xs font-mono uppercase tracking-widest font-bold ${config.textMuted}`}>2. Date & Scheduling Slot</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={`block text-xs font-semibold mb-1 flex items-center gap-1 ${config.label}`}>
                <Calendar className="w-3.5 h-3.5 opacity-60" />
                Service Date *
              </label>
              <input 
                type="date" 
                value={serviceDate}
                onChange={(e) => setServiceDate(e.target.value)}
                className={`w-full text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-1 ${config.input}`}
              />
            </div>
            <div>
              <label className={`block text-xs font-semibold mb-1 flex items-center gap-1 ${config.label}`}>
                <Clock className="w-3.5 h-3.5 opacity-60" />
                Dispatch Time Window *
              </label>
              <select 
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                className={`w-full text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-1 ${config.input} dark:bg-slate-950`}
              >
                <option value="09:00 AM - 11:30 AM" className="dark:text-white">09:00 AM - 11:30 AM (Morning Run)</option>
                <option value="11:30 AM - 02:00 PM" className="dark:text-white">11:30 AM - 02:00 PM (Midday Run)</option>
                <option value="02:00 PM - 04:30 PM" className="dark:text-white">02:00 PM - 04:30 PM (Afternoon Run)</option>
                <option value="04:30 PM - 07:00 PM" className="dark:text-white">04:30 PM - 07:00 PM (Sunset Run)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Job Parameters */}
        <div className={`space-y-4 pt-4 border-t ${config.borderLine}`}>
          <h3 className={`text-xs font-mono uppercase tracking-widest font-bold ${config.textMuted}`}>3. Installation Task Spec</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className={`block text-xs font-semibold mb-1 ${config.label}`}>Job Operation Type *</label>
              <select 
                value={jobType}
                onChange={(e) => setJobType(e.target.value as any)}
                className={`w-full text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-1 ${config.input} dark:bg-slate-950`}
              >
                <option value="CCTV Installation">🎥 CCTV Installation</option>
                <option value="CCTV Service">🛠️ CCTV Service</option>
                <option value="Laptop Service">💻 Laptop Service</option>
                <option value="PC Service">🖥️ PC Service</option>
                <option value="Installation">📦 Generic Installation</option>
                <option value="Troubleshooting">🩺 Generic Troubleshooting</option>
                <option value="Upgrades">🚀 Upgrades</option>
                <option value="Maintenance">🧹 Maintenance</option>
              </select>
            </div>
            
            <div>
              <label className={`block text-xs font-semibold mb-1 flex items-center gap-1 ${config.label}`}>
                <User className="w-3.5 h-3.5 opacity-60" />
                Serviceman Dispatch *
              </label>
              <select 
                value={technicianId}
                onChange={(e) => setTechnicianId(e.target.value)}
                className={`w-full text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-1 ${config.input} dark:bg-slate-950`}
              >
                <option value="unassigned" className="dark:text-white">⚠️ Unassigned (Standby Pool)</option>
                {technicians.map((tech) => (
                  <option key={tech.id} value={tech.id} className="dark:text-white">
                     {tech.name} ({tech.status})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={`block text-xs font-semibold mb-1 ${config.label}`}>Urgency Priority *</label>
              <div className="flex gap-2">
                {(['Low', 'Medium', 'High'] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`flex-1 text-center text-xs py-2.5 rounded-xl border font-semibold font-mono transition-all duration-100 ${
                      priority === p 
                        ? p === 'High' 
                          ? 'bg-rose-500 text-white border-rose-500 shadow-xs'
                          : p === 'Medium'
                          ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                          : 'bg-sky-500 text-white border-sky-400 shadow-xs'
                        : 'bg-black/5 dark:bg-black/20 text-slate-500 border-transparent hover:bg-black/10'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className={`block text-xs font-semibold mb-1 ${config.label}`}>Detailed Technical Scope of Work *</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Mount 4 analog bullet dome cameras around the perimeter. Run RJ45/coaxial lines back to front-entrance reception kiosk. Configure local video encoding..."
              className={`w-full text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-1 h-24 resize-none ${config.input}`}
            />
          </div>
        </div>

        {/* Automations Preview & Custom additions */}
        <div className={`rounded-2xl p-4 border text-left space-y-3 ${config.pill}`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold font-mono tracking-wider flex items-center gap-1.5 uppercase opacity-90">
              <Sparkles className="w-4 h-4 text-emerald-500" />
              Smart Dispatch Checklist Template
            </span>
          </div>

          <p className="text-[11px] leading-relaxed font-sans opacity-85">
            Choosing <span className="font-semibold">"{jobType}"</span> triggers auto-generation of specialized technical steps upon dispatching:
          </p>

          <div className="space-y-1.5 pl-1">
            {autoTasks.map((taskStr, index) => (
              <div key={index} className="flex items-start gap-2 text-xs font-mono">
                <span className="text-emerald-500 text-xs shrink-0 mt-0.5 font-bold">✓</span>
                <span className="flex-1 opacity-90">{taskStr}</span>
              </div>
            ))}
          </div>

          {/* Add custom tasks to generated template */}
          <div className={`border-t pt-3 mt-3 space-y-3 ${config.borderLine}`}>
            <label className="block text-xs font-semibold">Add Extra Custom Steps (Optional)</label>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={newCustomTask}
                onChange={(e) => setNewCustomTask(e.target.value)}
                placeholder="e.g. Bring extra 100ft drum reel of Cat6 UV-rated cable"
                className={`flex-1 text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 ${config.input}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAddCustomTask(e);
                  }
                }}
              />
              <button 
                type="button"
                onClick={handleAddCustomTask}
                className="bg-emerald-500 text-slate-950 font-mono font-bold text-xs px-3.5 py-1.5 rounded-xl hover:bg-emerald-400 transition shrink-0 cursor-pointer"
              >
                + Append
              </button>
            </div>

            {/* Custom Tasks Pills */}
            {customChecklistItems.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {customChecklistItems.map((task, i) => (
                  <span key={i} className="inline-flex items-center gap-1 bg-black/15 text-slate-100 font-mono text-[10px] px-2.5 py-1 rounded-lg border border-black/5 dark:border-white/5">
                    <span className="truncate max-w-[200px]">{task}</span>
                    <button 
                      type="button" 
                      onClick={() => handleRemoveCustomTask(i)}
                      className="text-rose-400 font-bold hover:text-rose-350 ml-1 cursor-pointer focus:outline-none"
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
            className={`text-xs font-semibold px-5 py-3 rounded-xl border transition cursor-pointer ${config.pill} hover:bg-black/5`}
          >
            Cancel
          </button>
          
          <button 
            type="submit"
            className={`text-xs font-bold font-mono tracking-wider px-6 py-3 rounded-xl shadow-md transform hover:scale-[1.01] active:scale-[0.99] transition cursor-pointer flex items-center justify-center gap-2 ${config.buttonPrimary}`}
          >
            Deploy Work Order Run
          </button>
        </div>
      </form>
    </div>
  );
}
