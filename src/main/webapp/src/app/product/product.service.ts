import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppService } from '../app.service';
import { Product } from './product.model';
import { ProductPage } from './product-page.model';

@Injectable({
    providedIn: 'root'
})
export class ProductService extends AppService {

    getAll(pageNumber: number): Observable<ProductPage> {
        const url: string = `${this.baseUrl}/products?pageNumber=${pageNumber}`;
        return this.http.get<ProductPage>(url);
    }

    getById(id: number): Observable<Product> {
        const url: string = `${this.baseUrl}/products/${id}`;
        return this.http.get<Product>(url);
    }

    getByCategoryId(categoryId: number, pageNumber: number): Observable<ProductPage> {
        const url: string = `${this.baseUrl}/products?categoryId=${categoryId}&pageNumber=${pageNumber}`;
        return this.http.get<ProductPage>(url);
    }

    create(product: Product): Observable<Product> {
        const url: string = `${this.baseUrl}/products`;
        return this.http.post(url, product);
    }

    edit(product: Product): Observable<Product> {
        const url: string = `${this.baseUrl}/products/${product.id}`;
        return this.http.put(url, product);
    }

    delete(productId: number): Observable<Product> {
        const url: string = `${this.baseUrl}/products/${productId}`;
        return this.http.delete(url);
    }

    rent(productId: number): Observable<Product> {
        const url: string = `${this.baseUrl}/products/${productId}/rent`;
        return this.http.put(url, {});  // body: renter?
    }
}
