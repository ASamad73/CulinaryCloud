// // import { useState, useEffect } from 'react';

// // const StartCooking = ({ recipe }) => {
// //   const [currentStep, setCurrentStep] = useState(0);
// //   const [timeLeft, setTimeLeft] = useState(0);
// //   const [isTimerRunning, setIsTimerRunning] = useState(false);

// //   // Timer logic
// //   useEffect(() => {
// //     let interval;
// //     if (isTimerRunning && timeLeft > 0) {
// //       interval = setInterval(() => {
// //         setTimeLeft((time) => time - 1);
// //       }, 1000);
// //     }
// //     return () => clearInterval(interval);
// //   }, [isTimerRunning, timeLeft]);

// //   useEffect(() => {
// //     if (recipe && recipe.steps && recipe.steps[currentStep]) {
// //       setTimeLeft(recipe.steps[currentStep].timer);
// //       setIsTimerRunning(false);
// //     }
// //   }, [currentStep, recipe]);

// //   const formatTime = (seconds) => {
// //     const mins = Math.floor(seconds / 60);
// //     const secs = seconds % 60;
// //     return `${mins}:${secs.toString().padStart(2, '0')}`;
// //   };

// //   if (!recipe || !recipe.steps || recipe.steps.length === 0) {
// //     return <div>Error: No recipe data available. Please go back and select a recipe.</div>;
// //   }

// //   return (
// //     <div className="cooking-mode">
// //       <h1 className="recipe-name">{recipe.name}</h1>

// //       <div className="ingredients-time-section">
// //         <div className="ingredients-header">
// //           <h3>
// //             <span className="icon ingredients-icon">✏</span> Ingredients
// //           </h3>
// //           <div className="time-estimate">
// //             <strong>
// //               <span className="icon time-icon">⏰</span> Estimated Time: {formatTime(recipe.steps[currentStep].timer)}
// //             </strong>
// //           </div>
// //         </div>
// //         <ul className="ingredients-list">
// //           {recipe.steps[currentStep].ingredients.map((ingredient, index) => (
// //             <li key={index} className="ingredient-item">
// //               <strong>{ingredient.name}</strong>: {ingredient.description}
// //             </li>
// //           ))}
// //         </ul>
// //       </div>

// //       <h2 className="step-header">{recipe.steps[currentStep].instruction}</h2>

// //       <div className="timer-section">
// //         <div className="timer-display">{formatTime(timeLeft)}</div>
// //         <button
// //           className="timer-button"
// //           onClick={() => setIsTimerRunning(!isTimerRunning)}
// //         >
// //           {isTimerRunning ? 'Stop Timer' : 'Start Timer'}
// //         </button>
// //       </div>

// //       <div className="step-progress">
// //         {recipe.steps.map((_, index) => (
// //           <div
// //             key={index}
// //             className={`progress-bar ${index < currentStep ? 'completed' : index === currentStep ? 'active' : 'inactive'}`}
// //           />
// //         ))}
// //       </div>

// //       {/* Navigation Buttons */}
// //       <div className="navigation-buttons">
// //         <button
// //           disabled={currentStep === 0}
// //           onClick={() => setCurrentStep((prev) => prev - 1)}
// //         >
// //           Previous
// //         </button>
// //         <button
// //           disabled={currentStep === recipe.steps.length - 1}
// //           onClick={() => setCurrentStep((prev) => prev + 1)}
// //         >
// //           {currentStep === recipe.steps.length - 1 ? 'Finish' : 'Next'}
// //         </button>
// //       </div>
// //     </div>
// //   );
// // };

// // export default StartCooking;

// // import { useState, useEffect, useRef } from 'react';
// // import { useLocation, useNavigate } from 'react-router-dom';

// // const StartCooking = () => {
// //   const location = useLocation();
// //   const navigate = useNavigate();
// //   const recipe = location.state?.recipe;
// //   const audioRef = useRef(null);

