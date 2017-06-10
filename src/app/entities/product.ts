
//app/entities/product.ts
export interface Product {
    id?:number | string,
    expiry?: string,
    product?:string,
    no?:number | string,
    socks?: boolean,
    auto?: string,
    auto_edit?: boolean

}