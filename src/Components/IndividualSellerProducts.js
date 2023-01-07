import React from 'react'
import { auth,fs } from '../Config/Config'


export const IndividualSellerProduct = ({individualProduct}) => {
    
    async function hello()
    {
        const temp = await fs.collection('Products').get()
        console.log(individualProduct.title)
        temp.docs.map(async(data1,index)=>{
            // arraydata[index]["id"]= data1?.id;
            // console.log(data1?.data().title)
            if(data1?.data().title === individualProduct.title)
            {
                console.log("Here")
                await fs.collection('Products').doc(data1?.id).delete()
            }
            // if(data1?.data().seller == userEmail ){
            //     arraydata[index]= data1?.data();
            //     console.log("data1 :",data1?.data())

            // }
            // console.log("data1 :",data1?.data())

        })
    }

    return (
        <div className='product'>
            <div className='product-img'>
                <img src={individualProduct.url} alt="product-img"/>
            </div>
            <div className='product-text title'>{individualProduct.title}</div>
            <div className='product-text description'>{individualProduct.description}</div>
            <div className='product-text price'>$ {individualProduct.price}</div>
            <button type="button" className="btn btn-primary" onClick ={hello} >Delete</button>
        </div> 
    )
}