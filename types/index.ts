export type Task = {
    id: string;
    name: string;
    userId: string;
    created_at: string,
};

export type User = {
    id: string,
    email?: string,
}