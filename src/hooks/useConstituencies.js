import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';

/**
 * Hook to fetch constituencies for a district with candidate counts
 * @param {string} districtId - UUID of the district
 */
export const useConstituencies = (districtId) => {
  const [constituencies, setConstituencies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!districtId) {
      setConstituencies([]);
      return;
    }

    const fetchConstituencies = async () => {
      setLoading(true);
      setError(null);

      try {
        // Get constituencies for this district
        const { data: constituenciesData, error: queryError } = await supabase
          .from('constituencies')
          .select('id, name, constituency_code')
          .eq('district_id', districtId)
          .order('name', { ascending: true });

        if (queryError) throw queryError;

        // For each constituency, get candidate count
        const constituenciesWithCounts = await Promise.all(
          (constituenciesData || []).map(async (constituency) => {
            const { count, error: countError } = await supabase
              .from('mp_candidates')
              .select('id', { count: 'exact', head: true })
              .eq('constituency_id', constituency.id)
              .eq('category', 'DEMP');

            if (countError) {
              console.error('Error counting candidates:', countError);
              return { ...constituency, candidateCount: 0 };
            }

            return { ...constituency, candidateCount: count || 0 };
          })
        );

        setConstituencies(constituenciesWithCounts);
      } catch (err) {
        console.error('Error fetching constituencies:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchConstituencies();
  }, [districtId]);

  return { constituencies, loading, error };
};