// //   const [currentStep, setCurrentStep] = useState(0);
// //   const [timeLeft, setTimeLeft] = useState(0);
// //   const [isTimerRunning, setIsTimerRunning] = useState(false);
// //   const [preparedIngredients, setPreparedIngredients] = useState({});

// //   // Helper function to convert timer object { hours, minutes } to seconds
// //   const convertTimerToSeconds = (time) => {
// //     const hours = Number(time?.hours) || 0;
// //     const minutes = Number(time?.minutes) || 0;
// //     const seconds = (isNaN(hours) ? 0 : hours) * 3600 + (isNaN(minutes) ? 0 : minutes) * 60;
// //     console.log("convertTimerToSeconds - Time:", time, "Seconds:", seconds);
// //     return seconds;
// //   };

// //   useEffect(() => {
// //     let interval;
// //     if (isTimerRunning && timeLeft > 0) {
// //       interval = setInterval(() => {
// //         setTimeLeft((time) => {
// //           const newTime = time - 1;
// //           if (newTime === 0 && audioRef.current) {
// //             audioRef.current.play();
// //           }
// //           return newTime;
// //         });
// //       }, 1000);
// //     }
// //     return () => clearInterval(interval);
// //   }, [isTimerRunning, timeLeft]);

// //   useEffect(() => {
// //     if (recipe && recipe.steps && recipe.steps[currentStep]) {
// //       const step = recipe.steps[currentStep];
// //       console.log("Current step data:", step);
// //       const timerInSeconds = convertTimerToSeconds(step.time); // Changed from step.timer to step.time
// //       setTimeLeft(timerInSeconds);
// //       setIsTimerRunning(false);
// //     }
// //   }, [currentStep, recipe]);

// //   const formatTime = (seconds) => {
// //     const validSeconds = isNaN(seconds) ? 0 : seconds;
// //     const mins = Math.floor(validSeconds / 60);
// //     const secs = validSeconds % 60;
// //     return `${mins}:${secs.toString().padStart(2, '0')}`;
// //   };

// //   const handleBackClick = () => {
// //     navigate('/home');
// //   };

// //   const handleRestart = () => {
// //     setCurrentStep(0);
// //     const timerInSeconds = convertTimerToSeconds(recipe.steps[0].time); // Changed from step.timer to step.time
// //     setTimeLeft(timerInSeconds);
// //     setIsTimerRunning(false);
// //     setPreparedIngredients({});
// //   };

// //   const toggleIngredientPrepared = (index) => {
// //     setPreparedIngredients((prev) => ({
// //       ...prev,
// //       [index]: !prev[index],
// //     }));
// //   };

// //   if (!recipe || !recipe.steps || recipe.steps.length === 0) {
// //     return <div className="error-message">Error: No recipe data available. Please go back and select a recipe.</div>;
// //   }

// //   const totalSteps = recipe.steps.length;
// //   const progressPercentage = ((currentStep + 1) / totalSteps) * 100;
// //   const initialTimerInSeconds = convertTimerToSeconds(recipe.steps[currentStep].time); // Changed from step.timer to step.time
// //   const timerPercentage = initialTimerInSeconds > 0 ? (timeLeft / initialTimerInSeconds) * 100 : 0;

// //   return (
// //     <div className="cooking-mode-container">
// //       <audio ref={audioRef} src="/timer-finished.mp3" />
// //       <div className="cooking-header">
// //         <button className="back-button" onClick={handleBackClick} aria-label="Go back to recipes">
// //           <i className="fa-solid fa-arrow-left"/> Back
// //         </button>
// //         <div className="recipe-title-container">
    
// //           <h1 className="recipe-title">{recipe.name}</h1>
// //         </div>
//         // <button className="restart-button" onClick={handleRestart} aria-label="Restart recipe">
//         // <i className="fa-solid fa-arrow-rotate-left"/>Restart
//         // </button>
// //       </div>

