export type History = {
    id: string;
    content: string;
    type: 'anonymous' | 'query' | 'subscription';
    date?: string;
    theme?: string;
    character?: string;
    generateAt: string;
};

export type HistoryPage = {
    histories: History[];
    meta: { page: number; pageSize: number; total: number; totalPages: number };
};
