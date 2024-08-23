import React, { useState } from 'react'
import './CSS/LoginSignup.css'

const LoginSignup = () => {


    const [state, setState] = useState("Login");
    const [fromData,setFromData]=useState({
        username:"",
        password:"",
        email:""
    })
    const changeHandler=(e)=>{
        setFromData({...fromData,[e.target.name]:e.target.value})
    }

    const login = async()=>{
        console.log("Login Function Executed", fromData);
        let responceData;
        await fetch('http://localhost:4000/login',{
            method:'POST',
            headers:{
                Accept:'application/form-data',
                'Content-type':'application/json',
            },
            body:JSON.stringify(FormData),
        }).then((response)=> response.json()).then((data)=>responceData=data)

        if(responceData.success){
            localStorage.setItem('auth-token',responceData.token);
            window.location.replace("/");
        }
        else{
            alert(responceData.errors)
        }

    }

    const signup = async()=>{
        console.log("Signup Function Executed",fromData);
        let responceData;
        await fetch('http://localhost:4000/signup',{
            method:'POST',
            headers:{
                Accept:'application/form-data',
                'Content-type':'application/json',
            },
            body:JSON.stringify(FormData),
        }).then((response)=> response.json()).then((data)=>responceData=data)

        if(responceData.success){
            localStorage.setItem('auth-token',responceData.token);
            window.location.replace("/");
        }
        else{
            alert(responceData.errors)
        }
    }

    return (
        <div className="loginsignup" >
            <div className="loginsignup-container" >
                <h1> {state} </h1>
                <div className="loginsignup-fields" >
                    {state === "Sign Up" ? <input name='username' value={fromData.sername} onChange={changeHandler} type='text' placeholder='Your Name' /> : <></>}
                    <input name='email' value={fromData.email} onChange={changeHandler} type='email' placeholder='Mail Address' />
                    <input name='password' value={fromData.password} onChange={changeHandler} type='password' placeholder='Password' />
                </div>
                <button onClick={()=>{state==="Login"?login():signup()}}>Continue</button>
                {state === "Sign Up" ? <p className="loginsignup-login">Alredy have an account? <span onClick={() => { setState("Login") }}>Login here</span></p> : <p className="loginsignup-login">Create an account? <span onClick={() => { setState("Sign Up") }}>Click here</span></p>}


                <div className="loginsignup-agree">
                    <input type="checkbox" name='' id='' />
                    <p>By continuing, i agree to the term of use & privacy policy.</p>
                </div>
            </div >
        </div >

    )
}
export default LoginSignup