// //       <div className="cooking-content">
// //         <div className="ingredients-section">
// //           <h3 className="section-title">
// //             <span className="icon ingredients-icon">✏</span> Ingredients
// //           </h3>
// //           <ul className="ingredients-list">
// //             {recipe.steps[currentStep].ingredients.map((ingredient, index) => (
// //               <li key={index} className="ingredient-item">
// //                 <label className="ingredient-label">
// //                   <input
// //                     type="checkbox"
// //                     checked={!!preparedIngredients[index]}
// //                     onChange={() => toggleIngredientPrepared(index)}
// //                     aria-label={`Mark ${ingredient.name} as prepared`}
// //                   />
// //                   <span className={preparedIngredients[index] ? 'prepared' : ''}>
// //                     <strong>{ingredient.name}</strong>: {ingredient.quantity || ''}
// //                   </span>
// //                 </label>
// //               </li>
// //             ))}
// //           </ul>
// //         </div>

// //         <div className="step-section">
// //           <div className="step-header">
// //             <h2 className="step-instruction">
// //               Step {currentStep + 1}: {recipe.steps[currentStep].description || 'No description available'}
// //             </h2>
// //             <span className="step-counter">
// //               Step {currentStep + 1} of {totalSteps}
// //             </span>
// //           </div>
// //           <div className="timer-section">
// //             <div className="timer-wrapper">
// //               <svg className="timer-circle" viewBox="0 0 100 100">
// //                 <circle
// //                   className="timer-circle-bg"
// //                   cx="50"
// //                   cy="50"
// //                   r="45"
// //                 />
// //                 <circle
// //                   className="timer-circle-progress"
// //                   cx="50"
// //                   cy="50"
// //                   r="45"
// //                   style={{
// //                     strokeDasharray: '283',
// //                     strokeDashoffset: 283 - (283 * timerPercentage) / 100,
// //                   }}
// //                 />
// //               </svg>
// //               <div className="timer-info">
// //                 <span className="timer-label">
// //                   <span className="icon time-icon">⏰</span> Estimated Time:
// //                 </span>
// //                 <span className="timer-display">{formatTime(timeLeft)}</span>
// //               </div>
// //             </div>
// //             <button
// //               className={`timer-button ${isTimerRunning ? 'stop' : 'start'}`}
// //               onClick={() => setIsTimerRunning(!isTimerRunning)}
// //               aria-label={isTimerRunning ? 'Stop timer' : 'Start timer'}
// //             >
// //               {isTimerRunning ? 'Stop Timer' : 'Start Timer'}
// //             </button>
// //           </div>
// //         </div>

// //         <div className="progress-section">
// //           <div className="step-progress">
// //             {recipe.steps.map((_, index) => (
// //               <div
// //                 key={index}
// //                 className={`progress-bar ${
// //                   index < currentStep
// //                     ? 'completed'
// //                     : index === currentStep
// //                     ? 'active'
// //                     : 'inactive'
// //                 }`}
// //                 role="progressbar"
// //                 aria-valuenow={(index + 1) / totalSteps * 100}
// //                 aria-valuemin="0"
// //                 aria-valuemax="100"
// //                 aria-label={`Step ${index + 1} progress`}
// //               />
// //             ))}
// //           </div>
// //           <div className="progress-percentage">
// //             {progressPercentage.toFixed(0)}% Complete
// //           </div>
// //         </div>

// //         <div className="navigation-section">
// //           <button
// //             className="nav-button previous"
// //             disabled={currentStep === 0}
// //             onClick={() => setCurrentStep((prev) => prev - 1)}
// //             aria-label="Previous step"
// //           >
// //             Previous
// //           </button>
// //           <button
// //             className="nav-button next"
// //             disabled={currentStep === recipe.steps.length - 1}
// //             onClick={() => setCurrentStep((prev) => prev + 1)}
// //             aria-label={currentStep === recipe.steps.length - 1 ? 'Finish recipe' : 'Next step'}
// //           >
// //             {currentStep === recipe.steps.length - 1 ? 'Finish' : 'Next'}
// //           </button>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default StartCooking;
// import { useState, useEffect, useRef } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';

