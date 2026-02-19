/**
 * Weather Service — Client-side
 * Calls the secure server-side proxy at /api/weather
 */

export interface WeatherResult {
    condition: string;
    description: string;
    temperature: number;
    icon: string;
}

export const WeatherService = {
    async getWeather(lat?: number, lng?: number): Promise<WeatherResult | null> {
        if (!lat || !lng) {
            console.warn('[WeatherService] No coordinates provided, skipping weather fetch');
            return null;
        }

        try {
            const response = await fetch(`/api/weather?lat=${lat}&lng=${lng}`);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('[WeatherService] API error:', response.status, errorData);
                return null;
            }

            const data: WeatherResult = await response.json();
            return data;
        } catch (error) {
            console.error('[WeatherService] Network error:', error);
            return null;
        }
    },
};
