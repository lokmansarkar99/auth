import prisma from '../controllers/prismaController.js'
import argon2 from 'argon2'
import e from 'connect-flash';
import session from 'express-session';
import jwt from 'jsonwebtoken'



export const getUserByEmail = async (email) => {
  // findUnique expects a where object, not empty array
  const user = await prisma.user.findUnique({
    where: { email }
  });
  await console.log("User Exist ")

  return user;
}

export const createUser = async ({ name, email, password }) => {
  // Hash the password before storing it
  const hashedPassword = await argon2.hash(password)

  const newUser = await prisma.user.create({
    data: { name, email, password:hashedPassword }
    
  });

 await console.log(newUser)
  return newUser;
}


export const generateToken = ({id,name, email}) =>{
  
  return jwt.sign({id,name, email}, process.env.JWT_SECRET,{
    expiresIn: '30d'
  } )

}


// Verify the token and return the decoded payload
export const verifyToken = (token) => {

  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    console.error('Token verification failed:', error);
    throw new Error('Invalid token');
    
  }
}


// CreateSesion
export const createSession = async (userId, {ipAddress, userAgent}) => {
  const session = await prisma.session.create({
    data: {
     user_id:userId,
     ipAddress,
     userAgent
    }
    


  })


  return session;
}

// create access token
export const createAccessToken = ({id,name, email, sessionId}) => { 

  return jwt.sign({id, name, email, sessionId}, process.env.JWT_SECRET, {
    expiresIn: '15m' // Access token valid for 15 minutes
  });
}


// Create refresh token
export const createRefreshToken = (sessionId) => {
  return jwt.sign({ sessionId }, process.env.JWT_SECRET, {
    expiresIn: '30d' // Refresh token valid for 30 days
  });
}


// refrsh tokens

export const refreshTokens = async (refreshToken) => { 
  try {
    
    const decodedToken = verifyToken(refreshToken)


      const currentSession = await prisma.session.findUnique({
        where: {
          id: decodedToken.sessionId
        }
      });

      if(!currentSession || !currentSession.valid) {
        throw new Error('Invalid session');
      }

      const user = await prisma.user.findUnique({
        where: {
          id: currentSession.user_id
        }
      });

      if(!user) {
        throw new Error('User not found');
      }

      // Create new access token
      const userInfo = {
        id: user.id,
        name: user.name,
        email: user.email,
        sessionId: currentSession.id
      }

      const newAccessToken = createAccessToken(userInfo);

      // Create new refresh token
      const newRefreshToken = createRefreshToken(currentSession.id);
      
      
      return { newAccessToken, newRefreshToken, user:userInfo };



  } catch (error) {
    
    console.error('Error refreshing tokens:', error);
    throw new Error('Failed to refresh tokens');
  }


}
 

// Clear User Session
export const clearUserSession = async (sessionId) => {
  try {
    // update the session from the database
    // await prisma.session.update({
    //   where: { id: sessionId },
    //   data: { valid: false } // Mark the session as invalid
    // });
    // Optionally, you can also delete the session
    await prisma.session.delete({
      where: { id: sessionId }
    });
    console.log('User session cleared successfully');


    
    return true;
  } catch (error) {
    console.error('Error clearing user session:', error);
    throw new Error('Failed to clear user session');
  }
}