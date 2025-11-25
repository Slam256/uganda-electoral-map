import { ChevronUp, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import Avatar from "../shared/Avatar";
import { InfoCard } from "../shared/InfoCard";
import { PanelContainer } from "../shared/PanelContainer";
import { getCandidatePhoto } from "../../utils/candidatePhotos";

const CampaignStopPanel = ({ feature, onCollapse }) => {
  const {
    candidateName,
    candidateShortCode,
    candidateColor,
    partyName,
    partyAbbreviation,
    stopData,
    stopIndex,
    totalStops
  } = feature;

  return (
    <motion.div
      layoutId="campaign-panel"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        layout: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 }
      }}
    >
      <PanelContainer>
        {/* Header Section with Avatar, Name, and Chevron */}
        <div className="flex items-start gap-3 mb-6">
          {/* Avatar with party color dot */}
          <Avatar
            src={getCandidatePhoto(candidateName)}
            alt={candidateName}
            fallbackColor={candidateColor}
            statusColor={candidateColor}
            size="lg"
          />

          {/* Candidate Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {candidateName}
                {candidateShortCode && (
                  <span className="font-normal text-gray-600 dark:text-gray-400 ml-1">
                    ({candidateShortCode})
                  </span>
                )}
              </h2>

              {/* Collapse Button with Chevron */}
              <button
                onClick={onCollapse}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors p-1 flex-shrink-0"
                aria-label="Collapse panel"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>

            {/* Party Name */}
            {partyName && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {partyName} {partyAbbreviation && `(${partyAbbreviation})`}
              </p>
            )}

            {/* Stops Summary */}
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {stopIndex} of {totalStops} stops in range
            </p>
          </div>
        </div>

        {/* Info Cards */}
        <div className="space-y-4">
          <InfoCard label="District" value={stopData.districtName} />
          <InfoCard
            label="Campaign Date"
            value={new Date(stopData.date).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          />
        </div>
      </PanelContainer>
    </motion.div>
  );
};

export default CampaignStopPanel;