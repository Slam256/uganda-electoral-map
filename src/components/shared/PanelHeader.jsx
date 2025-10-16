import { CollapseButton } from './CollapseButton';
export const PanelHeader = ({ title, onCollapse, isError = false }) => (
  <div className="flex justify-between">
    <h2 className={`text-xl md:text-2xl font-bold ${
      isError 
        ? 'text-red-800 dark:text-red-200' 
        : 'text-gray-800 dark:text-gray-100'
    }`}>
      {title}
    </h2>
    <CollapseButton onClick={onCollapse} />
  </div>
);