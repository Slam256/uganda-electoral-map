import { useState } from 'react';
import { motion } from 'framer-motion';
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Search, ChevronLeft, SlidersHorizontal, User } from 'lucide-react';
import Avatar from '../shared/Avatar';
import emptyStateUrl from '../../assets/candidate photos/empty-state.svg';

const Popover = PopoverPrimitive.Root;
const PopoverTrigger = PopoverPrimitive.Trigger;
const PopoverContent = PopoverPrimitive.Content;
const PopoverArrow = PopoverPrimitive.Arrow;


const MPAspirants = ({ aspirants, constituencies, onBack }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConstituency, setSelectedConstituency] = useState(null);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredAspirants = aspirants
    .filter(aspirant => {
      const nameMatch = aspirant.full_name.toLowerCase().includes(searchQuery.toLowerCase());
      const constituencyMatch = !selectedConstituency || aspirant.constituency_id === selectedConstituency;
      return nameMatch && constituencyMatch;
    })
    .sort((a, b) => {
      // First, sort by category (DWMP first)
      if (a.category !== b.category) {
        return a.category === 'DWMP' ? -1 : 1;
      }
      // Then sort alphabetically by name
      return a.full_name.localeCompare(b.full_name);
    });


  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
    >
      <div className="flex flex-col max-h-[600px] overflow-hidden">
        <div className="flex items-center justify-between mb-4 flex-shrink-0 pt-2 pb-2 -mx-4 md:-mx-6 px-4 md:px-6 bg-white dark:bg-gray-900">
          <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="relative flex-1 mx-2">
            <Search className="absolute w-5 h-5 text-gray-400 left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Type candidate name"
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full py-2 pl-10 pr-4 text-gray-900 dark:text-white bg-gray-100 border border-gray-200 rounded-full dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                <SlidersHorizontal className="w-6 h-6" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-0 bg-white border rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700 z-50">
              <PopoverArrow className="fill-white dark:fill-gray-800" />
              <div className="p-4">
                <h3 className="mb-2 font-semibold text-gray-900 dark:text-white">Filter candidates</h3>
                <div className="flex flex-col">
                  {constituencies.map(constituency => (
                    <button
                      key={constituency.id}
                      onClick={() => setSelectedConstituency(constituency.id)}
                      className={`px-2 py-1 text-left rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 ${selectedConstituency === constituency.id ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
                    >
                      {constituency.name}
                    </button>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <div className="overflow-y-auto h-[500px] md:h-[350px] -mx-4 md:-mx-6 px-4 md:px-6">
          {filteredAspirants.length > 0 ? (
            filteredAspirants.map(aspirant => (
              <div key={aspirant.id} className="flex items-start p-2 mb-2 bg-transparent">
                <Avatar
                  icon={User}
                  fallbackColor={aspirant.party?.color || '#e5e7eb'}
                  statusColor={aspirant.party?.color}
                />
                <div className="ml-3">
                  <div className="font-semibold text-gray-900 dark:text-white">{aspirant.full_name}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{aspirant.party?.abbreviation || 'Independent'}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{aspirant.areaName}</div>
                  {aspirant.category === 'DWMP' && (
                    <div className="text-sm text-gray-500 dark:text-gray-400">District Woman Mp</div>
                  )}
                  {aspirant.category === 'DEMP' && (
                    <div className="text-sm text-gray-500 dark:text-gray-400">Directly Elected MP</div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center h-full">
              <img
                src={emptyStateUrl}
                alt="No candidates found"
                className="w-32 h-32 mb-4 opacity-75"
              />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                We didn't find a match
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-[200px]">
                Try adjusting your search or filters to find what you're looking for.
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default MPAspirants;