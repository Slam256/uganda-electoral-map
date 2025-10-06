import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';

const normalizeName = (name) => {
  if (!name) return null;
  return name.toLowerCase().trim().replace(/\s+/g, ' ');
};

export const useAdminData = (adminLevel, identifier, identifierType = 'code') => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!adminLevel || !identifier) {
      setData(null);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Determine which table to query
        let tableName;
        let matchField;

        switch (adminLevel) {
          case 'districts':
            tableName = 'districts';
            matchField = identifierType === 'name' ? 'name_normalized' : 'district_code';
            break;
          case 'subcounties':
            tableName = 'subcounties';
            matchField = identifierType === 'name' ? 'name_normalized' : 'subcounty_code';
            break;
          case 'counties':
            tableName = 'counties';
            matchField = identifierType === 'name' ? 'name_normalized' : 'county_code';
            break;
          case 'constituencies':
            tableName = 'constituencies';
            matchField = identifierType === 'name' ? 'name_normalized' : 'constituency_code';
            break;
          case 'regions':
            tableName = 'regions';
            matchField = identifierType === 'name' ? 'name_normalized' : 'region_code';
            break;
          default:
            throw new Error(`Unknown admin level: ${adminLevel}`);
        }

        // Normalize the identifier if matching by name
        const lookupValue = identifierType === 'name' 
          ? normalizeName(identifier) 
          : identifier;

        // Query Supabase
        const { data: result, error: queryError } = await supabase
          .from(tableName)
          .select('*')
          .eq(matchField, lookupValue)
          .single();

        if (queryError) {
          // Not finding a match isn't necessarily an error
          if (queryError.code === 'PGRST116') {
            console.log(`No ${adminLevel} record found for: ${identifier}`);
            setData(null);
          } else {
            throw queryError;
          }
        } else {
          setData(result);
        }
      } catch (err) {
        console.error('Error fetching admin data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [adminLevel, identifier, identifierType]);

  return { data, loading, error };
}