import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  const userId = req.query.userId;

  const { data } = await supabase
    .from("users")
    .select("balance")
    .eq("id", userId)
    .single();

  res.json({ balance: data.balance });
}
