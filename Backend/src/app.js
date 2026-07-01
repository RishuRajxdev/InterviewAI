const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")

const app = express()

app.use(express.json())
app.use(cookieParser())

app.use(cors({
    origin: [
        "http://localhost:5173", 
        "https://interview-forge-frontend-seven.vercel.app"
    ],
    credentials: true
}))

const authRouter = require("./routes/auth.routes")
const interviewRouter = require("./routes/interview.routes")

app.use("/api/auth", authRouter)
app.use("/api/interview", interviewRouter)

app.get("/", (req, res) => {
  res.send("Interview Forge Backend is Live and Running!");
});

module.exports = app