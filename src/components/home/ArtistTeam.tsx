import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Users } from "lucide-react";

const ArtistTeam = () => {
  const { data: artists } = useQuery({
    queryKey: ["artists-home"],
    queryFn: async () => {
      const { data } = await supabase
        .from("artists")
        .select("id, name, branch_id, branches(name)")
        .eq("is_active", true)
        .order("name");
      return data ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });

  if (!artists?.length) return null;

  return (
    <section className="mx-auto max-w-[1440px] border-b border-border py-20 px-6 md:px-16">
      <div className="mb-12 text-center">
        <h2 className="font-serif text-3xl font-bold uppercase tracking-tight text-foreground md:text-4xl">
          Đội ngũ Artist
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Những nghệ sĩ tận tâm đứng sau mỗi tác phẩm.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {artists.map((a: any) => (
          <div
            key={a.id}
            className="group flex flex-col items-center border border-border p-6 text-center transition-colors hover:border-primary"
          >
            <div className="mb-4 flex h-16 w-16 items-center justify-center border border-border bg-secondary text-muted-foreground transition-colors group-hover:border-primary group-hover:text-primary">
              <Users size={24} strokeWidth={1.5} />
            </div>
            <h3 className="font-sans text-sm font-bold uppercase tracking-tight text-foreground">
              {a.name}
            </h3>
            {a.branches?.name && (
              <p className="mt-1 font-mono text-xs text-muted-foreground">
                {a.branches.name}
              </p>
            )}
            <Link
              to="/dat-lich"
              className="mt-3 font-mono text-xs uppercase tracking-widest text-primary transition-colors hover:text-foreground"
            >
              Đặt lịch
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ArtistTeam;
