import { useState, useEffect } from 'react';

const StartCooking = ({ recipe }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Timer logic
  useEffect(() => {
    let interval;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);

  useEffect(() => {
    if (recipe && recipe.steps && recipe.steps[currentStep]) {
      setTimeLeft(recipe.steps[currentStep].timer);
      setIsTimerRunning(false);
    }
  }, [currentStep, recipe]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!recipe || !recipe.steps || recipe.steps.length === 0) {
    return <div>Error: No recipe data available. Please go back and select a recipe.</div>;
  }

  return (
    <div className="cooking-mode">
      <h1 className="recipe-name">{recipe.name}</h1>

      <div className="ingredients-time-section">
        <div className="ingredients-header">
          <h3>
            <span className="icon ingredients-icon">✏</span> Ingredients
          </h3>
          <div className="time-estimate">
            <strong>
              <span className="icon time-icon">⏰</span> Estimated Time: {formatTime(recipe.steps[currentStep].timer)}
            </strong>
          </div>
        </div>
        <ul className="ingredients-list">
          {recipe.steps[currentStep].ingredients.map((ingredient, index) => (
            <li key={index} className="ingredient-item">
              <strong>{ingredient.name}</strong>: {ingredient.description}
            </li>
          ))}
        </ul>
      </div>

      <h2 className="step-header">{recipe.steps[currentStep].instruction}</h2>

      <div className="timer-section">
        <div className="timer-display">{formatTime(timeLeft)}</div>
        <button
          className="timer-button"
          onClick={() => setIsTimerRunning(!isTimerRunning)}
        >
          {isTimerRunning ? 'Stop Timer' : 'Start Timer'}
        </button>
      </div>

      <div className="step-progress">
        {recipe.steps.map((_, index) => (
          <div
            key={index}
            className={`progress-bar ${index < currentStep ? 'completed' : index === currentStep ? 'active' : 'inactive'}`}
          />
        ))}
      </div>

      {/* Navigation Buttons */}
      <div className="navigation-buttons">
        <button
          disabled={currentStep === 0}
          onClick={() => setCurrentStep((prev) => prev - 1)}
        >
          Previous
        </button>
        <button
          disabled={currentStep === recipe.steps.length - 1}
          onClick={() => setCurrentStep((prev) => prev + 1)}
        >
          {currentStep === recipe.steps.length - 1 ? 'Finish' : 'Next'}
        </button>
      </div>
    </div>
  );
};

export default StartCooking;
