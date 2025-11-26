import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';

export const useConstituencyStats = (districtId) => {
  const [constituencies, setConstituencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!districtId) {
      setConstituencies([]);
      setLoading(false);
      return;
    }

    const fetchConstituencies = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data, error: queryError } = await supabase
          .from('mv_constituency_voter_stats')
          .select('*')
          .eq('district_id', districtId)
          .order('constituency_name');

        if (queryError) throw queryError;

        setConstituencies(data || []);
      } catch (err) {
        console.error('Error fetching constituency stats:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchConstituencies();
  }, [districtId]);

  return { constituencies, loading, error };
};