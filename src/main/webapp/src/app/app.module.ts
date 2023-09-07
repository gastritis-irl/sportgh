import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from "./app.component";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HomeModule } from "./home/home.module";
import { NavbarComponent } from "./shared/navbar/navbar.component";
import { ProductModule } from './product/product.module';
import { FormsModule } from '@angular/forms';
import { environment } from "./environment";
import { CategoryModule } from './category/category.module';
import { AdminModule } from './admin/admin.module';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UserModule } from './user/user.module';

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        NavbarComponent,
        AngularFireModule.initializeApp(environment.firebaseConfig),
        AngularFireAuthModule,
        FormsModule,
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        NgbModule,
        HomeModule,
        ProductModule,
        CategoryModule,
        AdminModule,
        NavbarComponent,
        BrowserAnimationsModule,
        UserModule,
        ToastrModule.forRoot({
            timeOut: 10000,
        }),
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
