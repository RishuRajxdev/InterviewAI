const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const { ensureDBConnected } = require("./middlewares/db.middleware")

const app = express()

app.use(express.json())
app.use(cookieParser())

app.use(cors({
    origin: ["http://localhost:5173", "https://interview-forge-client.vercel.app"],
    credentials: true
}))

app.get("/", (req, res) => {
    res.send("InterviewForge is Running !")
})

app.use(ensureDBConnected)

/* require all the routes here */
const authRouter = require("./routes/auth.routes")
const interviewRouter = require("./routes/interview.routes")


/* using all the routes here */
app.use("/api/auth", authRouter)
app.use("/api/interview", interviewRouter)



module.exports = app