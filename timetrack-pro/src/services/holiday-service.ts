/**
 * Holiday Service — Client-side
 * Calls the secure server-side proxy at /api/holidays
 */

export interface HolidayResult {
    isHoliday: boolean;
    holidayName: string | null;
}

export const HolidayService = {
    async checkHoliday(countryCode?: string): Promise<HolidayResult | null> {
        const code = countryCode || 'PE'; // Default to Peru

        try {
            const response = await fetch(`/api/holidays?countryCode=${code}`);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('[HolidayService] API error:', response.status, errorData);
                return null;
            }

            const data: HolidayResult = await response.json();
            return data;
        } catch (error) {
            console.error('[HolidayService] Network error:', error);
            return null;
        }
    },
};
