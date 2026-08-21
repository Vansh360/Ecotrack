import { useState } from "react";
import {
  Sparkles,
  Send,
  Leaf,
  Car,
  Zap,
  Utensils,
  Recycle,
  Droplets,
  TrendingDown,
  Lightbulb,
  Target,
  RefreshCw,
} from "lucide-react";

export default function Advisor() {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);

  const [recommendations, setRecommendations] = useState([
    {
      id: 1,
      icon: <Car size={18} />,
      category: "Transportation",
      title: "Reduce car usage",
      description:
        "Transportation is currently your largest emission source. Consider using public transport or carpooling twice a week.",
      saving: "Potential saving: 28 kg CO₂/month",
      priority: "High Impact",
    },
    {
      id: 2,
      icon: <Zap size={18} />,
      category: "Electricity",
      title: "Reduce electricity consumption",
      description:
        "Switch off unused appliances and consider using energy-efficient lighting and appliances.",
      saving: "Potential saving: 12 kg CO₂/month",
      priority: "Medium Impact",
    },
    {
      id: 3,
      icon: <Utensils size={18} />,
      category: "Food",
      title: "Choose lower-carbon meals",
      description:
        "Replacing some high-emission meals with plant-based alternatives can reduce your food footprint.",
      saving: "Potential saving: 10 kg CO₂/month",
      priority: "Medium Impact",
    },
  ]);

  const handleAskAI = async (e) => {
    e.preventDefault();

    if (!question.trim()) {
      return;
    }

    setLoading(true);

    /*
      Temporary frontend response.

      Later this will become:

      POST /api/advisor/ask

      and Spring Boot will communicate
      with Gemini/OpenAI.
    */

    setTimeout(() => {
      setRecommendations((previous) => [
        {
          id: Date.now(),
          icon: <Sparkles size={18} />,
          category: "AI Recommendation",
          title: "Personalized recommendation",
          description:
            "Based on your current activities, reducing unnecessary transportation and electricity consumption would have the greatest impact.",
          saving: "Estimated reduction: 20–30 kg CO₂/month",
          priority: "AI Generated",
        },
        ...previous,
      ]);

      setQuestion("");
      setLoading(false);
    }, 1200);
  };

  const refreshRecommendations = () => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 800);
  };

  return (
    <div className="advisor-page">

      {/* HEADER */}

      <div className="advisor-header">

        <div className="advisor-title-section">

          <div className="advisor-icon">
            <Sparkles size={25} />
          </div>

          <div>
            <span className="advisor-label">
              AI-POWERED
            </span>

            <h1>
              Sustainability Advisor
            </h1>

            <p>
              Get personalized recommendations to
              reduce your environmental impact.
            </p>
          </div>

        </div>

        <button
          className="advisor-refresh"
          onClick={refreshRecommendations}
          disabled={loading}
        >
          <RefreshCw
            size={14}
            className={loading ? "spin" : ""}
          />

          Refresh Advice
        </button>

      </div>

      {/* AI SUMMARY */}

      <div className="ai-summary">

        <div className="ai-summary-icon">
          <Sparkles size={22} />
        </div>

        <div className="ai-summary-content">

          <span>
            YOUR AI INSIGHT
          </span>

          <h2>
            Transportation is your biggest
            opportunity for improvement.
          </h2>

          <p>
            Your current transportation emissions
            account for approximately 43% of your
            total monthly footprint. Small changes
            in your travel habits could make a
            significant difference.
          </p>

        </div>

        <div className="ai-summary-stat">

          <strong>
            28 kg
          </strong>

          <span>
            potential CO₂
            reduction/month
          </span>

        </div>

      </div>

      {/* ASK AI */}

      <div className="ask-ai-card">

        <div className="ask-ai-heading">

          <div className="ask-ai-icon">
            <Lightbulb size={18} />
          </div>

          <div>
            <h2>
              Ask EcoTrack AI
            </h2>

            <p>
              Ask questions about your carbon footprint
              and sustainability.
            </p>
          </div>

        </div>

        <form
          className="ai-question-form"
          onSubmit={handleAskAI}
        >

          <input
            type="text"
            placeholder="Example: How can I reduce my carbon footprint?"
            value={question}
            onChange={(e) =>
              setQuestion(e.target.value)
            }
          />

          <button
            type="submit"
            disabled={loading}
          >
            {loading ? (
              "Thinking..."
            ) : (
              <>
                Ask AI
                <Send size={14} />
              </>
            )}
          </button>

        </form>

        <div className="suggested-questions">

          <span>
            Try asking:
          </span>

          <button
            onClick={() =>
              setQuestion(
                "How can I reduce my transportation emissions?"
              )
            }
          >
            Reduce transportation
          </button>

          <button
            onClick={() =>
              setQuestion(
                "How can I reduce my electricity emissions?"
              )
            }
          >
            Save electricity
          </button>

          <button
            onClick={() =>
              setQuestion(
                "What food choices have lower carbon emissions?"
              )
            }
          >
            Sustainable food
          </button>

        </div>

      </div>

      {/* RECOMMENDATIONS */}

      <div className="recommendations-section">

        <div className="section-heading">

          <div>
            <span>
              PERSONALIZED
            </span>

            <h2>
              Recommendations
            </h2>

            <p>
              Suggestions based on your activity
              and carbon footprint.
            </p>
          </div>

          <div className="recommendation-count">
            {recommendations.length} suggestions
          </div>

        </div>

        <div className="recommendation-grid">

          {recommendations.map((recommendation) => (

            <div
              className="recommendation-card"
              key={recommendation.id}
            >

              <div className="recommendation-top">

                <div className="recommendation-icon">
                  {recommendation.icon}
                </div>

                <span className="recommendation-priority">
                  {recommendation.priority}
                </span>

              </div>

              <span className="recommendation-category">
                {recommendation.category}
              </span>

              <h3>
                {recommendation.title}
              </h3>

              <p>
                {recommendation.description}
              </p>

              <div className="recommendation-saving">

                <TrendingDown size={15} />

                {recommendation.saving}

              </div>

              <button className="recommendation-action">
                Add to Goals
                <Target size={14} />
              </button>

            </div>

          ))}

        </div>

      </div>

      {/* CATEGORY INSIGHTS */}

      <div className="category-insights">

        <div className="category-insight-card">

          <Car size={20} />

          <div>
            <strong>
              Transportation
            </strong>

            <span>
              Highest impact area
            </span>
          </div>

          <b>
            180 kg
          </b>

        </div>

        <div className="category-insight-card">

          <Zap size={20} />

          <div>
            <strong>
              Electricity
            </strong>

            <span>
              Second highest
            </span>
          </div>

          <b>
            120 kg
          </b>

        </div>

        <div className="category-insight-card">

          <Utensils size={20} />

          <div>
            <strong>
              Food
            </strong>

            <span>
              Moderate impact
            </span>
          </div>

          <b>
            80 kg
          </b>

        </div>

        <div className="category-insight-card">

          <Recycle size={20} />

          <div>
            <strong>
              Waste
            </strong>

            <span>
              Lowest impact
            </span>
          </div>

          <b>
            40 kg
          </b>

        </div>

      </div>

      {/* FOOTNOTE */}

      <div className="advisor-disclaimer">

        <Leaf size={16} />

        <p>
          EcoTrack recommendations are generated
          from your recorded activities and
          sustainability preferences. Estimated
          emission reductions are approximate and
          may vary depending on individual behavior.
        </p>

      </div>

    </div>
  );
}