async function getUpcomingEventsWithLocationAndYouTube(failteApiUrl) {
  try {
    // Fetch events from Fáilte Ireland API
    const response = await fetch(failteApiUrl);
    const data = await response.json();
    const events = data.value || [];

    // Get current date and calculate next month
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const nextMonth = (currentMonth + 1) % 12;
    const nextMonthYear = nextMonth === 0 ? currentYear + 1 : currentYear;

    // Filter events for the next month
    const nextMonthEvents = events.filter(event => {
      const eventStartDate = new Date(event.startDate);
      return (
        eventStartDate.getMonth() === nextMonth &&
        eventStartDate.getFullYear() === nextMonthYear
      );
    });

    // Sort events by date (ascending)
    nextMonthEvents.sort(
      (a, b) => new Date(a.startDate) - new Date(b.startDate)
    );

    // Select the first five events
    const upcomingEvents = nextMonthEvents.slice(0, 5);

    // Enrich events with static YouTube video URLs and geolocation
    const enrichedEvents = upcomingEvents.map(event => {
      const geoLocation = event.location
        ? {
            latitude: event.location.geo.latitude || 'Unknown',
            longitude: event.location.geo.longitude || 'Unknown',
          }
        : { latitude: 'Unknown', longitude: 'Unknown' };

      // Static YouTube URL
      const youtubeUrl = 'https://www.youtube.com/watch?v=YxDQKW9O4xU';

      return {
        name: event.name,
        url: event.url || 'No URL available',
        description: event.description || 'No description available',
        youtubeUrl: youtubeUrl,
        date: new Date(event.startDate),
        geoLocation: geoLocation,
      };
    });

    return enrichedEvents;
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
}

// Example usage
const failteApiUrl =
  'https://failteireland.azure-api.net/opendata-api/v2/events';

getUpcomingEventsWithLocationAndYouTube(failteApiUrl).then(events => {
  console.log(
    'Upcoming events with geolocation and static YouTube video URLs:',
    events
  );
});
