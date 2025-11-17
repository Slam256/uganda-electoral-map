
import { PanelContainer } from "../shared/PanelContainer";
import { Loader } from "lucide-react";


const LoadingPanel = () => (
  <PanelContainer className="flex items-center gap-4 bg-[#F7F7F7]">
    <div className="flex items-center gap-3">
      <span className="inline-flex items-center justify-center w-10 h-10">
        <Loader className="animate-spin" color="#007AFF" size={32} />
      </span>
      <div>
        <div className="font-semibold text-gray-900 text-base" style={{ color: '#222' }}>
          Loading...
        </div>
        <div className="text-gray-500 text-sm" style={{ color: '#6B7280' }}>
          Fetching data from the database...
        </div>
      </div>
    </div>
  </PanelContainer>
);

export default LoadingPanel;