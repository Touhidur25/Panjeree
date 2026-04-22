import { useState, useEffect, useCallback } from "react";

const PART_META = [
  { badgeClass: "badge-k", dotClass: "bdot-k", dotColor: "#534AB7", marks: "১" },
  { badgeClass: "badge-c", dotClass: "bdot-c", dotColor: "#0F6E56", marks: "২" },
  { badgeClass: "badge-a", dotClass: "bdot-a", dotColor: "#854F0B", marks: "৩" },
  { badgeClass: "badge-h", dotClass: "bdot-h", dotColor: "#993C1D", marks: "৪" },
];

const PART_TYPES = [
  "জ্ঞান (Knowledge)",
  "অনুধাবন (Comprehension)",
  "প্রয়োগ (Application)",
  "উচ্চতর দক্ষতা (Higher Ability)",
];

const PART_LABELS = ["জ্ঞ", "অনু", "প্র", "উচ্চ"];

const TOPICS = [
  "গতি ও বল",
  "তাপ ও তাপমাত্রা",
  "আলো ও প্রতিসরণ",
  "বিদ্যুৎ ও চুম্বক",
  "তরঙ্গ ও শব্দ",
  "মহাকর্ষ ও কেপলার",
  "চাপ ও প্লবতা",
];

const FALLBACK_STIMULUS =
  "রাফি একটি ঢালু সমতলে ১০ কেজি ভরের একটি বাক্স টানছে। ঢালের কোণ ৩০° এবং রাফি ২০ নিউটন বল প্রয়োগ করে বাক্সটি ৫ মিটার উপরে তোলে। এই প্রক্রিয়ায় ঘর্ষণ বল ৫ নিউটন।";

const FALLBACK_PARTS = [
  {
    ...PART_META[0],
    type: PART_TYPES[0],
    stimulus: FALLBACK_STIMULUS,
    question: "কাজ (Work) কাকে বলে?",
    hint: "সংজ্ঞাটি নিজের ভাষায় লেখার চেষ্টা করো।",
    answer:
      "যখন কোনো বস্তুর উপর বল প্রয়োগ করা হয় এবং সেই বলের দিকে বস্তুর সরণ ঘটে, তখন সেই বল কর্তৃক কৃত কার্যকে কাজ বলে। কাজ = বল × সরণ × cosθ।",
    rubric: ["সংজ্ঞা সঠিক", "সমীকরণ উল্লেখ", "θ এর ভূমিকা"],
  },
  {
    ...PART_META[1],
    type: PART_TYPES[1],
    stimulus: FALLBACK_STIMULUS,
    question:
      "রাফি যদি বাক্সটিকে না সরিয়ে শুধু ধরে রাখে, তাহলে কি কোনো কাজ হবে? ব্যাখ্যা করো।",
    hint: "সরণ এবং কাজের সম্পর্কের কথা ভাবো।",
    answer:
      'না, কোনো কাজ হবে না। সরণ শূন্য হলে কাজ = বল × ০ = শূন্য। এটি "শূন্য কাজ" (zero work) এর উদাহরণ।',
    rubric: ["সরণ = ০ উল্লেখ", "কাজ = ০ প্রমাণ", "ব্যাখ্যা যুক্তিসংগত"],
  },
  {
    ...PART_META[2],
    type: PART_TYPES[2],
    stimulus: FALLBACK_STIMULUS,
    question: "রাফি বাক্সটি ৫ মিটার ওপরে তুলতে কত কাজ করেছে? দেখাও।",
    hint: "বল = ২০ N, সরণ = ৫ m ব্যবহার করো।",
    answer: "W = F × s × cosθ = ২০ × ৫ × ১ = ১০০ জুল",
    rubric: ["সূত্র সঠিক", "মান বসানো সঠিক", "একক (জুল) উল্লেখ", "উত্তর সঠিক"],
  },
  {
    ...PART_META[3],
    type: PART_TYPES[3],
    stimulus: FALLBACK_STIMULUS,
    question:
      "ঘর্ষণ বল না থাকলে রাফির কাজ কি কম না বেশি হতো? বিশ্লেষণ করো।",
    hint: "শক্তির সংরক্ষণ সূত্রের কথা ভাবো।",
    answer:
      "ঘর্ষণ না থাকলে কাজ কম হতো। ঘর্ষণ বল ২৫ জুল শক্তি তাপে রূপান্তরিত করছে। এটি শক্তির সংরক্ষণ সূত্রের উদাহরণ।",
    rubric: [
      "তুলনামূলক বিশ্লেষণ",
      "শক্তির রূপান্তর ব্যাখ্যা",
      "সংরক্ষণ সূত্রের উল্লেখ",
      "বাস্তব প্রয়োগ",
    ],
  },
];

