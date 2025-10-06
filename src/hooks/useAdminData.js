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
        let result = null;
        let queryError = null;

        // Normalize the identifier if matching by name
        const lookupValue = identifierType === 'name' 
          ? normalizeName(identifier) 
          : identifier;

        switch (adminLevel) {
          case 'districts': {
            const matchField = identifierType === 'name' ? 'name_normalized' : 'district_code';
            
            const { data: districtData, error: err } = await supabase
              .from('districts')
              .select(`id, name, region, population, registered_voters_2021, subregion,
              constituencies:constituencies(id, name)`)
              .eq(matchField, lookupValue)
              .single();
            
            result = districtData;
            queryError = err;
            break;
          }

          case 'subcounties': {
            const matchField = identifierType === 'name' ? 'name_normalized' : 'subcounty_code';
            
            // Query with joins to get district and county names and constituencies
            const { data: subcountyData, error: err } = await supabase
              .from('subcounties')
              .select(`
                name, id, population,
                district:districts(id, name, district_code),
                county:counties(id, name, county_code)
              `)
              .eq(matchField, lookupValue)
              .single();
            
            result = subcountyData;
            queryError = err;
            break;
          }

          case 'counties': {
            const matchField = identifierType === 'name' ? 'name_normalized' : 'county_code';
            
            const { data: countyData, error: err } = await supabase
              .from('counties')
              .select(`
                *,
                district:districts(id, name, district_code)
              `)
              .eq(matchField, lookupValue)
              .single();
            
            result = countyData;
            queryError = err;
            break;
          }

          case 'constituencies': {
            const matchField = identifierType === 'name' ? 'name_normalized' : 'constituency_code';
            
            const { data: constituencyData, error: err } = await supabase
              .from('constituencies')
              .select(`
                *,
                district:districts(id, name, district_code)
              `)
              .eq(matchField, lookupValue)
              .single();
            
            result = constituencyData;
            queryError = err;
            break;
          }

          default:
            throw new Error(`Unknown admin level: ${adminLevel}`);
        }

        if (queryError) {
          // Not finding a match isn't necessarily an error
          if (queryError.code === 'PGRST116') {
            console.log(`No ${adminLevel} record found for: ${identifier}`);
            setData(null);
          } else {
            throw queryError;
          }
        } else {
          console.log(`Fetched ${adminLevel} data:`, result);
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
};
