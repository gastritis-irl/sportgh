export interface Product {

    id?: number,
    available?: boolean,
    name?: string,
    description?: string,
    location?: string,
    rentPrice?: number,
    categoryId?: number,
    subCategoryId?: number,
    subCategoryName?: string,
    userId?: number,
    username?: string,
    imageIds?: number[],
    imageDataUrls?: string[],
    imagesLoaded?: boolean;
}
