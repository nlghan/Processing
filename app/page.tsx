'use client';

import React, { useState } from 'react';
import { ChevronDown, Search, Plus, Trash2, X, Settings, ChevronRight } from 'lucide-react';

export default function MESProcessing() {
  const [selectedWO, setSelectedWO] = useState('WO2026070001');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isWODetailsOpen, setIsWODetailsOpen] = useState(false);
  const [selectedProcess, setSelectedProcess] = useState(1);
  const [expandedRow, setExpandedRow] = useState(2);
  const [expandedRowTab, setExpandedRowTab] = useState('team');
  const [detailsPopupRow, setDetailsPopupRow] = useState(null);
  const [productionTeamPopup, setProductionTeamPopup] = useState(false);
  const [selectedProductionTeam, setSelectedProductionTeam] = useState(null);
  const [workerPopup, setWorkerPopup] = useState(false);
  const [equipmentPopup, setEquipmentPopup] = useState(false);
  const [selectedWorkers, setSelectedWorkers] = useState([]);
  const [selectedEquipment, setSelectedEquipment] = useState([]);
  const [ngQty, setNgQty] = useState('');
  const [okQty, setOkQty] = useState('');
  const [notes, setNotes] = useState('');
  
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
    { id: 1, name: 'Ready' },
    { id: 2, name: 'Loading' },
    { id: 3, name: 'AOI' },
    { id: 4, name: 'Drilling' },
    { id: 5, name: 'Plating' },
    { id: 6, name: 'Solder' },
    { id: 7, name: 'Screen' },
    { id: 8, name: 'Inspect' },
    { id: 9, name: 'Pack' },
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
          <button onClick={() => setIsFilterOpen(true)} className="text-gray-600 hover:bg-gray-100 px-3 py-2 rounded flex items-center gap-2 border border-gray-200">
            <Settings size={16} /> Filter
          </button>
          <button className="text-sm text-gray-600 hover:bg-gray-100 px-3 py-2 rounded flex items-center gap-2">
            Admin <ChevronDown size={16} />
          </button>
        </div>
      </div>

      {/* Filter Modal - Collapsible */}
      {isFilterOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-20 z-50 flex items-start justify-end pt-16">
          <div className="bg-white w-96 h-[calc(100vh-64px)] shadow-lg flex flex-col rounded-l-lg">
            {/* Filter Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="font-semibold text-gray-800 text-sm">Filter (5 fields)</h2>
              <button onClick={() => setIsFilterOpen(false)} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>

            {/* Manage Fields Button */}
            <div className="px-4 py-2 border-b border-gray-200">
              <button className="text-blue-600 text-sm font-medium hover:text-blue-700 flex items-center gap-1">
                Manage Fields <ChevronDown size={14} />
              </button>
            </div>

            {/* Filter Fields */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">Status</label>
                <select className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-sm hover:border-gray-400">
                  <option>Pending</option>
                  <option>Active</option>
                  <option>Completed</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">Order From</label>
                <select className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-sm hover:border-gray-400">
                  <option>HQ</option>
                  <option>Branch</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">Order Date</label>
                <input type="date" defaultValue="2026-07-01" className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
                <div className="flex gap-2 mt-2">
                  <span className="text-gray-500 text-sm">-</span>
                  <input type="date" defaultValue="2026-08-01" className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm" />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">Dept</label>
                <input placeholder="Dept" className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">Drawing No</label>
                <input placeholder="Drawing No" className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
              </div>
            </div>

            {/* Close Button */}
            <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
              <button 
                onClick={() => setIsFilterOpen(false)}
                className="w-full bg-gray-300 text-gray-700 px-4 py-2 rounded font-medium hover:bg-gray-400 text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area - Horizontal Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Work Order List */}
        <div className="w-60 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-3 border-b border-gray-200 flex-shrink-0">
            <h3 className="font-semibold text-gray-800 mb-2 text-xs">Work Order List</h3>
            <div className="flex items-center gap-2 bg-gray-50 rounded px-2 py-1">
              <Search size={13} className="text-gray-400" />
              <input placeholder="Search WO No. or Lot No." className="bg-transparent text-xs w-full outline-none" />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto divide-y divide-gray-200">
            {[
              { wo: 'WO2026070001', lot: 'LOT2026070110', item: 'PCB001', status: 'IN PROGRESS' },
              { wo: 'WO2026070002', lot: 'LOT2026070109', item: 'PCB002', status: 'READY' },
              { wo: 'WO2026070003', lot: 'LOT2026070108', item: 'PCB001', status: 'READY' },
              { wo: 'WO2026070004', lot: 'LOT2026070107', item: 'PCB003', status: 'HOLD' },
              { wo: 'WO2026070005', lot: 'LOT2026070106', item: 'PCB002', status: 'DONE' },
              { wo: 'WO2026070006', lot: 'LOT2026070105', item: 'PCB001', status: 'DONE' },
              { wo: 'WO2026070007', lot: 'LOT2026070104', item: 'PCB003', status: 'READY' },
            ].map((item) => (
              <div
                key={item.wo}
                onClick={() => setSelectedWO(item.wo)}
                className={`p-2.5 text-xs cursor-pointer hover:bg-gray-50 transition-colors ${selectedWO === item.wo ? 'bg-blue-50 border-l-2 border-blue-600' : ''}`}
              >
                <div className="font-semibold text-gray-900">{item.wo}</div>
                <div className="text-gray-500 text-xs">{item.lot}</div>
                <div className="flex gap-2 mt-1 items-center">
                  <span className="text-gray-600 text-xs">{item.item}</span>
                  <span className={`px-1.5 py-0.5 rounded text-xs font-semibold whitespace-nowrap ${
                    item.status === 'IN PROGRESS' ? 'bg-blue-100 text-blue-700' :
                    item.status === 'READY' ? 'bg-gray-100 text-gray-700' :
                    item.status === 'HOLD' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-2 border-t border-gray-200 text-xs text-gray-500 flex-shrink-0 bg-gray-50">1 - 7 of 25</div>
        </div>

        {/* Right Content - Enlarged Grid */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
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
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 transform hover:scale-110 relative z-10 ${
                              isCurrent
                                ? 'bg-gradient-to-br from-cyan-400 to-blue-500 text-white shadow-lg border-4 border-white'
                                : isActive
                                ? 'bg-gradient-to-br from-cyan-400 to-blue-500 text-white border-2 border-white'
                                : 'bg-gray-200 text-gray-600 border-2 border-white hover:bg-gray-300'
                            }`}
                            title={`Go to ${process.name}`}
                          >
                            {process.id}
                          </button>
                          {/* Label */}
                          <span className={`text-xs font-medium whitespace-nowrap text-center transition-colors ${
                            isActive ? 'text-blue-600' : 'text-gray-500'
                          }`}>
                            {process.name}
                          </span>
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
                  <button className="border border-gray-300 rounded-full px-2.5 py-1.5 text-xs font-medium hover:bg-gray-50 flex items-center gap-1 transition-colors">
                    <Plus size={13} /> Add
                  </button>
                  <button className="border border-green-300 bg-green-50 text-green-700 rounded-full px-2.5 py-1.5 text-xs font-medium hover:bg-green-100 transition-colors">
                    ✓ Finish
                  </button>
                  <button className="border border-yellow-300 bg-yellow-50 text-yellow-700 rounded-full px-2.5 py-1.5 text-xs font-medium hover:bg-yellow-100 transition-colors">
                    ⚠ Cancel
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
                      <th className="px-3 py-2.5 text-left font-semibold text-gray-700">Seq</th>
                      <th className="px-3 py-2.5 text-left font-semibold text-gray-700">Date</th>
                      <th className="px-3 py-2.5 text-left font-semibold text-gray-700">Lot No.</th>
                      <th className="px-3 py-2.5 text-center font-semibold text-gray-700">Qty</th>
                      <th className="px-3 py-2.5 text-center font-semibold text-gray-700">OK</th>
                      <th className="px-3 py-2.5 text-center font-semibold text-gray-700">NG</th>
                      <th className="px-3 py-2.5 text-left font-semibold text-gray-700">Worker</th>
                      <th className="px-3 py-2.5 text-left font-semibold text-gray-700">Status</th>
                      <th className="px-3 py-2.5 text-right w-12"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {/* Row 1 - Completed */}
                    <tr className="hover:bg-blue-50 transition-colors">
                      <td className="px-3 py-2"><input type="checkbox" className="rounded w-3.5 h-3.5" /></td>
                      <td className="px-3 py-2 font-semibold text-gray-900">1</td>
                      <td className="px-3 py-2 text-gray-700">2026-07-10 08:00</td>
                      <td className="px-3 py-2 text-gray-700">LOT2026071001</td>
                      <td className="px-3 py-2 text-center text-gray-900 font-medium">100</td>
                      <td className="px-3 py-2 text-center text-green-700 font-semibold">100</td>
                      <td className="px-3 py-2 text-center text-gray-600">0</td>
                      <td className="px-3 py-2 text-gray-700">Admin</td>
                      <td className="px-3 py-2"><span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap">✓ Done</span></td>
                      <td className="px-3 py-2 text-right">
                        <button onClick={() => setDetailsPopupRow(1)} className="text-blue-600 hover:text-blue-700 text-xs font-medium hover:underline transition-colors">
                          More
                        </button>
                      </td>
                    </tr>

                    {/* Row 2 - Open (Expandable) */}
                    <tr className={`hover:bg-blue-50 transition-colors cursor-pointer ${expandedRow === 2 ? 'bg-blue-50' : ''}`}>
                      <td className="px-3 py-2"><input type="checkbox" className="rounded w-3.5 h-3.5" checked /></td>
                      <td className="px-3 py-2 font-semibold text-gray-900">2</td>
                      <td className="px-3 py-2 text-gray-700">2026-07-10 09:10</td>
                      <td className="px-3 py-2 text-gray-700">LOT2026071002</td>
                      <td className="px-3 py-2 text-center text-gray-900 font-medium">50</td>
                      <td className="px-3 py-2 text-center text-gray-900 font-medium">48</td>
                      <td className="px-3 py-2 text-center text-red-600 font-semibold">2</td>
                      <td className="px-3 py-2 text-gray-700">Admin</td>
                      <td className="px-3 py-2"><span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap">⚠ Open</span></td>
                      <td className="px-3 py-2 flex justify-end gap-2 items-center">
                        <button onClick={() => setExpandedRow(expandedRow === 2 ? null : 2)} className="text-gray-600 hover:text-blue-600 p-1">
                          <ChevronDown size={16} className={`transition-transform ${expandedRow === 2 ? 'rotate-180' : ''}`} />
                        </button>
                        <button onClick={() => setDetailsPopupRow(2)} className="text-blue-600 hover:text-blue-700 text-xs font-medium hover:underline transition-colors">
                          More
                        </button>
                      </td>
                    </tr>

                    {/* Row 2 Expanded - Tabbed Input Forms */}
                    {expandedRow === 2 && (
                      <tr>
                        <td colSpan={10} className="px-4 py-4 bg-gray-50">
                          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                            {/* Tab Navigation */}
                            <div className="flex border-b border-gray-200 bg-gray-50">
                              <button
                                onClick={() => setExpandedRowTab('team')}
                                className={`flex-1 px-4 py-3 text-xs font-semibold text-center transition-colors ${
                                  expandedRowTab === 'team'
                                    ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                                    : 'text-gray-600 hover:text-gray-800'
                                }`}
                              >
                                Nhập Tổ Sản Xuất
                              </button>
                              <button
                                onClick={() => setExpandedRowTab('ng')}
                                className={`flex-1 px-4 py-3 text-xs font-semibold text-center transition-colors ${
                                  expandedRowTab === 'ng'
                                    ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                                    : 'text-gray-600 hover:text-gray-800'
                                }`}
                              >
                                Nhập NG
                              </button>
                            </div>

                            {/* Tab Content */}
                            <div className="p-4">
                              {/* Production Team Input Tab */}
                              {expandedRowTab === 'team' && (
                                <div className="space-y-4">
                                  {/* Production Team Input */}
                                  <div className="space-y-4">
                                    <div className="flex items-center justify-between mb-4">
                                      <span className="font-semibold text-gray-800 text-xs">Chọn Tổ Sản Xuất</span>
                                      <button onClick={() => setProductionTeamPopup(true)} className="text-blue-600 hover:text-blue-700 text-xs font-medium hover:underline">
                                        Chọn tổ
                                      </button>
                                    </div>
                                    
                                    {/* Basic Info Row */}
                                    <div className="grid grid-cols-4 gap-3">
                                      <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Số Tôt</label>
                                        <input type="text" value={selectedProductionTeam?.code || ''} readOnly className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs bg-gray-50" />
                                      </div>
                                      <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Tên Tổ</label>
                                        <input type="text" value={selectedProductionTeam?.name || ''} readOnly className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs bg-gray-50" />
                                      </div>
                                      <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">OK Qty</label>
                                        <input type="number" value={okQty} onChange={(e) => setOkQty(e.target.value)} placeholder="0" className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs focus:outline-none focus:border-blue-500" />
                                      </div>
                                      <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">NG Qty</label>
                                        <input type="number" value={ngQty} onChange={(e) => setNgQty(e.target.value)} placeholder="0" className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs focus:outline-none focus:border-blue-500" />
                                      </div>
                                    </div>

                                    {/* Notes */}
                                    <div>
                                      <label className="block text-xs font-medium text-gray-700 mb-1">Ghi Chú</label>
                                      <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Nhập ghi chú" className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs focus:outline-none focus:border-blue-500 resize-none" rows="2"></textarea>
                                    </div>

                                    {/* Workers and Equipment Row */}
                                    <div className="grid grid-cols-2 gap-3">
                                      <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Số Lượng Công Nhân</label>
                                        <button onClick={() => setWorkerPopup(true)} className="w-full border border-blue-300 bg-blue-50 text-blue-600 rounded px-2 py-1.5 text-xs font-medium hover:bg-blue-100 transition-colors cursor-pointer text-left">
                                          {selectedWorkers.length > 0 ? `${selectedWorkers.length} công nhân` : 'Chọn công nhân'}
                                        </button>
                                      </div>
                                      <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Số Lượng Máy</label>
                                        <button onClick={() => setEquipmentPopup(true)} className="w-full border border-green-300 bg-green-50 text-green-600 rounded px-2 py-1.5 text-xs font-medium hover:bg-green-100 transition-colors cursor-pointer text-left">
                                          {selectedEquipment.length > 0 ? `${selectedEquipment.length} máy` : 'Chọn máy'}
                                        </button>
                                      </div>
                                    </div>

                                    {/* Selected Items Display */}
                                    {selectedWorkers.length > 0 && (
                                      <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Công Nhân Đã Chọn</label>
                                        <div className="flex flex-wrap gap-2">
                                          {selectedWorkers.map((worker) => (
                                            <div key={worker.id} className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                                              <span>{worker.name}</span>
                                              <button onClick={() => setSelectedWorkers(selectedWorkers.filter(w => w.id !== worker.id))} className="text-blue-700 hover:text-blue-900 font-bold">✕</button>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}

                                    {selectedEquipment.length > 0 && (
                                      <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Máy Đã Chọn</label>
                                        <div className="flex flex-wrap gap-2">
                                          {selectedEquipment.map((equip) => (
                                            <div key={equip.id} className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                                              <span>{equip.name}</span>
                                              <button onClick={() => setSelectedEquipment(selectedEquipment.filter(e => e.id !== equip.id))} className="text-green-700 hover:text-green-900 font-bold">✕</button>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}

                              {/* NG Input Tab */}
                              {expandedRowTab === 'ng' && (
                                <div className="space-y-4">
                                  {/* NG Input */}
                                  <div className="space-y-3">
                                    <table className="w-full text-xs">
                                      <thead className="bg-gray-100 border-b border-gray-200">
                                        <tr>
                                          <th className="px-3 py-2 text-left font-semibold text-gray-700">Loại NG</th>
                                          <th className="px-3 py-2 text-center font-semibold text-gray-700">Số Lượng</th>
                                          <th className="px-3 py-2 text-left font-semibold text-gray-700">Ghi Chú</th>
                                          <th className="px-3 py-2 text-center w-8"></th>
                                        </tr>
                                      </thead>
                                      <tbody className="divide-y divide-gray-200">
                                        <tr className="hover:bg-gray-50">
                                          <td className="px-3 py-2">
                                            <select className="w-full border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:border-blue-500">
                                              <option>Bridge - Cầu thiếc</option>
                                              <option>Scratch - Trầy xước</option>
                                              <option>Cold Solder - Thiếc lạnh</option>
                                            </select>
                                          </td>
                                          <td className="px-3 py-2">
                                            <input type="number" value="1" className="w-full border border-gray-300 rounded px-2 py-1 text-xs text-center focus:outline-none focus:border-blue-500" />
                                          </td>
                                          <td className="px-3 py-2">
                                            <input type="text" placeholder="Ghi chú" className="w-full border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:border-blue-500" />
                                          </td>
                                          <td className="px-3 py-2 text-center">
                                            <button className="text-red-600 hover:text-red-700 text-xs font-semibold">✕</button>
                                          </td>
                                        </tr>
                                        <tr className="hover:bg-gray-50">
                                          <td className="px-3 py-2">
                                            <select className="w-full border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:border-blue-500">
                                              <option>Bridge - Cầu thiếc</option>
                                              <option>Scratch - Trầy xước</option>
                                              <option>Cold Solder - Thiếc lạnh</option>
                                            </select>
                                          </td>
                                          <td className="px-3 py-2">
                                            <input type="number" value="1" className="w-full border border-gray-300 rounded px-2 py-1 text-xs text-center focus:outline-none focus:border-blue-500" />
                                          </td>
                                          <td className="px-3 py-2">
                                            <input type="text" placeholder="Ghi chú" className="w-full border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:border-blue-500" />
                                          </td>
                                          <td className="px-3 py-2 text-center">
                                            <button className="text-red-600 hover:text-red-700 text-xs font-semibold">✕</button>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>
                                  <button className="mt-2 text-blue-600 hover:text-blue-700 text-xs font-medium flex items-center gap-1">
                                    <Plus size={12} /> Thêm NG
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}

                    {/* Row 3 - Draft */}
                    <tr className="hover:bg-blue-50 transition-colors">
                      <td className="px-3 py-2"><input type="checkbox" className="rounded w-3.5 h-3.5" /></td>
                      <td className="px-3 py-2 font-semibold text-gray-900">3</td>
                      <td className="px-3 py-2 text-gray-700">2026-07-10 10:15</td>
                      <td className="px-3 py-2 text-gray-700">LOT2026071003</td>
                      <td className="px-3 py-2 text-center text-gray-900 font-medium">30</td>
                      <td className="px-3 py-2 text-center text-gray-600">-</td>
                      <td className="px-3 py-2 text-center text-gray-600">-</td>
                      <td className="px-3 py-2 text-gray-700">-</td>
                      <td className="px-3 py-2"><span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap">Draft</span></td>
                      <td className="px-3 py-2 text-right">
                        <button onClick={() => setDetailsPopupRow(3)} className="text-blue-600 hover:text-blue-700 text-xs font-medium hover:underline transition-colors">
                          More
                        </button>
                      </td>
                    </tr>

                    {/* Total Row */}
                    <tr className="bg-gray-100 font-semibold border-t-2 border-gray-300">
                      <td colSpan={4} className="px-3 py-2.5 text-gray-900">Total</td>
                      <td className="px-3 py-2.5 text-center text-gray-900">180</td>
                      <td className="px-3 py-2.5 text-center text-green-700">148</td>
                      <td className="px-3 py-2.5 text-center text-red-600">2</td>
                      <td colSpan={3} className="px-3 py-2.5 text-right text-gray-900">01:00</td>
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
      </div>

      {/* Worker Selection Popup */}
      {workerPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-20 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-200 sticky top-0 bg-white">
              <h2 className="font-semibold text-gray-800 text-base">Chọn Công Nhân</h2>
              <button onClick={() => setWorkerPopup(false)} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            <div className="p-5">
              <table className="w-full text-xs">
                <thead className="bg-gray-100 border-b border-gray-200">
                  <tr>
                    <th className="px-3 py-2 text-left font-semibold">Chọn</th>
                    <th className="px-3 py-2 text-left font-semibold">User ID</th>
                    <th className="px-3 py-2 text-left font-semibold">User Name</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {workers.map((worker) => (
                    <tr key={worker.id} className="hover:bg-gray-50">
                      <td className="px-3 py-2">
                        <input 
                          type="checkbox" 
                          checked={selectedWorkers.some(w => w.id === worker.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedWorkers([...selectedWorkers, worker]);
                            } else {
                              setSelectedWorkers(selectedWorkers.filter(w => w.id !== worker.id));
                            }
                          }}
                          className="rounded w-3.5 h-3.5 cursor-pointer"
                        />
                      </td>
                      <td className="px-3 py-2 text-gray-700">{worker.userId}</td>
                      <td className="px-3 py-2 text-gray-700">{worker.name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-5 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-2">
              <button onClick={() => setWorkerPopup(false)} className="bg-gray-300 text-gray-700 px-4 py-2 rounded text-xs font-medium hover:bg-gray-400">
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Equipment Selection Popup */}
      {equipmentPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-20 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-200 sticky top-0 bg-white">
              <h2 className="font-semibold text-gray-800 text-base">Chọn Máy</h2>
              <button onClick={() => setEquipmentPopup(false)} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            <div className="p-5">
              <table className="w-full text-xs">
                <thead className="bg-gray-100 border-b border-gray-200">
                  <tr>
                    <th className="px-3 py-2 text-left font-semibold">Chọn</th>
                    <th className="px-3 py-2 text-left font-semibold">Tên Máy</th>
                    <th className="px-3 py-2 text-left font-semibold">Loại</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {equipment.map((equip) => (
                    <tr key={equip.id} className="hover:bg-gray-50">
                      <td className="px-3 py-2">
                        <input 
                          type="checkbox" 
                          checked={selectedEquipment.some(e => e.id === equip.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedEquipment([...selectedEquipment, equip]);
                            } else {
                              setSelectedEquipment(selectedEquipment.filter(e => e.id !== equip.id));
                            }
                          }}
                          className="rounded w-3.5 h-3.5 cursor-pointer"
                        />
                      </td>
                      <td className="px-3 py-2 text-gray-700">{equip.name}</td>
                      <td className="px-3 py-2 text-gray-700">{equip.type}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-5 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-2">
              <button onClick={() => setEquipmentPopup(false)} className="bg-gray-300 text-gray-700 px-4 py-2 rounded text-xs font-medium hover:bg-gray-400">
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Production Team Selection Popup */}
      {productionTeamPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-20 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-200 sticky top-0 bg-white">
              <h2 className="font-semibold text-gray-800 text-base">Chọn Tổ Sản Xuất</h2>
              <button onClick={() => setProductionTeamPopup(false)} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-2 gap-3">
                {productionTeams.map((team) => (
                  <button
                    key={team.id}
                    onClick={() => {
                      setSelectedProductionTeam(team);
                      setProductionTeamPopup(false);
                    }}
                    className="border border-gray-300 rounded-lg p-4 hover:bg-blue-50 hover:border-blue-300 text-left transition-colors"
                  >
                    <div className="font-semibold text-gray-900 text-sm">{team.name}</div>
                    <div className="text-gray-600 text-xs mt-1">{team.code}</div>
                    <div className="text-gray-500 text-xs mt-1">Công nhân: {team.workers}</div>
                  </button>
                ))}
              </div>
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
                <div>
                  <h3 className="font-semibold text-gray-800 text-sm mb-4 pb-2 border-b border-gray-200">Loading Phase Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Loading Equipment</label>
                      <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500">
                        <option>Select equipment</option>
                        <option>Loading Machine A</option>
                        <option>Loading Machine B</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Loading Time (minutes)</label>
                      <input type="number" placeholder="0" className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Batch Size</label>
                      <input type="number" value="50" className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Operator Comments</label>
                      <textarea placeholder="Comments" className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 resize-none" rows="2"></textarea>
                    </div>
                  </div>
                </div>
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
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
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
              {/* Basic Information Section */}
              <div>
                <h3 className="font-semibold text-gray-800 text-sm mb-4 pb-2 border-b border-gray-200">Basic Information</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <span className="text-gray-600 text-xs font-medium block mb-1">WO No.</span>
                    <span className="font-semibold text-base">WO2026070001</span>
                  </div>
                  <div>
                    <span className="text-gray-600 text-xs font-medium block mb-1">Lot No.</span>
                    <span className="font-semibold text-base">LOT2026070110</span>
                  </div>
                  <div>
                    <span className="text-gray-600 text-xs font-medium block mb-1">Item Code</span>
                    <span className="font-semibold text-base">PCB001</span>
                  </div>
                  <div>
                    <span className="text-gray-600 text-xs font-medium block mb-1">Item Name</span>
                    <span className="font-semibold text-base">PCB BOARD</span>
                  </div>
                  <div>
                    <span className="text-gray-600 text-xs font-medium block mb-1">Due Date</span>
                    <span className="font-semibold text-base">2026-07-10</span>
                  </div>
                </div>
              </div>

              {/* Process Information Section */}
              <div>
                <h3 className="font-semibold text-gray-800 text-sm mb-4 pb-2 border-b border-gray-200">Process Information</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <span className="text-gray-600 text-xs font-medium block mb-1">Current Process</span>
                    <span className="font-semibold text-base">PRT - Printing</span>
                  </div>
                  <div>
                    <span className="text-gray-600 text-xs font-medium block mb-1">Process Name</span>
                    <span className="font-semibold text-base">Printing</span>
                  </div>
                  <div>
                    <span className="text-gray-600 text-xs font-medium block mb-1">Production Line</span>
                    <span className="font-semibold text-base">LJ01 - Line 01</span>
                  </div>
                </div>
              </div>

              {/* Quantity Information Section */}
              <div>
                <h3 className="font-semibold text-gray-800 text-sm mb-4 pb-2 border-b border-gray-200">Quantity Information</h3>
                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <span className="text-gray-600 text-xs font-medium block mb-1">Plan Qty</span>
                    <span className="font-bold text-lg">1,000 EA</span>
                  </div>
                  <div>
                    <span className="text-gray-600 text-xs font-medium block mb-1">Completed</span>
                    <span className="font-bold text-lg text-green-600">650 EA</span>
                  </div>
                  <div>
                    <span className="text-gray-600 text-xs font-medium block mb-1">Remaining</span>
                    <span className="font-bold text-lg text-orange-600">350 EA</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end">
              <button
                onClick={() => setIsWODetailsOpen(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-400 transition-colors"
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
