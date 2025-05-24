export async function getRooms({
  query
}: {
  query?: string
}) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rooms?q=${query || ''}`);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    return json?.data || []
  } catch (error) {
    return [];
  }
}

export async function getRoomById(id: number) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rooms/${id}`);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    return json || {}
  } catch (error) {
    return [];
  }
}