// const StartCooking = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const recipe = location.state?.recipe;
//   const audioRef = useRef(null);

//   const [currentStep, setCurrentStep] = useState(0);
//   const [timeLeft, setTimeLeft] = useState(0);
//   const [isTimerRunning, setIsTimerRunning] = useState(false);
//   const [preparedIngredients, setPreparedIngredients] = useState({});

//   // Convert hours/minutes object to seconds
//   const convertTimerToSeconds = (time) => {
//     const hours = Number(time?.hours) || 0;
//     const minutes = Number(time?.minutes) || 0;
//     const seconds = (isNaN(hours) ? 0 : hours) * 3600 + (isNaN(minutes) ? 0 : minutes) * 60;
//     return seconds;
//   };

//   // Reset timer for current step
//   const resetTimer = () => {
//     const timerInSeconds = convertTimerToSeconds(recipe.steps[currentStep].time);
//     setTimeLeft(timerInSeconds);
//     setIsTimerRunning(false);
//   };

//   useEffect(() => {
//     let interval;
//     if (isTimerRunning && timeLeft > 0) {
//       interval = setInterval(() => {
//         setTimeLeft((time) => {
//           const newTime = time - 1;
//           if (newTime === 0 && audioRef.current) {
//             audioRef.current.play();
//           }
//           return newTime;
//         });
//       }, 1000);
//     }
//     return () => clearInterval(interval);
//   }, [isTimerRunning, timeLeft]);

//   useEffect(() => {
//     if (recipe && recipe.steps && recipe.steps[currentStep]) {
//       const step = recipe.steps[currentStep];
//       const timerInSeconds = convertTimerToSeconds(step.time);
//       setTimeLeft(timerInSeconds);
//       setIsTimerRunning(false);
//     }
//   }, [currentStep, recipe]);

//   const formatTime = (seconds) => {
//     const validSeconds = isNaN(seconds) ? 0 : seconds;
//     const mins = Math.floor(validSeconds / 60);
//     const secs = validSeconds % 60;
//     return `${mins}:${secs.toString().padStart(2, '0')}`;
//   };

//   const handleBackClick = () => {
//     navigate('/home');
//   };

//   const handleRestart = () => {
//     setCurrentStep(0);
//     const timerInSeconds = convertTimerToSeconds(recipe.steps[0].time);
//     setTimeLeft(timerInSeconds);
//     setIsTimerRunning(false);
//     setPreparedIngredients({});
//   };

//   const toggleIngredientPrepared = (index) => {
//     setPreparedIngredients((prev) => ({
//       ...prev,
//       [index]: !prev[index],
//     }));
//   };

//   if (!recipe || !recipe.steps || recipe.steps.length === 0) {
//     return <div className="error-message">Error: No recipe data available. Please go back and select a recipe.</div>;
//   }

//   const totalSteps = recipe.steps.length;
//   const progressPercentage = ((currentStep + 1) / totalSteps) * 100;
//   const initialTimerInSeconds = convertTimerToSeconds(recipe.steps[currentStep].time);
//   const timerPercentage = initialTimerInSeconds > 0 ? (timeLeft / initialTimerInSeconds) * 100 : 0;

//   return (
//     <div className="cooking-mode-container">
//       <audio ref={audioRef} src="/timer-finished.mp3" />
      
//       <div className="cooking-header">
//         <button className="back-button" onClick={handleBackClick} aria-label="Go back to recipes">
//           <i className="fa-solid fa-arrow-left"></i> Back
//         </button>
//         <div className="recipe-title-container">
//           <h1 className="recipe-title">{recipe.name}</h1>
//         </div>
//         <button className="restart-button" onClick={handleRestart} aria-label="Restart recipe">
//           <i className="fa-solid fa-arrow-rotate-left"/>Restart
//         </button>
//       </div>

