how to use hook
// Fetch all aspirants for 2026
const { aspirants } = useMPAspirants(districtId);

// Fetch only District Woman MPs
const { aspirants } = useMPAspirants(districtId, { category: 'DWmP' });

// Fetch only Directly Elected MPs
const { aspirants } = useMPAspirants(districtId, { category: 'DEMP' });


import { useMPAspirants } from '../hooks/useMPAspirants';
