"use client"
import axios from "axios";
import Image from "next/image";
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import ReCAPTCHA from "react-google-recaptcha";
import { FaCheck } from "react-icons/fa";
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from "react-redux";
import { login } from "./redux/slices/userSlice";
import Cookies from "js-cookie";
import { IoMdEyeOff } from 'react-icons/io';



const SITE_KEY=process.env.NEXT_PUBLIC_SITE_KEY

export default function Home() {
  const [signUp, setSignUp] = useState(false);
  const [errors, setErrors] = useState({});
  const [emailerror,setEmailError]=useState('');
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [verifyText,setVerifyText] = useState('Check');
  const [disableStatus, setDisableStatus]= useState(false);
  const [formData, setFormData] = useState({
    name: "",
    password: "",
  });
   const [ loginForm, setLoginForm ] = useState({
    email: "",
    password: "",
   });
 
   const [emailData,setEmaildata]=useState({
    email: "",
    otp: "",
   });
  const dispatch = useDispatch();
  const [recaptchaValue,setRecaptchaValue]=useState('')
  const recaptchaRef = useRef(null); // Create a ref for reCAPTCHA
  const router = useRouter();
  

  const validateForm = () => {
    const newErrors = {};
    if(formData.name){
      if (!formData.name.trim()) newErrors.name = 'Please enter your name';
    }else{
      newErrors.name = 'Please enter your name';
    }


    const passwordPattern = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/;
    if (!passwordPattern.test(formData.password)) newErrors.password ='Minimum 8 Characters password, Atleast 1 Capital letter, 1 special character, 1 digit'


    setErrors(newErrors);

    console.log(newErrors);

    return Object.keys(newErrors).length === 0;

  }

  const emailValidate=(e)=>{

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(emailData.email)) {
      const newEmailError = 'Invalid Email ID';
      setEmailError(newEmailError);
      setIsEmailValid(false);
      return false;
    }
    setEmailError('');
    setIsEmailValid(true);
    return true;

  }
    
  
  const handlRegisterData=(e)=>{
      e.preventDefault();
      
      const ifValid = validateForm();

      if(!ifValid) return setTimeout(()=>{setErrors({})},4000);
      
      if (verifyText==='Check') {
          toast.error("Kindly verify your email")
      } 
      else{
        axios.post(`${process.env.NEXT_PUBLIC_URL}/user-credential/user/user-register`,formData)
        .then((response)=>{
            console.log(response.data)
          
            toast.success(`Successfully Registered`);
            setFormData({ name: "", email: "", password: "" });
          
        })
        .catch((error)=>{
          console.log(error)
          if (error.response && error.response.status === 403) {
            toast.error("Email already exists, please use a different one.");
          } else {
            toast.error("Registration failed. Please try again.");
          }
        })
      }
  
      // const data={
      //   name:e.target.name.value,
      //   email:e.target.email.value,
      //   password:e.target.password.value
      // }
      
      
   }
  const changeCaptcha=(value)=>{
     setRecaptchaValue(value)
   }
  const handleLoginData=async(e)=>{
      e.preventDefault();
  
      axios.post(`${process.env.NEXT_PUBLIC_URL}/user-credential/user/user-login`,{...loginForm,recaptchaValue})
      .then((response)=>{
        //console.log(response.data)
        dispatch(login(response.data))
        localStorage.setItem('user-data',JSON.stringify(response.data))
        setLoginForm({ email: "", password: "" });
        router.push('/home');
        // if (recaptchaRef?.current) {
        //   recaptchaRef.current.reset();
        // }; // Reset reCAPTCHA

        
        
      })
      .catch((error)=>{
        console.log(error)
        if (error.response) {
          const { status } = error.response;
  
          if (status === 403) {
            toast.error("Email ID does not exist. Please try again.");
          } else if (status === 401) {
            toast.error("Invalid password. Please try again.");
          } else {
            toast.error("An error occurred. Please try again later.");
          }
        } else {
          toast.error("Unable to connect to the server. Please check your network.");
        }
        if (recaptchaRef?.current) {
          recaptchaRef.current.reset();
        } // Reset reCAPTCHA
      })
   }
   const ifLogins=()=>{
    const cookieData=JSON.parse(localStorage.getItem('user-data'))
    if(cookieData)  router.push('/home');
  }
  useEffect(()=>{
    ifLogins()
  },[])
  //  useEffect(() => {
  //   return () => {
  //     if (recaptchaRef?.current) {
  //       recaptchaRef.current.reset(); // Reset on unmount
  //     }
  //   };
  // }, []);
  const handleOtp=(e)=>{
      e.preventDefault()
      const ifValid = emailValidate();
      if(!ifValid) return setTimeout(()=>{setEmailError('')},4000);
      
      axios.post(`${process.env.NEXT_PUBLIC_URL}/user-credential/user/generate-otp`, { email: emailData.email })
          .then((response) => {
                 console.log(response.data);
                 
               
          })
          .catch((error) => {
                console.log(error);
                const { status } = error.response;
                if (status === 500) {
                  toast.error("Something went wromg !");
                }
          });
  }

  const handlerEmail=(e)=>{
    e.preventDefault()
    axios.post(`${process.env.NEXT_PUBLIC_URL}/user-credential/user/verify-email`, emailData)
          .then((response) => {
            console.log(response)
            setIsEmailValid(false)
            setDisableStatus(true)
            setVerifyText(<FaCheck  size={20} /> )
            toast.success(`Successfully Email Verified`);
               
          })
          .catch((error) => {
                console.log(error);
                const { status } = error.response;
                if (status === 401) {
                  toast.error("Invalid OTP. Please try again.");
                }else {
                  toast.error("Unable to connect to the server. Please check your network.");
                }
          });
    
  }

  return (
    <>
     
       {
         signUp ? ( 
          <div className="w-[500px] fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] border p-3">
            
            <h1 className="text-[orangered] font-bold text-[18px]">Sign Up</h1>
             <IoMdEyeOff className=" " />
            <form method="post" onSubmit={handlRegisterData}>

                <input type='text' placeholder='name' name='name' className="w-full p-2 border-[1px] border-[solid] border-[#ccc] mt-2" onChange={(e) => { setFormData({ ...formData, name: e.target.value }) }} value={formData.name} />
                {errors.name && (<span className="text-[red] text-[11px] font-bold">{errors.name}</span>)}

                <div className='flex'>
                      <input 
                        type='text' 
                        placeholder='Email' 
                        name='email' 
                        className="w-full p-2 border-[1px] border-[solid] border-[#ccc] mt-2" 
                        onChange={(e)=>{setEmaildata({...emailData,email:e.target.value})}} 
                        value={emailData.email} 
                      />
                      <button 
                        type="button" 
                        className='green font-bold ms-3 mt-[10px] p-2 text-[14px] text-[green]' 
                        onClick={handleOtp}
                        disabled={disableStatus}
                      >
                        {verifyText}
                      </button>
                  </div>

                      {emailerror && (
                        <span className="text-[red] text-[11px] font-bold">{emailerror}</span>
                      )}

                      {isEmailValid && (
                        <>
                          <input 
                            type="text" 
                            placeholder="OTP" 
                            name="otp"
                            className="mt-2 w-full p-2 border-[1px] border-[solid] border-[#ccc]"
                            onChange={(e)=>{setEmaildata({...emailData,otp:e.target.value})}} 
                            value={emailData.otp} 
                          />
                          <button type="button" className='mt-2 p-2 text-[11px] bg-[#ccc]' onClick={handlerEmail}>
                            Submit
                          </button>
                        </>
                    )}
                
               
               
                <input type='password' placeholder='password' name='password' className="w-full p-2 border-[1px] border-[solid] border-[#ccc] mt-2" onChange={(e) => { setFormData({ ...formData, password: e.target.value }) }} value={formData.password} />
                {errors.password && (<span className="text-[red] text-[11px] font-bold">{errors.password}</span>)}
                
                <div className="flex justify-between items-center">
                  <button className="mt-4 p-3 bg-red-600 text-white">Submit</button>
                  <p className="text-blue-500 cursor-pointer" onClick={()=>setSignUp(false)}>Log in</p>
                </div>
            </form>
            
            </div>
           
         )
          
         : (
         
            <div className="w-[500px] fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] border p-3">
              <h1 className="text-[orangered] font-bold text-[18px]">Log In</h1>
              <form onSubmit={handleLoginData}>
                  <input type='text' placeholder='email' name='email' className="w-full p-2 border-[1px] border-[solid] border-[#ccc] mt-2"  onChange={(e) => { setLoginForm ({ ...loginForm, email: e.target.value }) }} value={loginForm.email} />
                  <input type='password' placeholder='password' name='password' className="w-full p-2 border-[1px] border-[solid] border-[#ccc] mt-2" onChange={(e) => { setLoginForm({ ...loginForm, password: e.target.value }) }} value={loginForm.password} />
                  <div className='flex justify-between mt-2 items-center'>
                    <ReCAPTCHA
                      sitekey={SITE_KEY}
                      ref={recaptchaRef}
                      onChange={changeCaptcha}
                    />
                  </div> 
                  <div className="flex justify-between items-center">
                    <button className="mt-4 p-3 bg-red-600 text-white">Submit</button>
                    <p className="text-blue-500 cursor-pointer" onClick={()=>setSignUp(true)}>Sign Up</p>
                  </div>
              </form>
            </div>
         )
       }
       <ToastContainer position="top-right" />
      </>

  )
}
