import { Product } from './product.model';

export interface ProductPage {

    products: Product[],
    nrOfPages: number,
    nrOfElements: number,
}
