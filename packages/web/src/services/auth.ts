export async function getAuth(token: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth`, {
      method: 'GET',
      headers: {
        'Authorization': token
      },
    });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    return json || []
  } catch (error) {
    return [];
  }
}