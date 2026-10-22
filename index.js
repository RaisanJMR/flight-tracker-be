const express = require("express");
const airportsRouter = require("./routes/airports");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Flight Tracker API is running",
    status: "ok",
  });
});

app.use("/api/airports", airportsRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
