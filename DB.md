# Supabase Data Fetching Guide for Contributors

Welcome! This guide will help you understand how to fetch data from the Supabase database for this project.

## Table of Contents
1. [Setup](#setup)
2. [Understanding the Database](#understanding-the-database)
3. [Basic Data Fetching](#basic-data-fetching)
4. [Using the Custom Hooks](#using-the-custom-hooks)
5. [Common Query Examples](#common-query-examples)
6. [Troubleshooting](#troubleshooting)

---

## Setup

### Prerequisites
Before you start, make sure you have:
- Node.js installed on your computer
- The project cloned to your local machine
- Access to the environment variables (`.env` file)

### Environment Variables
You'll receive a `.env` file with these variables:

```env
VITE_APP_SUPABASE_URL=your-supabase-url-here
VITE_APP_SUPABASE_ANON_KEY=your-anon-key-here
```

**Important:** 
- Place this `.env` file in the root of your project (same level as `package.json`)
- Never commit this file to Git (it's already in `.gitignore`)
- These credentials are read-only

---

## Understanding the Database

Our database contains information about Uganda's administrative boundaries and political data. Here's what each table contains:

### Core Administrative Tables

#### 1. **districts** 
Contains information about Uganda's districts (the main administrative divisions).

**Key Columns:**
- `id` (uuid) - Unique identifier
- `name` (text) - District name (e.g., "Kampala", "Mukono")
- `name_normalized` (text) - Lowercase version for searching (e.g., "kampala")
- `district_code` (text) - Official district code
- `region` (text) - Which region it belongs to (e.g., "Central", "Western")
- `subregion` (text) - More specific region
- `population` (bigint) - Total population
- `registered_voters_2021` (bigint) - Number of registered voters in 2021
- `centroid_lat` (numeric) - Latitude of district center
- `centroid_lng` (numeric) - Longitude of district center
- `region_id` (uuid) - Links to the `regions` table

**What it's used for:** Displaying district boundaries on the map and showing district statistics.

#### 2. **subcounties**
Smaller administrative units within districts.

**Key Columns:**
- `id` (uuid) - Unique identifier
- `name` (text) - Subcounty name
- `name_normalized` (text) - Lowercase version for searching
- `subcounty_code` (text) - Official subcounty code
- `district_id` (uuid) - Which district this subcounty belongs to
- `county_id` (uuid) - Which county this belongs to
- `population` (bigint) - Population of the subcounty

**What it's used for:** More detailed map layers and localized statistics.

#### 3. **counties**
Administrative level between districts and subcounties.

**Key Columns:**
- `id` (uuid) - Unique identifier
- `name` (text) - County name
- `county_code` (text) - Official code
- `district_id` (uuid) - Parent district
- `name_normalized` (text) - For searching

#### 4. **constituencies**
Electoral constituencies for parliament elections.

**Key Columns:**
- `id` (uuid) - Unique identifier
- `name` (text) - Constituency name
- `constituency_code` (text) - Official code
- `district_id` (uuid) - Parent district

#### 5. **regions**
Top-level regions of Uganda (Central, Eastern, Northern, Western).

**Key Columns:**
- `id` (uuid) - Unique identifier
- `name` (text) - Region name
- `region_code` (text) - Official code

### Political Data Tables

#### 6. **political_parties**
Political parties competing in elections.

**Key Columns:**
- `id` (uuid) - Unique identifier
- `name` (text) - Full party name
- `abbreviation` (text) - Short form (e.g., "NRM", "FDC")
- `color` (text) - Hex color code for visualization
- `logo_url` (text) - URL to party logo

#### 7. **candidates**
Presidential candidates.

**Key Columns:**
- `id` (uuid) - Unique identifier
- `full_name` (text) - Candidate's full name
- `short_code` (text) - Abbreviated name for display
- `party_id` (uuid) - Links to `political_parties`
- `position` (text) - Position running for (default: "President")
- `photo_url` (text) - URL to candidate photo

#### 8. **campaign_schedule**
Campaign stops/tour schedule for candidates.

**Key Columns:**
- `id` (uuid) - Unique identifier
- `candidate_id` (uuid) - Which candidate
- `district_id` (uuid) - Which district they visited
- `campaign_date` (date) - Date of the visit

**What it's used for:** Displaying campaign routes on the map.

#### 9. **parliament_members**
Current and past members of parliament.

**Key Columns:**
- `id` (integer) - Unique identifier
- `name` (text) - MP's name
- `seat_type` (text) - How they represent (constituency, district_woman, special_interest)
- `electoral_area` (text) - Area they represent
- `district_id` (uuid) - District they represent (if applicable)
- `party_id` (uuid) - Political party
- `is_current` (boolean) - Whether they're currently serving

---

## Basic Data Fetching

### Understanding the Supabase Client

In this project, we use the Supabase JavaScript client to fetch data. It's already set up in `src/utils/supabase.js`:

```javascript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_APP_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_APP_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### Basic Query Structure

All queries follow this pattern:

```javascript
import { supabase } from '../utils/supabase';

const { data, error } = await supabase
  .from('table_name')      // Which table to query
  .select('columns')        // Which columns to get
  .eq('column', 'value')    // Filter conditions (optional)
  .single();                // Get single result (optional)
```

Let's break this down:

1. **`from('table_name')`** - Specifies which table you want to query
2. **`select('columns')`** - Specifies which columns you want back
3. **`eq('column', 'value')`** - Adds a filter (equals)
4. **`single()`** - Returns one result instead of an array

### Example 1: Get All Districts

```javascript
const { data, error } = await supabase
  .from('districts')
  .select('id, name, population, registered_voters_2021');

if (error) {
  console.error('Error fetching districts:', error);
} else {
  console.log('Districts:', data);
}
```

**Returns:** Array of all districts with their id, name, population, and voter count.

### Example 2: Get a Specific District by Name

```javascript
const districtName = 'kampala'; // normalized (lowercase)

const { data, error } = await supabase
  .from('districts')
  .select('*')  // * means get all columns
  .eq('name_normalized', districtName)
  .single();    // We expect only one result

if (error) {
  console.error('Error:', error);
} else {
  console.log('District data:', data);
}
```

**Important:** Notice we use `name_normalized` (lowercase) for searching, not `name`. This makes searching more reliable.

### Example 3: Get District with Its Constituencies

This is a "join" - getting data from related tables:

```javascript
const { data, error } = await supabase
  .from('districts')
  .select(`
    id,
    name,
    population,
    constituencies:constituencies(id, name)
  `)
  .eq('name_normalized', 'kampala')
  .single();

console.log(data);
// Returns:
// {
//   id: '...',
//   name: 'Kampala',
//   population: 1680000,
//   constituencies: [
//     { id: '...', name: 'Kampala Central' },
//     { id: '...', name: 'Kampala North' },
//     // ... etc
//   ]
// }
```

**Understanding the syntax:**
- `constituencies:constituencies(id, name)` means: 
  - First `constituencies` is what we'll call this field in the result
  - Second `constituencies` is the table name
  - `(id, name)` are the columns we want from that table

---

## Using the Custom Hooks

The project includes custom React hooks that make data fetching easier. Let's understand how they work.

### useAdminData Hook

Located in `src/hooks/useAdminData.js`, this hook fetches data for districts, subcounties, etc.

**How it works:**

```javascript
import { useAdminData } from '../hooks/useAdminData';

function MyComponent() {
  const { data, loading, error } = useAdminData(
    'districts',          // Table name
    'kampala',           // Identifier (name or code)
    'name'               // How to match: 'name' or 'code'
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data) return <div>No data found</div>;

  return <div>{data.name} has {data.population} people</div>;
}
```

**Under the hood**, it's doing this query:

```javascript
// For districts by name
const { data, error } = await supabase
  .from('districts')
  .select(`
    id, name, region, population, registered_voters_2021, subregion,
    constituencies:constituencies(id, name)
  `)
  .eq('name_normalized', normalizedName)
  .single();
```

### useCampaignRoutes Hook

Located in `src/hooks/useCampaignRoutes.js`, this fetches campaign tour data.

**How it works:**

```javascript
import { useCampaignRoutes } from '../hooks/useCampaignRoutes';

function CampaignMap() {
  const { routes, loading, error } = useCampaignRoutes();

  if (loading) return <div>Loading routes...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {Object.values(routes).map(candidate => (
        <div key={candidate.candidateId}>
          <h3>{candidate.candidateName}</h3>
          <p>{candidate.stops.length} campaign stops</p>
        </div>
      ))}
    </div>
  );
}
```

**Under the hood**, it's doing this query:

```javascript
const { data, error } = await supabase
  .from('campaign_schedule')
  .select(`
    id,
    campaign_date,
    candidate_id,
    district_id,
    candidates (
      id,
      full_name,
      short_code,
      political_parties(
        id,
        name,
        abbreviation,
        color
      )
    ),
    districts (
      id,
      name,
      centroid_lat,
      centroid_lng
    )
  `)
  .order('campaign_date', { ascending: true });
```

It:
1. Gets all campaign schedule entries
2. For each entry, also gets the candidate info
3. For each candidate, also gets their party info
4. And gets the district info with coordinates
5. Orders everything by date

---

## Common Query Examples

### Example 1: Get All Subcounties in a District

```javascript
const districtName = 'wakiso';

const { data, error } = await supabase
  .from('subcounties')
  .select(`
    id,
    name,
    population,
    district:districts(name)
  `)
  .eq('district_id', districtId);  // You'd need to get the district ID first

// Or if you want to search by district name:
const { data: district } = await supabase
  .from('districts')
  .select('id')
  .eq('name_normalized', districtName)
  .single();

const { data: subcounties } = await supabase
  .from('subcounties')
  .select('id, name, population')
  .eq('district_id', district.id);
```

### Example 2: Get All Candidates with Their Parties

```javascript
const { data, error } = await supabase
  .from('candidates')
  .select(`
    id,
    full_name,
    short_code,
    political_parties (
      name,
      abbreviation,
      color
    )
  `);

// Returns:
// [
//   {
//     id: '...',
//     full_name: 'John Doe',
//     short_code: 'JD',
//     political_parties: {
//       name: 'National Resistance Movement',
//       abbreviation: 'NRM',
//       color: '#FFCC00'
//     }
//   },
//   // ... more candidates
// ]
```

### Example 3: Count Campaign Stops per District

```javascript
const { data, error } = await supabase
  .from('campaign_schedule')
  .select('district_id, districts(name)');

// Then group in JavaScript:
const stopsByDistrict = data.reduce((acc, stop) => {
  const districtName = stop.districts.name;
  acc[districtName] = (acc[districtName] || 0) + 1;
  return acc;
}, {});

console.log(stopsByDistrict);
// { 'Kampala': 15, 'Wakiso': 8, ... }
```

### Example 4: Get Current MPs for a District

```javascript
const districtName = 'kampala';

// First get the district ID
const { data: district } = await supabase
  .from('districts')
  .select('id')
  .eq('name_normalized', districtName)
  .single();

// Then get MPs for that district
const { data: mps } = await supabase
  .from('parliament_members')
  .select(`
    name,
    seat_type,
    electoral_area,
    political_parties (
      name,
      abbreviation
    )
  `)
  .eq('district_id', district.id)
  .eq('is_current', true);

console.log(`Current MPs for ${district.name}:`, mps);
```

### Example 5: Search Districts by Partial Name

```javascript
const searchTerm = 'kam';  // User is searching for districts with "kam"

const { data, error } = await supabase
  .from('districts')
  .select('id, name, population')
  .ilike('name', `%${searchTerm}%`)  // ilike = case-insensitive LIKE
  .limit(10);  // Limit to 10 results

// Returns: Kampala, Kamuli, Kamwenge, etc.
```

### Example 6: Get Districts with Most Registered Voters

```javascript
const { data, error } = await supabase
  .from('districts')
  .select('name, registered_voters_2021')
  .order('registered_voters_2021', { ascending: false })  // Highest first
  .limit(5);

console.log('Top 5 districts by voter registration:', data);
```

---

## Query Methods Reference

Here are the most common methods you'll use:

### Selection Methods
- `.select('columns')` - Choose which columns to get
- `.select('*')` - Get all columns

### Filtering Methods
- `.eq('column', value)` - Equals
- `.neq('column', value)` - Not equals
- `.gt('column', value)` - Greater than
- `.gte('column', value)` - Greater than or equal
- `.lt('column', value)` - Less than
- `.lte('column', value)` - Less than or equal
- `.like('column', '%pattern%')` - Pattern matching (case-sensitive)
- `.ilike('column', '%pattern%')` - Pattern matching (case-insensitive)
- `.in('column', [val1, val2])` - Value is in array
- `.is('column', null)` - Is null

### Ordering and Limiting
- `.order('column', { ascending: true })` - Sort results
- `.limit(10)` - Get only 10 results
- `.range(0, 9)` - Get results 0-9 (pagination)

### Result Modifiers
- `.single()` - Return one object instead of array
- `.maybeSingle()` - Return one object or null (no error if not found)

---

## Troubleshooting

### Common Issues and Solutions

#### Issue 1: "Cannot read property of undefined"

**Problem:** You're trying to access data before it's loaded.

**Solution:** Always check if data exists:

```javascript
const { data, loading } = useAdminData('districts', 'kampala', 'name');

if (loading) return <div>Loading...</div>;
if (!data) return <div>No data</div>;

// Now it's safe to use data
return <div>{data.name}</div>;
```

#### Issue 2: "PGRST116" Error (No rows found)

**Problem:** The query didn't find any matching rows, and you used `.single()`.

**Solution:** Use `.maybeSingle()` instead:

```javascript
const { data, error } = await supabase
  .from('districts')
  .select('*')
  .eq('name_normalized', 'nonexistent')
  .maybeSingle();  // Won't error, just returns null

if (!data) {
  console.log('District not found');
}
```

#### Issue 3: Getting Geometry Data

**Problem:** The `geom` columns contain PostGIS geometry data (for map boundaries) which is complex.

**Solution:** For most cases, you don't need to query geometry directly. The map components handle this. But if you need coordinates:

```javascript
// Get district centroids (center points) instead of full geometry
const { data } = await supabase
  .from('districts')
  .select('name, centroid_lat, centroid_lng')
  .eq('name_normalized', 'kampala')
  .single();

console.log(`Kampala center: ${data.centroid_lat}, ${data.centroid_lng}`);
```

#### Issue 4: Joins Not Working

**Problem:** Your related table data isn't showing up.

**Solution:** Make sure you're using the correct foreign key relationship name:

```javascript
// ❌ Wrong - using table name directly
.select('districts')

// ✅ Correct - using foreign key relationship
.select('district:districts(name)')

// The format is: localName:tableName(columns)
```

#### Issue 5: Environment Variables Not Loading

**Problem:** `supabaseUrl` or `supabaseAnonKey` is undefined.

**Solution:**
1. Make sure your `.env` file is in the project root
2. Restart your development server after adding `.env`
3. Check that variable names match exactly: `VITE_APP_SUPABASE_URL` and `VITE_APP_SUPABASE_ANON_KEY`

---

## Best Practices

### 1. Always Handle Loading and Error States

```javascript
const { data, loading, error } = useAdminData(...);

if (loading) return <LoadingSpinner />;
if (error) return <ErrorMessage error={error} />;
if (!data) return <NoDataMessage />;

// Now safely use data
return <DisplayData data={data} />;
```

### 2. Use Normalized Names for Searching

Always search using `name_normalized` fields, not the regular `name` field:

```javascript
// ✅ Good - consistent
.eq('name_normalized', userInput.toLowerCase())

// ❌ Bad - case-sensitive
.eq('name', userInput)
```

### 3. Only Select Columns You Need

Don't use `select('*')` unless you really need everything:

```javascript
// ✅ Good - efficient
.select('id, name, population')

// ❌ Bad - wasteful if you don't need geometry
.select('*')  // Includes large geometry columns
```

### 4. Use Proper Types

The project uses TypeScript. When creating new functions, consider the data types:

```typescript
interface District {
  id: string;
  name: string;
  population: number | null;
  registered_voters_2021: number | null;
}
```

---

## Additional Resources

- [Supabase JavaScript Client Docs](https://supabase.com/docs/reference/javascript/introduction)
- [PostgreSQL SELECT Documentation](https://www.postgresql.org/docs/current/sql-select.html)
- [React Query with Supabase](https://supabase.com/docs/guides/getting-started/tutorials/with-react)

---

## Need Help?

If you're stuck:
1. Check the existing hooks (`useAdminData.js`, `useCampaignRoutes.js`) for examples
2. Look at how components use these hooks

---

**Last Updated:** 2025
**Database Schema Version:** Current as of project setup