import React, { useState, useEffect } from "react";
import "../styles/CourseForm.css";

const CourseForm = ({ onAddOrUpdate, editingData, setSelectedCourse }) => {
  const [formData, setFormData] = useState({
    candidateName: "",
    courseName: "",
    courseId: "",
    startDate: "",
    endDate: "",
    description: "",
  });

  const [edit, setEdit] = useState(false);

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingData) {
      setFormData(editingData);
      setEdit(true);
      setErrors({});
    }
  }, [editingData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (value.trim() !== "") {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    Object.entries(formData).forEach(([key, value]) => {
      if (value.trim() === "") {
        newErrors[key] = "This field is required";
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onAddOrUpdate(formData);
    setFormData({
      candidateName: "",
      courseName: "",
      courseId: "",
      startDate: "",
      endDate: "",
      description: "",
    });
    setErrors({});
    setSelectedCourse(null);
  };

  const handleEdit = (e) => {
    e.preventDefault();
    if (edit) {
      setFormData({
        candidateName: "",
        courseName: "",
        courseId: "",
        startDate: "",
        endDate: "",
        description: "",
      });
      setErrors({});
      setEdit(false);
      setSelectedCourse(null);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      {[
        {
          name: "candidateName",
          type: "text",
          placeholder: "Candidate Name",
          label: "Enter Candidate Name",
        },
        {
          name: "courseName",
          type: "text",
          placeholder: "Course Name",
          label: "Enter Course Name",
        },
        {
          name: "courseId",
          type: "text",
          placeholder: "Course ID",
          label: "Enter Course ID",
        },
        { name: "startDate", type: "date", label: "Enter Start Date" },
        { name: "endDate", type: "date", label: "Enter End Date" },
      ].map(({ name, label, type, placeholder }) => (
        <div key={name} className="form-group">
          <label>{label}</label>
          <input
            type={type}
            name={name}
            value={formData[name]}
            onChange={handleChange}
            placeholder={placeholder}
            className={`form-input ${errors[name] ? "input-error" : ""}`}
          />
          {errors[name] && <div className="error-text">{errors[name]}</div>}
        </div>
      ))}

      <div className="form-group">
        <label>Enter Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          className={`form-input ${errors.description ? "input-error" : ""}`}
        />
        {errors.description && (
          <div className="error-text">{errors.description}</div>
        )}
      </div>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <button type="submit" className="form-button">
          {edit ? "Update" : "Add"} Course
        </button>
        <button className="form-button" onClick={(e) => handleEdit(e)}>
          Clear Course
        </button>
      </div>
    </form>
  );
};

export default CourseForm;
