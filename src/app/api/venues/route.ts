import { NextResponse } from 'next/server';

interface PlaceDetails {
  name: string;
  formatted_address: string;
  address_components: {
    long_name: string;
    short_name: string;
    types: string[];
  }[];
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json([]);
    }

    // First, get place predictions
    const predictionsResponse = await fetch(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
        query,
      )}&types=establishment&key=${
        process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY
      }`,
    );

    const predictionsData = await predictionsResponse.json();

    // Get details for each prediction
    const detailedVenues = await Promise.all(
      predictionsData.predictions.slice(0, 5).map(async (prediction: any) => {
        const detailsResponse = await fetch(
          `https://maps.googleapis.com/maps/api/place/details/json?place_id=${prediction.place_id}&fields=name,formatted_address,address_components&key=${process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY}`,
        );

        const detailsData = await detailsResponse.json();
        const place: PlaceDetails = detailsData.result;

        // Extract address components
        const getComponent = (type: string) =>
          place.address_components.find((component) =>
            component.types.includes(type),
          )?.long_name || null;

        return {
          venue: place.name,
          streetAddress: [getComponent('street_number'), getComponent('route')]
            .filter(Boolean)
            .join(' '),
          city: getComponent('locality'),
          state: getComponent('administrative_area_level_1'),
          postalCode: getComponent('postal_code'),
          country: getComponent('country'),
          formatted_address: place.formatted_address,
        };
      }),
    );

    return NextResponse.json(detailedVenues);
  } catch (error) {
    console.error('Venue search error:', error);
    return NextResponse.json([]);
  }
}
