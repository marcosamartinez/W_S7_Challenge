import React, { useState, useEffect } from "react";

const validationErrors = {
  fullNameTooShort: "full name must be at least 3 characters",
  fullNameTooLong: "full name must be at most 20 characters",
  sizeIncorrect: "size must be S or M or L",
};

const toppings = [
  { topping_id: "1", text: "Pepperoni" },
  { topping_id: "2", text: "Green Peppers" },
  { topping_id: "3", text: "Pineapple" },
  { topping_id: "4", text: "Mushrooms" },
  { topping_id: "5", text: "Ham" },
];

export default function Form() {
  const [fullName, setFullName] = useState("");
  const [size, setSize] = useState("");
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const validateForm = () => {
    const newErrors = {};
    if (fullName.trim().length < 3)
      newErrors.fullName = validationErrors.fullNameTooShort;
    if (!["S", "M", "L"].includes(size))
      newErrors.size = validationErrors.sizeIncorrect;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      try {
        const response = await fetch("http://localhost:9009/api/order", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fullName: fullName.trim(),
            size,
            toppings: selectedToppings,
          }),
        });

        if (!response.ok) {
          throw new Error("Server responded with an error!");
        }

        const data = await response.json();
        setSuccessMessage(data.message);
      } catch (error) {
        setErrors({ submit: error.message });
      }

      setFullName("");
      setSize("");
      setSelectedToppings([]);
    }
  };

  const handleToppingChange = (event) => {
    const toppingValue = event.target.name;
    setSelectedToppings((prevToppings) =>
      prevToppings.includes(toppingValue)
        ? prevToppings.filter((t) => t !== toppingValue)
        : [...prevToppings, toppingValue]
    );
  };

  useEffect(() => {
    const newErrors = {};
    if (fullName.trim().length < 3)
      newErrors.fullName = validationErrors.fullNameTooShort;
    if (!["S", "M", "L"].includes(size))
      newErrors.size = validationErrors.sizeIncorrect;
    setErrors(newErrors);
  }, [fullName, size]);

  return (
    <form onSubmit={handleSubmit}>
      <h2>Order Your Pizza</h2>
      {successMessage && <div className="success">{successMessage}</div>}
      {errors.submit && <div className="failure">{errors.submit}</div>}

      <div className="input-group">
        <div>
          <label htmlFor="fullName">Full Name</label>
          <br />
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Type full name"
            id="fullName"
            type="text"
          />
        </div>
        {errors.fullName && <div className="error">{errors.fullName}</div>}
      </div>

      <div className="input-group">
        <div>
          <label htmlFor="size">Size</label>
          <br />
          <select
            value={size}
            onChange={(e) => setSize(e.target.value)}
            id="size"
          >
            <option value="">----Choose Size----</option>
            <option value="S">Small</option>
            <option value="M">Medium</option>
            <option value="L">Large</option>
          </select>
        </div>
        {errors.size && <div className="error">{errors.size}</div>}
      </div>

      <div className="input-group">
        {toppings.map((topping) => (
          <label key={topping.topping_id}>
            <input
              name={topping.topping_id}
              type="checkbox"
              checked={selectedToppings.includes(topping.topping_id)}
              onChange={handleToppingChange}
            />
            {topping.text}
            <br />
          </label>
        ))}
      </div>
      <input type="submit" disabled={Object.keys(errors).length > 0} />
    </form>
  );
}
