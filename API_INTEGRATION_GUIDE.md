# Hindu Festival API Integration Guide

## Overview
The Academic Calendar currently includes a comprehensive list of Hindu festivals with approximate dates. This guide explains how to integrate free APIs to get real-time, accurate festival dates.

## Current Implementation
- ✅ **Working Calendar**: Full calendar view with all dates
- ✅ **Hindu Festivals**: 18 major festivals included
- ✅ **Dual View Modes**: List and Calendar views
- ✅ **Category Filtering**: Filter by festival type
- ✅ **Responsive Design**: Works on all devices

## Free APIs for Hindu Festivals

### 1. Calendarific API (Recommended)
**URL**: https://calendarific.com/api/v2/holidays
**Free Tier**: 1,000 requests/month
**Features**: Religious holidays, Hindu festivals, accurate dates

```javascript
// Example API call
const response = await fetch(
  `https://calendarific.com/api/v2/holidays?api_key=YOUR_API_KEY&country=IN&year=2024&type=religious`
)
```

**Setup Steps**:
1. Sign up at https://calendarific.com
2. Get your free API key
3. Replace `YOUR_API_KEY` in the code
4. Add to environment variables: `NEXT_PUBLIC_CALENDARIFIC_API_KEY`

### 2. Holiday API
**URL**: https://holidayapi.com/v1/holidays
**Free Tier**: 1,000 requests/month
**Features**: Public holidays, religious observances

```javascript
// Example API call
const response = await fetch(
  `https://holidayapi.com/v1/holidays?key=YOUR_API_KEY&country=IN&year=2024&public=true`
)
```

### 3. Abstract API - Holidays
**URL**: https://www.abstractapi.com/holidays-api
**Free Tier**: 1,000 requests/month
**Features**: Global holidays, religious festivals

### 4. TimeAndDate API
**URL**: https://www.timeanddate.com/services/api/
**Free Tier**: Limited
**Features**: Accurate Hindu calendar calculations

## Implementation Steps

### Step 1: Add Environment Variables
Create or update your `.env.local` file:

```env
# Calendarific API
NEXT_PUBLIC_CALENDARIFIC_API_KEY=your_api_key_here

# Holiday API (backup)
NEXT_PUBLIC_HOLIDAY_API_KEY=your_api_key_here

# Abstract API (optional)
NEXT_PUBLIC_ABSTRACT_API_KEY=your_api_key_here
```

### Step 2: Update the fetchHinduFestivals Function
Replace the current `getHinduFestivals` function in `src/components/AcademicCalendar.tsx`:

```typescript
const fetchHinduFestivals = async (): Promise<HinduFestival[]> => {
  const festivals: HinduFestival[] = []
  const currentYear = new Date().getFullYear()
  const nextYear = currentYear + 1

  try {
    // Primary API: Calendarific
    const calendarificKey = process.env.NEXT_PUBLIC_CALENDARIFIC_API_KEY
    if (calendarificKey) {
      const response = await fetch(
        `https://calendarific.com/api/v2/holidays?api_key=${calendarificKey}&country=IN&year=${currentYear}&type=religious`
      )
      
      if (response.ok) {
        const data = await response.json()
        if (data.response?.holidays) {
          data.response.holidays.forEach((holiday: any) => {
            if (holiday.type.includes('religious') || holiday.type.includes('hindu')) {
              festivals.push({
                id: `calendarific-${holiday.date.iso}`,
                title: holiday.name,
                date: new Date(holiday.date.iso),
                description: holiday.description || 'Hindu religious observance',
                significance: holiday.description || 'Traditional Hindu festival',
                category: holiday.type.includes('major') ? 'Major Festival' : 'Religious Day'
              })
            }
          })
        }
      }
    }

    // Backup API: Holiday API
    if (festivals.length === 0) {
      const holidayKey = process.env.NEXT_PUBLIC_HOLIDAY_API_KEY
      if (holidayKey) {
        const response = await fetch(
          `https://holidayapi.com/v1/holidays?key=${holidayKey}&country=IN&year=${currentYear}&public=true`
        )
        
        if (response.ok) {
          const data = await response.json()
          if (data.holidays) {
            data.holidays.forEach((holiday: any) => {
              if (holiday.type === 'religious' || holiday.name.toLowerCase().includes('hindu')) {
                festivals.push({
                  id: `holidayapi-${holiday.date}`,
                  title: holiday.name,
                  date: new Date(holiday.date),
                  description: holiday.description || 'Hindu religious observance',
                  significance: holiday.description || 'Traditional Hindu festival',
                  category: 'Religious Day'
                })
              }
            })
          }
        }
      }
    }

  } catch (error) {
    console.error('Error fetching Hindu festivals:', error)
  }

  // Fallback to hardcoded festivals if APIs fail
  if (festivals.length === 0) {
    return getFallbackHinduFestivals(currentYear, nextYear)
  }

  return festivals.sort((a, b) => a.date.getTime() - b.date.getTime())
}
```

### Step 3: Update Component State
Add loading state for API calls:

```typescript
const [festivalsLoading, setFestivalsLoading] = useState(true)
const [hinduFestivals, setHinduFestivals] = useState<HinduFestival[]>([])

