import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function sendMessage(content) {
  const { data, error } = await supabase.from("messages").insert([{ content }]);

  if (error) throw error;
  return data;
}

export async function getMessages() {
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function addReply(id, reply) {
  const { data, error } = await supabase
    .from("messages")
    .update({ is_replied: true, reply })
    .eq("id", id);

  if (error) throw error;
  return data;
}