const GRADE_LABELS = ["বুঝিনি", "আংশিক", "ভালো", "নিখুঁত"];
const GRADE_EMOJIS = ["😕", "🤔", "😊", "🌟"];
const GRADE_SUB = [
  "পুনরায় পড়তে হবে",
  "কিছুটা বুঝেছি",
  "বেশিরভাগ সঠিক",
  "পূর্ণ নম্বর",
];
const GRADE_COLORS = ["#FCEBEB", "#FAEEDA", "#EAF3DE", "#EEEDFE"];
const GRADE_TEXT = ["#501313", "#412402", "#173404", "#26215C"];


const toBengali = (n) =>
  String(n).replace(/[0-9]/g, (d) => "০১২৩৪৫৬৭৮৯"[d]);

const AI_PROMPT = (topic) =>
  `তুমি একজন বাংলাদেশী মাধ্যমিক পদার্থবিজ্ঞান শিক্ষক। "${topic}" বিষয়ে একটি সৃজনশীল প্রশ্ন (CQ) তৈরি করো।

তোমাকে অবশ্যই শুধুমাত্র valid JSON return করতে হবে। কোনো markdown, backtick, বা অতিরিক্ত text নয়।

JSON structure:
{
  "stimulus": "উদ্দীপকের বাংলা টেক্সট (৩-৪ বাক্য, বাস্তব পরিস্থিতি)",
  "chapter": "অধ্যায়ের নাম",
  "parts": [
    { "question": "জ্ঞানমূলক প্রশ্ন", "hint": "ছাত্রের জন্য হিন্ট", "answer": "আদর্শ উত্তর", "rubric": ["পয়েন্ট ১","পয়েন্ট ২","পয়েন্ট ৩"] },
    { "question": "অনুধাবনমূলক প্রশ্ন", "hint": "ছাত্রের জন্য হিন্ট", "answer": "আদর্শ উত্তর", "rubric": ["পয়েন্ট ১","পয়েন্ট ২","পয়েন্ট ৩"] },
    { "question": "প্রয়োগমূলক প্রশ্ন (numerical হলে ভালো)", "hint": "ছাত্রের জন্য হিন্ট", "answer": "ধাপে ধাপে সমাধান", "rubric": ["পয়েন্ট ১","পয়েন্ট ২","পয়েন্ট ৩","পয়েন্ট ৪"] },
    { "question": "বিশ্লেষণমূলক প্রশ্ন", "hint": "ছাত্রের জন্য হিন্ট", "answer": "গভীর বিশ্লেষণ", "rubric": ["পয়েন্ট ১","পয়েন্ট ২","পয়েন্ট ৩","পয়েন্ট ৪","পয়েন্ট ৫"] }
  ]
}`;


async function generateCQ() {
  const topic = TOPICS[Math.floor(Math.random() * TOPICS.length)];
  const data = await callGemini(AI_PROMPT(topic));
  const raw = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
  const parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());
  const stimulus = parsed.stimulus;
  const newParts = parsed.parts.map((p, i) => ({
    ...PART_META[i],
    type: PART_TYPES[i],
    stimulus,
    question: p.question,
    hint: p.hint,
    answer: p.answer,
    rubric: p.rubric || [],
  }));
  return { parts: newParts, chapter: parsed.chapter || topic };
}

function TopBar() {
  return (
    <div className="topbar">
      <div className="topbar-brand">
        <div className="brand-logo">
          <svg viewBox="0 0 16 16" fill="none" width="16" height="16">
            <rect x="2" y="2" width="5" height="5" rx="1.5" fill="white" />
            <rect x="9" y="2" width="5" height="5" rx="1.5" fill="white" opacity=".6" />
            <rect x="2" y="9" width="5" height="5" rx="1.5" fill="white" opacity=".6" />
            <rect x="9" y="9" width="5" height="5" rx="1.5" fill="white" opacity=".3" />
          </svg>
        </div>
        <span className="brand-name">Praxis</span>
        <span className="brand-tag">Academy</span>
      </div>
      <div className="topbar-right">
        <div className="avatar">রা</div>
      </div>
    </div>
  );
}

