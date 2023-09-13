import { NgModule } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductComponent } from './product.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { ProductRoute } from './product.route';
import { ProductEditComponent } from './product-edit/product-edit.component';
import { FormsModule } from '@angular/forms';
import { NgbCollapse, NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { FormCheckLabelComponent } from '../shared/form-check-labels/form-check-label.component';
import { ProductFilterComponent } from './product-filter/product-filter.component';
import { TreeViewComponent } from '../shared/treeview/tree-view.component';
import { BreadcrumbComponent } from '../shared/breadcrumb/breadcrumb.component';

@NgModule({
    declarations: [
        ProductDetailsComponent,
        ProductListComponent,
        ProductEditComponent,
        ProductFilterComponent,
        ProductComponent,
    ],
    imports: [
        ProductRoute,
        NgFor,
        FormsModule,
        NgIf,
        NgbPopover,
        FormCheckLabelComponent,
        NgbCollapse,
        TreeViewComponent,
        BreadcrumbComponent,
    ],
    providers: [
        ProductComponent,
    ],
    bootstrap: [],
})
export class ProductModule {

}