useEffect(() => {
  const loadFestivals = async () => {
    setFestivalsLoading(true)
    try {
      const festivals = await fetchHinduFestivals()
      setHinduFestivals(festivals)
    } catch (error) {
      console.error('Failed to load festivals:', error)
      // Use fallback data
      setHinduFestivals(getFallbackHinduFestivals(new Date().getFullYear(), new Date().getFullYear() + 1))
    } finally {
      setFestivalsLoading(false)
    }
  }

  if (isOpen) {
    loadFestivals()
  }
}, [isOpen])
```

### Step 4: Add Error Handling
Implement proper error handling and user feedback:

```typescript
const [apiError, setApiError] = useState<string | null>(null)

// In the fetch function
try {
  // API calls...
} catch (error) {
  setApiError('Unable to load festival data from external APIs')
  console.error('API Error:', error)
}
```

## Advanced Features

### 1. Caching
Implement caching to reduce API calls:

```typescript
const CACHE_KEY = 'hindu_festivals_cache'
const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 hours

const getCachedFestivals = () => {
  const cached = localStorage.getItem(CACHE_KEY)
  if (cached) {
    const { data, timestamp } = JSON.parse(cached)
    if (Date.now() - timestamp < CACHE_DURATION) {
      return data
    }
  }
  return null
}

const setCachedFestivals = (festivals: HinduFestival[]) => {
  localStorage.setItem(CACHE_KEY, JSON.stringify({
    data: festivals,
    timestamp: Date.now()
  }))
}
```

### 2. Multiple Years Support
Fetch festivals for multiple years:

```typescript
const fetchMultipleYears = async (startYear: number, endYear: number) => {
  const allFestivals: HinduFestival[] = []
  
  for (let year = startYear; year <= endYear; year++) {
    const yearFestivals = await fetchHinduFestivals(year)
    allFestivals.push(...yearFestivals)
  }
  
  return allFestivals.sort((a, b) => a.date.getTime() - b.date.getTime())
}
```

### 3. Lunar Calendar Integration
For more accurate Hindu festival dates, consider lunar calendar APIs:

```typescript
// Example lunar calendar API
const getLunarDate = async (date: Date) => {
  const response = await fetch(
    `https://api.lunar-calendar.com/convert?date=${date.toISOString()}`
  )
  return response.json()
}
```

## Testing

### 1. API Testing
Test your API integration:

```typescript
// Test function
const testAPIs = async () => {
  console.log('Testing Calendarific API...')
  const festivals = await fetchHinduFestivals()
  console.log('Festivals loaded:', festivals.length)
  console.log('Sample festival:', festivals[0])
}
```

### 2. Fallback Testing
Ensure fallback works when APIs are unavailable:

```typescript
// Disable APIs temporarily to test fallback
const DISABLE_APIS = true // Set to true to test fallback
```

## Performance Optimization

### 1. Lazy Loading
Load festivals only when calendar is opened:

```typescript
const [festivalsLoaded, setFestivalsLoaded] = useState(false)

useEffect(() => {
  if (isOpen && !festivalsLoaded) {
    loadFestivals()
    setFestivalsLoaded(true)
  }
}, [isOpen, festivalsLoaded])
```

### 2. Debouncing
Prevent multiple API calls:

```typescript
import { debounce } from 'lodash'

const debouncedFetch = debounce(fetchHinduFestivals, 300)
```

## Monitoring and Analytics

### 1. API Usage Tracking
Track API usage to stay within free limits:

```typescript
const trackAPIUsage = (apiName: string) => {
  const usage = JSON.parse(localStorage.getItem('api_usage') || '{}')
  usage[apiName] = (usage[apiName] || 0) + 1
  localStorage.setItem('api_usage', JSON.stringify(usage))
}
```

### 2. Error Monitoring
Monitor API failures:

```typescript
const logAPIError = (apiName: string, error: any) => {
  console.error(`${apiName} API Error:`, error)
  // Send to error tracking service
}
```

## Security Considerations

### 1. API Key Protection
- Never expose API keys in client-side code
- Use environment variables
- Consider server-side API calls for sensitive keys

### 2. Rate Limiting
- Implement rate limiting to stay within free tiers
- Cache responses to reduce API calls
- Monitor usage to avoid overages

## Troubleshooting

### Common Issues:

1. **CORS Errors**: Use server-side API calls
2. **Rate Limiting**: Implement caching and rate limiting
3. **API Changes**: Monitor API documentation for updates
4. **Network Issues**: Implement retry logic with exponential backoff

### Debug Mode:
```typescript
const DEBUG_MODE = process.env.NODE_ENV === 'development'

if (DEBUG_MODE) {
  console.log('API Response:', data)
  console.log('Processed Festivals:', festivals)
}
```

## Conclusion

The Academic Calendar is now ready for API integration. The current implementation provides a solid foundation with fallback data, while the API integration will provide real-time, accurate Hindu festival dates.

**Next Steps**:
1. Choose your preferred API (Calendarific recommended)
2. Sign up for free API keys
3. Add environment variables
4. Implement the fetchHinduFestivals function
5. Test thoroughly
6. Monitor usage and performance

The calendar will automatically fall back to the current hardcoded festivals if APIs are unavailable, ensuring a reliable user experience. 