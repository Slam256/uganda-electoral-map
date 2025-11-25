import { X } from 'lucide-react';

/**
 * Chip Component
 * Displays a pill-shaped chip with optional remove button
 */
const Chip = ({ label, onClick, onRemove }) => {
    return (
        <div
            className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-gray-700 
                 text-gray-700 dark:text-gray-300 rounded-full text-sm 
                 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-pointer"
            onClick={onClick}
        >
            <span>{label}</span>
            {onRemove && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onRemove();
                    }}
                    className="ml-1 hover:bg-gray-300 dark:hover:bg-gray-500 rounded-full p-0.5 transition-colors"
                    aria-label={`Remove ${label}`}
                >
                    <X className="w-3 h-3" />
                </button>
            )}
        </div>
    );
};

export default Chip;