//       <div className="cooking-content">
//         <div className="ingredients-section">
//           <h3 className="section-title">
//             <span className="icon ingredients-icon">✏</span> Ingredients
//           </h3>
//           <ul className="ingredients-list">
//             {recipe.steps[currentStep].ingredients.map((ingredient, index) => (
//               <li key={index} className="ingredient-item">
//                 <label className="ingredient-label">
//                   <input
//                     type="checkbox"
//                     checked={!!preparedIngredients[index]}
//                     onChange={() => toggleIngredientPrepared(index)}
//                     aria-label={`Mark ${ingredient.name} as prepared`}
//                   />
//                   <span className={preparedIngredients[index] ? 'prepared' : ''}>
//                     <strong>{ingredient.name}</strong>: {ingredient.quantity || ''} {ingredient.unit || ''}
//                   </span>
//                 </label>
//               </li>
//             ))}
//           </ul>
//         </div>

//         <div className="step-section">
//           <div className="step-header">
//             <h2 className="step-instruction">
//               Step {currentStep + 1}: {recipe.steps[currentStep].description || 'No description available'}
//             </h2>
//             <span className="step-counter">
//               Step {currentStep + 1} of {totalSteps}
//             </span>
//           </div>

//           <div className="timer-section">
//             <div className="timer-wrapper">
//               <svg className="timer-circle" viewBox="0 0 100 100">
//                 <circle className="timer-circle-bg" cx="50" cy="50" r="45" />
//                 <circle
//                   className="timer-circle-progress"
//                   cx="50"
//                   cy="50"
//                   r="45"
//                   style={{
//                     strokeDasharray: '283',
//                     strokeDashoffset: 283 - (283 * timerPercentage) / 100,
//                   }}
//                 />
//               </svg>
//               <div className="timer-info">
//                 <span className="timer-label">
//                   <span className="icon time-icon">⏰</span> Estimated Time:
//                 </span>
//                 <span className="timer-display">{formatTime(timeLeft)}</span>
//               </div>
//             </div>

//             {/* Start/Stop Timer Button */}
//             <button
//               className={`timer-button ${isTimerRunning ? 'stop' : 'start'}`}
//               onClick={() => setIsTimerRunning(!isTimerRunning)}
//               aria-label={isTimerRunning ? 'Stop timer' : 'Start timer'}
//             >
//               {isTimerRunning ? 'Stop Timer' : 'Start Timer'}
//             </button>

//             {/* Reset Timer Button */}
//             <button
//               className="timer-button reset"
//               onClick={resetTimer}
//               aria-label="Reset timer"
//             >
//               Reset Timer
//             </button>
//           </div>
//         </div>

//         <div className="progress-section">
//           <div className="step-progress">
//             {recipe.steps.map((_, index) => (
//               <div
//                 key={index}
//                 className={`progress-bar ${
//                   index < currentStep
//                     ? 'completed'
//                     : index === currentStep
//                     ? 'active'
//                     : 'inactive'
//                 }`}
//                 role="progressbar"
//                 aria-valuenow={(index + 1) / totalSteps * 100}
//                 aria-valuemin="0"
//                 aria-valuemax="100"
//                 aria-label={`Step ${index + 1} progress`}
//               />
//             ))}
//           </div>
//           <div className="progress-percentage">
//             {progressPercentage.toFixed(0)}% Complete
//           </div>
//         </div>

