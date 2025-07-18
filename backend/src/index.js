import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import { connectDB } from "./lib/db.js";

import authRoutes from "./routes/auth.routes.js";        
import userRoutes from "./routes/user.routes.js";
import supportTicketRoutes from "./routes/supportTicket.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import auditLogRoutes from "./routes/auditLog.routes.js";
import adminRoutes from "./routes/admin.routes.js";       

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());


app.use("/api/auth", authRoutes);
app.use("/api", profileRoutes);
app.use("/api/tickets", supportTicketRoutes);

app.use("/admin/users", userRoutes);
app.use("/admin", auditLogRoutes);
app.use("/admin", adminRoutes);   

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
