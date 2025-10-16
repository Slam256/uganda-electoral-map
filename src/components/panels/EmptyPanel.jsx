import { PanelHeader } from "../shared/PanelHeader";
import { PanelContainer } from "../shared/PanelContainer";

const EmptyPanel = ({ onCollapse }) => (
  <PanelContainer>
    <PanelHeader title="Feature Information" onCollapse={onCollapse} />
    <p className="text-gray-500 dark:text-gray-400 italic">
      Click on a district, subcounty, or campaign stop to view details
    </p>
  </PanelContainer>
);

export default EmptyPanel;