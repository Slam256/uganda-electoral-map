import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';

export const useMPAspirants = (districtId, options = {}) => {
  const [aspirants, setAspirants] = useState([]);
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
      return;
    }

    setLoading(true);
    setError(null);

    try {
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
          .eq('category', 'DWMP')
          .eq('election_year', electionYear)
          .eq('status', status);

        if (dwmpError) throw dwmpError;
        districtWomanMPs = dwmpData || [];
      }

      let directlyElectedMPs = [];
      if (!category || category === 'DEMP') {
        // Get all constituencies in this district
        const { data: constituencies, error: constError } = await supabase
          .from('constituencies')
          .select('id, name')
          .eq('district_id', districtId);

        if (constError) throw constError;

        if (constituencies && constituencies.length > 0) {
          const constituencyIds = constituencies.map(c => c.id);

          const { data: dempData, error: dempError } = await supabase
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
            .in('constituency_id', constituencyIds)
            .eq('category', 'DEMP')
            .eq('election_year', electionYear)
            .eq('status', status);

          if (dempError) throw dempError;
          directlyElectedMPs = dempData || [];
        }
      }

      // Combine and sort results
      const allAspirants = [...districtWomanMPs, ...directlyElectedMPs];
      
      allAspirants.sort((a, b) => {
        if (a.category !== b.category) {
          return a.category === 'DWMP' ? -1 : 1;
        }
        return a.full_name.localeCompare(b.full_name);
      });

      setAspirants(allAspirants);

    } catch (err) {
      console.error('Error fetching MP aspirants:', err);
      setError(err.message);
      setAspirants([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAspirants();
  }, [districtId, electionYear, category, status]);

  return { 
    aspirants, 
    loading, 
    error, 
    refetch: fetchAspirants 
  };
};

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