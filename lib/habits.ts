import { endOfToday, startOfToday, subDays } from "date-fns";
import { supabase } from "./supabase";

/** Gets the total completions for a given day */
export async function getCompletionosForDay(date: Date): Promise<number> {
    const start = startOfToday().toISOString();
    const end = endOfToday().toISOString();

    const {count, error} = await supabase
        .from("habit_completions")
        .select("*", { count: "exact", head: true})
        .gte("completed_date", start)
        .lte("completed_date", end);
    
    if (error) {
        console.error("Error fetching completions for day", error);
        return 0;
    }

    return count ?? 0;
}


/** Fetch completions for the last `days` days */
export async function getCompletionsForRange(days: number) {
    const start = subDays(new Date(), days).toISOString();

    const { data, error } = await supabase
        .from("habit_completions")
        .select("*")
        .gte("completed_date", start)
        .order("completed_date", { ascending: true });

    if (error) {
        console.error("Error fetching completions for range:", error);
        return [];
    }

    return data ?? [];
}

/** Returns all habits and their completion count separate */
export async function getAllHabitsWithCompletions(): Promise<any[]> {
    const {data, error} = await supabase
        .from("habit_completions")
        .select(`id, completed_date, habit_id, habits (id, name, created_at, frequency)`);
    
    if (error) {
        console.error("Error fetching all habits and their completions", error);
        return [];
    }

    return data ?? [];
}