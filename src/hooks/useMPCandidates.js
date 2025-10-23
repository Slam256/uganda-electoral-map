import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';

/**
 * Hook to fetch MP candidates for a district or constituency
 * @param {string} type - 'district' or 'constituency'
 * @param {string} id - UUID of district or constituency
 * @param {string} category - 'DEMP' or 'DWMP' or null for both
 */

export const useMPCandidates = (type, id, category = null) => {
  const [candidates, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!type || !id) {
      setData([]);
      return;
    }
    const fetchCandidates = async () => {
      setLoading(true);
      setError(null);

      try {
        let query = supabase
          .from('mp_candidates')
          .select(`
            id,
            full_name,
            ballot_symbol,
            category,
            constituency_id,
            district_id,
            political_parties!party_id (
              id,
              name,
              abbreviation,
              color
            )
          `)
          .order('full_name', { ascending: true });
        if (type === 'district') {
          query = query.eq('district_id', id);
        } else if (type === 'constituency') {
          query = query.eq('constituency_id', id);
        }
        if (category) {
          query = query.eq('category', category);
        }

        const res = await query;
        console.log('Fetched MP candidates:', res);
          const { data: result, error: queryError } = res;


        if (queryError) throw queryError;

        setData(result || []);
      } catch (err) {
        console.error('Error fetching MP candidates:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, [type, id, category]);

  return { candidates, loading, error };
};