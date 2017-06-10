import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';

import { ProductsAddNewComponent } from './products-add-new.component';
import { ProductsManageComponent } from './products-manage.component';
import { ProductsSidebarComponent } from './products-sidebar.component';

import { OrderReviewService } from '../../services/order-review.service';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@NgModule({
    declarations: [ProductsAddNewComponent, ProductsManageComponent, ProductsSidebarComponent], // components, pipes and directives that are part of this module
    imports: [CommonModule, RouterModule,FormsModule, ReactiveFormsModule], //importing other modules ,
    providers: [OrderReviewService] // providers eg services that are part of this module
})

export class ProductsModule {

}