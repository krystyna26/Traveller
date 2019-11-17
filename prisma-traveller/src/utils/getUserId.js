import jwt from 'jsonwebtoken';

const getUserId = (request, requireAuth = true) => {
  // console.log('GET USER ID');
  const header = request.request ? request.request.headers.authorization: request.connection.context.Authorization;

  // console.log('HEADER', header);
  if(header){
    const token = header.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
  // console.log("decoded.userId: ", decoded.userId);
    return decoded.userId;

  };
  // console.log("AUTH", requireAuth);
  if(requireAuth){
    throw new Error("Authentication required")
  };

  return null;
}

export { getUserId as default }
