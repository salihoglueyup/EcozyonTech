
// Ecozyon Tech — fictional but consistent city dataset for the impact map
// Each entry: lat, lon, country, users (active wearables), co2 (kg saved/day),
// solar (% solar contribution), partner (HQ/pilot partner?), since (joined year)

export const CITIES = [
    // Turkey / nearby
    { name: "İstanbul",    country: "TR", lat: 41.01, lon: 28.97, users: 1840, co2: 412, solar: 38, partner: true,  since: 2024 },
    { name: "Ankara",      country: "TR", lat: 39.93, lon: 32.86, users: 384,  co2: 86,  solar: 35, partner: false, since: 2024 },
    { name: "İzmir",       country: "TR", lat: 38.42, lon: 27.13, users: 287,  co2: 64,  solar: 48, partner: false, since: 2024 },
    { name: "Tel Aviv",    country: "IL", lat: 32.07, lon: 34.78, users: 142,  co2: 38,  solar: 56, partner: false, since: 2025 },

    // Europe
    { name: "Berlin",      country: "DE", lat: 52.52, lon: 13.40, users: 412,  co2: 96,  solar: 24, partner: true,  since: 2024 },
    { name: "Amsterdam",   country: "NL", lat: 52.37, lon:  4.89, users: 231,  co2: 52,  solar: 19, partner: false, since: 2024 },
    { name: "London",      country: "UK", lat: 51.50, lon: -0.12, users: 387,  co2: 84,  solar: 15, partner: false, since: 2024 },
    { name: "Paris",       country: "FR", lat: 48.85, lon:  2.35, users: 298,  co2: 62,  solar: 14, partner: false, since: 2025 },
    { name: "Madrid",      country: "ES", lat: 40.42, lon: -3.70, users: 142,  co2: 31,  solar: 42, partner: false, since: 2025 },
    { name: "Barcelona",   country: "ES", lat: 41.38, lon:  2.17, users: 128,  co2: 28,  solar: 44, partner: false, since: 2025 },
    { name: "Rome",        country: "IT", lat: 41.90, lon: 12.50, users: 121,  co2: 26,  solar: 32, partner: false, since: 2025 },
    { name: "Lisbon",      country: "PT", lat: 38.72, lon: -9.14, users: 89,   co2: 22,  solar: 49, partner: false, since: 2025 },
    { name: "Stockholm",   country: "SE", lat: 59.33, lon: 18.07, users: 164,  co2: 38,  solar: 9,  partner: false, since: 2025 },
    { name: "Copenhagen",  country: "DK", lat: 55.68, lon: 12.57, users: 178,  co2: 42,  solar: 8,  partner: true,  since: 2024 },
    { name: "Oslo",        country: "NO", lat: 59.91, lon: 10.75, users: 92,   co2: 24,  solar: 5,  partner: false, since: 2026 },
    { name: "Helsinki",    country: "FI", lat: 60.17, lon: 24.94, users: 74,   co2: 18,  solar: 6,  partner: false, since: 2026 },
    { name: "Warsaw",      country: "PL", lat: 52.23, lon: 21.01, users: 86,   co2: 19,  solar: 11, partner: false, since: 2026 },

    // Americas
    { name: "New York",    country: "US", lat: 40.71, lon: -74.01, users: 548,  co2: 121, solar: 18, partner: true,  since: 2024 },
    { name: "San Francisco",country: "US",lat: 37.77, lon: -122.42,users: 412,  co2: 96,  solar: 41, partner: false, since: 2024 },
    { name: "Los Angeles", country: "US", lat: 34.05, lon: -118.24,users: 298,  co2: 72,  solar: 38, partner: false, since: 2025 },
    { name: "Toronto",     country: "CA", lat: 43.65, lon: -79.38, users: 167,  co2: 38,  solar: 16, partner: false, since: 2025 },
    { name: "Vancouver",   country: "CA", lat: 49.28, lon: -123.12,users: 124,  co2: 28,  solar: 12, partner: false, since: 2025 },
    { name: "Mexico City", country: "MX", lat: 19.43, lon: -99.13, users: 123,  co2: 32,  solar: 28, partner: false, since: 2025 },
    { name: "São Paulo",   country: "BR", lat: -23.55,lon: -46.63, users: 189,  co2: 48,  solar: 44, partner: false, since: 2025 },
    { name: "Buenos Aires",country: "AR", lat: -34.61,lon: -58.38, users: 78,   co2: 19,  solar: 31, partner: false, since: 2026 },
    { name: "Bogotá",      country: "CO", lat:   4.71,lon: -74.07, users: 54,   co2: 14,  solar: 22, partner: false, since: 2026 },
    { name: "Lima",        country: "PE", lat: -12.05,lon: -77.04, users: 32,   co2:  8,  solar: 18, partner: false, since: 2026 },

    // Africa / Middle East
    { name: "Cape Town",   country: "ZA", lat: -33.92,lon:  18.42, users: 98,   co2: 24,  solar: 52, partner: false, since: 2025 },
    { name: "Lagos",       country: "NG", lat:   6.52,lon:  3.38,  users: 45,   co2: 11,  solar: 32, partner: false, since: 2026 },
    { name: "Nairobi",     country: "KE", lat:  -1.29,lon: 36.82,  users: 38,   co2:  9,  solar: 46, partner: false, since: 2026 },
    { name: "Cairo",       country: "EG", lat:  30.04,lon: 31.24,  users: 76,   co2: 18,  solar: 41, partner: false, since: 2025 },
    { name: "Dubai",       country: "AE", lat:  25.20,lon: 55.27,  users: 308,  co2: 68,  solar: 47, partner: true,  since: 2024 },

    // Asia / Pacific
    { name: "Mumbai",      country: "IN", lat: 19.08, lon: 72.88,  users: 245,  co2: 58,  solar: 33, partner: false, since: 2025 },
    { name: "Bangalore",   country: "IN", lat: 12.97, lon: 77.59,  users: 178,  co2: 42,  solar: 36, partner: false, since: 2025 },
    { name: "Delhi",       country: "IN", lat: 28.61, lon: 77.21,  users: 142,  co2: 36,  solar: 35, partner: false, since: 2026 },
    { name: "Singapore",   country: "SG", lat:  1.35, lon: 103.82, users: 308,  co2: 72,  solar: 23, partner: true,  since: 2024 },
    { name: "Bangkok",     country: "TH", lat: 13.76, lon: 100.50, users: 89,   co2: 21,  solar: 28, partner: false, since: 2026 },
    { name: "Hong Kong",   country: "HK", lat: 22.32, lon: 114.17, users: 215,  co2: 48,  solar: 14, partner: false, since: 2025 },
    { name: "Tokyo",       country: "JP", lat: 35.68, lon: 139.65, users: 412,  co2: 92,  solar: 17, partner: false, since: 2024 },
    { name: "Seoul",       country: "KR", lat: 37.57, lon: 126.98, users: 267,  co2: 61,  solar: 14, partner: false, since: 2025 },
    { name: "Sydney",      country: "AU", lat: -33.87,lon: 151.21, users: 189,  co2: 48,  solar: 38, partner: false, since: 2025 },
    { name: "Melbourne",   country: "AU", lat: -37.81,lon: 144.96, users: 134,  co2: 32,  solar: 36, partner: false, since: 2025 },
    { name: "Auckland",    country: "NZ", lat: -36.85,lon: 174.76, users: 67,   co2: 16,  solar: 25, partner: false, since: 2026 },

    // Expansion wave (E4) — denser coverage
    { name: "Munich",      country: "DE", lat: 48.14, lon: 11.58,  users: 196,  co2: 44,  solar: 26, partner: false, since: 2025 },
    { name: "Zurich",      country: "CH", lat: 47.38, lon:  8.54,  users: 158,  co2: 35,  solar: 21, partner: true,  since: 2025 },
    { name: "Vienna",      country: "AT", lat: 48.21, lon: 16.37,  users: 132,  co2: 29,  solar: 23, partner: false, since: 2026 },
    { name: "Dublin",      country: "IE", lat: 53.35, lon: -6.26,  users: 117,  co2: 26,  solar: 12, partner: false, since: 2026 },
    { name: "Athens",      country: "GR", lat: 37.98, lon: 23.73,  users: 71,   co2: 17,  solar: 51, partner: false, since: 2026 },
    { name: "Prague",      country: "CZ", lat: 50.08, lon: 14.44,  users: 84,   co2: 19,  solar: 18, partner: false, since: 2026 },
    { name: "Bursa",       country: "TR", lat: 40.19, lon: 29.06,  users: 142,  co2: 30,  solar: 40, partner: false, since: 2025 },
    { name: "Antalya",     country: "TR", lat: 36.90, lon: 30.71,  users: 118,  co2: 27,  solar: 58, partner: false, since: 2025 },
    { name: "Chicago",     country: "US", lat: 41.88, lon: -87.63, users: 234,  co2: 54,  solar: 20, partner: false, since: 2025 },
    { name: "Seattle",     country: "US", lat: 47.61, lon: -122.33,users: 198,  co2: 45,  solar: 22, partner: false, since: 2025 },
    { name: "Austin",      country: "US", lat: 30.27, lon: -97.74, users: 176,  co2: 41,  solar: 39, partner: false, since: 2026 },
    { name: "Santiago",    country: "CL", lat: -33.45,lon: -70.67, users: 64,   co2: 16,  solar: 47, partner: false, since: 2026 },
    { name: "Riyadh",      country: "SA", lat: 24.71, lon: 46.68,  users: 152,  co2: 34,  solar: 53, partner: false, since: 2025 },
    { name: "Jakarta",     country: "ID", lat: -6.21, lon: 106.85, users: 121,  co2: 29,  solar: 34, partner: false, since: 2026 },
    { name: "Shanghai",    country: "CN", lat: 31.23, lon: 121.47, users: 356,  co2: 79,  solar: 19, partner: false, since: 2025 },
    { name: "Accra",       country: "GH", lat:  5.60, lon: -0.19,  users: 29,   co2:  7,  solar: 44, partner: false, since: 2026 },
  ];

  // Continent ellipses for procedural land mask
  // (lat, lon, lat-radius, lon-radius)
  const CONTINENTS = [
    { lat:  48, lon:-100, ry: 22, rx: 30, n: "NA" },        // North America main
    { lat:  60, lon:-130, ry: 12, rx: 20, n: "NW" },        // NW Canada/Alaska
    { lat:  18, lon: -90, ry:  8, rx: 12, n: "CA" },        // Central America
    { lat:  72, lon: -42, ry: 10, rx: 16, n: "GL" },        // Greenland
    { lat: -15, lon: -60, ry: 30, rx: 16, n: "SA" },        // South America
    { lat:  52, lon:  15, ry: 14, rx: 25, n: "EU" },        // Europe
    { lat:  30, lon:  45, ry: 16, rx: 16, n: "ME" },        // Middle East
    { lat:   3, lon:  20, ry: 35, rx: 18, n: "AF" },        // Africa
    { lat:  45, lon:  95, ry: 28, rx: 38, n: "AS" },        // Asia
    { lat:  22, lon:  80, ry: 12, rx: 10, n: "IN" },        // India peninsula
    { lat:  -3, lon: 115, ry: 12, rx: 22, n: "SEA" },       // SE Asia / Indonesia
    { lat: -25, lon: 135, ry: 10, rx: 18, n: "AU" },        // Australia
    { lat: -42, lon: 173, ry:  6, rx:  4, n: "NZ" },        // New Zealand
    // Antarctica handled separately (any lat < -65)
  ];

  function isLand(lat, lon) {
    if (lat < -65) return true; // Antarctica
    for (const c of CONTINENTS) {
      const dlat = (lat - c.lat) / c.ry;
      let dlon = ((lon - c.lon + 540) % 360) - 180;
      dlon /= c.rx;
      const r = dlat * dlat + dlon * dlon;
      if (r < 1) {
        // soft jittered edge for natural look
        const noise = 0.18 * (Math.sin(lat * 0.6 + c.n.length) * Math.cos(lon * 0.4));
        if (r < 1 - noise) return true;
      }
    }
    return false;
  }

  // Convert (lat, lon, radius) to 3D point on a sphere of radius R
  function latLonToXYZ(lat, lon, R = 1) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    const x = -R * Math.sin(phi) * Math.cos(theta);
    const z =  R * Math.sin(phi) * Math.sin(theta);
    const y =  R * Math.cos(phi);
    return [x, y, z];
  }

  export const ECO_GEO = { isLand, latLonToXYZ, CONTINENTS };
