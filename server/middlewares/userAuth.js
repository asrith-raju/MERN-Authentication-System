import jwt from 'jsonwebtoken';

// Middleware to authenticate user using JWT token
const userAuth = (req,res,next)=>{

    // Get token from cookies
    const {token} = req.cookies;

    // Check if token exists
    if(!token){
        return res.status(401).json({success:false,message:"Not Unauthorized"})
    }

    try {
        
        // Verify token using JWT secret key
        const tokenDecode = jwt.verify(token,process.env.JWT_SECRET)

        // If token contains valid user ID, attach it to request
        if(tokenDecode.id){
            req.userId = tokenDecode.id 
        }else{

            // If token is invalid
            return res.json({success:false,message:"not authorized Login again"})
        }

        // Proceed to next middleware/controller
        next();

    } catch (error) {

        // Handle token verification errors
        res.json({success:false,message:error.message})
    }
}

// Export authentication middleware
export default userAuth;