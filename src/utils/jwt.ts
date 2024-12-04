import jwt, { JwtPayload } from 'jsonwebtoken';
export const createJWT = (payload: Object) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }
  return jwt.sign({ payload }, process.env.JWT_SECRET);
};

export const verifyJWT = (token: string): JwtPayload => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  if (typeof decoded === 'string') {
    throw new Error('Invalid token format');
  }
  return decoded;
};
