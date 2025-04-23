import { useState } from "react";
import Select from "react-select";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";


function Create(props) {
  // Initialize steps with an object structure for ingredients and proper time keys
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [steps, setSteps] = useState([
    { 
      id: 1, 
      ingredients: [{ name: "", quantity: "", unit: ""}], 
      description: "", 
      time: { hours: "", minutes: "" } 
    }
  ]);
  const [imageBase64, setImageBase64] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [categories, setCategories] = useState([]);
  const [videoUrls, setVideoUrls] = useState([]);

  // const navigate = useNavigate(); // Get the navigate function
  const categoryOptions = [
    { value: "Biryani Varieties", label: "Biryani Varieties" },
    { value: "Nihari Delicacies", label: "Nihari Delicacies" },
    { value: "Karahi Creations", label: "Karahi Creations" },
    { value: "Korma Specialties", label: "Korma Specialties" },
    { value: "Haleem Masterpieces", label: "Haleem Masterpieces" },
    { value: "Kebab Assortments", label: "Kebab Assortments" },
    { value: "Tandoori Treats", label: "Tandoori Treats" },
    { value: "Curry Classics", label: "Curry Classics" },
    { value: "Pulao Dishes", label: "Pulao Dishes" },
    { value: "Daal Delights", label: "Daal Delights" },
    { value: "Chaat Sensations", label: "Chaat Sensations" },
    { value: "Paratha Varieties", label: "Paratha Varieties" },
    { value: "Naan & Flatbreads", label: "Naan & Flatbreads" },
    { value: "Samosa Selections", label: "Samosa Selections" },
    { value: "Pakora & Bhaji", label: "Pakora & Bhaji" },
    { value: "Pickles & Chutneys", label: "Pickles & Chutneys" },
    { value: "Raita & Yogurt Dishes", label: "Raita & Yogurt Dishes" },
    { value: "Saag & Green Vegetable Curries", label: "Saag & Green Vegetable Curries" },
    { value: "Vegetable Curries", label: "Vegetable Curries" },
    { value: "Mughlai Influences", label: "Mughlai Influences" },
    { value: "Street Food Specialties", label: "Street Food Specialties" },
    { value: "Seafood Selections", label: "Seafood Selections" },
    { value: "Traditional Desserts", label: "Traditional Desserts" },
    { value: "Rice Puddings & Kheer", label: "Rice Puddings & Kheer" },
    { value: "Sheer Khurma", label: "Sheer Khurma" },
    { value: "Lassi & Yogurt Drinks", label: "Lassi & Yogurt Drinks" },
    { value: "Chai Varieties", label: "Chai Varieties" },
    { value: "Halwa Creations", label: "Halwa Creations" },
    { value: "Salad & Raita Innovations", label: "Salad & Raita Innovations" },
    { value: "Fusion Desi Snacks", label: "Fusion Desi Snacks" }
  ];

  const addStep = () => {
    setSteps([
      ...steps,
      { 
        id: steps.length + 1, 
        ingredients: [{ name: "", quantity: "", unit: ""}], 
        description: "", 
        time: { hours: "", minutes: "" } 
      }
    ]);
  };

  const updateIngredient = (stepIndex, ingredientIndex, value, field) => {
    const newSteps = [...steps];
    newSteps[stepIndex].ingredients[ingredientIndex][field] = value;
    setSteps(newSteps);
  };
  
  const addIngredient = (stepIndex) => {
    const newSteps = [...steps];
    newSteps[stepIndex].ingredients.push({ name: "", quantity: "", unit: "" });
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
    } else if (field === "hours" || field === "minutes") {
      newSteps[stepIndex].time[field] = value;
    }
    setSteps(newSteps);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageBase64(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  //-------------------------------------------
  // ✅ New: handle video upload
  const handleVideoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("video", file);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/recipes/upload-video`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "x-auth-token": localStorage.getItem("token"),
          },
        }
      );

      setVideoUrls((prev) => [...prev, res.data.videoUrl]);
      alert("Video uploaded successfully!");
    } catch (err) {
      console.error("Video upload failed:", err);
      alert("Video upload failed.");
    }
  };
  //-------------------------------------------

  const handleSubmit = async () => {
    // props.setPost(true);
    const token = localStorage.getItem("token");
    console.log('submitting')

    const formData = new FormData();
    formData.append("title", title);
    formData.append("steps", JSON.stringify(steps));
    formData.append("caption", caption);
    formData.append("categories", JSON.stringify(categories));
    formData.append("videoUrls", JSON.stringify(videoUrls));

    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      console.log("Sending token:", token);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/recipes`, {
        method: "POST",
        headers: {
          "x-auth-token": token
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Recipe submitted:", data);
        navigate("/home");  
      } else {
        const err = await response.json();
        // alert(err.msg || "Failed to post recipe");
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
                  className="input-ingredient-field"
                  value={ingredient.name}
                  onChange={(e) =>
                    updateIngredient(stepIndex, ingredientIndex, e.target.value, "name")
                  }
                />
                <input
                  type="text"
                  placeholder="Quantity"
                  className="input-quantity-field"
                  value={ingredient.quantity}
                  onChange={(e) =>
                    updateIngredient(stepIndex, ingredientIndex, e.target.value, "quantity")
                  }
                />
                <select
                  className="input-unit-field"
                  value={ingredient.unit}
                  onChange={(e) =>
                    updateIngredient(stepIndex, ingredientIndex, e.target.value, "unit")
                  }
                >
                  <option value="">Unit</option>
                  <option value="g">g</option>
                  <option value="kg">kg</option>
                  <option value="ml">ml</option>
                  <option value="l">l</option>
                  <option value="tsp">tsp</option>
                  <option value="tbsp">tbsp</option>
                  <option value="cup">cup</option>
                  <option value="pinch">pinch</option>
                  <option value="slice">slice</option>
                  <option value="piece">piece</option>
                </select>

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
            className="input-description-field"
            value={step.description}
            onChange={(e) =>
              updateStepField(stepIndex, "description", e.target.value)
            }
          />

          <h5 className="step-titles">Time (if applicable)</h5>
          <div className="time-container">
            <input
              type="number"
              placeholder="hours"
              className="time-field1"
              value={step.time.hours}
              onChange={(e) =>
                updateStepField(stepIndex, "hours", e.target.value)
              }
            />
            <input
              type="number"
              placeholder="mins"
              className="time-field2"
              value={step.time.minutes}
              onChange={(e) =>
                updateStepField(stepIndex, "minutes", e.target.value)
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

      <Select
        isMulti
        name="categories"
        options={categoryOptions}
        className="category-dropdown"
        classNamePrefix="select"
        value={categoryOptions.filter((option) => categories.includes(option.value))}
        onChange={(selected) => {
          if (selected.length <= 3) {
            setCategories(selected.map((s) => s.value));
          }
        }}
        placeholder="Select up to 3 categories"
        styles={{
          control: (base, state) => ({
            ...base,
            backgroundColor: "#fff",
            borderColor: state.isFocused ? "#6CBF84" : "#ccc",
            boxShadow: state.isFocused ? "0 0 0 2px rgba(108, 191, 132, 0.3)" : "none",
            borderRadius: "6px",
            minHeight: "48px",
            fontSize: "0.95rem",
            transition: "all 0.2s ease",
          }),
          multiValue: (base) => ({
            ...base,
            backgroundColor: "#6CBF84",
            color: "white",
            borderRadius: "4px",
            padding: "0 4px",
          }),
          multiValueLabel: (base) => ({
            ...base,
            color: "white",
            fontWeight: "500",
          }),
          option: (base, state) => ({
            ...base,
            backgroundColor: state.isSelected
              ? "#2E7D32"
              : state.isFocused
              ? "#F1F8E9"
              : "white",
            color: state.isSelected ? "white" : "#333",
            padding: "10px",
          }),
        }}
      />
      {/* ✅ Video Upload Field */}
      <div className="video-container">
        <h5 className="step-titles">Upload a Video</h5>
        <input type="file" accept="video/*" onChange={handleVideoUpload} className="choose-video"/>
      </div>

      {/* ✅ Video Preview */}
      {videoUrls.map((url, index) => (
        <video key={index} controls width="100%" style={{ marginTop: "10px" }}>
          <source src={url} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ))}
      <button className="submit-part" onClick={handleSubmit}>
        Submit
      </button>
    </div>
  );
}

export default Create;
