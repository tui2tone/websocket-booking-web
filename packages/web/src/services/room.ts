export async function getRooms() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rooms`);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    return json?.data || []
  } catch (error) {
    return [];
  }
}

export async function getRoomById(id: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rooms/${id}`);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    return json?.data || []
  } catch (error) {
    return [];
  }
}
