import express from "express";
import { createServer } from "http"; 
import { errorHandler } from "./middlewares/errorHandler";
import passport from "./config/passport";
import authRoutes from "./routes/auth.routes";
import conversationRoutes from "./routes/conversation.routes";
import messageRoutes from "./routes/message.routes";
import { initSocket } from "./sockets/index"; 

const app = express();
const httpServer = createServer(app); 

app.use(express.json());
app.use(passport.initialize());


app.get("/health", (req, res) => {
  res.json({ status: "ok", project: "Nexus" });
});

app.use("/auth", authRoutes);
app.use("/conversations", conversationRoutes);
app.use("/conversations/:id/messages", messageRoutes);

app.use(errorHandler);


const io = initSocket(httpServer); 

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
  console.log(`Nexus server running on port ${PORT}`);
});

export { io }; 
export default app;