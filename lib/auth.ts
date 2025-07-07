import { router } from "expo-router";
import { supabase } from "./supabase";

export async function signOut() {
    const { error } = await supabase.auth.signOut({ scope: "local" });

    if (error) console.log(error);

    router.replace("/");
}
