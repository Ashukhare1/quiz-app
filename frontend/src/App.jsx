import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:8080/api";

function App() {
  // auth
  const [currentUser, setCurrentUser] = useState(null);
  const [authMode, setAuthMode] = useState("login"); // "login" | "register"
  const [authForm, setAuthForm] = useState({ username: "", password: "" });
  const [authError, setAuthError] = useState("");

  // quiz
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // timer
  const [timeLeft, setTimeLeft] = useState(null);

  // load quizzes after login
  useEffect(() => {
    if (!currentUser) return;
    axios
      .get(`${API_BASE}/quizzes`)
      .then((res) => setQuizzes(res.data))
      .catch((err) => console.error(err));
  }, [currentUser]);

  const handleAuthChange = (e) => {
    const { name, value } = e.target;
    setAuthForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError("");

    if (!authForm.username || !authForm.password) {
      setAuthError("Username and password are required");
      return;
    }

    try {
      const url =
        authMode === "login"
          ? `${API_BASE}/auth/login`
          : `${API_BASE}/auth/register`;

      const res = await axios.post(url, authForm);
      setCurrentUser(res.data); // {id, username}
      setAuthForm({ username: "", password: "" });
    } catch (err) {
      if (err.response && err.response.data) {
        setAuthError(String(err.response.data));
      } else {
        setAuthError("Something went wrong");
      }
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setSelectedQuiz(null);
    setQuestions([]);
    setAnswers({});
    setResult(null);
    setTimeLeft(null);
  };

  const startQuiz = async (quiz) => {
    setSelectedQuiz(quiz);
    setResult(null);
    setAnswers({});
    setTimeLeft(null);
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/quizzes/${quiz.id}/questions`);
      setQuestions(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load questions");
    } finally {
      setLoading(false);
    }
  };

  // set timer when questions are loaded
  useEffect(() => {
    if (!selectedQuiz || questions.length === 0) return;
    const duration =
      selectedQuiz.durationSeconds && selectedQuiz.durationSeconds > 0
        ? selectedQuiz.durationSeconds
        : questions.length * 30; // fallback: 30 sec per question
    setTimeLeft(duration);
  }, [selectedQuiz, questions]);

  // countdown effect
  useEffect(() => {
    if (timeLeft === null || result) return;

    if (timeLeft <= 0) {
      submitQuiz(true);
      return;
    }

    const id = setInterval(() => {
      setTimeLeft((prev) => (prev !== null ? prev - 1 : prev));
    }, 1000);

    return () => clearInterval(id);
  }, [timeLeft, result]);

  const handleOptionChange = (questionId, option) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const submitQuiz = async (auto = false) => {
    if (!currentUser) {
      alert("You must be logged in");
      return;
    }
    if (result) return; // already submitted

    const payload = {
      userName: currentUser.username,
      answers,
    };

    try {
      const res = await axios.post(
        `${API_BASE}/quizzes/${selectedQuiz.id}/submit`,
        payload
      );
      setResult(res.data);
      if (auto) {
        alert("Time is up! Quiz submitted automatically.");
      }
    } catch (err) {
      console.error(err);
      if (!auto) alert("Error submitting quiz");
    }
  };

  const goBack = () => {
    setSelectedQuiz(null);
    setQuestions([]);
    setAnswers({});
    setResult(null);
    setTimeLeft(null);
  };

  const formatTime = (sec) => {
    if (sec == null) return "";
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  // ---------- UI ----------

  // if not logged in
  if (!currentUser) {
    return (
      <div className="app">
        <header className="app-header">
          <h1>Online Quiz App 🧠</h1>
        </header>
        <main className="app-main auth-main">
          <div className="auth-card">
            <h2>{authMode === "login" ? "Login" : "Register"}</h2>
            <form onSubmit={handleAuthSubmit} className="auth-form">
              <label>
                Username
                <input
                  name="username"
                  value={authForm.username}
                  onChange={handleAuthChange}
                  placeholder="Enter username"
                />
              </label>
              <label>
                Password
                <input
                  type="password"
                  name="password"
                  value={authForm.password}
                  onChange={handleAuthChange}
                  placeholder="Enter password"
                />
              </label>
              {authError && <p className="error-text">{authError}</p>}
              <button type="submit">
                {authMode === "login" ? "Login" : "Register"}
              </button>
            </form>
            <p className="auth-toggle">
              {authMode === "login" ? (
                <>
                  Don&apos;t have an account?{" "}
                  <button
                    type="button"
                    className="link-btn"
                    onClick={() => {
                      setAuthMode("register");
                      setAuthError("");
                    }}
                  >
                    Register
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    className="link-btn"
                    onClick={() => {
                      setAuthMode("login");
                      setAuthError("");
                    }}
                  >
                    Login
                  </button>
                </>
              )}
            </p>
          </div>
        </main>
      </div>
    );
  }

  // logged in view
  return (
    <div className="app">
      <header className="app-header">
        <h1>Online Quiz App 🧠</h1>
        <div className="user-info">
          <span>Hi, {currentUser.username}</span>
          <button onClick={logout}>Logout</button>
        </div>
      </header>

      <main className="app-main">
        {!selectedQuiz && (
          <div className="quiz-list">
            <h2>Available Quizzes</h2>
            {quizzes.length === 0 && (
              <p>No quizzes yet. Backend seeded one automatically.</p>
            )}
            <ul>
              {quizzes.map((quiz) => (
                <li key={quiz.id} className="quiz-card">
                  <h3>{quiz.title}</h3>
                  <p>{quiz.description}</p>
                  {quiz.durationSeconds && (
                    <p className="quiz-duration">
                      ⏱ {Math.round(quiz.durationSeconds / 60)} min
                    </p>
                  )}
                  <button onClick={() => startQuiz(quiz)}>Start Quiz</button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {selectedQuiz && !result && (
          <div className="quiz-screen">
            <div className="quiz-top-bar">
              <button className="back-btn" onClick={goBack}>
                ← Back
              </button>
              {timeLeft !== null && (
                <div
                  className={
                    "timer " + (timeLeft <= 10 ? "timer-danger" : "timer-ok")
                  }
                >
                  Time left: {formatTime(timeLeft)}
                </div>
              )}
            </div>

            <h2>{selectedQuiz.title}</h2>

            {loading ? (
              <p>Loading questions...</p>
            ) : (
              <div className="questions">
                {questions.map((q, index) => (
                  <div key={q.id} className="question-card">
                    <h4>
                      Q{index + 1}. {q.questionText}
                    </h4>
                    <div className="options">
                      {["A", "B", "C", "D"].map((opt) => {
                        const optionText =
                          opt === "A"
                            ? q.optionA
                            : opt === "B"
                            ? q.optionB
                            : opt === "C"
                            ? q.optionC
                            : q.optionD;
                        return (
                          <label key={opt} className="option">
                            <input
                              type="radio"
                              name={`q-${q.id}`}
                              value={opt}
                              checked={answers[q.id] === opt}
                              onChange={() => handleOptionChange(q.id, opt)}
                            />
                            <span>
                              <strong>{opt}.</strong> {optionText}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button className="submit-btn" onClick={() => submitQuiz(false)}>
              Submit Quiz
            </button>
          </div>
        )}

        {selectedQuiz && result && (
          <div className="result-screen">
            <h2>Result 🎉</h2>
            <p>
              {currentUser.username}, you scored{" "}
              <strong>
                {result.score} / {result.totalQuestions}
              </strong>
            </p>
            <button onClick={goBack}>Back to quizzes</button>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
