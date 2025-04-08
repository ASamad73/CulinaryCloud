// import { useState } from "react";

// function Create() {
//     const [steps, setSteps] = useState([{ id: 1, ingredients: [""] }]);
//     const [submit, setSubmit] = useState(false);
//     const [image, setImage] = useState(null);

//     const addStep = () => {
//         setSteps([...steps, { id: steps.length + 1, ingredients: [""] }]);
//     };

//     const updateIngredient = (stepIndex, ingredientIndex, value) => {
//         const newSteps = [...steps];
//         newSteps[stepIndex].ingredients[ingredientIndex] = value;
//         setSteps(newSteps);
//     };

//     const addIngredient = (stepIndex) => {
//         const newSteps = [...steps];
//         newSteps[stepIndex].ingredients.push("");
//         setSteps(newSteps);
//     };

//     const removeIngredient = (stepIndex) => {
//         const newSteps = [...steps];
//         if (newSteps[stepIndex].ingredients.length > 1) {
//             newSteps[stepIndex].ingredients.pop();
//             setSteps(newSteps);
//         }
//     };

//     const deleteStep = (stepIndex) => {
//         if (stepIndex > 0) {
//             setSteps(steps.filter((_, index) => index !== stepIndex));
//         }
//     };

//     const handleImageUpload = (event) => {
//         const file = event.target.files[0];
//         if (file) {
//             setImage(URL.createObjectURL(file)); 
//         }
//     };

//     return (
//         <div className="post-recipe">
//             <input type="text" placeholder="Recipe Title" className="recipe-title" />
//             {steps.map((step, stepIndex) => (
//                 <div key={step.id}>
//                     <h3 className="step-number">Step {stepIndex + 1}</h3>
//                     <h5 className="step-titles">Ingredients</h5>
//                     <div className="ingredients">
//                         {step.ingredients.map((ingredient, ingredientIndex) => (
//                             <div key={ingredientIndex} className="single-ingredient">
//                                 <input
//                                     type="text"
//                                     placeholder={`Ingredient ${ingredientIndex + 1}`}
//                                     className="input-fields"
//                                     value={ingredient}
//                                     onChange={(e) => updateIngredient(stepIndex, ingredientIndex, e.target.value)}
//                                 />
//                                 {ingredientIndex === step.ingredients.length - 1 && (
//                                     <div className="ingredient-btns">
//                                         <button onClick={() => addIngredient(stepIndex)} className="add-ingredients">Add</button>
//                                         <button className="remove-ingredients" onClick={() => removeIngredient(stepIndex)}>Remove</button>
//                                     </div>
//                                 )}
//                             </div>
//                         ))}
//                     </div>
//                     <h5 className="step-titles">Description</h5>
//                     <input type="text" placeholder="Explanation of this step" className="input-fields" />
//                     <h5 className="step-titles">Time (if applicable)</h5>
//                     <div className="time-container">
//                         <input type="number" placeholder="hrs" className="time-field1" />
//                         <input type="number" placeholder="mins" className="time-field2" />
//                     </div>
//                 </div>
//             ))}
//             <button className="delete-step" onClick={() => deleteStep(steps.length - 1)}>Delete Step</button>
//             <div className="add-step">
//                 <button className="step-btn" onClick={addStep}>+</button>
//                 <p className="step-txt">Add Step</p>
//             </div>

//             <div className="image" onClick={() => document.getElementById("imageUpload").click()}>
//                 <i className="fa-solid fa-paperclip" style={{ cursor: "pointer" }}></i>
//                 <p className="image-txt">Upload Image</p>
//             </div>
//             <input
//                 type="file"
//                 id="imageUpload"
//                 accept="image/*"
//                 style={{ display: "none" }}
//                 onChange={handleImageUpload}
//             />
//             {image && <img src={image} alt="Uploaded" className="uploaded-image" />}

//             <input type="text" placeholder="Caption (optional)" className="caption-field" />
//             <div className="submit">
//                 <button className="submit-part" onClick={() => setSubmit(true)}>Submit</button>
//             </div>
//         </div>
//     );
// }

// export default Create;
// import { useState } from "react";

