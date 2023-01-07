import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { Home } from './Components/Home'
import { Login } from './Components/Login'
import { Signup } from './Components/Signup'
import { NotFound } from './Components/NotFound'
import { SellerLogin } from './Components/SellerLogin'
import { SellerSignup } from './Components/SellerSignup'
import { SellerMain } from './Components/SellerMain'
import { Cart } from './Components/Cart'

export const App = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component = {Login}/>
        <Route path="/signup" component={Signup}/>
        <Route path="/login" component={Login}/>
        <Route path="/seller-login" component={SellerLogin}/>
        <Route path="/seller-signup" component={SellerSignup}/>  
        <Route path="/seller" component = {SellerMain}/>
        <Route path="/cart" component={Cart}/>  
        <Route path="/home" component={Home}/>  
        <Route component={NotFound}/>        
      </Switch>
    </BrowserRouter>
  )
}

export default App
