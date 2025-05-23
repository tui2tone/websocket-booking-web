import { supabase } from "@/lib/supabase";

export async function getRooms() {
  const { data } = await supabase.from("rooms").select();
  return data;
}
