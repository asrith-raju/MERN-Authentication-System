import userModel from "../models/User.js";

// Controller function to fetch logged-in user data
export const getUserData = async (req,res)=>{

    try {

        // Get user ID from request (usually added by auth middleware)
        const userId= req.userId ;
        
        // Find user in database using ID
        const user = await userModel.findById(userId)

        // If user does not exist, return error response
        if(!user){
            return res.json({success:false,message:"User not found"})
        }

        // Send selected user data as response
        res.json({
            success:true,
            userData:{
                name:user.name,          // User's name
                isVerified:user.isVerified // Verification status
            }
        })

    } catch (error) {

        // Handle unexpected errors
        res.json({success:false,message:error.message})
    }
}