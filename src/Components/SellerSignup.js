import React, { useState } from "react";
import {auth,fs} from '../Config/Config'
import {Link} from 'react-router-dom'
import {useHistory} from 'react-router-dom'

export const SellerSignup = () => {

    const history = useHistory();

    const [fullName, setFullname]=useState('');
    const [email, setEmail]=useState('');
    const [password, setPassword]=useState('');
    const [ethAddress,setEthAddress] = useState('');
    const [phone,setPhone] = useState('');
    const [errorMsg, setErrorMsg]=useState('');
    const [successMsg, setSuccessMsg]=useState('');

    const handleSignup=(e)=>{
        e.preventDefault();
        // console.log(fullName, email, password);
        auth.createUserWithEmailAndPassword(email,password).then((credentials)=>{
            console.log(credentials);
            fs.collection('Sellers').doc(credentials.user.uid).set({
                FullName: fullName,
                ethAddress: ethAddress,
                phone: phone,
                Email: email,
                Password: password
            }).then(()=>{
                setSuccessMsg('Signup Successfull. You will now automatically get redirected to Login');
                setFullname('');
                setEmail('');
                setPassword('');
                setEthAddress('');
                setPhone('');
                setErrorMsg('');
                setTimeout(()=>{
                    setSuccessMsg('');
                    history.push('/seller-login');
                },3000)
            }).catch(error=>setErrorMsg(error.message));
        }).catch((error)=>{
            setErrorMsg(error.message)
        })
    }

    return (
        <div className='container'>
            <br></br>
            <br></br>
            <h1>Seller Sign Up</h1>
            <hr></hr>
            {successMsg&&<>
                <div className='success-msg'>{successMsg}</div>
                <br></br>
            </>}
            <form className='form-group' autoComplete="off" onSubmit={handleSignup}>
                <label>Full Name</label>
                <input type="text" className='form-control' required
                onChange={(e)=>setFullname(e.target.value)} value={fullName}></input>
                <br></br>
                <label>Wallet Address</label>
                <input type="text" className='form-control' required
                onChange={(e)=>setEthAddress(e.target.value)} value={ethAddress}></input>
                <br></br>
                <label>phone</label>
                <input type="text" className='form-control' required
                onChange={(e)=>setPhone(e.target.value)} value={phone}></input>
                <br></br>
                <label>Email</label>
                <input type="email" className='form-control' required
                 onChange={(e)=>setEmail(e.target.value)} value={email}></input>
                <br></br>
                <label>Password</label>
                <input type="password" className='form-control' required
                 onChange={(e)=>setPassword(e.target.value)} value={password}></input>
                <br></br>
                <div className='btn-box'>
                    <span>Already have a Seller account Login
                    <Link to="seller-login" className='link'> Here</Link></span>
                    <button type="submit" className='btn btn-success btn-md'>SIGN UP</button>
                </div>
            </form>
            {errorMsg&&<>
                <br></br>
                <div className='error-msg'>{errorMsg}</div>                
            </>}
        </div>
    )
}
