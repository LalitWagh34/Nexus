import express from "express";

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;

app.get("/health", (req, res) => {
  res.json({ status: "ok", project: "Nexus" });
});

app.listen(PORT, () => {
  console.log(`Nexus server running on port ${PORT}`);
});

export default app;