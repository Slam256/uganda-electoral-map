import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../utils/supabase';

/**
 * Hook to fetch and organize campaign routes data with filtering
 *
 * Returns campaign stops grouped by candidate, with date filtering
 * and next stop detection
 */

// Predefined colors for candidates
const CANDIDATE_COLORS = [
  '#FF6B6B',
  '#4ECDC4',
  '#45B7D1',
  '#FFA07A',
  '#98D8C8',
  '#F7DC6F',
  '#BB8FCE',
  '#85C1E2',
  '#F8B739',
  '#52B788',
];

export const useCampaignRoutes = () => {
  const [routes, setRoutes] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter state
  const [filters, setFilters] = useState({
    dateRange: 'all', // 'all' | 'past' | 'upcoming' | 'custom'
    startDate: null,
    endDate: null,
    districts: [], // Array of district IDs or names
  });

  useEffect(() => {
    console.log('📍 useEffect running');
    fetchCampaignRoutes();
  }, []);

  const fetchCampaignRoutes = async () => {
  setLoading(true);
  setError(null);

  try {
    const { data, error: queryError } = await supabase
      .from('campaign_schedule')
      .select(`
        id,
        campaign_date,
        candidate_id,
        district_id,
        candidates (
          id,
          full_name,
          short_code,
          political_parties(
            id,
            name,
            abbreviation,
            color
          )
        ),
        districts (
          id,
          name,
          centroid_lat,
          centroid_lng
        )
      `)
      .order('campaign_date', { ascending: true });

    if (queryError) throw queryError;

    // Filter out any stops without coordinates
    const validStops = data.filter(stop => 
      stop.districts?.centroid_lat && 
      stop.districts?.centroid_lng
    );

    // Group stops by candidate
    const groupedByCandidate = {};
    
    validStops.forEach((stop) => {
      const candidateId = stop.candidate_id;
      
      if (!groupedByCandidate[candidateId]) {
        // First time seeing this candidate - initialize their data
        const colorIndex = Object.keys(groupedByCandidate).length % CANDIDATE_COLORS.length;
        const partyData = stop.candidates?.political_parties;
        const partyColor = partyData?.color;
        const assignedColor = partyColor || CANDIDATE_COLORS[colorIndex];
        
        groupedByCandidate[candidateId] = {
          candidateId: candidateId,
          candidateName: stop.candidates?.full_name || 'Unknown',
          candidateShortCode: stop.candidates?.short_code || 'UNK',
          partyName: partyData?.name || null,
          partyAbbreviation: partyData?.abbreviation || null,
          color: assignedColor,
          stops: [],
          visible: false // Initially not visible
        };
      }

      // Add this stop to the candidate's route
      groupedByCandidate[candidateId].stops.push({
        id: stop.id,
        districtId: stop.district_id,
        districtName: stop.districts?.name || 'Unknown',
        date: stop.campaign_date,
        lat: stop.districts.centroid_lat,
        lng: stop.districts.centroid_lng,
      });
    });

    // Sort each candidate's stops by date (for chronological routes)
    Object.values(groupedByCandidate).forEach(candidate => {
      candidate.stops.sort((a, b) => 
        new Date(a.date) - new Date(b.date)
      );
    });
    
    setRoutes(groupedByCandidate);

  } catch (err) {
    console.error('Error fetching campaign routes:', err);
    setError(err.message);
  } finally {
    setLoading(false);  // This should set loading to false!
  }
};

  // Apply filters to routes
  const filteredRoutes = useMemo(() => {
    if (filters.dateRange === 'all' && filters.districts.length === 0) {
      return routes;
    }

    const filtered = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    Object.entries(routes).forEach(([candidateId, candidate]) => {
      let filteredStops = [...candidate.stops];

      // Apply date filter
      if (filters.dateRange === 'past') {
        filteredStops = filteredStops.filter((stop) => stop.isPast);
      } else if (filters.dateRange === 'upcoming') {
        filteredStops = filteredStops.filter(
          (stop) => stop.isFuture || stop.isToday,
        );
      } else if (
        filters.dateRange === 'custom' &&
        filters.startDate &&
        filters.endDate
      ) {
        const start = new Date(filters.startDate);
        const end = new Date(filters.endDate);
        filteredStops = filteredStops.filter((stop) => {
          const stopDate = new Date(stop.date);
          return stopDate >= start && stopDate <= end;
        });
      }

      // Apply district filter
      if (filters.districts.length > 0) {
        filteredStops = filteredStops.filter(
          (stop) =>
            filters.districts.includes(stop.districtId) ||
            filters.districts.includes(stop.districtName),
        );
      }

      if (filteredStops.length > 0) {
        filtered[candidateId] = {
          ...candidate,
          stops: filteredStops,
        };
      }
    });

    return filtered;
  }, [routes, filters]);

  // Count total filtered stops
  const totalFilteredStops = useMemo(() => {
    return Object.values(filteredRoutes).reduce(
      (sum, candidate) => sum + candidate.stops.length,
      0,
    );
  }, [filteredRoutes]);

  const toggleCandidateVisibility = (candidateId) => {
    setRoutes((prevRoutes) => ({
      ...prevRoutes,
      [candidateId]: {
        ...prevRoutes[candidateId],
        visible: !prevRoutes[candidateId].visible,
      },
    }));
  };

  const showAll = () => {
    setRoutes((prevRoutes) => {
      const updated = {};
      Object.keys(prevRoutes).forEach((id) => {
        updated[id] = { ...prevRoutes[id], visible: true };
      });
      return updated;
    });
  };

  const hideAll = () => {
    setRoutes((prevRoutes) => {
      const updated = {};
      Object.keys(prevRoutes).forEach((id) => {
        updated[id] = { ...prevRoutes[id], visible: false };
      });
      return updated;
    });
  };

  return {
    routes: filteredRoutes,
    allRoutes: routes, // Unfiltered routes for reference
    loading,
    error,
    filters,
    setFilters,
    totalFilteredStops,
    totalStops: Object.values(routes).reduce(
      (sum, c) => sum + c.stops.length,
      0,
    ),
    toggleCandidateVisibility,
    showAll,
    hideAll,
    refetch: fetchCampaignRoutes,
  };
};
