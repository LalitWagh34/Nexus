import express from "express";
import { createServer } from "http"; 
import { errorHandler } from "./middlewares/errorHandler";
import passport from "./config/passport";
import authRoutes from "./routes/auth.routes";
import conversationRoutes from "./routes/conversation.routes";
import messageRoutes from "./routes/message.routes";
import { initSocket } from "./sockets/index"; 
import helmet from "helmet"
import {logger} from "./middlewares/logger"
import { authLimiter , globalLimiter } from "./middlewares/rateLimiter";
import uploadRoutes from "./routes/upload.routes";

const app = express();
const httpServer = createServer(app); 

app.use(helmet());
app.use(logger);
app.use(globalLimiter);
app.use(express.json());
app.use(passport.initialize());




app.get("/health", (req, res) => {
  res.json({ status: "ok", project: "Nexus" });
});

app.use("/auth", authLimiter ,authRoutes);
app.use("/conversations", conversationRoutes);
app.use("/conversations/:id/messages", messageRoutes);
app.use("/upload", uploadRoutes);

app.use(errorHandler);


const io = initSocket(httpServer); 

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
  console.log(`Nexus server running on port ${PORT}`);
});

export { io }; 
export default app;