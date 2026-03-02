import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface Profile {
  full_name: string | null;
  phone: string | null;
  referral_code: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  isModerator: boolean;
  /** true if user is admin OR moderator */
  canManagePosts: boolean;
  profile: Profile | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  isAdmin: false,
  isModerator: false,
  canManagePosts: false,
  profile: null,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isModerator, setIsModerator] = useState(false);

  const fetchProfile = async (userId: string, currentUser?: User | null) => {
    const { data } = await supabase
      .from("profiles")
      .select("full_name, phone, referral_code")
      .eq("id", userId)
      .single();
    if (data) {
      setProfile(data);
    } else {
      const meta = currentUser?.user_metadata;
      setProfile({
        full_name: (meta?.full_name as string) || null,
        phone: (meta?.phone as string) || null,
        referral_code: "",
      });
    }
  };

  const checkRoles = async (userId: string) => {
    const [adminRes, modRes] = await Promise.all([
      supabase.rpc("has_role", { _user_id: userId, _role: "admin" }),
      supabase.rpc("has_role", { _user_id: userId, _role: "moderator" }),
    ]);
    setIsAdmin(adminRes.data === true);
    setIsModerator(modRes.data === true);
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        if (session?.user) {
          setTimeout(() => {
            fetchProfile(session.user.id, session.user);
            checkRoles(session.user.id);
          }, 0);
        } else {
          setProfile(null);
          setIsAdmin(false);
          setIsModerator(false);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      if (session?.user) {
        fetchProfile(session.user.id, session.user);
        checkRoles(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const canManagePosts = isAdmin || isModerator;

  return (
    <AuthContext.Provider value={{ user, session, loading, isAdmin, isModerator, canManagePosts, profile }}>
      {children}
    </AuthContext.Provider>
  );
};
