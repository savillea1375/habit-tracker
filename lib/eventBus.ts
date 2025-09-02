type Callback = (payload?: any) => void;

const subs: Record<string, Callback[]> = {};

export const eventBus = {
    on(event: string, cb: Callback) {
        subs[event] = subs[event] ?? [];
        subs[event].push(cb);
        return () => {
            subs[event] = subs[event].filter((c) => c !== cb);
        }
    },
    emit(event: string, payload?: any) {
        (subs[event] ?? []).forEach((cb) => {
            try {
                cb(payload);
            } catch (e) {
                console.warn("eventBus error", e);
            }
        })
    }
}