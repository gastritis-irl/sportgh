//module for the user component

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserDetailsComponent } from './user-details/user-details.component';
import { UserEditComponent } from './user-edit/user-edit.component';
import { RouterModule } from '@angular/router';
import { UserRoute } from './user.route';
import { ImageComponent } from '../shared/image/image.component';

@NgModule({
    declarations: [
        UserDetailsComponent,
        UserEditComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        UserRoute,
        ImageComponent
    ],
    exports: [
        UserDetailsComponent // If you want to use it in other modules
    ]
})
export class UserModule { }
