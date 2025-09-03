import { format, parseISO, subDays } from "date-fns";
import { GraphPoint } from "react-native-graph";

/** Group completions together by day (for line graph) */
export function groupCompletionsByDay(completions: any[]): GraphPoint[] {
    const dateMap: Record<string, number> = {};

    // Fill date map with completions
    completions.forEach((c) => {
        const dateStr = format(parseISO(c.completed_date), "yyyy-MM-dd");
        dateMap[dateStr] = (dateMap[dateStr] || 0) + 1;
    });

    const today = new Date();
    const res: GraphPoint[] = [];

    for (let i = 29; i >= 0; i--) {
        const date = subDays(today, i);
        const dateStr = format(date, "yyyy-MM-dd");
        res.push({
            date,
            value: dateMap[dateStr] || 0,
        })
    }

    return res;
}