import { PanelContainer } from "../shared/PanelContainer";
import { PanelHeader } from "../shared/PanelHeader";

const LoadingPanel = ({ onCollapse }) => (
  <PanelContainer>
    <PanelHeader title="Loading..." onCollapse={onCollapse} />
    <p className="text-gray-500 dark:text-gray-400 italic">
      Fetching data from the database...
    </p>
  </PanelContainer>
);

export default LoadingPanel;