import { endOfToday, startOfToday } from "date-fns";
import { supabase } from "./supabase";

export async function getTodayCompletions() {
    const start = startOfToday().toISOString();
    const end = endOfToday().toISOString();

    const {data, error} = await supabase
        .from("habit_completions")
        .select("*")
        .gte("completed_date", start)
        .lte("completed_date", end);
}