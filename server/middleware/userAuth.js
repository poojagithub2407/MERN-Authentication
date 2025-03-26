// import jwt from "jsonwebtoken";

// const userAuth = async (req, res, next) => {
//      const { token } = req.cookies;

//      if (!token) {
//           res.json({ success: false, message: 'not authorized Login again' })
//      }

//      try {
//          const tokenDecode= jwt.verify(token, process.env.JWT_SECRET);
//          if(tokenDecode.id){
//           req.body.userId=tokenDecode.id
//          }else{
//           res.json({ success: false, message: 'Not Authorized Login again' })

//          }
//          next();
//      } catch (error) {
//           res.json({ success: false, message: error.message })

//      }
// }



import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
     const { token } = req.cookies;

     if (!token) {
          return res.status(401).json({ success: false, message: "Not authorized. Login again." });
     }

     try {
          const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
          
          if (tokenDecode.id) {
               req.body.userId = tokenDecode.id;
               next(); // Only proceed if the token is valid
          } else {
               return res.status(401).json({ success: false, message: "Invalid token. Please log in again." });
          }
     } catch (error) {
          return res.status(401).json({ success: false, message: "Token verification failed. Please log in again." });
     }
};

export default userAuth;
