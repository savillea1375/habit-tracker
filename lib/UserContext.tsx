import { User } from "@supabase/supabase-js";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { supabase } from "./supabase";

const UserContext = createContext<User | null>(null);

interface UserProviderProps {
    children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            setUser(user);
        });

        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => listener.subscription.unsubscribe();
    }, []);

    return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}

export function useUser(): User | null {
    return useContext(UserContext);
}
