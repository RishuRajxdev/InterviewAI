const { GoogleGenAI } = require("@google/genai")
const { z } = require("zod")
const { zodToJsonSchema } = require("zod-to-json-schema")
const puppeteer = require("puppeteer")

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
})

// ─────────────────────────────────────────────
// MANUAL RESPONSE SCHEMA (plain object — no zod conversion)
// zodToJsonSchema was confusing Gemini into returning
// float vectors instead of objects inside arrays.
// ─────────────────────────────────────────────
const interviewReportResponseSchema = {
    type: "object",
    properties: {
        title: { type: "string" },
        matchScore: { type: "number" },
        technicalQuestions: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    question:  { type: "string" },
                    intention: { type: "string" },
                    answer:    { type: "string" },
                },
                required: ["question", "intention", "answer"],
            },
        },
        behavioralQuestions: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    question:  { type: "string" },
                    intention: { type: "string" },
                    answer:    { type: "string" },
                },
                required: ["question", "intention", "answer"],
            },
        },
        skillGaps: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    skill:    { type: "string" },
                    severity: { type: "string", enum: ["low", "medium", "high"] },
                },
                required: ["skill", "severity"],
            },
        },
        preparationPlan: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    day:   { type: "integer" },
                    focus: { type: "string" },
                    tasks: { type: "array", items: { type: "string" } },
                },
                required: ["day", "focus", "tasks"],
            },
        },
    },
    required: ["title", "matchScore", "technicalQuestions", "behavioralQuestions", "skillGaps", "preparationPlan"],
}

// ─────────────────────────────────────────────
// generateInterviewReport
// ─────────────────────────────────────────────
async function generateInterviewReport({ resume, selfDescription, jobDescription }) {

    const prompt = `You are an expert technical interviewer and career coach.
Analyze the Resume, Self Description, and Job Description below.
Return a single JSON object that strictly matches the schema provided.
Do NOT return markdown. Do NOT wrap in code fences. Return raw JSON only.

Resume:
${resume}

Self Description:
${selfDescription}

Job Description:
${jobDescription}`

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: interviewReportResponseSchema,
        },
    })

    console.log("Gemini raw response:", response.text)

    const text = response.text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim()
    const parsed = JSON.parse(text)

    console.log("Parsed response:", JSON.stringify(parsed, null, 2))
    return parsed
}

// ─────────────────────────────────────────────
// generateResumePdf
// ─────────────────────────────────────────────
const resumeHtmlSchema = z.object({
    html: z.string().describe(
        "Complete, self-contained HTML document for a professional resume. " +
        "Must be ATS-friendly, tailored to the job description, and 1–2 pages when printed."
    ),
})

async function generateResumePdf({ resume, selfDescription, jobDescription }) {

    const prompt = `You are a professional resume writer.

Given the candidate's existing resume, self-description, and the target job description,
rewrite the resume as a polished, ATS-friendly HTML document.

---
CANDIDATE RESUME:
${resume}

CANDIDATE SELF-DESCRIPTION:
${selfDescription}

JOB DESCRIPTION:
${jobDescription}
---

Rules:
- Output ONLY a JSON object with a single key "html".
- The HTML must be a complete, self-contained document (include <style> tags for formatting).
- Highlight skills and experiences most relevant to the job description.
- Keep it concise — ideally 1 page, maximum 2 pages when converted to PDF.
- Do NOT include placeholder text or comments in the HTML.`

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(resumeHtmlSchema),
        },
    })

    const cleaned = response.text
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim()

    const { html } = JSON.parse(cleaned)
    const pdfBuffer = await generatePdfFromHtml(html)
    return pdfBuffer
}

// ─────────────────────────────────────────────
// Puppeteer helper
// ─────────────────────────────────────────────
async function generatePdfFromHtml(htmlContent) {
    const browser = await puppeteer.launch({ args: ["--no-sandbox"] })
    const page = await browser.newPage()
    await page.setContent(htmlContent, { waitUntil: "networkidle0" })

    const pdfBuffer = await page.pdf({
        format: "A4",
        margin: { top: "20mm", bottom: "20mm", left: "15mm", right: "15mm" },
    })

    await browser.close()
    return pdfBuffer
}

module.exports = { generateInterviewReport, generateResumePdf }