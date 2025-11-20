import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';

export const useNationalVoterStats = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data: stats, error: queryError } = await supabase
          .from('mv_national_voter_summary')
          .select('*')
          .single();

        if (queryError) {
          throw queryError;
        }

        setData(stats);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
};