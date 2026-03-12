import jwt from "jsonwebtoken";

export const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  
  if (!token) {
    return res.status(401).json({ success: false, message: "UNAUTHORIZED" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "default_secret");
    req.user = decoded; // { id, role }
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: "INVALID_TOKEN" });
  }
};

export const requireRole = (role) => (req, res, next) => {
  if (req.user?.role !== role) {
    return res.status(403).json({ success: false, message: "FORBIDDEN" });
  }
  next();
};
