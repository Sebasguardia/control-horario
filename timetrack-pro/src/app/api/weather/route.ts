import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/weather?lat={lat}&lng={lng}
 * 
 * Server-side proxy to weather providers.
 * Falls back to Open-Meteo (Free) if OpenWeatherMap API key is not configured.
 */
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');

    if (!lat || !lng) {
        return NextResponse.json(
            { error: 'Missing required parameters: lat, lng' },
            { status: 400 }
        );
    }

    const apiKey = process.env.OPENWEATHERMAP_API_KEY;

    // 1. Try OpenWeatherMap if key is available
    if (apiKey && apiKey !== 'your_openweathermap_api_key_here') {
        try {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 5000);

            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${apiKey}&units=metric&lang=es`,
                { signal: controller.signal }
            );
            clearTimeout(timeout);

            if (response.ok) {
                const data = await response.json();
                return NextResponse.json({
                    condition: data.weather?.[0]?.main || 'Unknown',
                    description: data.weather?.[0]?.description || '',
                    temperature: Math.round((data.main?.temp ?? 0) * 10) / 10,
                    icon: data.weather?.[0]?.icon || '',
                    city: data.name || 'Ubicación desconocida',
                });
            }
        } catch (error) {
            console.error('[Weather API] OpenWeatherMap failed:', error);
        }
    }

    // 2. Fallback to Open-Meteo (Free) + Nominatim (Reverse Geocoding)
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 8000);

        const weatherPromise = fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,weather_code&timezone=auto`,
            { signal: controller.signal }
        );

        // Nominatim for reverse geocoding (Free, requires User-Agent)
        const geoPromise = fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`,
            {
                signal: controller.signal,
                headers: { 'User-Agent': 'TimeTrackPro/1.0 (contact@timetrackpro.com)' }
            }
        ).catch(() => null);

        const [weatherRes, geoRes] = await Promise.all([weatherPromise, geoPromise]);
        clearTimeout(timeout);

        if (!weatherRes.ok) throw new Error('Weather API failed');

        const weatherData = await weatherRes.json();
        let city = 'Mi Ubicación';

        if (geoRes && geoRes.ok) {
            const geoData = await geoRes.json();
            city = geoData.address?.city || geoData.address?.town || geoData.address?.suburb || geoData.address?.village || city;
        }

        // Map Open-Meteo weather codes
        const code = weatherData.current.weather_code;
        let condition = 'Clouds';
        let description = 'nublado';

        if (code === 0) { condition = 'Clear'; description = 'despejado'; }
        else if (code <= 3) { condition = 'Clouds'; description = 'parcialmente nublado'; }
        else if (code >= 51 && code <= 67) { condition = 'Rain'; description = 'lluvia'; }
        else if (code >= 95) { condition = 'Thunderstorm'; description = 'tormenta'; }

        return NextResponse.json({
            condition,
            description,
            temperature: weatherData.current.temperature_2m,
            icon: '',
            city: city,
        });
    } catch (error) {
        console.error('[Weather API] Keyless fallback failed:', error);
        return NextResponse.json({ error: 'Service Unavailable', details: String(error) }, { status: 503 });
    }
}