// function Create() {
//     const [title, setTitle] = useState("");
//     const [steps, setSteps] = useState([{ id: 1, ingredients: [""], description: "", time: { hrs: "", mins: "" } }]);
//     const [imageBase64, setImageBase64] = useState("");
//     const [caption, setCaption] = useState("");
//     const [categories, setCategories] = useState([]);

//     const addStep = () => {
//         setSteps([...steps, { id: steps.length + 1, ingredients: [""], description: "", time: { hrs: "", mins: "" } }]);
//     };

//     const updateIngredient = (stepIndex, ingredientIndex, value) => {
//         const newSteps = [...steps];
//         newSteps[stepIndex].ingredients[ingredientIndex] = value;
//         setSteps(newSteps);
//     };

//     const addIngredient = (stepIndex) => {
//         const newSteps = [...steps];
//         newSteps[stepIndex].ingredients.push("");
//         setSteps(newSteps);
//     };

//     const removeIngredient = (stepIndex) => {
//         const newSteps = [...steps];
//         if (newSteps[stepIndex].ingredients.length > 1) {
//             newSteps[stepIndex].ingredients.pop();
//             setSteps(newSteps);
//         }
//     };

//     const deleteStep = (stepIndex) => {
//         if (stepIndex > 0) {
//             setSteps(steps.filter((_, index) => index !== stepIndex));
//         }
//     };

//     const updateStepField = (stepIndex, field, value) => {
//         const newSteps = [...steps];
//         if (field === "description") {
//             newSteps[stepIndex].description = value;
//         } else if (field === "hrs" || field === "mins") {
//             newSteps[stepIndex].time[field] = value;
//         }
//         setSteps(newSteps);
//     };

//     const handleImageUpload = (event) => {
//         const file = event.target.files[0];
//         if (file) {
//             const reader = new FileReader();
//             reader.onloadend = () => {
//                 setImageBase64(reader.result);
//             };
//             reader.readAsDataURL(file);
//         }
//     };

//     const handleSubmit = async () => {
//         const token = localStorage.getItem("token");
//         const payload = {
//             title,
//             steps,
//             image: imageBase64,
//             caption,
//             categories,
//         };

//         try {
//             const response = await fetch(`${import.meta.env.VITE_API_URL}/recipes`, {
//                 method: "POST",
//                 headers: {
//                   "Content-Type": "application/json",
//                   "Authorization": `Bearer ${token}`,
//                 },
//                 body: JSON.stringify(payload),
//             });
              

//             if (response.ok) {
//                 const data = await response.json();
//                 console.log("Recipe submitted:", data);
//                 alert("Recipe posted!");
//                 // Optionally: navigate("/home");
//             } else {
//                 const err = await response.json();
//                 alert(err.msg || "Failed to post recipe");
//             }
//         } catch (err) {
//             console.error("Submission error:", err);
//         }
//     };

//     return (
//         <div className="post-recipe">
//             <input
//                 type="text"
//                 placeholder="Recipe Title"
//                 className="recipe-title"
//                 value={title}
//                 onChange={(e) => setTitle(e.target.value)}
//             />

