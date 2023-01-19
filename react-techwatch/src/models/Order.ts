
export interface OrderInterface {
    amount: number;
    approval_id: string;
    created_at: Date;
    id: number;
    order_item: {
        created_at: Date;
        details: {
            barangay: string;
            city: string;
            email:  string;
            house_no:  string;
            name: string;
            province: string;
            street: string;
            zip_code: string;
        }
        id : number;
        items: {
            id: number;
            img: string;
            name: string;
            price: number;
            qty:  number;
            totalprice: number;
            uuid: string;
        }[];
        order_id: number;
        updated_at: Date;
    }
    order_status?: string | null;
    payer_id?: string | null;
    payment_type: string;
    qty: number;
    status: number;
    token?: string | null;
    updated_at: Date;
    user_id: number;
}