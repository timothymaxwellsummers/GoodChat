
export async function GET() {
    const res = await fetch('https://zenquotes.io/api/quotes', {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const data = await res.json()
   
    return Response.json({ data })
  }