import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/holidays?countryCode={CC}
 * 
 * Server-side proxy to Nager.Date public holidays API.
 * No API key required — free and open.
 */
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const countryCode = searchParams.get('countryCode');

    if (!countryCode) {
        return NextResponse.json(
            { error: 'Missing required parameter: countryCode' },
            { status: 400 }
        );
    }

    const today = new Date();
    const year = today.getFullYear();
    const todayStr = today.toISOString().split('T')[0]; // YYYY-MM-DD

    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);

        const response = await fetch(
            `https://date.nager.at/api/v3/PublicHolidays/${year}/${countryCode.toUpperCase()}`,
            { signal: controller.signal }
        );
        clearTimeout(timeout);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('[Holidays API] Nager.Date error:', response.status, errorText);
            return NextResponse.json(
                { error: `Holidays API returned ${response.status}` },
                { status: 502 }
            );
        }

        const holidays = await response.json();

        // Check if today is a holiday
        const todayHoliday = holidays.find(
            (h: { date: string; localName: string; name: string }) => h.date === todayStr
        );

        // Filter upcoming holidays (next 14 days)
        const upcomingHolidays = holidays.filter((h: { date: string }) => {
            const hDate = new Date(h.date + 'T00:00:00');
            const diffDays = Math.ceil((hDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
            return diffDays > 0 && diffDays <= 14;
        });

        return NextResponse.json({
            isHoliday: !!todayHoliday,
            holidayName: todayHoliday?.localName || todayHoliday?.name || null,
            upcomingHolidays: upcomingHolidays.map((h: any) => ({
                date: h.date,
                localName: h.localName,
                name: h.name
            }))
        });
    } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
            console.error('[Holidays API] Request timeout');
            return NextResponse.json({ error: 'Holidays API timeout' }, { status: 504 });
        }
        console.error('[Holidays API] Unexpected error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
