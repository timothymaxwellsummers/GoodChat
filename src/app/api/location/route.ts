export async function GET() {
    return new Promise((resolve) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve(new Response(JSON.stringify({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            }), {
              headers: { 'Content-Type': 'application/json' },
            }));
          },
          (error) => {
            resolve(new Response(JSON.stringify({
              error: error.message,
            }), {
              status: 500,
              headers: { 'Content-Type': 'application/json' },
            }));
          }
        );
      } else {
        resolve(new Response(JSON.stringify({
          error: 'Geolocation is not supported by this browser.',
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }));
      }
    });
  }
  