//         <div className="navigation-section">
//           <button
//             className="nav-button previous"
//             disabled={currentStep === 0}
//             onClick={() => setCurrentStep((prev) => prev - 1)}
//             aria-label="Previous step"
//           >
//             Previous
//           </button>
//           <button
//             className="nav-button next"
//             disabled={currentStep === recipe.steps.length - 1}
//             onClick={() => setCurrentStep((prev) => prev + 1)}
//             aria-label={currentStep === recipe.steps.length - 1 ? 'Finish recipe' : 'Next step'}
//           >
//             {currentStep === recipe.steps.length - 1 ? 'Finish' : 'Next'}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default StartCooking;
import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const StartCooking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const recipe = location.state?.recipe;
  const audioRef = useRef(null);

  const [currentStep, setCurrentStep] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isTimerFinished, setIsTimerFinished] = useState(false);
  const [preparedIngredients, setPreparedIngredients] = useState({});

  // Convert hours/minutes object to seconds
  const convertTimerToSeconds = (time) => {
    const hours = Number(time?.hours) || 0;
    const minutes = Number(time?.minutes) || 0;
    const seconds = (isNaN(hours) ? 0 : hours) * 3600 + (isNaN(minutes) ? 0 : minutes) * 60;
    return seconds;
  };

  // Reset timer for current step
  const resetTimer = () => {
    const timerInSeconds = convertTimerToSeconds(recipe.steps[currentStep].time);
    setTimeLeft(timerInSeconds);
    setIsTimerRunning(false);
    setIsTimerFinished(false);
  };

  useEffect(() => {
    let interval;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => {
          const newTime = time - 1;
          if (newTime === 0) {
            if (audioRef.current) {
              audioRef.current.play();
            }
            setIsTimerRunning(false);
            setIsTimerFinished(true);
          }
          return newTime;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);

  useEffect(() => {
    if (recipe && recipe.steps && recipe.steps[currentStep]) {
      const step = recipe.steps[currentStep];
      const timerInSeconds = convertTimerToSeconds(step.time);
      setTimeLeft(timerInSeconds);
      setIsTimerRunning(false);
      setIsTimerFinished(false);
    }
  }, [currentStep, recipe]);

  // Reset preparedIngredients when the step changes
  useEffect(() => {
    setPreparedIngredients({}); // Clear ingredient checkbox states on step change
  }, [currentStep]);

  const formatTime = (seconds) => {
    const validSeconds = isNaN(seconds) ? 0 : seconds;
    const mins = Math.floor(validSeconds / 60);
    const secs = validSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleBackClick = () => {
    navigate('/home');
  };

  const handleRestart = () => {
    setCurrentStep(0);
    const timerInSeconds = convertTimerToSeconds(recipe.steps[0].time);
    setTimeLeft(timerInSeconds);
    setIsTimerRunning(false);
    setIsTimerFinished(false);
    setPreparedIngredients({});
  };

  const toggleIngredientPrepared = (index) => {
    setPreparedIngredients((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  if (!recipe || !recipe.steps || recipe.steps.length === 0) {
    return <div className="error-message">Error: No recipe data available. Please go back and select a recipe.</div>;
  }

  const totalSteps = recipe.steps.length;
  const progressPercentage = ((currentStep + 1) / totalSteps) * 100;
  const initialTimerInSeconds = convertTimerToSeconds(recipe.steps[currentStep].time);
  const timerPercentage = initialTimerInSeconds > 0 ? (timeLeft / initialTimerInSeconds) * 100 : 0;

  return (
    <div className="cooking-mode-container">
      <audio ref={audioRef} src="/timer-finished.mp3" />
      
      <div className="cooking-header">
        <button className="back-button" onClick={handleBackClick} aria-label="Go back to recipes">
          <i className="fa-solid fa-arrow-left"></i> Back
        </button>
        <div className="recipe-title-container">
          <h1 className="recipe-title">{recipe.name}</h1>
        </div>
        <button className="restart-button" onClick={handleRestart} aria-label="Restart recipe">
          <i className="fa-solid fa-arrow-rotate-left"/>Restart
        </button>
      </div>

      <div className="cooking-content">
        <div className="ingredients-section">
          <h3 className="section-title">
            <span className="icon ingredients-icon">✏</span> Ingredients
          </h3>
          <ul className="ingredients-list">
            {recipe.steps[currentStep].ingredients.map((ingredient, index) => (
              <li key={index} className="ingredient-item">
                <label className="ingredient-label">
                  <input
                    type="checkbox"
                    checked={!!preparedIngredients[index]}
                    onChange={() => toggleIngredientPrepared(index)}
                    aria-label={`Mark ${ingredient.name} as prepared`}
                  />
                  <span className={preparedIngredients[index] ? 'prepared' : ''}>
                    <strong>{ingredient.name}</strong>: {ingredient.quantity || ''} {ingredient.unit || ''}
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </div>

        <div className="step-section">
          <div className="step-header">
            <h2 className="step-instruction">
              Step {currentStep + 1}: {recipe.steps[currentStep].description || 'No description available'}
            </h2>
            <span className="step-counter">
              Step {currentStep + 1} of {totalSteps}
            </span>
          </div>

          <div className="timer-section">
            <div className="timer-wrapper">
              <svg className="timer-circle" viewBox="0 0 100 100">
                <circle className="timer-circle-bg" cx="50" cy="50" r="45" />
                <circle
                  className="timer-circle-progress"
                  cx="50"
                  cy="50"
                  r="45"
                  style={{
                    strokeDasharray: '283',
                    strokeDashoffset: 283 - (283 * timerPercentage) / 100,
                  }}
                />
              </svg>
              <div className="timer-info">
                <span className="timer-label">
                  <span className="icon time-icon">⏰</span> Estimated Time:
                </span>
                <span className="timer-display">{formatTime(timeLeft)}</span>
              </div>
            </div>

            {/* Start/Stop Timer Button */}
            {/* <button
              className={`timer-button ${isTimerRunning ? 'stop' : 'start'}`}
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              disabled={isTimerFinished}
              aria-label={isTimerRunning ? 'Stop timer' : 'Start timer'}
            >
              {isTimerRunning ? 'Stop Timer' : 'Start Timer'}
            </button> */}
            <button
              className={`timer-button ${isTimerFinished ? 'disabled' : isTimerRunning ? 'stop' : 'start'}`}
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              disabled={isTimerFinished}
              aria-label={
                isTimerFinished
                  ? 'Timer finished'
                  : isTimerRunning
                  ? 'Stop timer'
                  : 'Start timer'
              }
            >
              {isTimerFinished
                ? 'Start Cooking'
                : isTimerRunning
                ? 'Stop Timer'
                : 'Start Timer'}
            </button>

            {/* Reset Timer Button */}
            <button
              className="timer-button reset"
              onClick={resetTimer}
              aria-label="Reset timer"
            >
              Reset Timer
            </button>
          </div>
        </div>

        <div className="progress-section">
          <div className="step-progress">
            {recipe.steps.map((_, index) => (
              <div
                key={index}
                className={`progress-bar ${
                  index < currentStep
                    ? 'completed'
                    : index === currentStep
                    ? 'active'
                    : 'inactive'
                }`}
                role="progressbar"
                aria-valuenow={(index + 1) / totalSteps * 100}
                aria-valuemin="0"
                aria-valuemax="100"
                aria-label={`Step ${index + 1} progress`}
              />
            ))}
          </div>
          <div className="progress-percentage">
            {progressPercentage.toFixed(0)}% Complete
          </div>
        </div>

        <div className="navigation-section">
          <button
            className="nav-button previous"
            disabled={currentStep === 0}
            onClick={() => setCurrentStep((prev) => prev - 1)}
            aria-label="Previous step"
          >
            Previous
          </button>
          <button
            className="nav-button next"
            onClick={() => {
              if (currentStep === recipe.steps.length - 1) {
                navigate('/home');
              } else {
                setCurrentStep((prev) => prev + 1);
              }
            }}
            aria-label={currentStep === recipe.steps.length - 1 ? 'Finish recipe' : 'Next step'}
          >
            {currentStep === recipe.steps.length - 1 ? 'Finish' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StartCooking;