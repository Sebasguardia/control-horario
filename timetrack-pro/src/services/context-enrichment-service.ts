/**
 * Context Enrichment Service
 * 
 * Orchestrates parallel API calls using Promise.allSettled
 * to enrich work sessions with weather and holiday data.
 * 
 * KEY DESIGN DECISIONS:
 * - Uses Promise.allSettled (not Promise.all) so that if one API fails,
 *   the other result is still captured.
 * - Returns partial data on failure — session creation is never blocked.
 * - All errors are logged for debugging.
 */

import { WeatherService, WeatherResult } from './weather-service';
import { HolidayService, HolidayResult } from './holiday-service';

export interface EnrichmentResult {
    weather: WeatherResult | null;
    holiday: HolidayResult | null;
    errors: string[];
    hasPartialError: boolean;
}

export interface EnrichmentData {
    weather_condition?: string | null;
    temperature?: number | null;
    is_holiday?: boolean;
    holiday_name?: string | null;
}

/**
 * Fetches weather and holiday data in parallel.
 * 
 * @example
 * // Promise.allSettled ensures both calls are attempted independently
 * const result = await enrichSessionContext(4.6097, -74.0817, 'CO');
 * // result.weather may be null if weather API failed
 * // result.holiday may still contain valid data
 */
export async function enrichSessionContext(
    lat?: number,
    lng?: number,
    countryCode?: string
): Promise<EnrichmentResult> {
    const errors: string[] = [];

    // ═══════════════════════════════════════════════════════
    // PARALLEL EXECUTION — Promise.allSettled
    // Both API calls run simultaneously. If one fails,
    // the other still succeeds. This is the core demonstration
    // of parallel task coordination.
    // ═══════════════════════════════════════════════════════
    const [weatherResult, holidayResult] = await Promise.allSettled([
        WeatherService.getWeather(lat, lng),
        HolidayService.checkHoliday(countryCode),
    ]);

    // Process weather result
    let weather: WeatherResult | null = null;
    if (weatherResult.status === 'fulfilled') {
        weather = weatherResult.value;
        if (!weather) {
            errors.push('Weather data unavailable (no coordinates or API error)');
        }
    } else {
        console.error('[Enrichment] Weather fetch rejected:', weatherResult.reason);
        errors.push(`Weather API error: ${weatherResult.reason?.message || 'Unknown'}`);
    }

    // Process holiday result
    let holiday: HolidayResult | null = null;
    if (holidayResult.status === 'fulfilled') {
        holiday = holidayResult.value;
        if (!holiday) {
            errors.push('Holiday data unavailable');
        }
    } else {
        console.error('[Enrichment] Holiday fetch rejected:', holidayResult.reason);
        errors.push(`Holiday API error: ${holidayResult.reason?.message || 'Unknown'}`);
    }

    // Log summary
    if (errors.length > 0) {
        console.warn('[Enrichment] Completed with partial errors:', errors);
    } else {
        console.log('[Enrichment] All context data fetched successfully');
    }

    return {
        weather,
        holiday,
        errors,
        hasPartialError: errors.length > 0,
    };
}

/**
 * Converts EnrichmentResult to flat data for database update.
 */
export function toEnrichmentData(result: EnrichmentResult): EnrichmentData {
    return {
        weather_condition: result.weather?.condition ?? null,
        temperature: result.weather?.temperature ?? null,
        is_holiday: result.holiday?.isHoliday ?? false,
        holiday_name: result.holiday?.holidayName ?? null,
    };
}
