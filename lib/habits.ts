import { differenceInDays, endOfToday, startOfToday, subDays } from "date-fns";
import { getUser } from "./auth";
import { supabase } from "./supabase";

/** Gets the total completions for a given day */
export async function getCompletionosForDay(date: Date): Promise<number> {
    const user = await getUser();
    if (!user) return 0;

    const start = startOfToday().toISOString();
    const end = endOfToday().toISOString();

    const {count, error} = await supabase
        .from("habit_completions")
        .select("id, habits(user_id)", { count: "exact", head: true})
        .gte("completed_date", start)
        .lte("completed_date", end)
        .eq("habits.user_id", user?.id);
        
    if (error) {
        console.error("Error fetching completions for day", error);
        return 0;
    }

    return count ?? 0;
}


/** Fetch completions for the last `days` days */
export async function getCompletionsForRange(days: number) {
    const user = await getUser();
    if (!user) return;

    const start = subDays(new Date(), days).toISOString();

    const { data, error } = await supabase
        .from("habit_completions")
        .select("*, habits(user_id)")
        .gte("completed_date", start)
        .eq("habits.user_id", user?.id)
        .order("completed_date", { ascending: true })
    
    if (error) {
        console.error("Error fetching completions for range:", error);
        return [];
    }
    
    return data ?? [];
}

/** Returns total number of completed days and missed days */
export async function getTotalCompletionsAndMisses(): Promise<{
    totalCompletions: number;
    totalMissedDays: number;
    totalDays: number;
    habitCount: number;
}> {
    const user = await getUser();
    if (!user) return { totalCompletions: 0, totalMissedDays: 0, totalDays: 0, habitCount: 0 };

    // Fetch all habits for the user
    const { data: habits, error: habitsError } = await supabase
        .from("habits")
        .select("id, created_at")
        .eq("user_id", user.id);

    if (habitsError || !habits) {
        console.error("Error fetching habits", habitsError);
        return { totalCompletions: 0, totalMissedDays: 0, totalDays: 0, habitCount: 0 };
    }

    // Fetch all completions for the user
    const { data: completions, error: completionsError } = await supabase
        .from("habit_completions")
        .select("id, habit_id, completed_date");

    if (completionsError || !completions) {
        console.error("Error fetching completions", completionsError);
        return { totalCompletions: 0, totalMissedDays: 0, totalDays: 0, habitCount: habits.length };
    }

    // Aggregate totals
    const today = startOfToday();
    let totalDays = 0;
    let totalCompletions = 0;

    habits.forEach((habit: any) => {
        const habitCompletions = completions.filter((c: any) => c.habit_id === habit.id);
        totalCompletions += habitCompletions.length;
        const createdDate = new Date(habit.created_at);
        totalDays += differenceInDays(today, createdDate) + 1;
    });

    const totalMissedDays = totalDays - totalCompletions;

    return {
        totalCompletions,
        totalMissedDays,
        totalDays,
        habitCount: habits.length,
    };
}