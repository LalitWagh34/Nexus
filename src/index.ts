import express from "express";
import { errorHandler } from "./middlewares/errorHandler";
import passport from "./config/passport";
import authRoutes from "./routes/auth.routes"
import conversationRoutes from "./routes/conversation.routes"
import messageRoutes from "./routes/message.routes"
const app = express();

app.use(express.json());
app.use(passport.initialize());

app.use("/auth", authRoutes)
app.use("/conversations", conversationRoutes);
app.use("/conversations/:id/messages" ,messageRoutes)


const PORT = process.env.PORT || 3000;

// Routes
app.get("/health", (req, res) => {
  res.json({ status: "ok", project: "Nexus" });
});


app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Nexus server running on port ${PORT}`);
});

export default app;