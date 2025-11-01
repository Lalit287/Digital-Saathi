import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { lessonService } from '../services/lessonService';
import { quizService } from '../services/quizService';
import { updateUser } from '../store/slices/authSlice';
import { updatePoints } from '../store/slices/userSlice';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, Award, Download, FileText } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const LessonDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  
  const [lesson, setLesson] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showQuiz, setShowQuiz] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizResult, setQuizResult] = useState(null);

  useEffect(() => {
    loadLesson();
  }, [id]);

  const loadLesson = async () => {
    try {
      const data = await lessonService.getById(id);
      setLesson(data);
      if (data.quiz) {
        const quizData = await quizService.getById(data.quiz._id || data.quiz);
        setQuiz(quizData);
      }
    } catch (error) {
      console.error('Failed to load lesson:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteLesson = async () => {
    try {
      const result = await lessonService.completeLesson(id);
      dispatch(updatePoints(result.pointsEarned));
      if (user) {
        dispatch(updateUser({ points: user.points + result.pointsEarned }));
      }
      alert(`Lesson completed! You earned ${result.pointsEarned} points!`);
    } catch (error) {
      console.error('Failed to complete lesson:', error);
    }
  };

  const handleSubmitQuiz = async () => {
    if (!quiz) return;
    
    try {
      const result = await quizService.submitQuiz(quiz._id, answers);
      setQuizResult(result);
      setQuizSubmitted(true);
      dispatch(updatePoints(result.pointsEarned));
      if (user) {
        dispatch(updateUser({ points: user.points + result.pointsEarned }));
      }
      if (result.passed) {
        handleCompleteLesson();
      }
    } catch (error) {
      console.error('Failed to submit quiz:', error);
    }
  };

  const handleDownloadTranscript = () => {
    if (!lesson) return;

    // Convert markdown to plain text (remove markdown syntax)
    const markdownToPlainText = (text) => {
      return text
        .replace(/#{1,6}\s+/g, '') // Remove headers
        .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
        .replace(/\*(.*?)\*/g, '$1') // Remove italic
        .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // Remove links, keep text
        .replace(/\n{3,}/g, '\n\n') // Normalize line breaks
        .trim();
    };

    // Create transcript content
    const transcriptContent = `DIGITAL SAATHI - LEARNING MODULE TRANSCRIPT
${'='.repeat(50)}

LESSON TITLE: ${lesson.title}
CATEGORY: ${lesson.category}
DIFFICULTY: ${lesson.difficulty}
ESTIMATED TIME: ${lesson.estimatedTime} minutes

${'='.repeat(50)}

DESCRIPTION:
${lesson.description}

${'='.repeat(50)}

TRANSCRIPT CONTENT:
${markdownToPlainText(lesson.content)}

${'='.repeat(50)}

Generated from Digital Saathi Learning Platform
Date: ${new Date().toLocaleString('en-IN', { 
  dateStyle: 'long', 
  timeStyle: 'short' 
})}
`;

    // Create blob and download
    const blob = new Blob([transcriptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    
    // Create safe filename from lesson title
    const safeFileName = lesson.title
      .replace(/[^a-z0-9]/gi, '_')
      .replace(/_+/g, '_')
      .toLowerCase();
    
    link.download = `Digital_Saathi_${safeFileName}_Transcript.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      </div>
    );
  }

  if (!lesson) {
    return <div>Lesson not found</div>;
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate('/learn')}
        className="flex items-center space-x-2 text-gray-600 hover:text-blue-600"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to Lessons</span>
      </button>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <div className="mb-4">
          <h1 className="text-3xl font-bold dark:text-white">{lesson.title}</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">{lesson.description}</p>
        </div>

        {/* Video */}
        {lesson.videoUrl && (
          <div className="mb-6">
            <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden relative">
              <iframe
                src={`${lesson.videoUrl}?rel=0&modestbranding=1&playsinline=1&controls=1&showinfo=0`}
                className="w-full h-full absolute top-0 left-0"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                title={lesson.title}
              />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {!showQuiz && (
          <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleCompleteLesson}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition flex items-center space-x-2"
            >
              <CheckCircle className="w-5 h-5" />
              <span>Mark as Complete</span>
            </button>
            {quiz && (
              <button
                onClick={() => setShowQuiz(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition flex items-center space-x-2"
              >
                <Award className="w-5 h-5" />
                <span>Take Quiz</span>
              </button>
            )}
            <button
              onClick={handleDownloadTranscript}
              className="bg-gray-600 dark:bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition flex items-center space-x-2"
            >
              <FileText className="w-5 h-5" />
              <span>Download Transcript</span>
            </button>
          </div>
        )}
      </div>

      {/* Quiz Section */}
      {showQuiz && quiz && (
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-2xl font-bold mb-4">{quiz.title}</h2>
          
          {!quizSubmitted ? (
            <>
              <div className="space-y-6">
                {quiz.questions.map((question, qIndex) => (
                  <div key={qIndex} className="border-b pb-4">
                    <h3 className="font-semibold mb-3">{qIndex + 1}. {question.question}</h3>
                    <div className="space-y-2">
                      {question.options.map((option, oIndex) => (
                        <label
                          key={oIndex}
                          className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name={`question-${qIndex}`}
                            value={oIndex}
                            onChange={() => {
                              const newAnswers = [...answers];
                              newAnswers[qIndex] = oIndex;
                              setAnswers(newAnswers);
                            }}
                            className="w-4 h-4 text-blue-600"
                          />
                          <span>{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={handleSubmitQuiz}
                disabled={answers.length !== quiz.questions.length}
                className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Submit Quiz
              </button>
            </>
          ) : (
            <div className="space-y-4">
              <div className={`p-4 rounded-lg ${quizResult.passed ? 'bg-green-50' : 'bg-red-50'}`}>
                <h3 className={`font-bold text-lg ${quizResult.passed ? 'text-green-800' : 'text-red-800'}`}>
                  {quizResult.passed ? '🎉 Congratulations! You Passed!' : 'Try Again'}
                </h3>
                <p className="mt-2">
                  Score: {quizResult.score}% ({quizResult.correctCount}/{quizResult.totalQuestions} correct)
                </p>
                {quizResult.pointsEarned > 0 && (
                  <p className="mt-2 text-green-600 font-semibold">
                    You earned {quizResult.pointsEarned} points!
                  </p>
                )}
              </div>
              <button
                onClick={() => navigate('/learn')}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
              >
                Back to Lessons
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LessonDetail;

