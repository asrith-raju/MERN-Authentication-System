import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken'
import userModel from "../models/User.js";
import transporter from "../config/nodeMailer.js";
import { EMAIL_VERIFY_TEMPLATE,PASSWORD_RESET_TEMPLATE } from "../config/emailTemplates.js";

// Register new user
export const register = async (req,res)=>{
    
    // Extract user details from request body
    const {name,email,password} = req.body

    // Check if all required fields are present
    if(!name || !email || !password){
        return res.json({success:false,message:"Missing Details"})
    }

    try {
        
        // Check if user already exists
        const existingUser = await userModel.findOne({email})
        if(existingUser){
            return res.json({success:false,message:"User Already Exist"})
        }
        
       // Hash password before saving
       const hashedPassword = await bcrypt.hash(password,10)

       // Create new user document
       const user = new userModel({name,email,password:hashedPassword})
       
       // Save user to database
       await user.save();

       // Generate JWT token
       const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'7d'})

       // Store token in cookie
       res.cookie('token',token,{
        httpOnly:true,
        secure:process.env.NODE_ENV === 'production',
        sameSite:process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        maxAge:7*24*60*60*1000
        })

         // Sending welcome email
        const mailOptions ={
            from:process.env.SENDER_EMAIL,
            to:email,
            subject:"Welcome to our Platform",
            text:`Welcome to our platform, Your account has been created with email id: ${email}`
        }

        await transporter.sendMail(mailOptions)

        // Return success response
        res.json({success:true})

    } catch (error) {

        // Handle errors
        res.json({success:false,message:error.message})
    }
}


// Login user
export const login = async (req,res)=>{

    // Extract login credentials
    const {email,password} = req.body

    // Check missing fields
    if(!email || !password){
        return res.json({success:false,message:"Missing Details"})
    }

    try {

        // Find user by email
        const user = await userModel.findOne({email})

        if(!user){
            return res.json({success:false,message:"Invalid email"})   
        }

       // Compare entered password with hashed password
       const isMatch = await bcrypt.compare(password,user.password)

       if(!isMatch){
        return res.json({success:false,message:"Invalid Password"})   
       }

       // Generate token
       const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'7d'})

       // Save token in cookie
       res.cookie('token',token,{
        httpOnly:true,
        secure:process.env.NODE_ENV === 'production',
        sameSite:process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        maxAge:7*24*60*60*1000
        })

        return res.json({success:true,message:"Login Successful"})

    } catch (error) {

        return res.json({success:false,message:error.message})
    }
}


// Logout user
export const logout = async (req,res)=>{
    try {

        // Clear token cookie
        res.clearCookie('token',{
            httpOnly:true,
            secure:process.env.NODE_ENV === 'production',
            sameSite:process.env.NODE_ENV === 'production' ? 'none' : 'strict'
        })

        return res.json({success:true,message:"Logged Out"})

    } catch (error) {

        return res.json({success:false,message:error.message})

    }
}


// Send verification OTP to user's email
export const sendVerifyOtp = async (req,res)=>{
    try {

        // Get logged-in user ID
        const userId = req.userId ;

        // Find user
        const user = await userModel.findById(userId);

        // Check if already verified
        if(user.isVerified){
            return res.json({success:false,message:"Account already verified"})
        }

        // Generate 6-digit OTP
        const otp = String(Math.floor(100000+Math.random()*900000))

        // Save OTP and expiry time
        user.verifyOtp = otp;
        user.verifyOtpExpireAt = Date.now() + 10*60*1000;

        await user.save();

        // Email OTP to user
        const mailOptions ={
            from:process.env.SENDER_EMAIL,
            to:user.email,
            subject:"Account Verification Otp",
            text:` Your OTP is:${otp}. It is valid for 10 minutes`,
            html:EMAIL_VERIFY_TEMPLATE.replace("{{otp}}",otp).replace("{{email}}",user.email)
        }

        await transporter.sendMail(mailOptions)

        res.json({success:true,message:"Verification OTP sent to your email"})

    } catch (error) {

        res.json({success:false,message:error.message})
    }
}


// Verify email using OTP
export const verifyEmail = async (req,res)=>{

    const { otp } = req.body;
    const userId = req.userId;

    // Check missing data
    if(!userId || !otp){
        return res.json({success:false,message:"Missing Details"})
    }

    try {

        const user = await userModel.findById(userId);

        if(!user){
            return res.json({success:false,message:"User not found"})
        }

        // Validate OTP
        if(user.verifyOtp === '' || user.verifyOtp !== otp){
            return res.json({success:false,message:"Invalid OTP"})
        }

        // Check OTP expiry
        if(user.verifyOtpExpireAt < Date.now()){
            return res.json({success:false,message:"OTP Expired"})
        }

        // Mark user verified
        user.isVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExpireAt = 0;

        await user.save();

        return res.json({success:true,message:"Email Verified Successfully"})

    } catch (error) {

       return res.json({success:false,message:error.message})
    }

}


// Check if user is authenticated
export const isAuthenticated = async (req,res)=>{
     try {

        return res.json({success:true})

     } catch (error) {

        res.json({success:false,message:error.message})
     }
}


// Send password reset OTP
export const sendResetOtp = async (req,res)=>{

     const {email} = req.body;

     if(!email){
        return res.json({success:false,message:"email is required"})
     }

     try {

        const user = await userModel.findOne({email});

        if(!user){
            return res.json({success:false,message:"User not found"})
        }

        // Generate reset OTP
        const otp = String(Math.floor(100000+Math.random()*900000))

        user.resetOtp = otp;
        user.resetOtpExpireAt = Date.now() + 15*60*1000;

        await user.save();

        // Send OTP email
        const mailOptions ={
            from:process.env.SENDER_EMAIL,
            to:user.email,
            subject:"Password Reset Otp",
            text:` Your OTP for password reset is:${otp}. It is valid for 15 minutes.`,
            html:PASSWORD_RESET_TEMPLATE.replace("{{otp}}",otp).replace("{{email}}",user.email)
        }

        await transporter.sendMail(mailOptions)

        return res.json({success:true,message:"Password reset OTP sent to your email"})

     } catch (error) {

        return res.json({success:false,message:error.message})
     }
}


// Reset user password
export const resetPassword = async (req,res)=>{

    const {email,otp,newPassword} = req.body;

    // Check missing fields
    if(!email || !otp || !newPassword){
        return res.json({success:false,message:"Missing Details"})
    }

    try {

        const user = await userModel.findOne({email});

        if(!user){
            return res.json({success:false,message:"User not found"})
        }

        // Validate OTP
        if(user.resetOtp === '' || user.resetOtp !== otp){
            return res.json({success:false,message:"Invalid OTP"})
        }

        // Check OTP expiry
        if(user.resetOtpExpireAt < Date.now()){
            return res.json({success:false,message:"OTP Expired"})
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword,10)

        // Update password
        user.password = hashedPassword;

        // Clear reset OTP
        user.resetOtp = '';
        user.resetOtpExpireAt = 0;

        await user.save();

        return res.json({success:true,message:"Password Reset Successfully"})

    } catch (error) {

        return res.json({success:false,message:error.message})
    }
}