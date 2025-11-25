import { ChevronUp, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import Avatar from "../shared/Avatar";
import { getCandidatePhoto } from "../../utils/candidatePhotos";
import EmptyPanel from "./EmptyPanel";

const CollapsedPanel = ({ selectedFeature, dbData, onExpand }) => {
  // Handle campaign stops with special UI
  if (selectedFeature?.layerType === 'campaign-stop') {
    const {
      candidateName,
      candidateShortCode,
      candidateColor,
      stopIndex,
      totalStops,
      stopData
    } = selectedFeature;

    return (
      <motion.button
        onClick={onExpand}
        layoutId="campaign-panel"
        className="w-full bg-white dark:bg-gray-800 rounded-[16px] shadow-lg px-4 py-3 hover:shadow-xl transition-shadow border border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{
          layout: { type: "spring", stiffness: 300, damping: 30 },
          opacity: { duration: 0.2 }
        }}
      >
        <div className="flex items-center gap-3">
          {/* Avatar with party color dot */}
          <Avatar
            src={getCandidatePhoto(candidateName)}
            alt={candidateName}
            fallbackColor={candidateColor}
            statusColor={candidateColor}
            size="md"
          />

          {/* Candidate Info */}
          <div className="flex-1 min-w-0 text-left">
            <div className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
              {candidateName}
              {candidateShortCode && (
                <span className="font-normal text-gray-600 dark:text-gray-400 ml-1">
                  ({candidateShortCode})
                </span>
              )}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {stopIndex} of {totalStops} stops in range
            </div>
            {stopData?.districtName && (
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {stopData.districtName}
              </div>
            )}
          </div>

          {/* Chevron Up Icon */}
          <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
        </div>
      </motion.button>
    );
  }

  if (!selectedFeature) {
    return <EmptyPanel />;
  }
  return (
    <motion.button
      onClick={onExpand}
      layoutId="district-panel"
      className="bg-white dark:bg-gray-800 rounded-[12px] shadow-lg px-4 py-3 hover:shadow-xl transition-shadow border border-gray-200 dark:border-gray-700"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        layout: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 }
      }}
    >
      <div className="flex items-center gap-2">
        <MapPin className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate max-w-[200px]">
          {dbData?.name || 'Loading...'}
        </span>
        <ChevronUp className="w-5 h-5 text-gray-400" />
      </div>
    </motion.button>
  );
};

export default CollapsedPanel;