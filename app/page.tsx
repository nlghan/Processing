'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Search, Plus, Trash2, X, Settings, ChevronRight, ChevronUp, Play, Pause, Square, Maximize2, Minimize2, RefreshCw } from 'lucide-react';

export default function MESProcessing() {
  const [selectedWO, setSelectedWO] = useState('WO2026070001');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isWODetailsOpen, setIsWODetailsOpen] = useState(false);
  const [selectedProcess, setSelectedProcess] = useState(1);
  const [detailsPopupRow, setDetailsPopupRow] = useState(null);
  const [equipmentPopup, setEquipmentPopup] = useState(false);
  const [workerPopup, setWorkerPopup] = useState(false);
  const [woListCollapsed, setWoListCollapsed] = useState(false);

  // Production Timer state
  const [timerType, setTimerType] = useState<'manual' | 'machine'>('manual');
  const [timerStatus, setTimerStatus] = useState<'running' | 'paused' | 'idle'>('running');
  const [startTime, setStartTime] = useState(() => {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  });
  const [endTime, setEndTime] = useState('');
  const [selectedMachine, setSelectedMachine] = useState('AOI-01');
  const [timerCollapsed, setTimerCollapsed] = useState(false);
  const [targetQty, setTargetQty] = useState('50');
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [editingCell, setEditingCell] = useState<string | null>(null);
  const [cellValues, setCellValues] = useState({
    row1: { date: '2026-07-10 08:00', finishDate: '2026-07-10 08:25', receiveQty: '100', okQty: '100', ngQty: '0', leadTime: '25 min', checker: 'Admin', inspectionYn: 'Yes', yieldRate: '98%', blockDist: '0.25 mm', concentricity: '0.15', stdLocation: 'Pass', jigInspection: '✓', remark: '-', productionTeamId: 1 },
    row3: { date: '2026-07-10 10:15', finishDate: '2026-07-10 10:35', receiveQty: '30', okQty: '', ngQty: '', leadTime: '', checker: '', inspectionYn: '', yieldRate: '', blockDist: '', concentricity: '', stdLocation: '', jigInspection: '', remark: '', productionTeamId: '' },
  });
  const [resultPopupOpen, setResultPopupOpen] = useState(false);
  const [endTimePopupOpen, setEndTimePopupOpen] = useState(false);
  const [tempEndTime, setTempEndTime] = useState(() => {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  });
  const [popupOkQty, setPopupOkQty] = useState('48');
  const [popupNgQty, setPopupNgQty] = useState('2');
  const [popupTeamSelection, setPopupTeamSelection] = useState(null);
  const [popupTeamNgData, setPopupTeamNgData] = useState([]);
  
  const okQtyTimer = parseInt(popupOkQty) || 48;
  const ngQtyTimer = parseInt(popupNgQty) || 2;
  const progress = Math.round((parseInt(targetQty) > 0 ? (okQtyTimer / parseInt(targetQty)) : 0) * 100);

  const machines = ['AOI-01', 'AOI-02', 'Printer-01', 'Dryer-01', 'AOI-03'];

  const machineStatuses = [
    { name: 'AOI-01', status: 'Running', color: 'bg-green-500', runtime: '00:18:35', operator: 'Admin' },
    { name: 'AOI-02', status: 'Running', color: 'bg-green-500', runtime: '00:12:10', operator: 'Nguyễn Văn A' },
    { name: 'Printer-01', status: 'Idle', color: 'bg-yellow-400', runtime: '--:--:--', operator: '-' },
    { name: 'Dryer-01', status: 'Offline', color: 'bg-gray-400', runtime: '--:--:--', operator: '-' },
    { name: 'AOI-03', status: 'Alarm', color: 'bg-red-500', runtime: '00:03:45', operator: 'Trần Văn B' },
  ];
  
  const productionTeams = [
    { id: 1, name: 'BOOTH 1', code: 'RS_CELL 1', workers: 2 },
    { id: 2, name: 'BOOTH 2', code: 'RS_CELL 2', workers: 2 },
    { id: 3, name: 'BOOTH 3', code: 'RS_CELL 3', workers: 2 },
    { id: 4, name: 'BOOTH 4', code: 'RS_CELL 4', workers: 3 },
  ];

  const workers = [
    { id: 1, name: 'Bản Thị Dep', userId: '2240211' },
    { id: 2, name: 'Bé Văn Tuấn', userId: '2240520' },
    { id: 3, name: 'Nguyễn Văn A', userId: '2240521' },
    { id: 4, name: 'Trần Thị B', userId: '2240522' },
  ];

  const equipment = [
    { id: 1, name: 'Loading Machine A', type: 'Loader' },
    { id: 2, name: 'Loading Machine B', type: 'Loader' },
    { id: 3, name: 'AOI Scanner 1', type: 'Inspector' },
    { id: 4, name: 'Drilling Machine 1', type: 'Drill' },
  ];

  const processes = [
    { id: 1, code: 'R01', name: 'RS Ready', nameKo: 'RS준비' },
    { id: 2, code: 'R02', name: 'Loading', nameKo: '로딩' },
    { id: 3, code: 'R04', name: 'Kiểm tra lần 1', nameKo: '1차검사' },
    { id: 4, code: 'R05', name: 'Laser', nameKo: 'RS레이저' },
    { id: 5, code: 'R07', name: 'Dọn dẹp', nameKo: '정리' },
    { id: 6, code: 'R10', name: 'Vertex', nameKo: 'Vertex' },
    { id: 7, code: 'R13', name: 'Công đoạn đo đặc biệt', nameKo: '최종특성검사' },
    { id: 8, code: 'R08', name: 'RS Kiểm tra lần cuối', nameKo: 'RS최종검사' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header - Compact */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-xl font-bold text-blue-600">MES</span>
          <h1 className="text-lg font-semibold text-gray-800">Processing Execution</h1>
        </div>
        <div className="flex items-center gap-3">
          <button className="text-sm text-gray-600 hover:bg-gray-100 px-3 py-2 rounded flex items-center gap-2">
            Admin <ChevronDown size={16} />
          </button>
        </div>
      </div>



      {/* Main Content Area - Horizontal Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Work Order List */}
        <div className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 relative ${woListCollapsed ? 'w-12' : 'w-60'}`}>
          <div className={`p-3 border-b border-gray-200 flex-shrink-0 ${woListCollapsed ? 'flex items-center justify-center' : ''}`}>
            {woListCollapsed ? (
              <button
                onClick={() => setWoListCollapsed(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100"
                title="Expand"
              >
                <ChevronRight size={16} />
              </button>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-800 text-xs">Work Order List</h3>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setIsFilterOpen(!isFilterOpen)}
                      className={`p-1 rounded transition-colors ${isFilterOpen ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
                      title="Filter"
                    >
                      <Settings size={14} />
                    </button>
                    <button
                      onClick={() => setWoListCollapsed(true)}
                      className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100"
                      title="Collapse"
                    >
                      <ChevronDown size={14} />
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-2 py-1 border-b border-gray-200">
                  <Search size={13} className="text-gray-400" />
                  <input placeholder="Search WO No. or Lot No." className="bg-transparent text-xs w-full outline-none" />
                </div>
              </div>
            )}
          </div>

          {/* Filter Dropdown Panel - outside header div to avoid overflow clip */}
          {!woListCollapsed && isFilterOpen && (
            <div className="absolute left-0 top-[72px] w-72 bg-white border border-gray-200 shadow-xl z-50 flex flex-col">
              {/* Filter Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                <span className="font-semibold text-gray-800 text-xs">Filter (5 fields)</span>
                <button onClick={() => setIsFilterOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={16} />
                </button>
              </div>

              {/* Manage Fields */}
              <div className="px-4 py-2 border-b border-gray-200">
                <button className="text-blue-600 text-xs font-medium hover:text-blue-700 flex items-center gap-1">
                  Manage Fields <ChevronDown size={12} />
                </button>
              </div>

              {/* Filter Fields */}
              <div className="overflow-y-auto max-h-80 p-4 space-y-3">
                <div>
                  <label className="text-xs font-medium text-gray-700 block mb-1">Status</label>
                  <select className="w-full border border-gray-300 rounded px-2 py-1.5 bg-white text-xs hover:border-gray-400">
                    <option>Pending</option>
                    <option>Active</option>
                    <option>Completed</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700 block mb-1">Order From</label>
                  <select className="w-full border border-gray-300 rounded px-2 py-1.5 bg-white text-xs hover:border-gray-400">
                    <option>HQ</option>
                    <option>Branch</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700 block mb-1">Order Date</label>
                  <input type="date" defaultValue="2026-07-01" className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs" />
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-gray-400 text-xs">to</span>
                    <input type="date" defaultValue="2026-08-01" className="flex-1 border border-gray-300 rounded px-2 py-1.5 text-xs" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700 block mb-1">Dept</label>
                  <input placeholder="Dept" className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700 block mb-1">Drawing No</label>
                  <input placeholder="Drawing No" className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs" />
                </div>
              </div>

              {/* Footer */}
              <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 flex gap-2">
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="flex-1 bg-blue-600 text-white px-3 py-1.5 rounded text-xs font-medium hover:bg-blue-700 transition-colors"
                >
                  Apply
                </button>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="flex-1 bg-gray-200 text-gray-700 px-3 py-1.5 rounded text-xs font-medium hover:bg-gray-300 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          )}
          
          {!woListCollapsed && (
            <>
            <div className="flex-1 overflow-y-auto divide-y divide-gray-200">
              {[
                { wo: 'WO2026070001', lot: 'LOT2026070110', itemCode: 'PCB001', itemName: 'PCB Assembly Board', status: 'Open' },
                { wo: 'WO2026070002', lot: 'LOT2026070109', itemCode: 'PCB002', itemName: 'Flexible Board', status: 'Release' },
                { wo: 'WO2026070003', lot: 'LOT2026070108', itemCode: 'PCB001', itemName: 'PCB Assembly Board', status: 'Open' },
                { wo: 'WO2026070004', lot: 'LOT2026070107', itemCode: 'PCB003', itemName: 'High Density Board', status: 'Block' },
                { wo: 'WO2026070005', lot: 'LOT2026070106', itemCode: 'PCB002', itemName: 'Flexible Board', status: 'Close' },
                { wo: 'WO2026070006', lot: 'LOT2026070105', itemCode: 'PCB001', itemName: 'PCB Assembly Board', status: 'Close' },
                { wo: 'WO2026070007', lot: 'LOT2026070104', itemCode: 'PCB003', itemName: 'High Density Board', status: 'Release' },
              ].map((item) => (
                <div
                  key={item.wo}
                  onClick={() => setSelectedWO(item.wo)}
                  className={`p-2.5 text-xs cursor-pointer hover:bg-gray-50 transition-colors ${selectedWO === item.wo ? 'bg-blue-50 border-l-2 border-blue-600' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-gray-900">{item.wo}</div>
                    <span className={`px-1.5 py-0.5 rounded text-xs font-semibold whitespace-nowrap ${
                      item.status === 'Open' ? 'bg-gray-100 text-gray-700' :
                      item.status === 'Release' ? 'bg-yellow-100 text-yellow-700' :
                      item.status === 'Close' ? 'bg-green-100 text-green-700' :
                      item.status === 'Block' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                  <div className="text-gray-500 text-xs">{item.lot}</div>
                  <div className="text-gray-600 text-xs mt-1">[{item.itemCode}] {item.itemName}</div>
                </div>
              ))}
            </div>
            
            <div className="p-2 border-t border-gray-200 text-xs text-gray-500 flex-shrink-0 bg-gray-50">1 - 7 of 25</div>
            </>
          )}
        </div>

        {/* Right Content - Main + Timer Sidebar */}
        <div className="flex-1 flex overflow-hidden bg-gray-50">
          {/* Main scrollable area */}
          <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-2 gap-4 p-4 auto-rows-max">
            
            {/* Process Flow - Compact Card */}
            <div className="col-span-2 bg-white rounded-lg border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800 text-sm">Process Status</h3>
                <div className="flex items-center gap-2">
                  <button className="bg-blue-50 text-blue-600 border border-blue-200 rounded-lg px-2 py-2 text-xs font-medium hover:bg-blue-100 transition-colors">
                    📄 Document
                  </button>
                  <button 
                    onClick={() => setIsWODetailsOpen(true)}
                    className="text-blue-600 hover:text-blue-700 p-1 hover:bg-blue-50 rounded transition-colors"
                    title="View Details"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>

              {/* Work Order Info Grid */}
              <div className="grid grid-cols-4 gap-3 mb-5 pb-5 border-b border-gray-200">
                <div>
                  <div className="text-xs text-gray-500 font-medium">Work Order Date</div>
                  <div className="text-sm font-semibold text-gray-800">2026-07-10</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 font-medium">Work Order Code</div>
                  <div className="text-sm font-semibold text-gray-800">WO2026070001</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 font-medium">Lot No.</div>
                  <div className="text-sm font-semibold text-gray-800">LOT2026071001</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 font-medium">Delivery Date</div>
                  <div className="text-sm font-semibold text-gray-800">2026-08-15</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 font-medium">Item Code</div>
                  <div className="text-sm font-semibold text-gray-800">PCB001</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 font-medium">Receive Qty</div>
                  <div className="text-sm font-semibold text-gray-800">1000</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 font-medium">Remain Qty</div>
                  <div className="text-sm font-semibold text-gray-800">150</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 font-medium">Drawing No</div>
                  <div className="text-sm font-semibold text-gray-800">DRW-2026-001</div>
                </div>
              </div>
              
              <div className="flex-1">
                {/* Process Flow with Interactive Dots */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between relative px-1">
                    {processes.map((process, index) => {
                      const isActive = process.id <= selectedProcess;
                      const isCurrent = process.id === selectedProcess;
                      return (
                        <div key={process.id} className="flex flex-col items-center gap-1.5 cursor-pointer group flex-1 relative">
                          {/* Connecting line */}
                          {index < processes.length - 1 && (
                            <div className={`absolute top-3 left-1/2 w-[calc(100%-12px)] h-1 rounded-full transition-all duration-300 ${
                              isActive ? 'bg-gradient-to-r from-cyan-400 to-blue-500' : 'bg-gray-200'
                            }`}></div>
                          )}
                          {/* Dot */}
                          <button
                            onClick={() => setSelectedProcess(process.id)}
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 transform hover:scale-110 relative z-10 ${
                              isCurrent
                                ? 'bg-gradient-to-br from-cyan-400 to-blue-500 text-white shadow-lg border-4 border-white'
                                : isActive
                                ? 'bg-gradient-to-br from-cyan-400 to-blue-500 text-white border-2 border-white'
                                : 'bg-gray-200 text-gray-600 border-2 border-white hover:bg-gray-300'
                            }`}
                            title={`${process.code} - ${process.name}`}
                          >
                            <span className="text-[9px] font-bold">{process.code}</span>
                          </button>
                          {/* Label */}
                          <div className="text-center transition-colors">
                            <div className={`text-xs font-medium whitespace-nowrap ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
                              {process.name}
                            </div>
                            <div className={`text-[10px] whitespace-nowrap ${isActive ? 'text-blue-500' : 'text-gray-400'}`}>
                              ({process.nameKo})
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Processing Session Table - 2 cols */}
            <div className="col-span-2 bg-white rounded-lg border border-gray-200 flex flex-col">
              <div className="flex items-center justify-between p-5 border-b border-gray-200 flex-shrink-0">
                <h3 className="font-semibold text-gray-800 text-sm">Processing Session</h3>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => {
                      if (selectedRow === null) return;
                      const rows = [
                        {seq: 1, date: '2026-07-10 08:00', lotNo: 'LOT2026071001', qty: 100, ok: 100, ng: 0, worker: 'Admin'},
                        {seq: 2, date: '2026-07-10 09:10', lotNo: 'LOT2026071002', qty: 50, ok: 48, ng: 2, worker: 'Admin'},
                        {seq: 3, date: '2026-07-10 10:15', lotNo: 'LOT2026071003', qty: 30, ok: 0, ng: 0, worker: '-'},
                      ];
                      const row = rows[selectedRow - 1];
                      setSelectedRowData(row);
                      setTargetQty(String(row.qty));
                      setPopupOkQty(String(row.ok));
                      setPopupNgQty(String(row.ng));
                      setResultPopupOpen(true);
                    }}
                    disabled={selectedRow === null}
                    className={`border rounded-full px-2.5 py-1.5 text-xs font-medium transition-colors ${
                      selectedRow !== null
                        ? 'border-blue-300 bg-blue-50 text-blue-700 hover:bg-blue-100 cursor-pointer'
                        : 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Result
                  </button>
                  <button className="border border-yellow-300 bg-yellow-50 text-yellow-700 rounded-full px-2.5 py-1.5 text-xs font-medium hover:bg-yellow-100 transition-colors">
                    Cancel
                  </button>
                  <button className="border border-red-300 bg-red-50 text-red-700 rounded-full px-2.5 py-1.5 text-xs font-medium hover:bg-red-100 flex items-center gap-1 transition-colors">
                    <Trash2 size={13} /> Delete
                  </button>
                </div>
              </div>
              
              <div className="overflow-x-auto flex-1">
                <table className="w-full text-xs">
                  <thead className="bg-gray-100 border-b border-gray-200 sticky top-0">
                    <tr>
                      <th className="px-3 py-2.5 text-left w-6"><input type="checkbox" className="rounded w-3.5 h-3.5" /></th>
                      <th className="px-3 py-2.5 text-left font-semibold text-gray-700 whitespace-nowrap">Seq</th>
                      <th className="px-3 py-2.5 text-left font-semibold text-gray-700 whitespace-nowrap">Date</th>
                      <th className="px-3 py-2.5 text-left font-semibold text-gray-700 whitespace-nowrap">Finish line date</th>
                      <th className="px-3 py-2.5 text-center font-semibold text-gray-700 whitespace-nowrap">Receive Qty</th>
                      <th className="px-3 py-2.5 text-center font-semibold text-gray-700 whitespace-nowrap">OK Qty</th>
                      <th className="px-3 py-2.5 text-center font-semibold text-gray-700 whitespace-nowrap">NG Qty</th>
                      {selectedProcess === 2 && (
                        <>
                          <th className="px-3 py-2.5 text-center font-semibold text-gray-700 whitespace-nowrap">Lead Time</th>
                          <th className="px-3 py-2.5 text-left font-semibold text-gray-700 whitespace-nowrap">Checker</th>
                          <th className="px-3 py-2.5 text-center font-semibold text-gray-700 whitespace-nowrap">Inspection YN</th>
                        </>
                      )}
                      {selectedProcess === 3 && (
                        <>
                          <th className="px-3 py-2.5 text-center font-semibold text-gray-700 whitespace-nowrap">Yield Rate</th>
                          <th className="px-3 py-2.5 text-center font-semibold text-gray-700 whitespace-nowrap">Block distance</th>
                          <th className="px-3 py-2.5 text-center font-semibold text-gray-700 whitespace-nowrap">Concentricity (BGF)</th>
                          <th className="px-3 py-2.5 text-left font-semibold text-gray-700 whitespace-nowrap">Std Location Bottom Pad</th>
                          <th className="px-3 py-2.5 text-center font-semibold text-gray-700 whitespace-nowrap">JIG/Drawing Insp</th>
                        </>
                      )}
                      <th className="px-3 py-2.5 text-left font-semibold text-gray-700 whitespace-nowrap">Production Team</th>
                      <th className="px-3 py-2.5 text-left font-semibold text-gray-700 whitespace-nowrap">Remark</th>
                      <th className="px-3 py-2.5 text-center font-semibold text-gray-700 whitespace-nowrap">Status</th>
                      <th className="px-3 py-2.5 text-right font-semibold text-gray-700 whitespace-nowrap">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {/* Row 1 - Open with Excel-style editing */}
                    <tr className={`transition-colors ${selectedRow === 1 ? 'bg-blue-50' : 'hover:bg-blue-50'}`}>
                      <td className="px-3 py-2"><input type="checkbox" readOnly checked={selectedRow === 1} className="rounded w-3.5 h-3.5 cursor-pointer" onClick={() => setSelectedRow(selectedRow === 1 ? null : 1)} /></td>
                      <td className="px-3 py-2 font-semibold text-gray-900 whitespace-nowrap">1</td>
                      {/* Date */}
                      <td className="px-3 py-2 cursor-text" onClick={() => setEditingCell('row1-date')}>
                        {editingCell === 'row1-date' ? (
                          <input autoFocus type="text" value={cellValues.row1.date} onChange={(e) => setCellValues({...cellValues, row1: {...cellValues.row1, date: e.target.value}})} onBlur={() => setEditingCell(null)} className="w-full px-2 py-1 border-2 border-blue-400 rounded text-sm bg-white focus:outline-none" />
                        ) : (
                          <span className="text-gray-700">{cellValues.row1.date}</span>
                        )}
                      </td>
                      {/* Finish Line Date */}
                      <td className="px-3 py-2 cursor-text" onClick={() => setEditingCell('row1-finishDate')}>
                        {editingCell === 'row1-finishDate' ? (
                          <input autoFocus type="text" value={cellValues.row1.finishDate} onChange={(e) => setCellValues({...cellValues, row1: {...cellValues.row1, finishDate: e.target.value}})} onBlur={() => setEditingCell(null)} className="w-full px-2 py-1 border-2 border-blue-400 rounded text-sm bg-white focus:outline-none" />
                        ) : (
                          <span className="text-gray-700">{cellValues.row1.finishDate}</span>
                        )}
                      </td>
                      {/* Receive Qty */}
                      <td className="px-3 py-2 text-center cursor-text" onClick={() => setEditingCell('row1-receiveQty')}>
                        {editingCell === 'row1-receiveQty' ? (
                          <input autoFocus type="number" value={cellValues.row1.receiveQty} onChange={(e) => setCellValues({...cellValues, row1: {...cellValues.row1, receiveQty: e.target.value}})} onBlur={() => setEditingCell(null)} className="w-16 px-2 py-1 border-2 border-blue-400 rounded text-center text-sm bg-white focus:outline-none" />
                        ) : (
                          <span className="text-gray-900 font-medium">{cellValues.row1.receiveQty}</span>
                        )}
                      </td>
                      {/* OK Qty */}
                      <td className="px-3 py-2 text-center cursor-text" onClick={() => setEditingCell('row1-okQty')}>
                        {editingCell === 'row1-okQty' ? (
                          <input autoFocus type="number" value={cellValues.row1.okQty} onChange={(e) => setCellValues({...cellValues, row1: {...cellValues.row1, okQty: e.target.value}})} onBlur={() => setEditingCell(null)} className="w-16 px-2 py-1 border-2 border-blue-400 rounded text-center text-sm bg-white focus:outline-none" />
                        ) : (
                          <span className="text-green-700 font-semibold">{cellValues.row1.okQty}</span>
                        )}
                      </td>
                      {/* NG Qty */}
                      <td className="px-3 py-2 text-center cursor-text" onClick={() => setEditingCell('row1-ngQty')}>
                        {editingCell === 'row1-ngQty' ? (
                          <input autoFocus type="number" value={cellValues.row1.ngQty} onChange={(e) => setCellValues({...cellValues, row1: {...cellValues.row1, ngQty: e.target.value}})} onBlur={() => setEditingCell(null)} className="w-16 px-2 py-1 border-2 border-blue-400 rounded text-center text-sm bg-white focus:outline-none" />
                        ) : (
                          <span className="text-gray-600">{cellValues.row1.ngQty}</span>
                        )}
                      </td>
                      {selectedProcess === 2 && (
                        <>
                          <td className="px-3 py-2 text-center cursor-text" onClick={() => setEditingCell('row1-leadTime')}>
                            {editingCell === 'row1-leadTime' ? (
                              <input autoFocus type="text" value={cellValues.row1.leadTime} onChange={(e) => setCellValues({...cellValues, row1: {...cellValues.row1, leadTime: e.target.value}})} onBlur={() => setEditingCell(null)} className="w-20 px-2 py-1 border-2 border-blue-400 rounded text-center text-sm bg-white focus:outline-none" />
                            ) : (
                              <span className="text-gray-700">{cellValues.row1.leadTime}</span>
                            )}
                          </td>
                          <td className="px-3 py-2 cursor-text" onClick={() => setEditingCell('row1-checker')}>
                            {editingCell === 'row1-checker' ? (
                              <input autoFocus type="text" value={cellValues.row1.checker} onChange={(e) => setCellValues({...cellValues, row1: {...cellValues.row1, checker: e.target.value}})} onBlur={() => setEditingCell(null)} className="w-full px-2 py-1 border-2 border-blue-400 rounded text-sm bg-white focus:outline-none" />
                            ) : (
                              <span className="text-gray-700">{cellValues.row1.checker}</span>
                            )}
                          </td>
                          <td className="px-3 py-2 text-center cursor-text" onClick={() => setEditingCell('row1-inspectionYn')}>
                            {editingCell === 'row1-inspectionYn' ? (
                              <input autoFocus type="text" value={cellValues.row1.inspectionYn} onChange={(e) => setCellValues({...cellValues, row1: {...cellValues.row1, inspectionYn: e.target.value}})} onBlur={() => setEditingCell(null)} className="w-16 px-2 py-1 border-2 border-blue-400 rounded text-center text-sm bg-white focus:outline-none" />
                            ) : (
                              <span className="text-gray-700">{cellValues.row1.inspectionYn}</span>
                            )}
                          </td>
                        </>
                      )}
                      {selectedProcess === 3 && (
                        <>
                          <td className="px-3 py-2 text-center cursor-text" onClick={() => setEditingCell('row1-yieldRate')}>
                            {editingCell === 'row1-yieldRate' ? (
                              <input autoFocus type="text" value={cellValues.row1.yieldRate} onChange={(e) => setCellValues({...cellValues, row1: {...cellValues.row1, yieldRate: e.target.value}})} onBlur={() => setEditingCell(null)} className="w-16 px-2 py-1 border-2 border-blue-400 rounded text-center text-sm bg-white focus:outline-none" />
                            ) : (
                              <span className="text-green-600 font-semibold">{cellValues.row1.yieldRate}</span>
                            )}
                          </td>
                          <td className="px-3 py-2 text-center cursor-text" onClick={() => setEditingCell('row1-blockDist')}>
                            {editingCell === 'row1-blockDist' ? (
                              <input autoFocus type="text" value={cellValues.row1.blockDist} onChange={(e) => setCellValues({...cellValues, row1: {...cellValues.row1, blockDist: e.target.value}})} onBlur={() => setEditingCell(null)} className="w-20 px-2 py-1 border-2 border-blue-400 rounded text-center text-sm bg-white focus:outline-none" />
                            ) : (
                              <span className="text-gray-700">{cellValues.row1.blockDist}</span>
                            )}
                          </td>
                          <td className="px-3 py-2 text-center cursor-text" onClick={() => setEditingCell('row1-concentricity')}>
                            {editingCell === 'row1-concentricity' ? (
                              <input autoFocus type="text" value={cellValues.row1.concentricity} onChange={(e) => setCellValues({...cellValues, row1: {...cellValues.row1, concentricity: e.target.value}})} onBlur={() => setEditingCell(null)} className="w-16 px-2 py-1 border-2 border-blue-400 rounded text-center text-sm bg-white focus:outline-none" />
                            ) : (
                              <span className="text-gray-700">{cellValues.row1.concentricity}</span>
                            )}
                          </td>
                          <td className="px-3 py-2 cursor-text" onClick={() => setEditingCell('row1-stdLocation')}>
                            {editingCell === 'row1-stdLocation' ? (
                              <input autoFocus type="text" value={cellValues.row1.stdLocation} onChange={(e) => setCellValues({...cellValues, row1: {...cellValues.row1, stdLocation: e.target.value}})} onBlur={() => setEditingCell(null)} className="w-full px-2 py-1 border-2 border-blue-400 rounded text-sm bg-white focus:outline-none" />
                            ) : (
                              <span className="text-gray-700">{cellValues.row1.stdLocation}</span>
                            )}
                          </td>
                          <td className="px-3 py-2 text-center cursor-text" onClick={() => setEditingCell('row1-jigInspection')}>
                            {editingCell === 'row1-jigInspection' ? (
                              <input autoFocus type="text" value={cellValues.row1.jigInspection} onChange={(e) => setCellValues({...cellValues, row1: {...cellValues.row1, jigInspection: e.target.value}})} onBlur={() => setEditingCell(null)} className="w-16 px-2 py-1 border-2 border-blue-400 rounded text-center text-sm bg-white focus:outline-none" />
                            ) : (
                              <span className="text-green-600 font-semibold">{cellValues.row1.jigInspection}</span>
                            )}
                          </td>
                        </>
                      )}
                      {/* Production Team - Only for R02 and R04 */}
                      <td className="px-3 py-2">
                        {(selectedProcess === 2 || selectedProcess === 3) ? (
                          <select value={cellValues.row1.productionTeamId} onChange={(e) => setCellValues({...cellValues, row1: {...cellValues.row1, productionTeamId: parseInt(e.target.value) || ''}})} className="w-full px-2 py-1 border border-gray-300 rounded text-sm bg-white hover:border-blue-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 cursor-pointer">
                            <option value="">Select Team</option>
                            {productionTeams.map(team => (
                              <option key={team.id} value={team.id}>{team.name}</option>
                            ))}
                          </select>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      {/* Remark */}
                      <td className="px-3 py-2 cursor-text" onClick={() => setEditingCell('row1-remark')}>
                        {editingCell === 'row1-remark' ? (
                          <input autoFocus type="text" value={cellValues.row1.remark} onChange={(e) => setCellValues({...cellValues, row1: {...cellValues.row1, remark: e.target.value}})} onBlur={() => setEditingCell(null)} className="w-full px-2 py-1 border-2 border-blue-400 rounded text-sm bg-white focus:outline-none" />
                        ) : (
                          <span className="text-gray-500 text-xs">{cellValues.row1.remark}</span>
                        )}
                      </td>
                      <td className="px-3 py-2 text-center"><span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-semibold">Open</span></td>
                      <td className="px-3 py-2 text-right flex gap-1 justify-end">
                        <button onClick={(e) => { e.stopPropagation(); }} className="text-red-600 hover:text-red-700 text-xs font-medium hover:underline transition-colors whitespace-nowrap">
                          Defect
                        </button>
                      </td>
                    </tr>

                    {/* Row 2 - Closed (Read-only) */}
                    <tr onClick={() => setSelectedRow(selectedRow === 2 ? null : 2)} className={`cursor-pointer transition-colors ${selectedRow === 2 ? 'bg-blue-100' : 'hover:bg-blue-50'} bg-gray-50`}>
                      <td className="px-3 py-2"><input type="checkbox" readOnly checked={selectedRow === 2} className="rounded w-3.5 h-3.5" /></td>
                      <td className="px-3 py-2 font-semibold text-gray-900 whitespace-nowrap">2</td>
                      <td className="px-3 py-2 text-gray-700 whitespace-nowrap">2026-07-10 09:10</td>
                      <td className="px-3 py-2 text-gray-700 whitespace-nowrap">2026-07-10 09:35</td>
                      <td className="px-3 py-2 text-center text-gray-900 font-medium">50</td>
                      <td className="px-3 py-2 text-center text-gray-900 font-medium">48</td>
                      <td className="px-3 py-2 text-center text-red-600 font-semibold">2</td>
                      {selectedProcess === 2 && (
                        <>
                          <td className="px-3 py-2 text-center text-gray-700">25 min</td>
                          <td className="px-3 py-2 text-gray-700 whitespace-nowrap">Admin</td>
                          <td className="px-3 py-2 text-center text-gray-700">Yes</td>
                        </>
                      )}
                      {selectedProcess === 3 && (
                        <>
                          <td className="px-3 py-2 text-center text-yellow-600 font-semibold">96%</td>
                          <td className="px-3 py-2 text-center text-gray-700">0.30 mm</td>
                          <td className="px-3 py-2 text-center text-gray-700">0.18</td>
                          <td className="px-3 py-2 text-gray-700">Warning</td>
                          <td className="px-3 py-2 text-center text-gray-600">-</td>
                        </>
                      )}
                      <td className="px-3 py-2 text-gray-700">BOOTH 2</td>
                      <td className="px-3 py-2 text-gray-500 text-xs">Offset</td>
                      <td className="px-3 py-2 text-center"><span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-semibold">Close</span></td>
                      <td className="px-3 py-2 text-right flex gap-1 justify-end">
                        <button disabled className="text-gray-400 text-xs font-medium cursor-not-allowed whitespace-nowrap">
                          Defect
                        </button>
                      </td>
                    </tr>

                    {/* Row 3 - Open with Excel-style editing */}
                    <tr className={`transition-colors ${selectedRow === 3 ? 'bg-blue-50' : 'hover:bg-blue-50'}`}>
                      <td className="px-3 py-2"><input type="checkbox" readOnly checked={selectedRow === 3} className="rounded w-3.5 h-3.5 cursor-pointer" onClick={() => setSelectedRow(selectedRow === 3 ? null : 3)} /></td>
                      <td className="px-3 py-2 font-semibold text-gray-900 whitespace-nowrap">3</td>
                      <td className="px-3 py-2 cursor-text" onClick={() => setEditingCell('row3-date')}>
                        {editingCell === 'row3-date' ? (
                          <input autoFocus type="text" value={cellValues.row3.date} onChange={(e) => setCellValues({...cellValues, row3: {...cellValues.row3, date: e.target.value}})} onBlur={() => setEditingCell(null)} className="w-full px-2 py-1 border-2 border-blue-400 rounded text-sm bg-white focus:outline-none" />
                        ) : (
                          <span className="text-gray-700">{cellValues.row3.date}</span>
                        )}
                      </td>
                      <td className="px-3 py-2 cursor-text" onClick={() => setEditingCell('row3-finishDate')}>
                        {editingCell === 'row3-finishDate' ? (
                          <input autoFocus type="text" value={cellValues.row3.finishDate} onChange={(e) => setCellValues({...cellValues, row3: {...cellValues.row3, finishDate: e.target.value}})} onBlur={() => setEditingCell(null)} className="w-full px-2 py-1 border-2 border-blue-400 rounded text-sm bg-white focus:outline-none" />
                        ) : (
                          <span className="text-gray-700">{cellValues.row3.finishDate}</span>
                        )}
                      </td>
                      <td className="px-3 py-2 text-center cursor-text" onClick={() => setEditingCell('row3-receiveQty')}>
                        {editingCell === 'row3-receiveQty' ? (
                          <input autoFocus type="number" value={cellValues.row3.receiveQty} onChange={(e) => setCellValues({...cellValues, row3: {...cellValues.row3, receiveQty: e.target.value}})} onBlur={() => setEditingCell(null)} className="w-16 px-2 py-1 border-2 border-blue-400 rounded text-center text-sm bg-white focus:outline-none" />
                        ) : (
                          <span className="text-gray-900 font-medium">{cellValues.row3.receiveQty}</span>
                        )}
                      </td>
                      <td className="px-3 py-2 text-center cursor-text" onClick={() => setEditingCell('row3-okQty')}>
                        {editingCell === 'row3-okQty' ? (
                          <input autoFocus type="number" value={cellValues.row3.okQty} onChange={(e) => setCellValues({...cellValues, row3: {...cellValues.row3, okQty: e.target.value}})} onBlur={() => setEditingCell(null)} className="w-16 px-2 py-1 border-2 border-blue-400 rounded text-center text-sm bg-white focus:outline-none" />
                        ) : (
                          <span className="text-gray-600">{cellValues.row3.okQty || '-'}</span>
                        )}
                      </td>
                      <td className="px-3 py-2 text-center cursor-text" onClick={() => setEditingCell('row3-ngQty')}>
                        {editingCell === 'row3-ngQty' ? (
                          <input autoFocus type="number" value={cellValues.row3.ngQty} onChange={(e) => setCellValues({...cellValues, row3: {...cellValues.row3, ngQty: e.target.value}})} onBlur={() => setEditingCell(null)} className="w-16 px-2 py-1 border-2 border-blue-400 rounded text-center text-sm bg-white focus:outline-none" />
                        ) : (
                          <span className="text-gray-600">{cellValues.row3.ngQty || '-'}</span>
                        )}
                      </td>
                      {selectedProcess === 2 && (
                        <>
                          <td className="px-3 py-2 text-center cursor-text" onClick={() => setEditingCell('row3-leadTime')}>
                            {editingCell === 'row3-leadTime' ? (
                              <input autoFocus type="text" value={cellValues.row3.leadTime} onChange={(e) => setCellValues({...cellValues, row3: {...cellValues.row3, leadTime: e.target.value}})} onBlur={() => setEditingCell(null)} className="w-20 px-2 py-1 border-2 border-blue-400 rounded text-center text-sm bg-white focus:outline-none" />
                            ) : (
                              <span className="text-gray-600">{cellValues.row3.leadTime || '-'}</span>
                            )}
                          </td>
                          <td className="px-3 py-2 cursor-text" onClick={() => setEditingCell('row3-checker')}>
                            {editingCell === 'row3-checker' ? (
                              <input autoFocus type="text" value={cellValues.row3.checker} onChange={(e) => setCellValues({...cellValues, row3: {...cellValues.row3, checker: e.target.value}})} onBlur={() => setEditingCell(null)} className="w-full px-2 py-1 border-2 border-blue-400 rounded text-sm bg-white focus:outline-none" />
                            ) : (
                              <span className="text-gray-600">{cellValues.row3.checker || '-'}</span>
                            )}
                          </td>
                          <td className="px-3 py-2 text-center cursor-text" onClick={() => setEditingCell('row3-inspectionYn')}>
                            {editingCell === 'row3-inspectionYn' ? (
                              <input autoFocus type="text" value={cellValues.row3.inspectionYn} onChange={(e) => setCellValues({...cellValues, row3: {...cellValues.row3, inspectionYn: e.target.value}})} onBlur={() => setEditingCell(null)} className="w-16 px-2 py-1 border-2 border-blue-400 rounded text-center text-sm bg-white focus:outline-none" />
                            ) : (
                              <span className="text-gray-600">{cellValues.row3.inspectionYn || '-'}</span>
                            )}
                          </td>
                        </>
                      )}
                      {selectedProcess === 3 && (
                        <>
                          <td className="px-3 py-2 text-center cursor-text" onClick={() => setEditingCell('row3-yieldRate')}>
                            {editingCell === 'row3-yieldRate' ? (
                              <input autoFocus type="text" value={cellValues.row3.yieldRate} onChange={(e) => setCellValues({...cellValues, row3: {...cellValues.row3, yieldRate: e.target.value}})} onBlur={() => setEditingCell(null)} className="w-16 px-2 py-1 border-2 border-blue-400 rounded text-center text-sm bg-white focus:outline-none" />
                            ) : (
                              <span className="text-gray-600">{cellValues.row3.yieldRate || '-'}</span>
                            )}
                          </td>
                          <td className="px-3 py-2 text-center cursor-text" onClick={() => setEditingCell('row3-blockDist')}>
                            {editingCell === 'row3-blockDist' ? (
                              <input autoFocus type="text" value={cellValues.row3.blockDist} onChange={(e) => setCellValues({...cellValues, row3: {...cellValues.row3, blockDist: e.target.value}})} onBlur={() => setEditingCell(null)} className="w-20 px-2 py-1 border-2 border-blue-400 rounded text-center text-sm bg-white focus:outline-none" />
                            ) : (
                              <span className="text-gray-600">{cellValues.row3.blockDist || '-'}</span>
                            )}
                          </td>
                          <td className="px-3 py-2 text-center cursor-text" onClick={() => setEditingCell('row3-concentricity')}>
                            {editingCell === 'row3-concentricity' ? (
                              <input autoFocus type="text" value={cellValues.row3.concentricity} onChange={(e) => setCellValues({...cellValues, row3: {...cellValues.row3, concentricity: e.target.value}})} onBlur={() => setEditingCell(null)} className="w-16 px-2 py-1 border-2 border-blue-400 rounded text-center text-sm bg-white focus:outline-none" />
                            ) : (
                              <span className="text-gray-600">{cellValues.row3.concentricity || '-'}</span>
                            )}
                          </td>
                          <td className="px-3 py-2 cursor-text" onClick={() => setEditingCell('row3-stdLocation')}>
                            {editingCell === 'row3-stdLocation' ? (
                              <input autoFocus type="text" value={cellValues.row3.stdLocation} onChange={(e) => setCellValues({...cellValues, row3: {...cellValues.row3, stdLocation: e.target.value}})} onBlur={() => setEditingCell(null)} className="w-full px-2 py-1 border-2 border-blue-400 rounded text-sm bg-white focus:outline-none" />
                            ) : (
                              <span className="text-gray-600">{cellValues.row3.stdLocation || '-'}</span>
                            )}
                          </td>
                          <td className="px-3 py-2 text-center cursor-text" onClick={() => setEditingCell('row3-jigInspection')}>
                            {editingCell === 'row3-jigInspection' ? (
                              <input autoFocus type="text" value={cellValues.row3.jigInspection} onChange={(e) => setCellValues({...cellValues, row3: {...cellValues.row3, jigInspection: e.target.value}})} onBlur={() => setEditingCell(null)} className="w-16 px-2 py-1 border-2 border-blue-400 rounded text-center text-sm bg-white focus:outline-none" />
                            ) : (
                              <span className="text-gray-600">{cellValues.row3.jigInspection || '-'}</span>
                            )}
                          </td>
                        </>
                      )}
                      {/* Production Team - Only for R02 and R04 */}
                      <td className="px-3 py-2">
                        {(selectedProcess === 2 || selectedProcess === 3) ? (
                          <select value={cellValues.row3.productionTeamId} onChange={(e) => setCellValues({...cellValues, row3: {...cellValues.row3, productionTeamId: parseInt(e.target.value) || ''}})} className="w-full px-2 py-1 border border-gray-300 rounded text-sm bg-white hover:border-blue-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 cursor-pointer">
                            <option value="">Select Team</option>
                            {productionTeams.map(team => (
                              <option key={team.id} value={team.id}>{team.name}</option>
                            ))}
                          </select>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-3 py-2 cursor-text" onClick={() => setEditingCell('row3-remark')}>
                        {editingCell === 'row3-remark' ? (
                          <input autoFocus type="text" value={cellValues.row3.remark} onChange={(e) => setCellValues({...cellValues, row3: {...cellValues.row3, remark: e.target.value}})} onBlur={() => setEditingCell(null)} className="w-full px-2 py-1 border-2 border-blue-400 rounded text-sm bg-white focus:outline-none" />
                        ) : (
                          <span className="text-gray-500 text-xs">{cellValues.row3.remark || '-'}</span>
                        )}
                      </td>
                      <td className="px-3 py-2 text-center"><span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-semibold">Open</span></td>
                      <td className="px-3 py-2 text-right flex gap-1 justify-end">
                        <button onClick={(e) => { e.stopPropagation(); }} className="text-red-600 hover:text-red-700 text-xs font-medium hover:underline transition-colors whitespace-nowrap">
                          Defect
                        </button>
                      </td>
                    </tr>

                    {/* Total Row */}
                    <tr className="bg-gray-100 font-semibold border-t-2 border-gray-300">
                      <td colSpan={4} className="px-3 py-2.5 text-gray-900">Total</td>
                      <td className="px-3 py-2.5 text-center text-gray-900">180</td>
                      <td className="px-3 py-2.5 text-center text-green-700">148</td>
                      <td className="px-3 py-2.5 text-center text-red-600">2</td>
                      {selectedProcess === 2 && (
                        <>
                          <td className="px-3 py-2.5 text-center text-gray-900">75 min</td>
                          <td colSpan={2}></td>
                        </>
                      )}
                      {selectedProcess === 3 && (
                        <>
                          <td className="px-3 py-2.5 text-center text-gray-900">97.3%</td>
                          <td colSpan={4}></td>
                        </>
                      )}
                      <td colSpan={2}></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Material Section - 1 col */}
            <div className="col-span-1 bg-white rounded-lg border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800 text-sm">Material</h3>
                <button className="text-sm bg-yellow-400 text-black px-3 py-1.5 rounded font-semibold hover:bg-yellow-500">↓ BOM</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100 border-b border-gray-200">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-semibold">Code</th>
                      <th className="px-3 py-2 text-left text-xs font-semibold">Name</th>
                      <th className="px-3 py-2 text-center text-xs font-semibold">Req</th>
                      <th className="px-3 py-2 text-center text-xs font-semibold">Issued</th>
                      <th className="px-3 py-2 text-center text-xs font-semibold">Used</th>
                      <th className="px-3 py-2 text-center text-xs font-semibold">Remain</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr className="hover:bg-gray-50">
                      <td className="px-3 py-2 text-sm">MAT001</td>
                      <td className="px-3 py-2 text-sm">Solder Mask</td>
                      <td className="px-3 py-2 text-center text-sm">0.500</td>
                      <td className="px-3 py-2 text-center text-sm">0.500</td>
                      <td className="px-3 py-2 text-center text-sm">0.300</td>
                      <td className="px-3 py-2 text-center text-sm">0.200</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-3 py-2 text-sm">MAT002</td>
                      <td className="px-3 py-2 text-sm">Thinner</td>
                      <td className="px-3 py-2 text-center text-sm">0.200</td>
                      <td className="px-3 py-2 text-center text-sm">0.200</td>
                      <td className="px-3 py-2 text-center text-sm">0.120</td>
                      <td className="px-3 py-2 text-center text-sm">0.080</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-3 py-2 text-sm">MAT003</td>
                      <td className="px-3 py-2 text-sm">Screen Mesh</td>
                      <td className="px-3 py-2 text-center text-sm">2.000</td>
                      <td className="px-3 py-2 text-center text-sm">2.000</td>
                      <td className="px-3 py-2 text-center text-sm">1.000</td>
                      <td className="px-3 py-2 text-center text-sm">1.000</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-3 py-2 text-sm">MAT004</td>
                      <td className="px-3 py-2 text-sm">Squeegee</td>
                      <td className="px-3 py-2 text-center text-sm">2.000</td>
                      <td className="px-3 py-2 text-center text-sm">2.000</td>
                      <td className="px-3 py-2 text-center text-sm">1.000</td>
                      <td className="px-3 py-2 text-center text-sm">1.000</td>
                    </tr>
                    <tr className="bg-gray-100 font-semibold">
                      <td colSpan={2} className="px-3 py-2 text-sm">Total</td>
                      <td className="px-3 py-2 text-center text-sm">4.700</td>
                      <td className="px-3 py-2 text-center text-sm">4.700</td>
                      <td className="px-3 py-2 text-center text-sm">2.420</td>
                      <td className="px-3 py-2 text-center text-sm">2.280</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Handover Section - 1 col */}
            <div className="col-span-1 bg-white rounded-lg border border-gray-200 flex flex-col h-full">
              <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
                <h3 className="font-semibold text-gray-800 text-sm">Handover</h3>
                <button className="text-sm bg-orange-500 text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-orange-600 transition-colors">Take selected</button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <table className="w-full text-xs">
                  <thead className="sticky top-0">
                    <tr className="bg-gray-100 border-y border-gray-300">
                      <th className="px-3 py-2.5 text-left font-semibold text-gray-700 whitespace-nowrap w-8"><input type="checkbox" className="rounded w-3.5 h-3.5" /></th>
                      <th className="px-3 py-2.5 text-left font-semibold text-gray-700 whitespace-nowrap">seq</th>
                      <th className="px-3 py-2.5 text-left font-semibold text-gray-700 whitespace-nowrap">Process</th>
                      <th className="px-3 py-2.5 text-left font-semibold text-gray-700 whitespace-nowrap">Sender name</th>
                      <th className="px-3 py-2.5 text-left font-semibold text-gray-700 whitespace-nowrap">Handover Date</th>
                      <th className="px-3 py-2.5 text-right font-semibold text-gray-700 whitespace-nowrap">Handover Qty</th>
                      <th className="px-3 py-2.5 text-left font-semibold text-gray-700 whitespace-nowrap">Send Remark</th>
                      <th className="px-3 py-2.5 text-left font-semibold text-gray-700 whitespace-nowrap">Receiver</th>
                      <th className="px-3 py-2.5 text-left font-semibold text-gray-700 whitespace-nowrap">Received Date</th>
                      <th className="px-3 py-2.5 text-right font-semibold text-gray-700 whitespace-nowrap">Remain Qty</th>
                      <th className="px-3 py-2.5 text-right font-semibold text-gray-700 whitespace-nowrap">Received Qty</th>
                      <th className="px-3 py-2.5 text-left font-semibold text-gray-700 whitespace-nowrap">Remark</th>
                      <th className="px-3 py-2.5 text-center font-semibold text-gray-700 whitespace-nowrap">Status</th>
                      <th className="px-3 py-2.5 text-center font-semibold text-gray-700 whitespace-nowrap">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {[
                      { seq: 'R01', process: '', sender: '2250844', handoverDate: '2026-03-19 18:37:09', handoverQty: 10, sendRemark: '', receiver: '2250844', receivedDate: '2026-03-19 18:37:20', remainQty: 0, receivedQty: 10, remark: '', status: 'Pending' },
                    ].map((row, i) => (
                      <tr 
                        key={i} 
                        onDoubleClick={() => alert(`Taking ${row.seq}`)}
                        className={`transition-colors cursor-pointer ${row.status === 'Pending' ? 'bg-yellow-50 hover:bg-yellow-100' : 'bg-white hover:bg-gray-50'}`}
                        title="Double-click to take"
                      >
                        <td className="px-3 py-2 text-center"><input type="checkbox" className="rounded w-3.5 h-3.5" /></td>
                        <td className="px-3 py-2 text-gray-700 font-medium">{row.seq}</td>
                        <td className="px-3 py-2 text-gray-600">{row.process}</td>
                        <td className="px-3 py-2 text-gray-700">{row.sender}</td>
                        <td className="px-3 py-2 text-gray-600 whitespace-nowrap">{row.handoverDate}</td>
                        <td className="px-3 py-2 text-right text-gray-700 font-medium">{row.handoverQty}</td>
                        <td className="px-3 py-2 text-gray-500 text-xs">{row.sendRemark || '-'}</td>
                        <td className="px-3 py-2 text-gray-700">{row.receiver}</td>
                        <td className="px-3 py-2 text-gray-600 whitespace-nowrap">{row.receivedDate}</td>
                        <td className="px-3 py-2 text-right text-gray-700 font-medium">{row.remainQty}</td>
                        <td className="px-3 py-2 text-right text-gray-700 font-medium">{row.receivedQty}</td>
                        <td className="px-3 py-2 text-gray-500 text-xs">{row.remark || '-'}</td>
                        <td className="px-3 py-2 text-center">
                          <span className={`px-2 py-1 rounded text-xs font-semibold whitespace-nowrap inline-block ${
                            row.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                          }`}>
                            {row.status}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button 
                              onClick={() => alert(`Taking ${row.seq}`)}
                              className="bg-orange-500 text-white px-2 py-1 rounded text-xs font-semibold hover:bg-orange-600 transition-colors whitespace-nowrap"
                              title="Take it"
                            >
                              Take it
                            </button>
                            <button className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-semibold hover:bg-blue-600 transition-colors whitespace-nowrap" title="Edit">
                              Edit
                            </button>
                            <button className="bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold hover:bg-red-600 transition-colors whitespace-nowrap" title="Delete">
                              Del
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Fixed Footer */}
              <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-600">Show</span>
                  <select className="border border-gray-300 rounded px-2 py-1 text-xs bg-white text-gray-700 hover:border-gray-400 focus:outline-none focus:border-blue-500">
                    <option>100</option>
                    <option>50</option>
                    <option>25</option>
                  </select>
                  <span className="text-xs text-gray-600">entries</span>
                </div>
                <span className="text-xs text-gray-600">1-1 of 1 items</span>
                <div className="flex items-center gap-1">
                  <button className="border border-gray-300 rounded px-2 py-1 text-gray-600 hover:bg-gray-100 transition-colors" title="First">&laquo;</button>
                  <button className="border border-gray-300 rounded px-2 py-1 text-gray-600 hover:bg-gray-100 transition-colors" title="Previous">&lt;</button>
                  <button className="border border-gray-300 rounded px-2 py-1 bg-blue-600 text-white font-semibold min-w-[28px]">1</button>
                  <button className="border border-gray-300 rounded px-2 py-1 text-gray-600 hover:bg-gray-100 transition-colors" title="Next">&gt;</button>
                  <button className="border border-gray-300 rounded px-2 py-1 text-gray-600 hover:bg-gray-100 transition-colors" title="Last">&raquo;</button>
                </div>
              </div>
            </div>

            {/* Action Buttons - 2 cols */}
            <div className="col-span-2 flex gap-2 pb-4">
              <button className="flex-1 bg-blue-600 text-white rounded-full px-3 py-2 text-xs font-semibold hover:bg-blue-700 transition-colors whitespace-nowrap">
                ▶ Start
              </button>
              <button className="flex-1 bg-green-600 text-white rounded-full px-3 py-2 text-xs font-semibold hover:bg-green-700 transition-colors whitespace-nowrap">
                ✓ Handover
              </button>
              <button className="flex-1 bg-red-600 text-white rounded-full px-3 py-2 text-xs font-semibold hover:bg-red-700 transition-colors whitespace-nowrap">
                Mix Powder
              </button>
              <button className="flex-1 bg-gray-200 text-gray-700 rounded-full px-3 py-2 text-xs font-semibold hover:bg-gray-300 transition-colors whitespace-nowrap">
                🖨️ PRINT
              </button>
              <button className="flex-1 bg-blue-100 text-blue-700 rounded-full px-3 py-2 text-xs font-semibold hover:bg-blue-200 transition-colors whitespace-nowrap">
                Skip
              </button>
            </div>
          </div>
          </div>

          {/* Production Timer Sidebar */}
          <div className="w-72 bg-white border-l border-gray-200 flex flex-col overflow-y-auto flex-shrink-0">
            {/* Timer Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 flex-shrink-0">
              <h3 className="font-semibold text-gray-800 text-sm">Production Timer</h3>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setTimerCollapsed(!timerCollapsed)}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100"
                >
                  {timerCollapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
                </button>
                <button className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100">
                  <Maximize2 size={14} />
                </button>
              </div>
            </div>

            {!timerCollapsed && (
              <div className="flex flex-col gap-3 p-4">
                {/* Status Badge - Only show for Machine type */}
                {timerType === 'machine' && (
                <div className={`flex items-center justify-center gap-2 py-1.5 rounded-md text-xs font-semibold ${
                  timerStatus === 'running' ? 'bg-green-50 text-green-700' :
                  timerStatus === 'paused' ? 'bg-yellow-50 text-yellow-700' :
                  'bg-gray-100 text-gray-500'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${
                    timerStatus === 'running' ? 'bg-green-500 animate-pulse' :
                    timerStatus === 'paused' ? 'bg-yellow-500' :
                    'bg-gray-400'
                  }`}></span>
                  {timerStatus === 'running' ? 'Running' : timerStatus === 'paused' ? 'Paused' : 'Idle'}
                </div>
                )}

                {/* Type Dropdown */}
                <div>
                  <label className="text-xs text-gray-500 font-medium block mb-1">Type</label>
                  <div className="relative">
                    <select
                      value={timerType}
                      onChange={(e) => setTimerType(e.target.value as 'manual' | 'machine')}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm font-medium text-gray-800 bg-white appearance-none focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="manual">Manual</option>
                      <option value="machine">Machine</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Machine Dropdown - Only show if Type is Machine */}
                {timerType === 'machine' && (
                <div>
                  <label className="text-xs text-gray-500 font-medium block mb-1">Machine</label>
                  <div className="relative">
                    <select
                      value={selectedMachine}
                      onChange={(e) => setSelectedMachine(e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm font-medium text-gray-800 bg-white appearance-none focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    >
                      {machines.map((m) => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                )}

                {/* Start Time & End Time */}
                <div className="flex flex-col gap-2">
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                    <div className="text-xs text-gray-500 font-medium mb-1">Start Time</div>
                    <input
                      type="text"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      placeholder="yyyy-mm-dd hh:mm:ss"
                      className="w-full text-sm font-bold text-gray-800 font-mono bg-white border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                    <div className="text-xs text-gray-500 font-medium mb-1">End Time</div>
                    <input
                      type="text"
                      value={endTime}
                      disabled
                      placeholder="yyyy-mm-dd hh:mm:ss"
                      className="w-full text-sm font-bold text-gray-600 font-mono bg-gray-100 border border-gray-300 rounded px-2 py-1 cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Target / OK / NG Qty */}
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-xs text-gray-500 font-medium mb-1 block">Target Qty</label>
                    <input
                      type="number"
                      value={targetQty}
                      onChange={(e) => setTargetQty(e.target.value)}
                      className="w-full text-lg font-bold text-gray-800 bg-white border border-gray-300 rounded px-2 py-1.5 text-center focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 font-medium mb-1 block">OK Qty</label>
                    <input
                      type="number"
                      value={okQtyTimer}
                      disabled
                      className="w-full text-lg font-bold text-green-600 bg-gray-100 border border-gray-300 rounded px-2 py-1.5 text-center cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 font-medium mb-1 block">NG Qty</label>
                    <input
                      type="number"
                      value={ngQtyTimer}
                      disabled
                      className="w-full text-lg font-bold text-red-500 bg-gray-100 border border-gray-300 rounded px-2 py-1.5 text-center cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Progress Bar */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-gray-500 font-medium">Progress</span>
                    <span className="text-xs font-bold text-gray-700">{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-blue-500 h-2.5 rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => setTimerStatus('running')}
                    className={`flex items-center justify-center gap-1.5 py-3 rounded-lg text-sm font-bold transition-colors ${
                      timerStatus === 'running'
                        ? 'bg-green-600 text-white shadow-sm'
                        : 'bg-green-50 text-green-700 border border-green-300 hover:bg-green-100'
                    }`}
                  >
                    <Play size={14} /> Start
                  </button>
                  <button
                    onClick={() => setEndTimePopupOpen(true)}
                    className="flex items-center justify-center gap-1.5 py-3 rounded-lg text-sm font-bold bg-red-50 text-red-600 border border-red-300 hover:bg-red-100 transition-colors"
                  >
                    <Square size={14} /> End
                  </button>
                </div>
              </div>
            )}

            {/* Machine Status Section - only show when type is Machine */}
            {timerType === 'machine' && <div className="border-t border-gray-200 flex-1">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <h4 className="font-semibold text-gray-800 text-sm">Machine Status</h4>
                <button className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100">
                  <RefreshCw size={13} />
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-3 py-2 text-left font-semibold text-gray-600">Machine</th>
                      <th className="px-3 py-2 text-left font-semibold text-gray-600">Status</th>
                      <th className="px-3 py-2 text-left font-semibold text-gray-600">Runtime</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {machineStatuses.map((m) => (
                      <tr key={m.name} className="hover:bg-gray-50">
                        <td className="px-3 py-2.5">
                          <div className="flex items-center gap-1.5">
                            <div className="w-5 h-5 bg-blue-100 rounded flex items-center justify-center flex-shrink-0">
                              <span className="text-blue-600 text-[9px] font-bold">M</span>
                            </div>
                            <span className="font-medium text-gray-800">{m.name}</span>
                          </div>
                        </td>
                        <td className="px-3 py-2.5">
                          <div className="flex items-center gap-1.5">
                            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${m.color} ${m.status === 'Running' ? 'animate-pulse' : ''}`}></span>
                            <span className={`font-medium ${
                              m.status === 'Running' ? 'text-green-600' :
                              m.status === 'Idle' ? 'text-yellow-600' :
                              m.status === 'Alarm' ? 'text-red-600' :
                              'text-gray-500'
                            }`}>{m.status}</span>
                          </div>
                        </td>
                        <td className="px-3 py-2.5 font-mono text-gray-700">{m.runtime}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>}
          </div>
        </div>
      </div>



      {/* Result Input Popup Modal */}
      {resultPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
              <h2 className="font-semibold text-gray-800 text-lg">Nhập Kết Quả Sản Xuất</h2>
              <button 
                onClick={() => setResultPopupOpen(false)}
                className="text-gray-500 hover:text-gray-700 p-1"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Receive Qty */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Receive Qty</label>
                <input 
                  type="number" 
                  value={targetQty}
                  disabled
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-50 text-gray-600 font-semibold"
                />
              </div>

              {/* OK and NG Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">OK Qty</label>
                  <input 
                    type="number" 
                    value={popupOkQty}
                    onChange={(e) => setPopupOkQty(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">NG Qty</label>
                  <input 
                    type="number" 
                    value={popupNgQty}
                    onChange={(e) => setPopupNgQty(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Production Team Grid */}
              <div>
                <h3 className="font-semibold text-gray-800 text-sm mb-3 pb-2 border-b border-gray-200">Nhập Tổ Sản Xuất</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead className="bg-gray-100 border-b border-gray-200">
                      <tr>
                        <th className="px-3 py-2 text-left font-semibold">Số Tôt</th>
                        <th className="px-3 py-2 text-left font-semibold">Tên Tổ</th>
                        <th className="px-3 py-2 text-center font-semibold">OK Qty</th>
                        <th className="px-3 py-2 text-center font-semibold">NG Qty</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <tr className="hover:bg-gray-50">
                        <td className="px-3 py-2">RS_CELL 1</td>
                        <td className="px-3 py-2">BOOTH 1</td>
                        <td className="px-3 py-2 text-center">
                          <input type="number" placeholder="0" className="w-12 border border-gray-300 rounded px-2 py-1 text-center text-xs" />
                        </td>
                        <td className="px-3 py-2 text-center">
                          <input type="number" placeholder="0" className="w-12 border border-gray-300 rounded px-2 py-1 text-center text-xs" />
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="px-3 py-2">RS_CELL 2</td>
                        <td className="px-3 py-2">BOOTH 2</td>
                        <td className="px-3 py-2 text-center">
                          <input type="number" placeholder="0" className="w-12 border border-gray-300 rounded px-2 py-1 text-center text-xs" />
                        </td>
                        <td className="px-3 py-2 text-center">
                          <input type="number" placeholder="0" className="w-12 border border-gray-300 rounded px-2 py-1 text-center text-xs" />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* NG Details Section */}
              <div>
                <h3 className="font-semibold text-gray-800 text-sm mb-3 pb-2 border-b border-gray-200">Chi Tiết Nhập NG</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Loại NG</label>
                    <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500">
                      <option>Bridge - Cầu thiếc</option>
                      <option>Scratch - Trầy xước</option>
                      <option>Cold Solder - Thiếc lạnh</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Số Lượng NG</label>
                    <input type="number" placeholder="0" className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Ghi Chú</label>
                    <textarea placeholder="Nhập ghi chú" className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 resize-none" rows={2}></textarea>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-2">
              <button
                onClick={() => setResultPopupOpen(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-400 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => setResultPopupOpen(false)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm"
              >
                Result
              </button>
            </div>
          </div>
        </div>
      )}

      {/* End Time Picker Popup Modal */}
      {endTimePopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-sm">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white">
              <h2 className="font-semibold text-gray-800 text-lg">Chọn End Time</h2>
              <button 
                onClick={() => setEndTimePopupOpen(false)}
                className="text-gray-500 hover:text-gray-700 p-1"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">End Time</label>
                <input 
                  type="text" 
                  value={tempEndTime}
                  onChange={(e) => setTempEndTime(e.target.value)}
                  placeholder="yyyy-mm-dd hh:mm:ss"
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 font-mono"
                />
                <p className="text-xs text-gray-500 mt-1">Format: yyyy-mm-dd hh:mm:ss</p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-2">
              <button
                onClick={() => setEndTimePopupOpen(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-400 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setEndTime(tempEndTime);
                  setEndTimePopupOpen(false);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Row Details Popup Modal */}
      {detailsPopupRow && (
        <div className="fixed inset-0 bg-black bg-opacity-20 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
              <h2 className="font-semibold text-gray-800 text-lg">
                Processing Details - Seq {detailsPopupRow}
              </h2>
              <button 
                onClick={() => setDetailsPopupRow(null)}
                className="text-gray-500 hover:text-gray-700 p-1"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Common Fields */}
              <div>
                <h3 className="font-semibold text-gray-800 text-sm mb-4 pb-2 border-b border-gray-200">Processing Information</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Lot No.</label>
                    <input type="text" value={`LOT202607100${detailsPopupRow}`} className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-50" disabled />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Processing Date</label>
                    <input type="datetime-local" defaultValue="2026-07-10T09:10" className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Worker</label>
                    <input type="text" placeholder="Enter worker name" className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                  </div>
                </div>
              </div>

              {/* Conditional Fields Based on Row/Process */}
              {detailsPopupRow === 1 && (
                <div>
                  <h3 className="font-semibold text-gray-800 text-sm mb-4 pb-2 border-b border-gray-200">Quality Check (Ready Phase)</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Inspection Date</label>
                      <input type="date" className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Inspector Name</label>
                      <input type="text" placeholder="Enter inspector name" className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Equipment Used</label>
                      <input type="text" placeholder="Enter equipment" className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Notes</label>
                      <textarea placeholder="Additional notes" className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 resize-none" rows="2"></textarea>
                    </div>
                  </div>
                </div>
              )}

              {detailsPopupRow === 2 && (
                <>
                  <div>
                    <h3 className="font-semibold text-gray-800 text-sm mb-4 pb-2 border-b border-gray-200">Production Results</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Receive Qty</label>
                        <div className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-50 text-gray-600 font-semibold">50</div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">OK Qty</label>
                        <div className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-50 text-green-600 font-semibold">48</div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">NG Qty</label>
                        <div className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-gray-50 text-red-600 font-semibold">2</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-800 text-sm mb-3 pb-2 border-b border-gray-200">Production Team Details</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead className="bg-gray-100 border-b border-gray-200">
                          <tr>
                            <th className="px-3 py-2 text-left font-semibold">Số Tôt</th>
                            <th className="px-3 py-2 text-left font-semibold">Tên Tổ</th>
                            <th className="px-3 py-2 text-center font-semibold">OK Qty</th>
                            <th className="px-3 py-2 text-center font-semibold">NG Qty</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          <tr className="hover:bg-gray-50">
                            <td className="px-3 py-2">RS_CELL 1</td>
                            <td className="px-3 py-2">BOOTH 1</td>
                            <td className="px-3 py-2 text-center font-semibold">25</td>
                            <td className="px-3 py-2 text-center font-semibold">1</td>
                          </tr>
                          <tr className="hover:bg-gray-50">
                            <td className="px-3 py-2">RS_CELL 2</td>
                            <td className="px-3 py-2">BOOTH 2</td>
                            <td className="px-3 py-2 text-center font-semibold">23</td>
                            <td className="px-3 py-2 text-center font-semibold">1</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-800 text-sm mb-3 pb-2 border-b border-gray-200">NG Details</h3>
                    <div className="space-y-2">
                      <div className="bg-gray-50 rounded p-3 border border-gray-200">
                        <div className="flex justify-between mb-1">
                          <span className="text-xs font-medium text-gray-700">Bridge - Cầu thiếc</span>
                          <span className="text-xs font-bold text-red-600">1 pcs</span>
                        </div>
                        <p className="text-xs text-gray-600">Ghi chú: Linh kiện bị lệch vị trí</p>
                      </div>
                      <div className="bg-gray-50 rounded p-3 border border-gray-200">
                        <div className="flex justify-between mb-1">
                          <span className="text-xs font-medium text-gray-700">Cold Solder - Thiếc lạnh</span>
                          <span className="text-xs font-bold text-red-600">1 pcs</span>
                        </div>
                        <p className="text-xs text-gray-600">Ghi chú: Thiếc lạnh ở chân IC</p>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {detailsPopupRow === 3 && (
                <div>
                  <h3 className="font-semibold text-gray-800 text-sm mb-4 pb-2 border-b border-gray-200">AOI Inspection Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">AOI Machine ID</label>
                      <input type="text" placeholder="Enter machine ID" className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Scan Duration (seconds)</label>
                      <input type="number" placeholder="0" className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Defects Found</label>
                      <input type="number" value="0" className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Pass/Fail</label>
                      <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500">
                        <option>Pass</option>
                        <option>Fail</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-2">
              <button
                onClick={() => setDetailsPopupRow(null)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-400 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => setDetailsPopupRow(null)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Work Order Details Modal */}
      {isWODetailsOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-20 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
              <h2 className="font-semibold text-gray-800 text-lg">Work Order Details</h2>
              <button 
                onClick={() => setIsWODetailsOpen(false)}
                className="text-gray-500 hover:text-gray-700 p-1"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Section 1: Basic Information */}
              <div>
                <h3 className="font-semibold text-gray-800 text-sm mb-4 pb-2 border-b border-gray-200">Basic Information</h3>
                <div className="grid grid-cols-3 gap-6">
                  <div><span className="text-gray-600 text-xs font-medium block mb-1">Level</span><span className="font-semibold text-sm">1</span></div>
                  <div><span className="text-gray-600 text-xs font-medium block mb-1">Lot No</span><span className="font-semibold text-sm">LOT2026070110</span></div>
                  <div><span className="text-gray-600 text-xs font-medium block mb-1">Work Order No</span><span className="font-semibold text-sm">WO2026070001</span></div>
                  <div><span className="text-gray-600 text-xs font-medium block mb-1">Work Order Date</span><span className="font-semibold text-sm">2026-07-10 08:30:00</span></div>
                  <div><span className="text-gray-600 text-xs font-medium block mb-1">Line Req Delivery Date</span><span className="font-semibold text-sm">2026-07-15</span></div>
                  <div><span className="text-gray-600 text-xs font-medium block mb-1">Production Rank</span><span className="font-semibold text-sm">High</span></div>
                  <div><span className="text-gray-600 text-xs font-medium block mb-1">Sales Order No</span><span className="font-semibold text-sm">SO-2026-001</span></div>
                  <div><span className="text-gray-600 text-xs font-medium block mb-1">Routing Type</span><span className="font-semibold text-sm">Standard</span></div>
                  <div><span className="text-gray-600 text-xs font-medium block mb-1">Production Type</span><span className="font-semibold text-sm">Mass</span></div>
                </div>
              </div>

              {/* Section 2: Item & Order Info */}
              <div>
                <h3 className="font-semibold text-gray-800 text-sm mb-4 pb-2 border-b border-gray-200">Item & Order Information</h3>
                <div className="grid grid-cols-3 gap-6">
                  <div><span className="text-gray-600 text-xs font-medium block mb-1">Manufacturing Division</span><span className="font-semibold text-sm">Assembly</span></div>
                  <div><span className="text-gray-600 text-xs font-medium block mb-1">Production Req No</span><span className="font-semibold text-sm">PR-2026-001</span></div>
                  <div><span className="text-gray-600 text-xs font-medium block mb-1">Item Code</span><span className="font-semibold text-sm">PCB001</span></div>
                  <div><span className="text-gray-600 text-xs font-medium block mb-1">Item Name</span><span className="font-semibold text-sm">PCB Assembly Board</span></div>
                  <div><span className="text-gray-600 text-xs font-medium block mb-1">Drawing No</span><span className="font-semibold text-sm">DWG-PCB001-R2</span></div>
                  <div><span className="text-gray-600 text-xs font-medium block mb-1">Drawing DWG URL</span><span className="text-blue-600 text-xs font-semibold hover:underline cursor-pointer">View File</span></div>
                  <div><span className="text-gray-600 text-xs font-medium block mb-1">Type (Large)</span><span className="font-semibold text-sm">Component</span></div>
                  <div><span className="text-gray-600 text-xs font-medium block mb-1">Type (Small)</span><span className="font-semibold text-sm">A1</span></div>
                  <div><span className="text-gray-600 text-xs font-medium block mb-1">Part Type</span><span className="font-semibold text-sm">PCB</span></div>
                </div>
              </div>

              {/* Section 3: Classification & Status */}
              <div>
                <h3 className="font-semibold text-gray-800 text-sm mb-4 pb-2 border-b border-gray-200">Classification & Status</h3>
                <div className="grid grid-cols-3 gap-6">
                  <div><span className="text-gray-600 text-xs font-medium block mb-1">Item Classification</span><span className="font-semibold text-sm">Standard</span></div>
                  <div><span className="text-gray-600 text-xs font-medium block mb-1">OQC Status</span><span className="font-semibold text-sm">Pass</span></div>
                  <div><span className="text-gray-600 text-xs font-medium block mb-1">Status</span><span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-semibold inline-block">Open</span></div>
                </div>
              </div>

              {/* Section 4: Quantity Information */}
              <div>
                <h3 className="font-semibold text-gray-800 text-sm mb-4 pb-2 border-b border-gray-200">Quantity Information</h3>
                <div className="grid grid-cols-4 gap-6">
                  <div><span className="text-gray-600 text-xs font-medium block mb-1">Production Req Qty</span><span className="font-bold text-lg">1,000 EA</span></div>
                  <div><span className="text-gray-600 text-xs font-medium block mb-1">Work Order Qty</span><span className="font-bold text-lg">1,000 EA</span></div>
                  <div><span className="text-gray-600 text-xs font-medium block mb-1">Final Real Quantity</span><span className="font-bold text-lg text-green-600">950 EA</span></div>
                  <div><span className="text-gray-600 text-xs font-medium block mb-1">IQC Qty</span><span className="font-bold text-lg">1,000 EA</span></div>
                  <div><span className="text-gray-600 text-xs font-medium block mb-1">OQC Qty</span><span className="font-bold text-lg">950 EA</span></div>
                  <div><span className="text-gray-600 text-xs font-medium block mb-1">Order Qty</span><span className="font-bold text-lg">1,000 EA</span></div>
                  <div><span className="text-gray-600 text-xs font-medium block mb-1">Para Qty</span><span className="font-bold text-lg">50 EA</span></div>
                </div>
              </div>

              {/* Section 5: Date Information */}
              <div>
                <h3 className="font-semibold text-gray-800 text-sm mb-4 pb-2 border-b border-gray-200">Date Information</h3>
                <div className="grid grid-cols-3 gap-6">
                  <div><span className="text-gray-600 text-xs font-medium block mb-1">Production Completion Date</span><span className="font-semibold text-sm">2026-07-12</span></div>
                  <div><span className="text-gray-600 text-xs font-medium block mb-1">Order Date</span><span className="font-semibold text-sm">2026-07-05</span></div>
                  <div><span className="text-gray-600 text-xs font-medium block mb-1">Finished Prod Req Date</span><span className="font-semibold text-sm">2026-07-15</span></div>
                  <div><span className="text-gray-600 text-xs font-medium block mb-1">IQC Date</span><span className="font-semibold text-sm">2026-07-11</span></div>
                  <div><span className="text-gray-600 text-xs font-medium block mb-1">Created By</span><span className="font-semibold text-sm">Admin</span></div>
                </div>
              </div>

              {/* Section 6: Process & Routing */}
              <div>
                <h3 className="font-semibold text-gray-800 text-sm mb-4 pb-2 border-b border-gray-200">Process & Routing</h3>
                <div className="grid grid-cols-3 gap-6">
                  <div><span className="text-gray-600 text-xs font-medium block mb-1">Current Process</span><span className="font-semibold text-sm">Printing</span></div>
                  <div><span className="text-gray-600 text-xs font-medium block mb-1">Rout No</span><span className="font-semibold text-sm">RT-001</span></div>
                  <div><span className="text-gray-600 text-xs font-medium block mb-1">Inspection No</span><span className="font-semibold text-sm">INS-001</span></div>
                  <div><span className="text-gray-600 text-xs font-medium block mb-1">Inspection YN</span><span className="font-semibold text-sm">Yes</span></div>
                  <div><span className="text-gray-600 text-xs font-medium block mb-1">Req Type</span><span className="font-semibold text-sm">Standard</span></div>
                  <div><span className="text-gray-600 text-xs font-medium block mb-1">Request Material</span><span className="font-semibold text-sm">Yes</span></div>
                </div>
              </div>

              {/* Section 7: Additional Notes */}
              <div>
                <h3 className="font-semibold text-gray-800 text-sm mb-4 pb-2 border-b border-gray-200">Additional Information</h3>
                <div>
                  <span className="text-gray-600 text-xs font-medium block mb-1">Remark</span>
                  <div className="bg-gray-50 p-3 rounded text-sm text-gray-700 min-h-[80px] border border-gray-200">
                    This is a standard PCB assembly order. No special handling required. Please follow standard QC procedures.
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-2">
              <button
                onClick={() => setIsWODetailsOpen(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-400 transition-colors text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
