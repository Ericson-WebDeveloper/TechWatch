

export interface userInterface {
    id: number;
    name: string;
    email: string;
    password?: string;
    created_at?: Date;
    updated_at?: Date;
    stripe_id?: string | null;
    card_brand?: string | null;
    card_last_four?: string | null;
    trial_ends_at?: string | null;
}