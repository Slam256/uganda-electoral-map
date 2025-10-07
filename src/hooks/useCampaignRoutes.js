import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';

/**
 * Hook to fetch and organize campaign routes data
 * 
 * Returns campaign stops grouped by candidate, with coordinates
 * and sorted chronologically for route visualization
 */

const CANDIDATE_COLORS = [
  '#FF6B6B', // Red
  '#4ECDC4', // Teal
  '#45B7D1', // Blue
  '#FFA07A', // Light Salmon
  '#98D8C8', // Mint
  '#F7DC6F', // Yellow
  '#BB8FCE', // Purple
  '#85C1E2', // Sky Blue
  '#F8B739', // Orange
  '#52B788', // Green
];

export const useCampaignRoutes = () => {
  const [routes, setRoutes] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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

      console.log(`Loaded ${validStops.length} campaign stops with coordinates`);

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
            visible: false // Initially visible
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

      console.log(`Found ${Object.keys(groupedByCandidate).length} candidates with routes`);
      
      setRoutes(groupedByCandidate);

    } catch (err) {
      console.error('Error fetching campaign routes:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Toggle visibility of a specific candidate's route
  const toggleCandidateVisibility = (candidateId) => {
    setRoutes(prevRoutes => ({
      ...prevRoutes,
      [candidateId]: {
        ...prevRoutes[candidateId],
        visible: !prevRoutes[candidateId].visible
      }
    }));
  };

  // Show all candidates
  const showAll = () => {
    setRoutes(prevRoutes => {
      const updated = {};
      Object.keys(prevRoutes).forEach(id => {
        updated[id] = { ...prevRoutes[id], visible: true };
      });
      return updated;
    });
  };

  // Hide all candidates
  const hideAll = () => {
    setRoutes(prevRoutes => {
      const updated = {};
      Object.keys(prevRoutes).forEach(id => {
        updated[id] = { ...prevRoutes[id], visible: false };
      });
      return updated;
    });
  };

  return {
    routes,
    loading,
    error,
    toggleCandidateVisibility,
    showAll,
    hideAll,
    refetch: fetchCampaignRoutes
  };
};
