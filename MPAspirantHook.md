how to use hook
// Fetch all aspirants for 2026
const { aspirants } = useMPAspirants(districtId);

// Fetch only District Woman MPs
const { aspirants } = useMPAspirants(districtId, { category: 'DWmP' });

// Fetch only Directly Elected MPs
const { aspirants } = useMPAspirants(districtId, { category: 'DEMP' });


import { useMPAspirants } from '../hooks/useMPAspirants';

Returned object. 
{
  id: "uuid",
  full_name: "Betty Nambooze",
  category: "DEMP",           // or "DWmP"
  election_year: 2026,
  status: "candidate",
  party: {
    id: "uuid",
    name: "National Unity Platform",
    abbreviation: "NUP",
    color: "#FF0000"
  },
  constituency: {             // For DEMP
    id: "uuid",
    name: "Mukono Municipality"
  },
  district: {                 // For DWWP
    id: "uuid",
    name: "Mukono"
  }
}