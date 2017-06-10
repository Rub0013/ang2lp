import { Routes }   from '@angular/router';

import { ProductsAddNewComponent } from './products-add-new.component';
import { ProductsManageComponent } from './products-manage.component';

export const productRoutes: Routes = [
    {path: '', redirectTo: 'new', pathMatch: 'full'}
    , {path: 'new', component: ProductsAddNewComponent}
    , {path: 'manage', component: ProductsManageComponent}
];