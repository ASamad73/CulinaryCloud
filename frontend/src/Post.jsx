import { useState } from "react";

function Post() {
    const [steps, setSteps] = useState([{id:1, ingredients: [""]}]);
    const [submit, setSubmit]=useState(false)

    const addStep = () => {
        setSteps([...steps, { id: steps.length + 1, ingredients: [""] }]);
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
        if (newSteps[stepIndex].ingredients.length>1) {
            newSteps[stepIndex].ingredients.pop(); 
            setSteps(newSteps); 
        }
    };

    const deleteStep = (stepIndex) => {
        if(stepIndex>0){
            setSteps(steps.filter((_, index) => index !== stepIndex));
        }
    };

    return (
        <div className="post-recipe">
            <input type="text" placeholder="Recipe Title" className="recipe-title"/>
            {steps.map((step, stepIndex) => (
                <div key={step.id}>
                    <h3 className="step-number">Step {stepIndex + 1}</h3>
                    <h5 className="step-titles">Ingredients</h5>
                    <div className="ingredients">
                        {step.ingredients.map((ingredient, ingredientIndex) => (
                            <div key={ingredientIndex} className="single-ingredient">
                                <input
                                    type="text"
                                    placeholder={"Ingredient"}
                                    className="input-fields"
                                    value={ingredient}
                                    onChange={(e) => updateIngredient(stepIndex, ingredientIndex, e.target.value)}
                                />
                                {ingredientIndex === step.ingredients.length - 1 && (
                                <div className="ingredient-btns">
                                    <button onClick={() => addIngredient(stepIndex)} className="add-ingredients">Add</button>
                                    <button className="remove-ingredients" onClick={()=>removeIngredient(stepIndex)}>Remove</button>
                                </div>
                            )}
                            </div>
                        ))}
                    </div>
                    <h5 className="step-titles">Description</h5>
                    <input type="text" placeholder="Explanation of this step" className="input-fields"/>
                    <h5 className="step-titles">Time (if applicable)</h5>
                    <input type="text" placeholder="Time required" className="input-fields"/>
                </div>
            ))}
            <button className="delete-step" onClick={() => deleteStep(steps.length-1)}>Delete Step</button>
            <div className="add-step">
                <button className="step-btn" onClick={addStep}>+</button>
                <p className="step-txt">Add Step</p>
            </div>
            <div className="image">
                <i className="fa-solid fa-paperclip"  style={{ cursor: "pointer" }}></i>
                <p className="image-txt">Upload Image</p>
            </div>
            <input type="text" placeholder="Caption (optional)" className="caption-field"></input>
            <div className="next">
                <button className="next-part" onClick={()=>setSubmit(true)}>Submit</button>
            </div>
        </div>
    );
}

export default Post;
