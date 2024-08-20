import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@1.30.0';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const { id, email_addresses, first_name, image_url, created_at, updated_at } = (await req.json()).data;    const email = email_addresses[0].email_address;
    const created_at_formatted = new Date(parseInt(created_at)).toISOString();
    const updated_at_formatted = new Date(parseInt(updated_at)).toISOString();
    console.log("id: ", id);
    console.log("email: ", email);
    console.log("image_url: ", image_url);
    console.log("first_name: ", first_name);
    console.log("created_at: ", created_at);
    console.log("updated_at: ", updated_at);
    console.log("created_at_formatted: ", created_at_formatted);

    const { data, error } = await supabase
      .from('users')
      .insert({ id, email, full_name: first_name , created_at:created_at_formatted, updated_at:updated_at_formatted, image_url: image_url });

    if (error) {
      console.log("error: ", error);
      return new Response(JSON.stringify(error), { status: 400 });
    }

    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' },
      status: 201,
    });
  } catch (err) {
    console.log(err);

    return new Response(JSON.stringify({ error: err.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
