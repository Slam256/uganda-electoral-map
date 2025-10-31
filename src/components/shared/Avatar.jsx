import { useState } from 'react';

/**
 * Avatar component for displaying candidate photos
 * - Falls back to colored circle if no image is provided
 * - Supports custom fallback colors
 */

const Avatar = ({ 
  src, 
  alt, 
  fallbackColor, 
  size = 'md',
  className = '',
  statusColor 
}) => {
  const [imageError, setImageError] = useState(false);

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const sizeClass = sizeClasses[size] || sizeClasses.md;

  // Status dot size based on avatar size
  const statusDotSizes = {
    sm: 'w-2.5 h-2.5 border-[2px]',
    md: 'w-3 h-3 border-2',
    lg: 'w-3.5 h-3.5 border-2',
    xl: 'w-4 h-4 border-[3px]'
  };

  const statusDotClass = statusDotSizes[size] || statusDotSizes.md;

  // Show fallback only if no src or image failed to load
  const showFallback = !src || imageError;

  return (
    <div className="relative inline-block">
      <div 
        className={`${sizeClass} rounded-full flex-shrink-0 border-2 border-white dark:border-gray-800 shadow-sm overflow-hidden relative ${className}`}
      >
        {src && !imageError && (
          <img
            src={src}
            alt={alt || ''}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover"
          />
        )}
        
        {showFallback && fallbackColor && (
          <div 
            className="w-full h-full absolute inset-0"
            style={{ backgroundColor: fallbackColor }}
          />
        )}
      </div>
      
      {/* Party color dot at bottom-right */}
      {statusColor && (
        <div 
          className={`${statusDotClass} absolute bottom-0 right-0 rounded-full border-white dark:border-gray-800 shadow-sm`}
          style={{ backgroundColor: statusColor }}
        />
      )}
    </div>
  );
};

export default Avatar;

