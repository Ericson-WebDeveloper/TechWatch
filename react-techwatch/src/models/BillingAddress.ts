

export interface BiilingAddInterface {
    id: number;
    user_id: number;
    province: string;
    city: string;
    zip_code: number;
    barangay: string;
    street: string;
    house_no: number;
    created_at?: Date;
    updated_at?: Date;
}