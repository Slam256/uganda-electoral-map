/* eslint-disable no-unused-vars */
import { Badge } from "../shared/Badge";
import { CollapseButton } from "../shared/CollapseButton";
import { PanelContainer } from "../shared/PanelContainer";
import { VoterStatisticsCard } from "../shared/VoterStatisticsCard";
import { BadgeInfo, Vote, LandPlot, ChevronRight } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { useMPAspirants } from "../../hooks/useMPAspirantsData";
import MPAspirants from "./MPAspirants";

const TABS = [
  { key: 'about', label: 'About', icon: BadgeInfo },
  { key: 'voter', label: 'Voter data', icon: Vote },
  { key: 'admin', label: 'Admin', icon: LandPlot },
];

const DistrictInfoPanel = ({ data, onCollapse }) => {
  const voterStats = data?.voterStats || {};
  const [activeTab, setActiveTab] = useState('about');
  const [adminView, setAdminView] = useState('main');
  const { aspirants, constituencies, loading, error } = useMPAspirants(data.id);

  // Tab content renderers
  const renderAbout = () => (
    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
      {/* Header Row: Name, region, badge */}
      <div className="flex items-start justify-between mb-2">
        <div>
          <div className="text-xl font-semibold text-gray-900 dark:text-white leading-tight">
            {data.name}
          </div>
          {(data.region || data.subregion) && (
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {data.region && <span>{data.region}</span>}
              {data.region && data.subregion && <span>. </span>}
              {data.subregion && <span>{data.subregion}</span>}
            </div>
          )}
        </div>
        <div className="flex-shrink-0">
          <Badge type="district" text="District" />
        </div>
      </div>

      {/* Data rows */}
      <div className="divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-gray-800 rounded-lg">
        <div className="flex items-center justify-between py-3">
          <span className="text-base text-gray-900 dark:text-white">District code</span>
          <span className="text-base text-gray-500 dark:text-gray-300">{data.district_code || '-'}</span>
        </div>
        <div className="flex items-center justify-between py-3">
          <span className="text-base text-gray-900 dark:text-white">Population (census)</span>
          <span className="text-base text-gray-500 dark:text-gray-300">{data.population ? data.population.toLocaleString() : '-'}</span>
        </div>
        <div className="flex items-center justify-between py-3">
          <span className="text-base text-gray-900 dark:text-white">Area</span>
          <span className="text-base text-gray-500 dark:text-gray-300">{data.area_km2 ? `${data.area_km2.toLocaleString()} km²` : '-'}</span>
        </div>
      </div>
    </motion.div>
  );

  const renderVoter = () => (
    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
      <VoterStatisticsCard stats={voterStats} />
    </motion.div>
  );

  const renderAdmin = () => {
    const constituencyCount = voterStats.constituency_count ?? '-';
    const subcountyCount = voterStats.subcounty_count ?? '-';
    const parishCount = voterStats.parish_count ?? '-';
    const constituenciesData = data.constituencies && data.constituencies.length > 0 ? data.constituencies : [];
    const candidatesCount = aspirants.length > 0 ? aspirants.length : '0';

    if (adminView === 'aspirants') {
      return (
        <MPAspirants
          aspirants={aspirants}
          constituencies={constituencies}
          onBack={() => setAdminView('main')}
        />
      );
    }

    return (
      <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
        {/* Top rows: Constituencies, Sub counties, Parishes */}
        <div className="divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-gray-800 rounded-lg">
          <div className="flex items-center justify-between py-3">
            <span className="text-base text-gray-900 dark:text-white">Constituencies</span>
            <span className="text-base text-gray-500 dark:text-gray-300">{constituencyCount}</span>
          </div>
          <div className="flex items-center justify-between py-3">
            <span className="text-base text-gray-900 dark:text-white">Sub counties</span>
            <span className="text-base text-gray-500 dark:text-gray-300">{subcountyCount}</span>
          </div>
          <div className="flex items-center justify-between py-3">
            <span className="text-base text-gray-900 dark:text-white">Parishes</span>
            <span className="text-base text-gray-500 dark:text-gray-300">{parishCount}</span>
          </div>
          <div
            className="flex items-center justify-between py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
            onClick={() => setAdminView('aspirants')}
          >
            <span className="text-base text-gray-900 dark:text-white">Candidates</span>
            <div className="flex items-center">
              <span className="text-base text-gray-500 dark:text-gray-300 mr-2">{candidatesCount}</span>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Constituencies list */}
        {constituenciesData.length > 0 && (
          <div className="mt-4">
            <div className="flex justify-between text-base font-semibold text-gray-900 dark:text-white mb-2">
              <span>Constituencies</span>
              <span>Code</span>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg divide-y divide-gray-100 dark:divide-gray-800">
              {constituenciesData.map((constituency) => (
                <div key={constituency.id} className="flex items-center justify-between py-3">
                  <span className="text-base text-gray-900 dark:text-white">{constituency.name}</span>
                  <span className="text-base text-gray-500 dark:text-gray-300">{constituency.constituency_code}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    );
  };


  const renderTabContent = () => {
    switch (activeTab) {
      case 'about':
        return renderAbout();
      case 'voter':
        return renderVoter();
      case 'admin':
        return renderAdmin();
      default:
        return null;
    }
  };

  return (
    <motion.div
      layoutId="district-panel"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        layout: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 }
      }}
    >
      <PanelContainer
        className="rounded-[12px] flex flex-col overflow-hidden h-[45vh] md:h-[400px]"
        scrollable={false}
        noPadding={true}
      >
        {/* Tabs - Sticky Header */}
        <div className="flex items-center gap-2 p-4 md:p-6 pb-2 border-b border-gray-200 dark:border-gray-700 flex-shrink-0 bg-white dark:bg-gray-800 z-10">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              className={`flex flex-col items-center px-3 pt-2 pb-1 focus:outline-none transition-colors relative ${activeTab === key
                ? 'text-blue-600 dark:text-blue-400 font-semibold'
                : 'text-gray-500 dark:text-gray-400'
                }`}
              style={{ borderRadius: 12 }}
              onClick={() => setActiveTab(key)}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-xs">{label}</span>
              {activeTab === key && (
                <motion.span layoutId="tab-underline" className="absolute left-0 right-0 -bottom-1 h-0.5 bg-blue-500 rounded-full" />
              )}
            </button>
          ))}
          <div className="flex-1" />
          <CollapseButton onClick={onCollapse} />
        </div>

        {/* Tab Content - Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 pt-2 min-h-0">
          <AnimatePresence mode="wait">
            {renderTabContent()}
          </AnimatePresence>
        </div>
      </PanelContainer>
    </motion.div>
  );
};

export default DistrictInfoPanel;