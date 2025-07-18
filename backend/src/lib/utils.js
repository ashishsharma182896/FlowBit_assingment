
import jwt from "jsonwebtoken";

export const signJwt = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
};

export const setTokenCookie = (res, token) => {
  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true,                  // Prevents XSS
    sameSite: "strict",              // Prevents CSRF
    secure: process.env.NODE_ENV !== "development"
  });
};

export const generateTokenAndSetCookie = (user, res) => {
  const payload = {
    userId: user._id,
    customerId: user.customerId,
    role: user.role,
  };
  const token = signJwt(payload);
  setTokenCookie(res, token);
  return token;
};
