import React,{useState, useEffect} from 'react'
import {Navbar} from './Navbar'
import {auth,fs} from '../Config/Config'
import { CartProducts } from './CartProducts';
import { ethers } from 'ethers';
import { useHistory } from 'react-router-dom';

export const Cart = () => {

    const { ethereum } = window;
const history = useHistory();

    // getting current user function
    function GetCurrentUser(){
        const [user, setUser]=useState(null);
        useEffect(()=>{
            auth.onAuthStateChanged(user=>{
                if(user){
                    fs.collection('users').doc(user.uid).get().then(snapshot=>{
                        setUser(snapshot.data().FullName);
                    })
                }
                else{
                    setUser(null);
                }
            })
        },[])
        return user;
    }

    const user = GetCurrentUser();
    // console.log(user);
    
    // state of cart products
    const [cartProducts, setCartProducts]=useState([]);
    const [ItemsList,setItemsList] = useState([])
    // getting cart products from firestore collection and updating the state
    useEffect(()=>{
        auth.onAuthStateChanged(user=>{
            if(user){
                fs.collection('Cart' + user.uid).onSnapshot(snapshot=>{
                    const newCartProduct = snapshot.docs.map((doc)=>({
                        ID: doc.id,
                        ...doc.data(),
                    }));
                    setCartProducts(newCartProduct);
                    let temp =[];
                    for(let i=0;i<newCartProduct.length;i++)
                    {
                     temp.push(newCartProduct[i].title);
                    }
                    setItemsList(temp);

                })
            }
            else{
                console.log('user is not signed in to retrieve cart');
            }
        })
    },[])

    // console.log(cartProducts);
    
    // getting the qty from cartProducts in a seperate array
    const qty = cartProducts.map(cartProduct=>{
        return cartProduct.qty;
    })

    // reducing the qty in a single value
    const reducerOfQty = (accumulator, currentValue)=>accumulator+currentValue;

    const totalQty = qty.reduce(reducerOfQty,0);

    // console.log(totalQty);

    // getting the TotalProductPrice from cartProducts in a seperate array
    const price = cartProducts.map((cartProduct)=>{
        return cartProduct.TotalProductPrice;
    })


    // reducing the price in a single value
    const reducerOfPrice = (accumulator,currentValue)=>accumulator+currentValue;

    const totalPrice = price.reduce(reducerOfPrice,0);

    // global variable
    let Product;
    
    // cart product increase function
    const cartProductIncrease=(cartProduct)=>{
        // console.log(cartProduct);
        Product=cartProduct;
        Product.qty=Product.qty+1;
        Product.TotalProductPrice=Product.qty*Product.price;
        // updating in database
        auth.onAuthStateChanged(user=>{
            if(user){
                fs.collection('Cart' + user.uid).doc(cartProduct.ID).update(Product).then(()=>{
                    console.log('increment added');
                })
            }
            else{
                console.log('user is not logged in to increment');
            }
        })
    }

    // cart product decrease functionality
    const cartProductDecrease =(cartProduct)=>{
        Product=cartProduct;
        if(Product.qty > 1){
            Product.qty=Product.qty-1;
            Product.TotalProductPrice=Product.qty*Product.price;
             // updating in database
            auth.onAuthStateChanged(user=>{
                if(user){
                    fs.collection('Cart' + user.uid).doc(cartProduct.ID).update(Product).then(()=>{
                        console.log('decrement');
                    })
                }
                else{
                    console.log('user is not logged in to decrement');
                }
            })
        }
    }

    const [successMsg, setSuccessMsg]=useState('');
    //Ethersjs Section
    console.log(ItemsList);

    let tx;

    async function MetamaskPayment()
    {
        const uid = auth.currentUser.uid;

        const ADDRESS = "0xb034c498Efabe592Eee6861c2aE3b3b8a5462580";
const ABI =[{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"inputs":[{"internalType":"string","name":"_user","type":"string"},{"internalType":"uint256","name":"_price","type":"uint256"},{"internalType":"string[]","name":"_products","type":"string[]"},{"internalType":"string[]","name":"_quantity","type":"string[]"},{"internalType":"string[]","name":"_prices","type":"string[]"},{"internalType":"string[]","name":"_seller","type":"string[]"}],"name":"addReceipt","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"getHistory","outputs":[{"components":[{"internalType":"string","name":"user","type":"string"},{"internalType":"uint256","name":"price","type":"uint256"},{"internalType":"string[]","name":"products","type":"string[]"},{"internalType":"string[]","name":"quantity","type":"string[]"},{"internalType":"string[]","name":"prices","type":"string[]"},{"internalType":"string[]","name":"seller","type":"string[]"},{"internalType":"uint256","name":"date_and_time","type":"uint256"}],"internalType":"struct w3Mart.List[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"}];

       let provider = new ethers.providers.Web3Provider(
          window.ethereum,
          "any"
        );
        let accounts = await provider.send("eth_requestAccounts", []);
        console.log(accounts[0]);

   
        await ethereum.request({ method: 'wallet_switchEthereumChain', params:[{chainId: '0x5'}]});

        let signer = await provider.getSigner(accounts[0]);
       
       //Initialize smart contract
       const contract = await new ethers.Contract(ADDRESS,ABI,signer);
       console.log(contract);

       //Updated on 7/1/2023
       let sellerList = [];
       let pricelist = [];
       let quantitylist = []; 
       const items = await fs.collection('Cart' + uid).get();
       console.log(items)


       items.docs.map((data1,index)=>{
        // arraydata[index]["id"]= data1?.id;
        pricelist.push(String(data1?.data().price));
        sellerList.push(data1?.data().seller)
        quantitylist.push(String(data1?.data().qty));
       })

       console.log(pricelist)
       console.log(sellerList)
       console.log(quantitylist)

       //Ether price taken on 12/18/2022 at 2:43 AM
        let weiAmount = String(totalPrice/1179);
   
    tx = await contract.addReceipt(user,totalPrice,ItemsList,quantitylist,pricelist,sellerList,{ value: ethers.utils.parseUnits(weiAmount,"ether") })
    console.log(tx.hash)


      if(tx != null)
      {
       const carts = await fs.collection('Cart' + uid).get();
       for(var snap of carts.docs){
           fs.collection('Cart' + uid).doc(snap.id).delete();
       }
        setSuccessMsg('Item successfully purchased.You can see your transaction at '+tx.hash+  ' You will now automatically get redirected to Main page');
        tx = null;
        setTimeout(()=>{
            setSuccessMsg('');
            history.push('/home');
        },8000)
       }
    }


     // state of totalProducts
     const [totalProducts, setTotalProducts]=useState(0);
     // getting cart products   
     useEffect(()=>{        
         auth.onAuthStateChanged(user=>{
             if(user){
                 fs.collection('Cart' + user.uid).onSnapshot(snapshot=>{
                     const qty = snapshot.docs.length;
                     setTotalProducts(qty);
                 })
             }
         })       
     },[])  


  
    return (
        <>
            <Navbar user={user} totalProducts={totalProducts} />           
            <br></br>
            {successMsg&&<>
                <div className='success-msg'>{successMsg}</div>
                <br></br>
            </>}
            {cartProducts.length > 0 && (
                <div className='container-fluid'>
                    <h1 className='text-center'>Cart</h1>
                    <div className='products-box'>
                        <CartProducts cartProducts={cartProducts}
                           cartProductIncrease={cartProductIncrease}
                           cartProductDecrease={cartProductDecrease}
                        />
                    </div>
                    <div className='summary-box'>
                        <h5>Cart Summary</h5>
                        <br></br>
                        <div>
                        Total No of Products: <span>{totalQty}</span>
                        </div>
                        <div>
                        Total Price to Pay: <span>$ {totalPrice}</span>
                        </div>
                        <br></br>
                        <button type="button" className="btn btn-primary" onClick={() =>MetamaskPayment()}>Pay with Metamask</button>
                        
                    </div>                                    
                </div>
            )}
            {cartProducts.length < 1 && (
                <div className='container-fluid'>No products to show</div>
            ) }           
        </>
    )
}