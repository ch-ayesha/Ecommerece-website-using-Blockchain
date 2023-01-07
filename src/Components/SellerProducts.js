import React from 'react'
import { IndividualSellerProduct } from './IndividualSellerProducts'

export const SellerProducts = ({products}) => {

    // console.log(products);
    
    return products.map((individualProduct)=>(
        <IndividualSellerProduct  individualProduct={individualProduct}
        />
    ))
}