//             {steps.map((step, stepIndex) => (
//                 <div key={step.id}>
//                     <h3 className="step-number">Step {stepIndex + 1}</h3>
//                     <h5 className="step-titles">Ingredients</h5>
//                     <div className="ingredients">
//                         {step.ingredients.map((ingredient, ingredientIndex) => (
//                             <div key={ingredientIndex} className="single-ingredient">
//                                 <input
//                                     type="text"
//                                     placeholder={`Ingredient ${ingredientIndex + 1}`}
//                                     className="input-fields"
//                                     value={ingredient}
//                                     onChange={(e) =>
//                                         updateIngredient(stepIndex, ingredientIndex, e.target.value)
//                                     }
//                                 />
//                                 {ingredientIndex === step.ingredients.length - 1 && (
//                                     <div className="ingredient-btns">
//                                         <button
//                                             onClick={() => addIngredient(stepIndex)}
//                                             className="add-ingredients"
//                                         >
//                                             Add
//                                         </button>
//                                         <button
//                                             className="remove-ingredients"
//                                             onClick={() => removeIngredient(stepIndex)}
//                                         >
//                                             Remove
//                                         </button>
//                                     </div>
//                                 )}
//                             </div>
//                         ))}
//                     </div>
//                     <h5 className="step-titles">Description</h5>
//                     <input
//                         type="text"
//                         placeholder="Explanation of this step"
//                         className="input-fields"
//                         value={step.description}
//                         onChange={(e) =>
//                             updateStepField(stepIndex, "description", e.target.value)
//                         }
//                     />
//                     <h5 className="step-titles">Time (if applicable)</h5>
//                     <div className="time-container">
//                         <input
//                             type="number"
//                             placeholder="hrs"
//                             className="time-field1"
//                             value={step.time.hrs}
//                             onChange={(e) =>
//                                 updateStepField(stepIndex, "hrs", e.target.value)
//                             }
//                         />
//                         <input
//                             type="number"
//                             placeholder="mins"
//                             className="time-field2"
//                             value={step.time.mins}
//                             onChange={(e) =>
//                                 updateStepField(stepIndex, "mins", e.target.value)
//                             }
//                         />
//                     </div>
//                 </div>
//             ))}

//             <button className="delete-step" onClick={() => deleteStep(steps.length - 1)}>
//                 Delete Step
//             </button>
//             <div className="add-step">
//                 <button className="step-btn" onClick={addStep}>+</button>
//                 <p className="step-txt">Add Step</p>
//             </div>

//             <div className="image" onClick={() => document.getElementById("imageUpload").click()}>
//                 <i className="fa-solid fa-paperclip" style={{ cursor: "pointer" }}></i>
//                 <p className="image-txt">Upload Image</p>
//             </div>
//             <input
//                 type="file"
//                 id="imageUpload"
//                 accept="image/*"
//                 style={{ display: "none" }}
//                 onChange={handleImageUpload}
//             />
//             {imageBase64 && (
//                 <img src={imageBase64} alt="Uploaded" className="uploaded-image" />
//             )}

//             <input
//                 type="text"
//                 placeholder="Caption (optional)"
//                 className="caption-field"
//                 value={caption}
//                 onChange={(e) => setCaption(e.target.value)}
//             />

//             <input
//                 type="text"
//                 placeholder="Add up to 3 categories (comma-separated)"
//                 className="caption-field"
//                 onChange={(e) => {
//                     const values = e.target.value.split(",").map((val) => val.trim());
//                     setCategories(values.slice(0, 3));
//                 }}
//             />

//             <div className="submit">
//                 <button className="submit-part" onClick={()=>{handleSubmit()}}>
//                     Submit
//                 </button>
//             </div>
//         </div>
//     );
// }

// export default Create;




import { useState } from "react";

