import { PanelContainer } from "../shared/PanelContainer";
import { PanelHeader } from "../shared/PanelHeader";

const ErrorPanel = ({ error, onCollapse }) => (
  <PanelContainer>
    <PanelHeader 
      title={error === "No information available for this feature" ? "No Data" : "Error"} 
      onCollapse={onCollapse} 
      isError={true}
    />
    <p className="text-red-600 dark:text-red-400">
      {error}
    </p>
  </PanelContainer>
);

export default ErrorPanel;