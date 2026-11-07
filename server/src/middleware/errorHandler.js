import { ZodError } from "zod";

export function notFound(req, res) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

export function errorHandler(err, req, res, next) {
  console.error(err);

  if (err instanceof ZodError) {
    const first = err.issues[0];
    return res.status(400).json({ message: first?.message || "Invalid input" });
  }

  const status = err.status || 500;
  res.status(status).json({
    message: err.message || "Something went wrong",
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
}
