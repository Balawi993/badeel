import React from 'react';
import { SPECIALTIES, SPECIALTY_ICONS, REGIONS } from '../lib/constants';

export const FilterBar = ({ filters, setFilters }) => {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4 mb-2 bg-white p-2.5 md:p-3.5 md:px-5 rounded-2xl shadow-ios border border-gray-100">
            {/* Specialties Chips (Horizontal Scroll) */}
            <div className="flex overflow-x-auto hide-scrollbar gap-1.5 pb-0.5 md:pb-0 flex-1 w-full md:w-auto">
                <button
                    onClick={() => setFilters(prev => ({ ...prev, specialty: '' }))}
                    className={`whitespace-nowrap px-2 py-1 rounded-[8px] text-[11px] font-medium transition-all flex items-center gap-1 ${
                        filters.specialty === '' 
                        ? 'bg-gray-800 text-white shadow-sm' 
                        : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                    }`}
                >
                    <div className="icon-layout-grid text-[11px]"></div>
                    الكل
                </button>
                {SPECIALTIES.map(spec => (
                    <button
                        key={spec}
                        onClick={() => setFilters(prev => ({ ...prev, specialty: spec }))}
                        className={`whitespace-nowrap px-2 py-1 rounded-[8px] text-[11px] font-medium transition-all flex items-center gap-1 ${
                            filters.specialty === spec 
                            ? 'bg-primary text-white shadow-sm' 
                            : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                        }`}
                    >
                        <div className={`${SPECIALTY_ICONS[spec]} text-[11px]`}></div>
                        {spec}
                    </button>
                ))}
            </div>

            {/* Region Dropdowns */}
            <div className="grid grid-cols-2 md:flex md:w-auto gap-2 md:gap-3 mt-0.5 md:mt-0 shrink-0">
                <div className="relative md:w-40">
                    <select
                        className="w-full bg-gray-50 border border-transparent hover:border-gray-200 focus:bg-white text-gray-700 text-[12px] rounded-xl focus:ring-primary focus:border-primary block p-2 transition-all appearance-none outline-none pr-8"
                        value={filters.currentRegion}
                        onChange={(e) => setFilters(prev => ({ ...prev, currentRegion: e.target.value }))}
                    >
                        <option value="">من منطقة...</option>
                        {REGIONS.map(region => (
                            <option key={`curr-${region}`} value={region}>{region}</option>
                        ))}
                    </select>
                    <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none text-gray-400">
                        <div className="icon-map-pin text-xs"></div>
                    </div>
                </div>

                <div className="relative md:w-40">
                    <select
                        className="w-full bg-gray-50 border border-transparent hover:border-gray-200 focus:bg-white text-gray-700 text-[12px] rounded-xl focus:ring-primary focus:border-primary block p-2 transition-all appearance-none outline-none pr-8"
                        value={filters.desiredRegion}
                        onChange={(e) => setFilters(prev => ({ ...prev, desiredRegion: e.target.value }))}
                    >
                        <option value="">إلى منطقة...</option>
                        {REGIONS.map(region => (
                            <option key={`des-${region}`} value={region}>{region}</option>
                        ))}
                    </select>
                    <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none text-gray-400">
                        <div className="icon-arrow-left text-xs"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};
