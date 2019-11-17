import jwt from 'jsonwebtoken';
// https://www.npmjs.com/package/jsonwebtoken

const generateToken = (id) => {
  // token third arg is for how long the token should be valid, and it's optional
  // https://www.npmjs.com/package/jsonwebtoken
  // token: jwt.sign({ userId: user.id}, 'secretToken', { expiresIn: '7 days' })
  return jwt.sign({ userId: id }, process.env.JWT_SECRET)
}

export { generateToken as default }
