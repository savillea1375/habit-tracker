import { router } from "expo-router";
import { supabase } from "./supabase";

export const getUser = async () => {
    const {
        data: { user },
        error,
    } = await supabase.auth.getUser();

    if (error) {
        console.error("Failed to get user:", error);
        return;
    }

    return user;
}

export const signOut = async () => {
    const { error } = await supabase.auth.signOut({ scope: "local" });

    if (error) console.log(error);

    router.replace("/");
}
