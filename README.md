# CQ Flashcard — Praxis Academy Trainee PM Assessment

A digital flashcard app that helps Bangladeshi SSC/HSC students practice **সৃজনশীল প্রশ্ন (Creative Questions)** — the long-form subjective questions that make up the majority of board exam marks.

## The Problem

MCQs are easy to practice digitally because they have instant feedback. But CQs — which carry far more marks — are subjective, long-form, and nearly impossible to practice alone without a teacher to grade your answer.

## The Solution

A flashcard-style UI where students:
1. Read the **উদ্দীপক** (stimulus passage)
2. Write their own answer first
3. Flip to see the **ideal answer + rubric points**
4. Honestly **self-grade** their response (বুঝিনি → নিখুঁত)
5. Repeat for all 4 parts of the CQ (জ্ঞান, অনুধাবন, প্রয়োগ, উচ্চতর দক্ষতা)

---

## What's In This Repo

| File | What it is |
|------|------------|
| `app.jsx` | The full React app |
| `index.css` | All styles and design tokens |
| `Task2.docx` | Product Requirement Document (Task 2) |
| `Task03.docx` | The Reality Check (Task 3) |

---

## Tech

- **React + Vite** — frontend
- **Custom CSS** — no UI library, fully hand-crafted design

---

## How to Run
Just Download and run this command in the terminal: npm run dev




## Assessment Tasks

**Task 1 — Prototype:** Built the working React app with Gemini AI integration, full 4-part CQ flow, self-grading, bookmark, skip, and result screen.

**Task 2 — Mini-Spec:** Wrote a 1-page PRD covering the feedback loop logic, what the content team needs to supply per card, and 8 edge cases the product must handle.

**Task 3 — Reality Check:** Identified the core flaw (flashcards train memorisation, not thinking) and proposed two specific metrics to prove the feature drives real learning — Self-Grade Improvement Rate and Answer Attempt Rate Before Flip.

---
