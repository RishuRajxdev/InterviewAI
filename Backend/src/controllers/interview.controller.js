const { generateInterviewReport, generateResumePdf } = require("../services/ai.service");
const interviewReportModel = require("../models/interviewReport.model");

//Sanitization of Gemini Responses..
function parseIfString(item) {
    if (typeof item === "string") {
        try { return JSON.parse(item) } catch { return null }
    }
    return item
}

function sanitizeAiResponse(raw) {
    const sanitizeQuestions = (arr) =>
        (Array.isArray(arr) ? arr : [])
            .map(parseIfString)
            .filter(Boolean)
            .map(q => ({
                question:  q.question  || q.Question  || "",
                intention: q.intention || q.Intention || q.purpose || "",
                answer:    q.answer    || q.Answer    || q.idealAnswer || "",
            }))
            .filter(q => q.question)

    const sanitizeSkillGaps = (arr) =>
        (Array.isArray(arr) ? arr : [])
            .map(parseIfString)
            .filter(Boolean)
            .map(g => {
                if (typeof g === "string") {
                    return { skill: g, severity: "medium" }
                }
                return {
                    skill:    g.skill    || g.Skill    || g.name || String(g),
                    severity: ["low", "medium", "high"].includes(g.severity?.toLowerCase())
                        ? g.severity.toLowerCase()
                        : "medium",
                }
            })
            .filter(g => g.skill)

    const sanitizePreparationPlan = (arr) =>
        (Array.isArray(arr) ? arr : [])
            .map(parseIfString)
            .filter(Boolean)
            .map((p, index) => {
                let dayNum = index + 1
                if (typeof p.day === "number") {
                    dayNum = p.day
                } else if (typeof p.day === "string") {
                    const match = p.day.match(/\d+/)
                    if (match) dayNum = parseInt(match[0])
                }

                let tasks = []
                if (Array.isArray(p.tasks) && p.tasks.length) {
                    tasks = p.tasks.map(String)
                } else if (typeof p.activities === "string") {
                    tasks = p.activities
                        .split(/\.\s+|\n/)
                        .map(s => s.trim())
                        .filter(Boolean)
                } else if (typeof p.actionItem === "string") {
                    tasks = [p.actionItem]
                } else {
                    tasks = ["Review and practice concepts for this day"]
                }

                return {
                    day:   dayNum,
                    focus: p.focus || p.topic || p.Focus || `Day ${dayNum} Focus`,
                    tasks,
                }
            })
            .filter(p => p.focus)

    return {
        title:               raw.title || raw.job_applied_for || raw.applied_position || "Target Role",
        matchScore:          typeof raw.matchScore === "number" ? raw.matchScore : (parseInt(raw.matchScore) || 0),
        
        technicalQuestions:  sanitizeQuestions(raw.technicalQuestions || raw.interview_questions_suggested || raw.technical_questions),
        behavioralQuestions: sanitizeQuestions(raw.behavioralQuestions || raw.behavioral_questions),
        skillGaps:           sanitizeSkillGaps(raw.skillGaps || raw.skills_gaps || raw.gaps_identified || raw.skills_evaluation_unmentioned_or_missing_skills),
        preparationPlan:     sanitizePreparationPlan(raw.preparationPlan || raw.preparation_plan || raw.roadmap),
    }
}



/**
 * @description Generate interview report based on resume, self description, and job description.
 */
async function generateInterViewReportController(req, res) {
    try {
        const { extractText, getDocumentProxy } = await import('unpdf')
        const pdf = await getDocumentProxy(Uint8Array.from(req.file.buffer))
        const { text } = await extractText(pdf, { mergePages: true })
        const resumeText = text

        const { selfDescription, jobDescription } = req.body

        const rawAiResponse = await generateInterviewReport({
            resume: resumeText,
            selfDescription,
            jobDescription,
        })

        const sanitized = sanitizeAiResponse(rawAiResponse)
        console.log("Sanitized report:", JSON.stringify(sanitized, null, 2))

        const interviewReport = await interviewReportModel.create({
            user:            req.user.id,
            resume:          resumeText,
            selfDescription,
            jobDescription,
            ...sanitized,
        })

        res.status(201).json({
            message: "Interview report generated successfully.",
            interviewReport,
        })
    } catch (error) {
        console.error("Failed to generate report:", error)
        res.status(500).json({
            message: "An error occurred while generating or saving the report.",
            error: error.message,
        })
    }
}

/**
 * @description Get a single interview report by ID.
 */
async function getInterviewReportByIdController(req, res) {
    const { interviewId } = req.params

    const interviewReport = await interviewReportModel.findOne({
        _id: interviewId,
        user: req.user.id,
    })

    if (!interviewReport) {
        return res.status(404).json({ message: "Interview report not found." })
    }

    res.status(200).json({
        message: "Interview report fetched successfully.",
        interviewReport,
    })
}

/**
 * @description Get all interview reports for the logged-in user.
 */
async function getAllInterviewReportsController(req, res) {
    const interviewReports = await interviewReportModel
        .find({ user: req.user.id })
        .sort({ createdAt: -1 })
        .select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")

    res.status(200).json({
        message: "Interview reports fetched successfully.",
        interviewReports,
    })
}

/**
 * @description Generate and download a tailored resume PDF.
 */
async function generateResumePdfController(req, res) {
    const { interviewReportId } = req.params

    const interviewReport = await interviewReportModel.findById(interviewReportId)

    if (!interviewReport) {
        return res.status(404).json({ message: "Interview report not found." })
    }

    const { resume, jobDescription, selfDescription } = interviewReport

    const pdfBuffer = await generateResumePdf({ resume, jobDescription, selfDescription })

    res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`,
    })

    res.send(pdfBuffer)
}

/**
 * @description Delete an interview report by ID.
 */
async function deleteInterviewReportController(req, res) {
    try {
        const { interviewId } = req.params

        const interviewReport = await interviewReportModel.findOneAndDelete({
            _id: interviewId,
            user: req.user.id,
        })

        if (!interviewReport) {
            return res.status(404).json({ message: "Interview report not found." })
        }

        res.status(200).json({
            message: "Interview report deleted successfully.",
        })
    } catch (error) {
        console.error("Failed to delete report:", error)
        res.status(500).json({
            message: "An error occurred while deleting the report.",
            error: error.message,
        })
    }
}

module.exports = {
    generateInterViewReportController,
    getInterviewReportByIdController,
    getAllInterviewReportsController,
    generateResumePdfController,
    deleteInterviewReportController,
}