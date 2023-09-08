import { Product } from "../product/product.model";

export interface User {

    id?: number;
    username?: string;
    email?: string;
    fullName?: string;
    phoneNumber?: string;
    bio?: string;
    adress?: string;
    city?: string;
    country?: string;
    products?: Product[];
    password?: string;
    role?: string;
}
