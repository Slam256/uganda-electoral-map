import { useState, useEffect, useRef } from "react";
import { useMapSearch } from "../hooks/useMapSearch";
import Chip from "./shared/Chip";

const SearchComponent = ({ mapRef, onFeatureSelect }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState([]);
  const searchInputRef = useRef(null);
  const panelRef = useRef(null);

  const {
    searchQuery,
    setSearchQuery,
    searchResults,
    handleResultSelect
  } = useMapSearch(mapRef);

  // Load recent searches from local storage on mount
  useEffect(() => {
    const stored = localStorage.getItem('recentSearches');
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse recent searches:', e);
      }
    }
  }, []);

  // Save search to recent searches
  const saveRecentSearch = (query) => {
    if (!query || query.length < 2) return;

    setRecentSearches(prev => {
      // Remove if already exists
      const filtered = prev.filter(s => s !== query);
      // Add to beginning, keep max 3
      const updated = [query, ...filtered].slice(0, 3);
      // Save to local storage
      localStorage.setItem('recentSearches', JSON.stringify(updated));
      return updated;
    });
  };

  // Remove a recent search
  const removeRecentSearch = (query) => {
    setRecentSearches(prev => {
      const updated = prev.filter(s => s !== query);
      localStorage.setItem('recentSearches', JSON.stringify(updated));
      return updated;
    });
  };

  useEffect(() => {
    if (isExpanded && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isExpanded]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setIsExpanded(false);
        setSearchQuery('');
        setSelectedIndex(-1);
      }
    };
    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isExpanded, setSearchQuery]);

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!isExpanded) return;

    switch (e.key) {
      case 'Escape':
        setIsExpanded(false);
        setSearchQuery('');
        setSelectedIndex(-1);
        break;

      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev =>
          prev < searchResults.length - 1 ? prev + 1 : prev
        );
        break;

      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;

      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && searchResults[selectedIndex]) {
          handleResultSelect(searchResults[selectedIndex], onFeatureSelect);
          setIsExpanded(false);
          setSelectedIndex(-1);
        }
        break;
    }
  };

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(-1);
  }, [searchResults]);

  const toggleSearch = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      setSearchQuery('');
      setSelectedIndex(-1);
    }
  };

  const handleResultClick = (item) => {
    handleResultSelect(item, onFeatureSelect);
    saveRecentSearch(searchQuery);
    setIsExpanded(false);
    setSelectedIndex(-1);
  };

  // Handle chip click
  const handleChipClick = (query) => {
    setSearchQuery(query);
  };

  // Get the layer type label
  const getLayerLabel = (layerType) => {
    return layerType === 'districts' ? 'District' : 'Subcounty';
  };

  return (
    <div
      ref={panelRef}
      className="absolute top-32 right-2 z-10"
      style={{ marginTop: '10px' }}
    >
      {!isExpanded && (
        <button
          onClick={toggleSearch}
          className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-white dark:bg-gray-800 
                     border border-gray-300 dark:border-gray-600 shadow-md 
                     hover:shadow-lg transition-all duration-200 
                     flex items-center justify-center group"
          aria-label="Search locations"
        >
          <svg
            className="w-5 h-5 md:w-6 md:h-6 text-gray-600 dark:text-gray-300 
                       group-hover:text-gray-800 dark:group-hover:text-gray-100 
                       transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>
      )}

      {/* Expanded Search Panel */}
      {isExpanded && (
        <div
          className="bg-white dark:bg-gray-800 rounded-lg border border-gray-300 
                     dark:border-gray-600 shadow-xl transition-all duration-300 
                     animate-in fade-in slide-in-from-top-2"
          style={{ width: '300px' }}
        >
          {/* Search Input */}
          <div className="relative">
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search districts..."
              className="w-full px-10 py-3 rounded-t-lg border-b border-gray-200 
                         dark:border-gray-700 bg-transparent text-gray-800 
                         dark:text-gray-200 placeholder-gray-500 
                         dark:placeholder-gray-400 focus:outline-none"
            />

            {/* Search Icon in Input */}
            <svg
              className="absolute left-3 top-3.5 w-5 h-5 text-gray-400 dark:text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>

            {/* Clear/Close Button */}
            <button
              onClick={() => {
                setIsExpanded(false);
                setSearchQuery('');
                setSelectedIndex(-1);
              }}
              className="absolute right-2 top-2.5 p-1 rounded hover:bg-gray-100 
                         dark:hover:bg-gray-700 transition-colors"
              aria-label="Close search"
            >
              <svg
                className="w-5 h-5 text-gray-400 hover:text-gray-600 
                           dark:text-gray-500 dark:hover:text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Search Results */}
          {searchQuery.length >= 2 && (
            <div className="max-h-80 overflow-y-auto">
              {searchResults.length > 0 ? (
                <div className="py-2">
                  {searchResults.map((item, index) => (
                    <button
                      key={`${item.layerType}-${item.name}-${index}`}
                      onClick={() => handleResultClick(item)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`w-full px-3 py-2.5 text-left flex items-center 
                                  justify-between transition-colors
                                  ${selectedIndex === index
                          ? 'bg-blue-50 dark:bg-blue-900/30'
                          : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <svg
                          className="w-4 h-4 text-gray-400 dark:text-gray-500 flex-shrink-0"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-gray-800 dark:text-gray-200 truncate">
                          {item.name}
                        </span>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0
                                        ${item.layerType === 'districts'
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                          : 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300'}`}>
                        {getLayerLabel(item.layerType)}
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="px-3 py-4 text-center text-gray-500 dark:text-gray-400 text-sm">
                  No districts found
                </div>
              )}
            </div>
          )}

          {/* Recent Searches and Helper text when no query */}
          {searchQuery.length < 2 && (
            <div className="px-3 py-3">
              {recentSearches.length > 0 && (
                <div className="mb-3">
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">Recent searches</div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((search, index) => (
                      <Chip
                        key={index}
                        label={search}
                        onClick={() => handleChipClick(search)}
                        onRemove={() => removeRecentSearch(search)}
                      />
                    ))}
                  </div>
                </div>
              )}
              <div className="text-center text-gray-400 dark:text-gray-500 text-sm">
                Type at least 2 characters to search
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

}
export default SearchComponent;