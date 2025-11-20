import { PanelContainer } from "../shared/PanelContainer";
import { Lightbulb } from "lucide-react";

const EmptyPanel = () => (
  <PanelContainer noPadding>
    <div className="flex items-start gap-3 p-4">
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
);

export default EmptyPanel;