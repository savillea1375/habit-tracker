import { router } from "expo-router";
import { useEffect } from "react";
import { supabase } from "../lib/supabase";

export default function Index() {
    useEffect(() => {
        const checkSession = async () => {
            const {
                data: { session },
            } = await supabase.auth.getSession();
            if (session) {
                router.replace("/dashboard");
            } else {
                router.replace("/login");
            }
        };
        checkSession();
    }, []);

    return null;
}