function SubjectBar({ currentIndex, chapter }) {
  const title = chapter
    ? `পদার্থবিজ্ঞান — ${chapter}`
    : "পদার্থবিজ্ঞান — কাজ, শক্তি ও ক্ষমতা";
  return (
    <div className="subject-bar">
      <div className="subject-info">
        <div className="chapter-pill">{chapter || "অধ্যায় ৫"}</div>
        <div className="subject-title">{title}</div>
      </div>
      <div className="part-stepper">
        {PART_TYPES.map((p, i) => (
          <div className="step-node" key={i}>
            <div
              className={`step-circle ${
                i < currentIndex ? "done" : i === currentIndex ? "active" : ""
              }`}
            >
              {i < currentIndex ? (
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path
                    d="M2 5l2.5 2.5 3.5-4"
                    stroke="white"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                PART_LABELS[i]
              )}
            </div>
            {i === currentIndex && (
              <span className="step-label-sm">{p.split(" ")[0]}</span>
            )}
            {i < PART_TYPES.length - 1 && <div className="step-connector" />}
          </div>
        ))}
      </div>
    </div>
  );
}

function ProgressBar({ currentIndex, total = 4 }) {
  const pct = Math.round((currentIndex / total) * 100);
  return (
    <div className="progress-section">
      <div className="progress-meta">
        <span className="prog-label">
          অংশ {toBengali(currentIndex + 1)} এর {toBengali(total)}
        </span>
        <span className="prog-pct">{pct}%</span>
      </div>
      <div className="prog-track">
        <div className="prog-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function QuestionCard({
  part,
  answer,
  charCount,
  onAnswerChange,
  onReveal,
  onSkip,
  onNext,
  onBookmark,
  bookmarked,
  revealed,
  skipped,
  canNext,
  isLast,
}) {
  return (
    <div className="card-main">
      <div className="card-header">
        <div className={`part-type-badge ${part.badgeClass}`}>
          <div className={`badge-dot ${part.dotClass}`} />
          <span>{part.type}</span>
        </div>
        <div className="marks-tag">
          <div className="marks-icon">{part.marks}</div>
          <span className="marks-label">নম্বর</span>
        </div>
      </div>
      <div className="card-divider" />

      <div className="stimulus-section">
        <div className="stimulus-header">
          <div className="stimulus-icon">
            <svg viewBox="0 0 10 10" fill="none" width="10" height="10">
              <path
                d="M1 2h8M1 5h6M1 8h4"
                stroke="white"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <span className="stimulus-lbl">উদ্দীপক</span>
        </div>
        <p className="stimulus-text">{part.stimulus || FALLBACK_STIMULUS}</p>
      </div>

      <div className="question-section">
        <div className="question-label">প্রশ্ন</div>
        <p className="question-text">{part.question}</p>
      </div>

      <div className="answer-section">
        <div className="answer-label-row">
          <div className="answer-label">তোমার উত্তর</div>
          <div className="char-count">{toBengali(charCount)} অক্ষর</div>
        </div>
        <textarea
          value={answer}
          onChange={(e) => onAnswerChange(e.target.value)}
          disabled={revealed || skipped}
          placeholder="এখানে তোমার উত্তর লিখো — নিজের ভাষায় ব্যাখ্যা করার চেষ্টা করো..."
          rows={4}
        />
        <div className="hint-strip">
          <svg className="hint-icon" viewBox="0 0 14 14" fill="none" width="14" height="14">
            <circle cx="7" cy="7" r="6" stroke="#534AB7" strokeWidth="1" />
            <path d="M7 6.5v3" stroke="#534AB7" strokeWidth="1.2" strokeLinecap="round" />
            <circle cx="7" cy="4.5" r=".6" fill="#534AB7" />
          </svg>
          <span className="hint-text">{part.hint}</span>
        </div>
      </div>

      <div className="card-footer">
        <div className="action-left">
          <button
            className={`btn-icon${bookmarked ? " active-bm" : ""}`}
            onClick={onBookmark}
            title="সেভ করুন"
          >
            <svg viewBox="0 0 14 14" fill="none" width="14" height="14">
              <path
                d="M3 2h8v10l-4-2.5L3 12V2z"
                stroke={bookmarked ? "#854F0B" : "#6b6b66"}
                strokeWidth="1"
                strokeLinejoin="round"
                fill={bookmarked ? "#FAEEDA" : "none"}
              />
            </svg>
          </button>
          {!revealed && !skipped && (
            <button className="btn-skip" onClick={onSkip}>
              এড়িয়ে যাও
            </button>
          )}
        </div>
        <div className="action-right">
          {!revealed && !skipped && (
            <button className="btn-reveal" onClick={onReveal}>
              উত্তর দেখো
            </button>
          )}
          <button className="btn-next" onClick={onNext} disabled={!canNext}>
            <span>{isLast ? "সম্পন্ন করো" : "পরবর্তী"}</span>
            <svg viewBox="0 0 14 14" fill="none" width="14" height="14">
              <path
                d="M5 3l4 4-4 4"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

function AnswerRevealCard({ part }) {
  return (
    <div className="answer-reveal-card">
      <div className="reveal-header">
        <div className="reveal-header-icon">
          <svg viewBox="0 0 10 10" fill="none" width="10" height="10">
            <path
              d="M2 5l2 2 4-4"
              stroke="white"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <span className="reveal-lbl">আদর্শ উত্তর</span>
      </div>
      <div className="reveal-body">
        <p className="ideal-answer-text">{part.answer}</p>
        <div className="rubric-section">
          <div className="rubric-lbl">মূল্যায়ন পয়েন্ট</div>
          <div className="rubric-tags">
            {(part.rubric || []).map((r, i) => (
              <div className="rubric-tag" key={i}>
                <div className="rtag-dot" />
                {r}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SelfGradeCard({ selectedGrade, onSelectGrade }) {
  return (
    <div className="selfgrade-card">
      <div className="sg-header">
        <span className="sg-title">নিজের উত্তর মূল্যায়ন করো</span>
        <span className="sg-sub">আদর্শ উত্তরের সাথে তুলনা করো</span>
      </div>
      <div className="sg-body">
        {GRADE_LABELS.map((label, i) => (
          <button
            key={i}
            className={`sg-btn${selectedGrade === i ? ` sel-${i}` : ""}`}
            onClick={() => onSelectGrade(i)}
          >
            <div className="sg-emoji">{GRADE_EMOJIS[i]}</div>
            <div className="sg-label">{label}</div>
            <div className="sg-sub-lbl">{GRADE_SUB[i]}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

function ResultScreen({ grades, skipped, bookmarked, parts, onRestart, onNewCQ }) {
  const good = grades.filter((g) => g >= 2).length;
  const sk = skipped.filter(Boolean).length;
  const attempted = parts.length - sk;

  const stats = [
    { val: toBengali(attempted), label: "উত্তর দিয়েছো", color: "#534AB7" },
    { val: toBengali(good), label: "ভালো / নিখুঁত", color: "#3B6D11" },
    { val: toBengali(sk), label: "এড়িয়ে গেছো", color: "#854F0B" },
    { val: bookmarked ? "১" : "০", label: "সেভ করেছো", color: "#993C1D" },
  ];

  return (
    <div className="result-shell">
      <div className="result-hero">
        <div className="result-badge">
          <svg viewBox="0 0 28 28" fill="none" width="28" height="28">
            <circle cx="14" cy="14" r="13" stroke="#534AB7" strokeWidth="1.5" />
            <path
              d="M8 14l4 4 8-8"
              stroke="#534AB7"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className="result-title">অনুশীলন সম্পন্ন!</div>
        <div className="result-sub">
          তুমি এই CQ-এর সবগুলো অংশ শেষ করেছো।
          <br />
          তোমার স্ব-মূল্যায়নের ফলাফল নিচে দেখো।
        </div>
      </div>

      <div className="result-stats">
        {stats.map((s, i) => (
          <div className="stat-card" key={i}>
            <div className="stat-val" style={{ color: s.color }}>
              {s.val}
            </div>
            <div className="stat-lbl">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="breakdown-card">
        <div className="bc-header">অংশওয়ারী ফলাফল</div>
        {parts.map((p, i) => {
          let chip = "";
          let chipStyle = {};
          if (skipped[i]) {
            chip = "এড়িয়ে গেছো";
            chipStyle = { background: "#FAEEDA", color: "#633806" };
          } else if (grades[i] !== null) {
            chip = GRADE_LABELS[grades[i]];
            chipStyle = {
              background: GRADE_COLORS[grades[i]],
              color: GRADE_TEXT[grades[i]],
            };
          } else {
            chip = "উত্তর নেই";
          }
          return (
            <div className="bc-row" key={i}>
              <div className="bc-left">
                <div className="bc-dot" style={{ background: p.dotColor }} />
                <div className="bc-type">{p.type.split("(")[0].trim()}</div>
              </div>
              <span className="bc-chip" style={chipStyle}>
                {chip}
              </span>
            </div>
          );
        })}
      </div>

      <div className="result-actions">
        <button className="btn-newcq" style={{ flex: 1 }} onClick={onRestart}>
          <svg viewBox="0 0 16 16" fill="none" width="14" height="14">
            <path d="M3 8a5 5 0 1 1 5 5" stroke="white" strokeWidth="1.3" strokeLinecap="round"/>
            <path d="M3 5v3h3" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          আবার শুরু থেকে করো
        </button>
      </div>
    </div>
  );
}




export default function CQFlashcard() {
  const [parts, setParts] = useState(FALLBACK_PARTS);
  const [chapter, setChapter] = useState("কাজ, শক্তি ও ক্ষমতা");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [grades, setGrades] = useState([null, null, null, null]);
  const [skipped, setSkipped] = useState([false, false, false, false]);
  const [bookmarked, setBookmarked] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [answer, setAnswer] = useState("");
  const [screen, setScreen] = useState("quiz");

  const part = parts[currentIndex];
  const isSkipped = skipped[currentIndex];
  const currentGrade = grades[currentIndex];
  const canNext = revealed ? currentGrade !== null : isSkipped;
  const isLast = currentIndex === parts.length - 1;

  useEffect(() => {
    setRevealed(false);
    setAnswer("");
  }, [currentIndex]);

  const resetQuizState = () => {
    setCurrentIndex(0);
    setGrades([null, null, null, null]);
    setSkipped([false, false, false, false]);
    setBookmarked(false);
    setRevealed(false);
    setAnswer("");
  };

  const handleReveal = () => setRevealed(true);

  const handleSkip = () => {
    const next = [...skipped];
    next[currentIndex] = true;
    setSkipped(next);
  };

  const handleSelectGrade = (level) => {
    const next = [...grades];
    next[currentIndex] = level;
    setGrades(next);
    const nextSkipped = [...skipped];
    nextSkipped[currentIndex] = false;
    setSkipped(nextSkipped);
  };

  const handleNext = () => {
    if (isLast) setScreen("result");
    else setCurrentIndex((i) => i + 1);
  };

  const handleRestart = () => {
    resetQuizState();
    setScreen("quiz");
  };

  const handleNewCQ = useCallback(async () => {
    setScreen("loading");
    try {
      const { parts: newParts, chapter: newChapter } = await generateCQ();
      setParts(newParts);
      setChapter(newChapter);
      resetQuizState();
      setScreen("quiz");
    } catch (e) {
      console.error("Gemini error:", e);
      setScreen("error");
    }
  }, []);

  if (screen === "loading") return <LoadingScreen />;
  if (screen === "error") return <ErrorScreen onRetry={handleNewCQ} />;

  if (screen === "result") {
    return (
      <div className="app-shell">
        <TopBar />
        <ResultScreen
          grades={grades}
          skipped={skipped}
          bookmarked={bookmarked}
          parts={parts}
          onRestart={handleRestart}
          onNewCQ={handleNewCQ}
        />
      </div>
    );
  }

  return (
    <div className="app-shell">
      <TopBar />
      <SubjectBar currentIndex={currentIndex} chapter={chapter} />
      <div className="main-content">
        <ProgressBar currentIndex={currentIndex} total={parts.length} />

        <QuestionCard
          part={part}
          answer={answer}
          charCount={answer.length}
          onAnswerChange={setAnswer}
          onReveal={handleReveal}
          onSkip={handleSkip}
          onNext={handleNext}
          onBookmark={() => setBookmarked((b) => !b)}
          bookmarked={bookmarked}
          revealed={revealed}
          skipped={isSkipped}
          canNext={canNext}
          isLast={isLast}
        />

        {isSkipped && (
          <div className="skipped-banner">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="7" stroke="#854F0B" strokeWidth="1" />
              <path d="M8 5v4" stroke="#854F0B" strokeWidth="1.3" strokeLinecap="round" />
              <circle cx="8" cy="11.5" r=".6" fill="#854F0B" />
            </svg>
            এই অংশটি এড়িয়ে গেছো — পরে রিভিউ করতে পারবে।
          </div>
        )}

        {revealed && (
          <>
            <AnswerRevealCard part={part} />
            <SelfGradeCard
              selectedGrade={currentGrade}
              onSelectGrade={handleSelectGrade}
            />
          </>
        )}
      </div>
    </div>
  );
}