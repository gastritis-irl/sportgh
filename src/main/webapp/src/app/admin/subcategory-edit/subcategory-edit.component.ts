import { Component, OnInit } from '@angular/core';
import { SubcategoryService } from '../../subcategory/subcategory.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subcategory } from '../../subcategory/subcategory.model';

type ClickHandlerFunction = () => void;

@Component({
    selector: 'sgh-subcategory-edit',
    templateUrl: './subcategory-edit.component.html',
})
export class SubcategoryEditComponent implements OnInit {

    subcategory: Subcategory = { id: undefined, name: '', categoryId: undefined};
    clickHandlerFunction: ClickHandlerFunction = (): void => {
    };
    editMode: boolean = false;
    buttonPushed: boolean = false;
    paramCheck: 'create' | 'edit' = 'create';
    constructor(
        private subcategoryService: SubcategoryService,
        private router: Router,
        private route: ActivatedRoute,
        private toastNotify: ToastrService,
    ) {
    }

    ngOnInit(): void {
        this.loadDataByParam();
    }

    loadDataByParam(): void {
        this.route.params.subscribe(
            {
                next: (params: Params): void => {
                    this.loadData([params['categoryId'], params['subcategoryId']]);
                },
                error: (error): void => {
                    console.error(error);
                    this.toastNotify.error(`Error fetching data`);
                }
            }
        );
    }

    loadData(params: (string | undefined)[]): void {
        if (params) {
            if (params[1] === 'new') {
                this.paramCheck = 'create';
                if (params[0]) {
                    this.subcategory.categoryId = parseInt(params[0]);
                }
                this.clickHandlerFunction = this.createSubcategoryData;
                this.editMode = false;
            }
            if(params[1]) {
                const id: number = parseInt(params[1]);
                if (!isNaN(id)) {
                    this.paramCheck = 'edit';
                    this.clickHandlerFunction = this.updateSubcategoryData;
                    this.editMode = true;
                    this.subcategoryService.getById(id).subscribe(
                        {
                            next: (data: Subcategory) => {
                                this.subcategory = data;
                            },
                            error: (error) => {
                                console.error(error);
                                this.toastNotify.error(`Error fetching data`);
                            }
                        }
                    );
                }
            }
        }
    }

    createSubcategoryData(): void {
        this.subcategoryService.create(this.subcategory).subscribe(
            {
                next: (resp: Subcategory): void => {
                    this.router.navigate([`/admin/categories/${this.subcategory.categoryId}`])
                        .then((): void => {
                            this.toastNotify.success(`Subcategory "${resp.name}" successfully created!`);
                        })
                        .catch((): void => {
                            this.toastNotify.error(`Error redirecting to route '/admin/categories`);
                        });
                },
                error: (error): void => {
                    if (error.status === 0) {
                        this.toastNotify.error('Error creating category: unauthorized');
                    } else {
                        this.toastNotify.error(`Error creating category: ${error.error}`);
                    }
                }
            }
        );
    }

    updateSubcategoryData(): void {
        this.subcategoryService.update(this.subcategory.id, this.subcategory).subscribe(
            {
                next: (): void => {
                    this.router.navigate([`/admin/categories/${this.subcategory.categoryId}`])
                        .then((): void => {
                            this.toastNotify.success(`Subcategory successfully updated!`);
                        })
                        .catch((): void => {
                            this.toastNotify.error(`Error redirecting to route /admin/categories`);
                        });
                },
                error: (error: { status: number; error: undefined }): void => {
                    if (error.status === 0) {
                        this.toastNotify.error('Error creating category: unauthorized');
                    } else {
                        this.toastNotify.error(`Error creating category: ${error.error}`);
                    }
                }
            }
        );
    }
}
