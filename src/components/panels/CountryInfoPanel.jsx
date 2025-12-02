/* eslint-disable no-unused-vars */
import { Badge } from "../shared/Badge";
import { CollapseButton } from "../shared/CollapseButton";
import { PanelContainer } from "../shared/PanelContainer";
import { VoterStatisticsCard } from "../shared/VoterStatisticsCard";
import { BadgeInfo, Vote, LandPlot, Lightbulb } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from 'framer-motion';

const TABS = [
  { key: 'about', label: 'About', icon: BadgeInfo },
  { key: 'voter', label: 'Voter data', icon: Vote },
  { key: 'admin', label: 'Admin', icon: LandPlot },
];

const CountryInfoPanel = ({ data, onCollapse }) => {
  const [activeTab, setActiveTab] = useState('about');
  const stats = data.voterStats || {};

  // Tab content renderers
  const renderAbout = () => (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
    >
      {/* Header Row: Name and badge */}
      <div className="flex items-start justify-between mb-2">
        <div>
          <div className="text-xl font-semibold text-gray-900 dark:text-white leading-tight">
            {data.name || 'Uganda'}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            National Overview
          </div>
        </div>
        <div className="flex-shrink-0">
          <Badge type="district" text="Country" />
        </div>
      </div>

      {/* Data rows */}
      <div className="divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-gray-800 rounded-lg">
        <div className="flex items-center justify-between py-3">
          <span className="text-base text-gray-900 dark:text-white">Country code</span>
          <span className="text-base text-gray-500 dark:text-gray-300">
            {data.country_code || 'UGA'}
          </span>
        </div>

        <div className="flex items-center justify-between py-3">
          <span className="text-base text-gray-900 dark:text-white">Population (Census)</span>
          <span className="text-base text-gray-500 dark:text-gray-300">
            {data.population ? data.population.toLocaleString() : '-'}
          </span>
        </div>
        <div className="flex items-center justify-between py-3">
          <span className="text-base text-gray-900 dark:text-white">Area</span>
          <span className="text-base text-gray-500 dark:text-gray-300">241,555 km²</span>
        </div>
      </div>

      {/* Info Message */}
      <PanelContainer noPadding>
        <div className="flex items-center gap-3 p-4">
          <div className="flex-shrink-0">
            <div className="h-10 w-10 rounded-full bg-yellow-400 flex items-center justify-center">
              <Lightbulb className="text-white" size={18} />
            </div>
          </div>
          <div className="leading-tight">
            <div className="font-semibold text-gray-900 dark:text-white">Tip!</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Click on a district, subcounty, or campaign stop to view details
            </div>
          </div>
        </div>
      </PanelContainer>
    </motion.div>
  );

  const renderVoter = () => (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
    >
      <VoterStatisticsCard stats={stats} />
    </motion.div>
  );

  const renderAdmin = () => {
    const districtCount = data.total_districts || 0;
    const constituencyCount = data.total_constituencies || 0;
    const subcountyCount = data.total_subcounties || 0;
    const pollingStationCount = data.total_polling_stations || stats.total_polling_stations || 0;

    return (
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 10 }}
      >
        {/* Administrative Divisions */}
        <div className="divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-gray-800 rounded-lg">
          <div className="flex items-center justify-between py-3">
            <span className="text-base text-gray-900 dark:text-white">Districts</span>
            <span className="text-base text-gray-500 dark:text-gray-300">
              {districtCount.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center justify-between py-3">
            <span className="text-base text-gray-900 dark:text-white">Constituencies</span>
            <span className="text-base text-gray-500 dark:text-gray-300">
              {constituencyCount.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center justify-between py-3">
            <span className="text-base text-gray-900 dark:text-white">Subcounties</span>
            <span className="text-base text-gray-500 dark:text-gray-300">
              {subcountyCount.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center justify-between py-3">
            <span className="text-base text-gray-900 dark:text-white">Polling stations</span>
            <span className="text-base text-gray-500 dark:text-gray-300">
              {pollingStationCount.toLocaleString()}
            </span>
          </div>
        </div>
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
      layoutId="country-panel"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        layout: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 }
      }}
    >
      <PanelContainer
        className="rounded-[12px] flex flex-col overflow-hidden md:h-[400px] max-h-[50vh]"
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
                <motion.span
                  layoutId="tab-underline"
                  className="absolute left-0 right-0 -bottom-1 h-0.5 bg-blue-500 rounded-full"
                />
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

export default CountryInfoPanel;