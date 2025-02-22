import { Component, OnInit } from '@angular/core';
import { Product } from './product.model';
import { ProductService } from './product.service';
import { ProductPage } from './product-page.model';
import { Category } from '../category/category.model';
import { Subcategory } from '../subcategory/subcategory.model';
import { CategoryService } from '../category/category.service';
import { SubcategoryService } from '../subcategory/subcategory.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ImageService } from '../shared/image/image.service';
import { CustomFieldConfig, CustomFieldValue } from '../subcategory/customFieldConfig.model';

@Component({
    selector: 'sgh-product',
    templateUrl: './product.component.html',
    styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit {

    products: Product[] = [];
    categories: Category[] = [];
    subcategories: Subcategory[] = [];
    nrOfPages: number = 0;
    nrOfItems: number = 0;
    currentPage: number = 1;
    orderByParam: string = 'name';
    direction: string = 'ASC';
    filterParams: Params = {};
    filterParamNames: string[] = [
        'pageNumber',
        'orderBy',
        'direction',
        'Category',
        'subcategoryNames',
        'customFieldValues',
        'minPrice',
        'maxPrice',
        'textSearch',
        'locationLat',
        'locationLng',
        'locationRadius'
    ];
    selectedAtLeastOneSubCatOfCat: boolean[] = [];
    selectedExactlyOneSubCat: boolean = false;
    customFieldValues: CustomFieldValue[] = [];
    categorySelected: boolean[] = [];
    subcategorySelected: boolean[] = [];
    textSearch: string = '';
    minPrice: number = 0;
    maxPrice: number = 0;
    locationLat?: number = 0;
    locationLng?: number = 0;
    locationRadius?: number = 0;

    constructor(
        private productService: ProductService,
        private categoryService: CategoryService,
        private subcategoryService: SubcategoryService,
        private toastNotify: ToastrService,
        private route: ActivatedRoute,
        private router: Router,
        private imageService: ImageService,
    ) {
    }

    ngOnInit(): void {
        this.setDefaultParams();
        this.loadDataFirst();
    }

    loadDataFirst(): void {
        this.categoryService.getAll().subscribe(
            {
                next: (data: Category[]): void => {
                    this.categories = data;
                    this.subcategoryService.getAll().subscribe(
                        {
                            next: (data: Subcategory[]): void => {
                                this.subcategories = data;
                                this.getQueryParams();
                            },
                            error: (error): void => {
                                console.error('Error fetching data(subcategories):', error);
                                this.toastNotify.error('Error loading filters');
                            }
                        }
                    );
                },
                error: (error): void => {
                    console.error('Error fetching data(categories):', error);
                    this.toastNotify.error('Error loading filters');
                }
            }
        );
    }

    loadProductImages(products: Product[]): void {
        for (const product of products) {

            if (!product.id) {
                continue;
            }
            this.imageService.getImageFilesByProductId(product.id).subscribe({
                next: (response: { name: string, data: Uint8Array }[]) => {
                    if (!response) {
                        return;
                    }
                    try {
                        product.imageDataUrls = [];
                        for (const imageDTO of response) {
                            if (!imageDTO.data) {
                                continue;
                            }

                            const base64String = imageDTO.data;
                            const imageUrl = 'data:image/jpeg;base64,' + base64String;
                            product.imageDataUrls.push(imageUrl);
                        }
                        product.imagesLoaded = true;
                    } catch (error) {
                        this.toastNotify.error(`Error loading images: ${error}`);
                    }
                },
                error: (error) => {
                    this.toastNotify.error(`Error fetching images`, error);
                }
            });
        }
    }

    changesEvent(changed: [number, number, string, boolean, number?, number?, number?]): void {
        const selectedExactlyOneSubCatOldValue: boolean = this.selectedExactlyOneSubCat;
        this.minPrice = changed[0];
        this.maxPrice = changed[1];
        this.textSearch = changed[2];
        this.selectedExactlyOneSubCat = changed[3];
        this.locationLat = changed[4];
        this.locationLng = changed[5];
        this.locationRadius = changed[6];

        if (this.selectedExactlyOneSubCat) {
            this.setCustomFieldValuesInCondition();
        }
        if (!this.selectedExactlyOneSubCat && selectedExactlyOneSubCatOldValue) {
            this.customFieldValues = [];
        }

        this.setParams();
        this.setQueryParams();
        this.loadData();
    }

    selectAllSubCatOfCat(categoryIndex: number): void {
        if (categoryIndex != -1) {
            this.categorySelected[categoryIndex] = true;
        }
        for (let i: number = 0; i < this.subcategories.length; i++) {
            if (this.subcategories[i].categoryId === this.categories[categoryIndex].id) {
                this.subcategorySelected[i] = true;
            }
        }
    }

    getQueryParams(): void {
        this.route.queryParams.subscribe(
            {
                next: (params: Params): void => {
                    for (const paramName of this.filterParamNames) {
                        if (params[paramName] && params[paramName] != 0) {
                            if (paramName === 'subcategoryNames') {
                                if (typeof params[paramName] === 'string') {
                                    for (let j: number = 0; j < this.subcategories.length; j++) {
                                        if (this.subcategories[j].name === params[paramName]) {
                                            this.subcategorySelected[j] = true;
                                        }
                                    }
                                } else {
                                    for (let i: number = 0; i < params[paramName].length; i++) {
                                        for (let j: number = 0; j < this.subcategories.length; j++) {
                                            if (this.subcategories[j].name === params[paramName][i]) {
                                                this.subcategorySelected[j] = true;
                                            }
                                        }
                                    }
                                }
                            } else {
                                this.filterParams[paramName] = params[paramName];
                            }
                            if (paramName === 'Category') {
                                if (typeof params[paramName] === 'string') {
                                    let catInd: number = -1;
                                    for (let i: number = 0; i < this.categories.length; i++) {
                                        if (this.categories[i].name === params[paramName]) {
                                            catInd = i;
                                            break;
                                        }
                                    }
                                    this.selectAllSubCatOfCat(catInd);
                                } else {
                                    for (let j: number = 0; j < params[paramName].length; j++) {
                                        let catInd: number = -1;
                                        for (let i: number = 0; i < this.categories.length; i++) {
                                            if (this.categories[i].name === params[paramName][j]) {
                                                catInd = i;
                                                break;
                                            }
                                        }
                                        this.selectAllSubCatOfCat(catInd);
                                    }
                                }
                            }
                            if (paramName === 'pageNumber') {
                                this.currentPage = params[paramName];
                            }
                            if (paramName === 'orderBy') {
                                this.orderByParam = params[paramName];
                            }
                            if (paramName === 'direction') {
                                this.direction = params[paramName];
                            }
                            if (paramName === 'textSearch') {
                                this.textSearch = params[paramName];
                            }
                            if (paramName === 'minPrice') {
                                this.minPrice = params[paramName];
                            }
                            if (paramName === 'maxPrice') {
                                this.maxPrice = params[paramName];
                            }
                            if (paramName === 'locationLat') {
                                this.locationLat = params[paramName];
                            }
                            if (paramName === 'locationLng') {
                                this.locationLng = params[paramName];
                            }
                            if (paramName === 'locationRadius') {
                                this.locationRadius = params[paramName];
                            }
                            this.selectedExactlyOneSubCat = this.subcategorySelected.length > 0 ?
                                this.subcategorySelected.map((a: boolean): number => a ? 1 : 0).reduce((a: number, b: number) => a + b) === 1 : false;
                        }
                    }
                    this.setParams();
                    this.loadData();
                },
                error: (error): void => {
                    console.error(error);
                    this.toastNotify.error('Error loading filter parameters');
                }
            }
        );
    }

    setQueryParams(): void {
        this.router.navigate(
            [],
            {
                relativeTo: this.route,
                queryParams: {
                    subcategoryNames: this.filterParams['subcategoryNames'],
                    customFieldValues: this.filterParams['customFieldValues'],
                    textSearch: this.textSearch,
                    minPrice: this.minPrice,
                    maxPrice: this.maxPrice,
                    locationLat: this.locationLat,
                    locationLng: this.locationLng,
                    locationRadius: this.locationRadius
                },
                replaceUrl: true,
            }
        ).catch(error => {
            console.error(error);
            this.toastNotify.error('Error loading filter parameters');
        });
    }

    loadData(): void {
        this.scrollToTop();
        this.productService.getAllByParams(this.filterParams).subscribe(
            {
                next: (data: ProductPage): void => {
                    this.products = data.products;
                    this.loadProductImages(this.products);
                    this.nrOfPages = data.nrOfPages;
                    this.nrOfItems = data.nrOfElements;
                },
                error: (error): void => {
                    console.error('Error fetching data (products):', error);
                    this.toastNotify.error('Error loading products');
                }
            }
        );
    }

    scrollToTop(): void {
        window.scroll({
            top: 0,
            behavior: 'smooth'
        });
    }

    setPageNumber(pageNumber: number): void {
        this.filterParams['pageNumber'] = pageNumber;
        this.loadData();
    }

    orderBy(orderBy: string): void {
        this.filterParams['orderBy'] = orderBy.split('#')[0];
        this.filterParams['direction'] = orderBy.split('#')[1];
        this.loadData();
    }

    clearFilter(paramNameAndFilterCheck: [string, boolean]): void {
        if (paramNameAndFilterCheck[0] === 'textSearch') {
            this.textSearch = '';
        }
        if (paramNameAndFilterCheck[0] === 'minPrice') {
            this.minPrice = 0;
        }
        if (paramNameAndFilterCheck[0] === 'maxPrice') {
            this.maxPrice = 0;
        }
        if (paramNameAndFilterCheck[0] === 'locationLat') {
            this.locationLat = 0;
        }
        if (paramNameAndFilterCheck[0] === 'locationLng') {
            this.locationLng = 0;
        }
        if (paramNameAndFilterCheck[0] === 'locationRadius') {
            this.locationRadius = 0;
        }
        this.selectedExactlyOneSubCat = this.subcategorySelected.length > 0 ?
            this.subcategorySelected.map((a: boolean): number => a ? 1 : 0).reduce((a: number, b: number) => a + b) === 1 : false;

        if (paramNameAndFilterCheck[1]) {
            this.setParams();
            this.setQueryParams();
            this.loadData();
        }
    }

    resetFilters(): void {
        this.setDefaultParams();
        this.setQueryParams();
        this.loadData();
    }

    setDefaultParams(): void {
        this.filterParams = {
            pageNumber: 1,
            orderBy: 'name',
            direction: 'ASC',
            subcategoryNames: [],
            customFieldValues: [],
            textSearch: '',
            minPrice: 0,
            maxPrice: 0,
            locationLat: 0,
            locationLng: 0,
            locationRadius: 0
        };
        this.currentPage = 1;
        this.orderByParam = 'name';
        this.direction = 'ASC';
        this.subcategorySelected = [];
        this.customFieldValues = [];
        this.categorySelected = [];
        this.selectedAtLeastOneSubCatOfCat = [];
        this.textSearch = '';
        this.minPrice = 0;
        this.maxPrice = 0;
        this.locationLat = 0;
        this.locationLng = 0;
        this.locationRadius = 0;
    }

    setParams(): void {
        this.filterParams = [];
        this.filterParams = {
            pageNumber: this.currentPage,
            orderBy: this.orderByParam,
            direction: this.direction,
            subcategoryNames: [],
            customFieldValues: [],
            textSearch: this.textSearch,
            minPrice: this.minPrice,
            maxPrice: this.maxPrice,
            locationLat: this.locationLat,
            locationLng: this.locationLng,
            locationRadius: this.locationRadius
        };

        for (let i: number = 0; i < this.subcategories.length; i++) {
            if (this.subcategorySelected[i]) {
                this.filterParams['subcategoryNames'].push(this.subcategories[i].name);
            }
        }

        this.selectedExactlyOneSubCat = this.subcategorySelected.length > 0 ?
            this.subcategorySelected.map((a: boolean): number => a ? 1 : 0).reduce((a: number, b: number) => a + b) === 1 : false;

        if (this.selectedExactlyOneSubCat) {
            this.setCustomFieldValuesInCondition();
        }
    }

    setCustomFieldValuesInCondition(): void {
        let selectedSubcategoryIndex: number = -1;
        for (let i: number = 0; i < this.subcategories.length; i++) {
            if (this.subcategorySelected[i]) {
                selectedSubcategoryIndex = i;
            }
        }

        if (selectedSubcategoryIndex !== -1) {
            const selectedSubcategory: Subcategory = this.subcategories[selectedSubcategoryIndex];
            if (selectedSubcategory.id) {
                this.setCustomFieldValues(this.subcategories[selectedSubcategoryIndex].customFields);
                this.filterParams['customFieldValues'] = [];
                for (let i: number = 0; i < this.customFieldValues.length; i++) {
                    this.filterParams['customFieldValues'].push(`${this.customFieldValues[i].config.name}#${this.customFieldValues[i].config.type}#${this.customFieldValues[i].value}`);
                }
            }
        }
    }

    setCustomFieldValues(customFields: CustomFieldConfig[]): void {
        const values: (string | number | null)[] = [];
        for (let i: number = 0; i < this.customFieldValues.length; i++) {
            values.push(this.customFieldValues[i].value);
        }

        this.customFieldValues = [];
        if (customFields && customFields.length > 0) {
            for (let i: number = 0; i < customFields.length; i++) {
                this.customFieldValues.push({
                    config: customFields[i],
                    value: values[i]
                });
            }
        }
    }
}
