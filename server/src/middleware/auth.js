import { verifyToken } from "../utils/jwt.js";

export function authenticate(req, res, next) {
  const token = req.cookies?.token;
  if (!token) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  try {
    req.user = verifyToken(token); // { id, role }
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired session" });
  }
}

export function requireAdmin(req, res, next) {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
}
