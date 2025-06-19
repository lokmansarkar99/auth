
import { verifyToken, refreshTokens } from '../services/auth.services.js';

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */


// export const verifyAuth= (req, res, next) => {

//     const token = req.cookies.access_token

//     if(!token) {
//         req.user = null;
//         return next()
//     }

//     try {
//         const decodedToken = verifyToken(token)
//         req.user =decodedToken;
//         // console.log('Token verified successfully:', decodedToken);
//         console.log('User:', req.user);
//     } catch (error) {
//         console.error('Token verification failed:', error);
//         req.user = null;
//         return next();
        
//     }

//     next();

// }




// Make verifyAuth middleware for session + access token + refresh token 
export const verifyAuth= async (req, res, next) => { 
const accessToken = req.cookies.access_token;
const refreshToken = req.cookies.refresh_token;

if(!accessToken && !refreshToken) {
    req.user = null;
    return next();
}

if(accessToken) {
    const decodedToken = verifyToken(accessToken);
    req.user = decodedToken;
    return next();
}

if(refreshToken) {
    try {
        const {newAccessToken, newRefreshToken, user} = await  refreshTokens(refreshToken); 


        req.user = user;

        const baseConfig = {httpOnly: true, secure: true}
        // Set the access token in a cookie
        res.cookie('access_token', newAccessToken, { 
            ...baseConfig,
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
        });



// set the refresh token in a cookie
        res.cookie('refresh_token', newRefreshToken, { 
            ...baseConfig,
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
        });

        return next();
    } catch (error) {
        console.error('Refresh token verification failed:', error);
        req.user = null;
        return next();
        
    }
}



return next();

}