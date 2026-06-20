import { cookies } from "next/headers";
import { createClient } from "../../utils/supabase/server";

export default async function SupabasePage() {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const { data: todos, error } = await supabase.from("todos").select();

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white p-8">
      <h1 className="font-valorax text-3xl mb-6">SUPABASE TODO DEMO</h1>

      {error ? (
        <p className="text-red-400 text-sm">Erreur de lecture: {error.message}</p>
      ) : (
        <ul className="space-y-2 font-body-readable text-sm text-[#bbb]">
          {todos?.map((todo) => (
            <li key={todo.id} className="rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2">
              {todo.name}
            </li>
          ))}
          {!todos?.length ? <li>Aucun todo pour le moment.</li> : null}
        </ul>
      )}
    </main>
  );
}
