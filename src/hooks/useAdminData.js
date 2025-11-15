import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';

const normalizeName = (name) => {
  if (!name) return null;
  return name.toLowerCase().trim().replace(/\s+/g, ' ');
};

export const useAdminData = (adminLevel, identifier, identifierType = 'code') => {
  const [data, setData] = useState(null);
  const [voterStats, setVoterStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!adminLevel || !identifier) {
      setData(null);
      setVoterStats(null);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        let result = null;
        let statsResult = null;
        let queryError = null;

        // Normalize the identifier if matching by name
        const lookupValue = identifierType === 'name' 
          ? normalizeName(identifier) 
          : identifier;

        switch (adminLevel) {
          case 'districts': {
            const matchField = identifierType === 'name' ? 'name_normalized' : 'district_code';
            
            // Fetch basic district data with constituencies
            const { data: districtData, error: err } = await supabase
              .from('districts')
              .select(`
                id, name, district_code, region, population, 
                registered_voters_2021, subregion, area_km2,
                constituencies:constituencies(id, name, constituency_code)
              `)
              .eq(matchField, lookupValue)
              .single();
            
            result = districtData;
            queryError = err;

            // Fetch voter statistics from materialized view
            if (districtData?.id) {
              const { data: stats, error: statsError } = await supabase
                .from('mv_district_voter_stats')
                .select('*')
                .eq('district_id', districtData.id)
                .single();
              
              statsResult = stats;
              if (statsError && statsError.code !== 'PGRST116') {
                console.error('Error fetching district voter stats:', statsError);
              }
            }
            break;
          }

          case 'subcounties': {
            const matchField = identifierType === 'name' ? 'name_normalized' : 'subcounty_code';
            
            // Fetch basic subcounty data with relationships
            const { data: subcountyData, error: err } = await supabase
              .from('subcounties')
              .select(`
                id, name, subcounty_code, population,
                district:districts(id, name, district_code),
                county:counties(id, name, county_code)
              `)
              .eq(matchField, lookupValue)
              .single();
            
            result = subcountyData;
            queryError = err;

            // Fetch voter statistics from materialized view
            if (subcountyData?.id) {
              const { data: stats, error: statsError } = await supabase
                .from('mv_subcounty_voter_stats')
                .select('*')
                .eq('subcounty_id', subcountyData.id)
                .single();
              
              statsResult = stats;
              if (statsError && statsError.code !== 'PGRST116') {
                console.error('Error fetching subcounty voter stats:', statsError);
              }
            }
            break;
          }

          case 'parishes': {
            const matchField = identifierType === 'name' ? 'name_normalized' : 'parish_code';
            
            // Fetch basic parish data
            const { data: parishData, error: err } = await supabase
              .from('parishes')
              .select(`
                id, name, parish_code,
                subcounty:subcounties(id, name),
                constituency:constituencies(id, name)
              `)
              .eq(matchField, lookupValue)
              .single();
            
            result = parishData;
            queryError = err;

            // Fetch voter statistics from materialized view
            if (parishData?.id) {
              const { data: stats, error: statsError } = await supabase
                .from('mv_parish_voter_stats')
                .select('*')
                .eq('parish_id', parishData.id)
                .single();
              
              statsResult = stats;
              if (statsError && statsError.code !== 'PGRST116') {
                console.error('Error fetching parish voter stats:', statsError);
              }
            }
            break;
          }

          case 'constituencies': {
            const matchField = identifierType === 'name' ? 'name_normalized' : 'constituency_code';
            
            // Fetch basic constituency data
            const { data: constituencyData, error: err } = await supabase
              .from('constituencies')
              .select(`
                id, name, constituency_code,
                district:districts(id, name, district_code)
              `)
              .eq(matchField, lookupValue)
              .single();
            
            result = constituencyData;
            queryError = err;

            // Fetch voter statistics from materialized view
            if (constituencyData?.id) {
              const { data: stats, error: statsError } = await supabase
                .from('mv_constituency_voter_stats')
                .select('*')
                .eq('constituency_id', constituencyData.id)
                .single();
              
              statsResult = stats;
              if (statsError && statsError.code !== 'PGRST116') {
                console.error('Error fetching constituency voter stats:', statsError);
              }
            }
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

          default:
            throw new Error(`Unknown admin level: ${adminLevel}`);
        }

        if (queryError) {
          // Not finding a match isn't necessarily an error
          if (queryError.code === 'PGRST116') {
            setData(null);
            setVoterStats(null);
          } else {
            throw queryError;
          }
        } else {
          // Merge basic data with voter statistics
          const mergedData = {
            ...result,
            voterStats: statsResult
          };
          setData(mergedData);
          setVoterStats(statsResult);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [adminLevel, identifier, identifierType]);

  return { data, voterStats, loading, error };
};
