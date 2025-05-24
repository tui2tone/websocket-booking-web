export async function getBeds({
    roomId
}: {
    roomId?: number;
}) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/beds?roomId=${roomId}`);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    return json?.data || []
  } catch (error) {
    return [];
  }
}