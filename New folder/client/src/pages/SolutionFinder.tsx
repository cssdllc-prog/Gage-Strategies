import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import { useState } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";

export default function SolutionFinder() {
  const [, navigate] = useLocation();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const questions = [
    {
      id: 0,
      title: "What are you trying to improve?",
      options: [
        "Save Time",
        "Increase Sales",
        "Improve Operations",
        "Manage Projects",
        "Customer Experience",
        "Reduce Costs",
        "Use AI",
        "Leadership",
      ],
    },
    {
      id: 1,
      title: "Which department are you in?",
      options: [
        "Leadership",
        "Sales",
        "Operations",
        "HR",
        "Finance",
        "Project Management",
        "Customer Service",
        "Marketing",
      ],
    },
    {
      id: 2,
      title: "What's your biggest frustration right now?",
      options: [
        "Too many manual tasks",
        "Lack of visibility",
        "Team coordination issues",
        "Missing deadlines",
        "Poor data quality",
        "Communication gaps",
        "Scaling challenges",
        "Other",
      ],
    },
    {
      id: 3,
      title: "How many people are on your team?",
      options: ["1-5", "6-20", "21-50", "51-100", "100+"],
    },
    {
      id: 4,
      title: "What's your industry?",
      options: [
        "Technology",
        "Professional Services",
        "Manufacturing",
        "Retail",
        "Healthcare",
        "Finance",
        "Education",
        "Other",
      ],
    },
  ];

  const currentQuestion = questions[step];
  const isAnswered = answers[step] !== undefined;

  const handleAnswer = (option: string) => {
    setAnswers({ ...answers, [step]: option });
  };

  const handleNext = () => {
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      // Show results
      navigate("/solutions");
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <Navigation />

      {/* Main Content */}
      <section className="container py-12 md:py-24">
        <div className="max-w-2xl mx-auto">
          {/* Progress */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-foreground/60">
                Question {step + 1} of {questions.length}
              </span>
              <span className="text-sm font-medium text-foreground/60">
                {Math.round(((step + 1) / questions.length) * 100)}%
              </span>
            </div>
            <div className="h-2 bg-border rounded-full overflow-hidden">
              <div
                className="h-full bg-accent transition-all duration-300"
                style={{ width: `${((step + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question */}
          <div className="mb-12">
            <h1 className="mb-8 text-foreground">{currentQuestion.title}</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentQuestion.options.map((option) => (
                <button
                  key={option}
                  onClick={() => handleAnswer(option)}
                  className={`p-6 rounded-lg border-2 transition-all text-left ${
                    answers[step] === option
                      ? "border-accent bg-accent/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <p className="font-medium text-foreground">{option}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button
              onClick={handleBack}
              variant="outline"
              disabled={step === 0}
              className="disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            <Button
              onClick={handleNext}
              disabled={!isAnswered}
              className="bg-accent hover:bg-accent/90 text-foreground font-semibold disabled:opacity-50"
            >
              {step === questions.length - 1 ? "See Results" : "Next"}
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