function Create(props) {
    const [title, setTitle] = useState("");
    const [steps, setSteps] = useState([{ id: 1, ingredients: [""], description: "", time: { hrs: "", mins: "" } }]);
    const [imageBase64, setImageBase64] = useState("");
    const [caption, setCaption] = useState("");
    const [categories, setCategories] = useState([]);

    const addStep = () => {
        setSteps([...steps, { id: steps.length + 1, ingredients: [""], description: "", time: { hrs: "", mins: "" } }]);
    };

    const updateIngredient = (stepIndex, ingredientIndex, value) => {
        const newSteps = [...steps];
        newSteps[stepIndex].ingredients[ingredientIndex] = value;
        setSteps(newSteps);
    };

    const addIngredient = (stepIndex) => {
        const newSteps = [...steps];
        newSteps[stepIndex].ingredients.push("");
        setSteps(newSteps);
    };

    const removeIngredient = (stepIndex) => {
        const newSteps = [...steps];
        if (newSteps[stepIndex].ingredients.length > 1) {
            newSteps[stepIndex].ingredients.pop();
            setSteps(newSteps);
        }
    };

    const deleteStep = (stepIndex) => {
        if (stepIndex > 0) {
            setSteps(steps.filter((_, index) => index !== stepIndex));
        }
    };

    const updateStepField = (stepIndex, field, value) => {
        const newSteps = [...steps];
        if (field === "description") {
            newSteps[stepIndex].description = value;
        } else if (field === "hrs" || field === "mins") {
            newSteps[stepIndex].time[field] = value;
        }
        setSteps(newSteps);
    };

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageBase64(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async () => {
        const token = localStorage.getItem("token");
        const payload = {
            title,
            steps,
            image: imageBase64,
            caption,
            categories,
        };

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/recipes`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "x-auth-token": token,
                },
                body: JSON.stringify(payload),
            });
              

            if (response.ok) {
                const data = await response.json();
                console.log("Recipe submitted:", data);
                alert("Recipe posted!");
                // Optionally: navigate("/home");
            } else {
                const err = await response.json();
                alert(err.msg || "Failed to post recipe");
            }
        } catch (err) {
            console.error("Submission error:", err);
        }
    };

    return (
        <div className="post-recipe">
            <input
                type="text"
                placeholder="Recipe Title"
                className="recipe-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />

            {steps.map((step, stepIndex) => (
                <div key={step.id}>
                    <h3 className="step-number">Step {stepIndex + 1}</h3>
                    <h5 className="step-titles">Ingredients</h5>
                    <div className="ingredients">
                        {step.ingredients.map((ingredient, ingredientIndex) => (
                            <div key={ingredientIndex} className="single-ingredient">
                                <input
                                    type="text"
                                    placeholder={`Ingredient ${ingredientIndex + 1}`}
                                    className="input-fields"
                                    value={ingredient}
                                    onChange={(e) =>
                                        updateIngredient(stepIndex, ingredientIndex, e.target.value)
                                    }
                                />
                                {ingredientIndex === step.ingredients.length - 1 && (
                                    <div className="ingredient-btns">
                                        <button
                                            onClick={() => addIngredient(stepIndex)}
                                            className="add-ingredients"
                                        >
                                            Add
                                        </button>
                                        <button
                                            className="remove-ingredients"
                                            onClick={() => removeIngredient(stepIndex)}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    <h5 className="step-titles">Description</h5>
                    <input
                        type="text"
                        placeholder="Explanation of this step"
                        className="input-fields"
                        value={step.description}
                        onChange={(e) =>
                            updateStepField(stepIndex, "description", e.target.value)
                        }
                    />
                    <h5 className="step-titles">Time (if applicable)</h5>
                    <div className="time-container">
                        <input
                            type="number"
                            placeholder="hrs"
                            className="time-field1"
                            value={step.time.hrs}
                            onChange={(e) =>
                                updateStepField(stepIndex, "hrs", e.target.value)
                            }
                        />
                        <input
                            type="number"
                            placeholder="mins"
                            className="time-field2"
                            value={step.time.mins}
                            onChange={(e) =>
                                updateStepField(stepIndex, "mins", e.target.value)
                            }
                        />
                    </div>
                </div>
            ))}

            <button className="delete-step" onClick={() => deleteStep(steps.length - 1)}>
                Delete Step
            </button>
            <div className="add-step">
                <button className="step-btn" onClick={addStep}>+</button>
                <p className="step-txt">Add Step</p>
            </div>

            <div className="image" onClick={() => document.getElementById("imageUpload").click()}>
                <i className="fa-solid fa-paperclip" style={{ cursor: "pointer" }}></i>
                <p className="image-txt">Upload Image</p>
            </div>
            <input
                type="file"
                id="imageUpload"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleImageUpload}
            />
            {imageBase64 && (
                <img src={imageBase64} alt="Uploaded" className="uploaded-image" />
            )}

            <input
                type="text"
                placeholder="Caption (optional)"
                className="caption-field"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
            />

            <input
                type="text"
                placeholder="Add up to 3 categories (comma-separated)"
                className="caption-field"
                onChange={(e) => {
                    const values = e.target.value.split(",").map((val) => val.trim());
                    setCategories(values.slice(0, 3));
                }}
            />

            <div className="submit">
                <button className="submit-part" onClick={()=>{handleSubmit(props.setPost((prev)=>!prev)); set}}>
                    Submit
                </button>
            </div>
        </div>
    );
}

export default Create;