"use client"
import React, { useState,useRef } from 'react'

function page() {
    const [otp, setOtp] = useState(['', '', '', '']);
    const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
    const [formData, setFormData] = useState({
        name: "",
        email: "",
    });

    const [otpLoading, setOTPLoading]=useState(false)
    const [errors, setErrors] = useState({});
    const handleChange = (e, index) => {
        const { value } = e.target;

        if (/^[0-9]$/.test(value) || value === '') {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);

            // Move to the next input
            if (value && index < inputRefs.length - 1) {
                inputRefs[index + 1].current.focus();
            }
            // Move to previous input if backspace
            if (!value && index > 0) {
                inputRefs[index - 1].current.focus();
            }
        }
    };

    const handlePaste = (e) => {
        const pastedData = e.clipboardData.getData('text');
        if (/^\d{4}$/.test(pastedData)) {
            setOtp(pastedData.split(''));
            inputRefs[3].current.focus();
           
        }
    };
    const validateForm = () => {
        const newErrors = {};
        if(formData.name){
            if (!formData.name.trim()) newErrors.name = 'Please enter your name';
        }else{
            newErrors.name = 'Please enter your name';
        }
        const emailPattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

        if (!emailPattern.test(formData.email)) newErrors.email = 'please provide a valid email';
    }
    const handleOtp=(e)=>{
        e.preventDefault()
        const ifValid = validateForm();

        if(!ifValid) return setTimeout(()=>{setErrors({})},4000);
        setOTPLoading(true)
    }
  return (
    <>
         <div className="w-[500px] fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] border p-3">
            <h2 className="text-[orangered] font-bold text-[18px]">Login With OTP</h2>
            <form method="post">
                <input type='text' placeholder='name' name='name' className="w-full p-2 border-[1px] border-[solid] border-[#ccc] mt-2" onChange={(e) => { setFormData({ ...formData, name: e.target.value }) }} value={formData.name} />
                <div className='flex '>
                      <input 
                        type='text' 
                        placeholder='Email' 
                        name='email'
                        style={{width:"80%"}} 
                        className="w-full p-2 border-[1px] border-[solid] border-[#ccc] mt-2" 
                        onChange={(e)=>{setEmaildata({...formData,email:e.target.value})}} 
                        value={formData.email} 
                      />
                      <button 
                        type="button" 
                        className='font-bold ms-3 mt-[10px] p-2 text-[12px] text-[black]' 
                        style={{backgroundColor:"brown", color:"white"}}
                        onClick={handleOtp}
                      >
                        GET OTP
                      </button>
                </div>
                {(otpLoading && 
                    <>
                        <div style={{ display: 'flex', gap: '10px' }}>
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                type="text"
                                value={digit}
                                onChange={(e) => handleChange(e, index)}
                                onFocus={(e) => e.target.select()}
                                ref={inputRefs[index]}
                                maxLength={1}
                                style={{ border:'1px solid #ededed',width: '40px', height: '40px', fontSize: '20px', textAlign: 'center', marginTop:"10px" }}
                                onPaste={handlePaste}
                            />
                        ))}
                        </div>
                        <button
                            onClick={() => alert('OTP Submitted: ' + otp.join(''))}
                            style={{ marginTop: '20px', padding: '10px', backgroundColor:"orangered", color:"white" }}
                        >
                        Submit OTP
                        </button>
                    </> 
                )}
            </form>
                
         </div>
    </>
  )
}

export default page