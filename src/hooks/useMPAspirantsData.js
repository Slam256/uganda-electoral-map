import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../utils/supabase';

/**
 * Hook to fetch MP aspirants/candidates by district
 * 
 * @param {string} districtId - UUID of the district to fetch candidates for
 * @param {object} options - Optional filters
 * @param {number} options.electionYear - Filter by election year (default: 2026)
 * @param {string} options.category - Filter by category ('DEMP', 'DWmP', or null for all)
 * @param {string} options.status - Filter by status (default: 'candidate')
 * 
 * @returns {object} { aspirants, constituencies, loading, error, refetch, filterByConstituency }
 */
export const useMPAspirants = (districtId, options = {}) => {
  const [aspirants, setAspirants] = useState([]);
  const [constituencies, setConstituencies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const {
    electionYear = 2026,
    category = null,  // null means fetch both DEMP and DWmP
    status = 'candidate'
  } = options;

  const fetchAspirants = async () => {
    if (!districtId) {
      setAspirants([]);
      setConstituencies([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // First, get all constituencies in this district (for filtering UI)
      const { data: districtConstituencies, error: constError } = await supabase
        .from('constituencies')
        .select('id, name')
        .eq('district_id', districtId)
        .order('name');

      if (constError) throw constError;
      setConstituencies(districtConstituencies || []);

      // Get District Woman MPs (direct district_id match)
      let districtWomanMPs = [];
      if (!category || category === 'DWMP') {
        const { data: dwmpData, error: dwmpError } = await supabase
          .from('mp_candidates')
          .select(`
            id,
            full_name,
            category,
            election_year,
            status,
            constituency_id,
            district_id,
            party:political_parties (
              id,
              name,
              abbreviation,
              color
            ),
            district:districts (
              id,
              name
            )
          `)
          .eq('district_id', districtId)
          .eq('category', 'DWmP')
          .eq('election_year', electionYear)
          .eq('status', status);

        if (dwmpError) throw dwmpError;
        
        // Add a marker for UI - these are district-wide
        districtWomanMPs = (dwmpData || []).map(mp => ({
          ...mp,
          constituency: null,  // DWMP don't have a constituency
          areaName: mp.district?.name + ' District',
          areaType: 'district'
        }));
      }

      // Get Directly Elected MPs (constituency-based)
      let directlyElectedMPs = [];
      if (!category || category === 'DEMP') {
        if (districtConstituencies && districtConstituencies.length > 0) {
          const constituencyIds = districtConstituencies.map(c => c.id);

          const { data: dempData, error: dempError } = await supabase
            .from('mp_candidates')
            .select(`
              id,
              full_name,
              category,
              election_year,
              status,
              constituency_id,
              district_id,
              party:political_parties (
                id,
                name,
                abbreviation,
                color
              ),
              constituency:constituencies (
                id,
                name
              )
            `)
            .in('constituency_id', constituencyIds)
            .eq('category', 'DEMP')
            .eq('election_year', electionYear)
            .eq('status', status);

          if (dempError) throw dempError;
          
          // Add area info for UI consistency
          directlyElectedMPs = (dempData || []).map(mp => ({
            ...mp,
            areaName: mp.constituency?.name,
            areaType: 'constituency'
          }));
        }
      }

      // Combine and sort results
      const allAspirants = [...districtWomanMPs, ...directlyElectedMPs];
      
      // Sort by category first (DWMP first), then by constituency, then by name
      allAspirants.sort((a, b) => {
        // DWMP comes first
        if (a.category !== b.category) {
          return a.category === 'DWMP' ? -1 : 1;
        }
        // Then sort by area name
        if (a.areaName !== b.areaName) {
          return (a.areaName || '').localeCompare(b.areaName || '');
        }
        // Then by name
        return a.full_name.localeCompare(b.full_name);
      });

      setAspirants(allAspirants);

    } catch (err) {
      console.error('Error fetching MP aspirants:', err);
      setError(err.message);
      setAspirants([]);
      setConstituencies([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAspirants();
  }, [districtId, electionYear, category, status]);

  // Helper function to filter aspirants by constituency
  const filterByConstituency = (constituencyId) => {
    if (!constituencyId) return aspirants;
    return aspirants.filter(a => a.constituency_id === constituencyId);
  };

  // Group aspirants by constituency for easy UI rendering
  const aspirantsByConstituency = useMemo(() => {
    const grouped = {
      districtWide: [],  // DWmP candidates
      byConstituency: {} // DEMP candidates grouped by constituency
    };

    aspirants.forEach(aspirant => {
      if (aspirant.category === 'DWMP') {
        grouped.districtWide.push(aspirant);
      } else if (aspirant.constituency_id) {
        const constId = aspirant.constituency_id;
        if (!grouped.byConstituency[constId]) {
          grouped.byConstituency[constId] = {
            constituency: aspirant.constituency,
            aspirants: []
          };
        }
        grouped.byConstituency[constId].aspirants.push(aspirant);
      }
    });

    return grouped;
  }, [aspirants]);

  return { 
    aspirants,
    constituencies,  // List of constituencies in this district (for filter dropdown)
    aspirantsByConstituency,  // Pre-grouped for easy rendering
    loading, 
    error, 
    refetch: fetchAspirants,
    filterByConstituency  // Helper function
  };
};

/**
 * Hook to fetch MP aspirants for a specific constituency
 * 
 * @param {string} constituencyId - UUID of the constituency
 * @param {object} options - Optional filters
 * 
 * @returns {object} { aspirants, loading, error, refetch }
 */
export const useMPAspirantsByConstituency = (constituencyId, options = {}) => {
  const [aspirants, setAspirants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const {
    electionYear = 2026,
    status = 'candidate'
  } = options;

  const fetchAspirants = async () => {
    if (!constituencyId) {
      setAspirants([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: queryError } = await supabase
        .from('mp_candidates')
        .select(`
          id,
          full_name,
          category,
          election_year,
          status,
          party:political_parties (
            id,
            name,
            abbreviation,
            color
          ),
          constituency:constituencies (
            id,
            name
          )
        `)
        .eq('constituency_id', constituencyId)
        .eq('election_year', electionYear)
        .eq('status', status)
        .order('full_name');

      if (queryError) throw queryError;
      
      setAspirants(data || []);

    } catch (err) {
      console.error('Error fetching MP aspirants by constituency:', err);
      setError(err.message);
      setAspirants([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAspirants();
  }, [constituencyId, electionYear, status]);

  return { 
    aspirants, 
    loading, 
    error, 
    refetch: fetchAspirants 
  };
};