import React, { useState, useCallback } from "react";
import CourseForm from "./components1/CourseForm";
import CoursesTable from "./components1/CourseTable";
import PdfUploader from "./components1/PdfUploader";
import PdfEditor from "./components1/PdfEditor";
import PdfPreviewDownload from "./components1/PdfPreviewDownload";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "../../certificate/src/app.css";

function App() {
  const [uploadedPdf, setUploadedPdf] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courses, setCourses] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [pdfSelectedCourse, setPdfSelectedCourse] = useState(null);

  const handleAddCourse = (course) => {
    if (editingIndex !== null) {
      const updated = [...courses];
      updated[editingIndex] = course;
      setCourses(updated);
      setEditingIndex(null);
    } else {
      setCourses([...courses, course]);
    }
  };

  const handleEdit = (editingIndex) => {
    console.log("Editing Index: ", editingIndex);
    setEditingIndex(editingIndex);
    setSelectedCourse(courses[editingIndex]);
    console.log("Course: ", courses[editingIndex]);
    console.log("Selected Course: ", selectedCourse);
  };

  const handleDelete = (index) => {
    const updated = [...courses];
    updated.splice(index, 1);
    setCourses(updated);
    if (index === editingIndex) setEditingIndex(null);
  };

  const handleFileLoaded = useCallback((file) => {
    setUploadedPdf(file);
  }, []);

  const handleDropDown = (index) => {
    setPdfSelectedCourse(courses[index]);
  };

  return (
    <div className="App">
      <h1>Certificate Issuance System</h1>
      <div
        style={{
          display: "flex",
        }}
        className="app-interface"
      >
        {" "}
        <CourseForm
          onAddOrUpdate={handleAddCourse}
          editingData={selectedCourse}
          setSelectedCourse={setSelectedCourse}
        />{" "}
        <div style={{ display: "flex", flexDirection: "column" }}>
          {" "}
          <PdfUploader onFileLoaded={handleFileLoaded} />
          {uploadedPdf && (
            <DndProvider backend={HTML5Backend}>
              <div className="certificate-preview-container">
                <div className="form-section">
                  <label htmlFor="course" className="dropdown-label">
                    Select Candidate Name:
                  </label>
                  <select
                    name="course"
                    id="course"
                    className="course-dropdown"
                    onChange={(e) => handleDropDown(e.target.selectedIndex - 1)}
                    disabled={courses.length === 0}
                  >
                    <option disabled selected>
                      -- Select Course --
                    </option>
                    {courses.map((ele, index) => (
                      <option value={ele.candidateName} key={index}>
                        {ele.candidateName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="preview-section">
                  <PdfPreviewDownload
                    pdfFile={uploadedPdf}
                    courseData={pdfSelectedCourse}
                  />
                </div>
              </div>
            </DndProvider>
          )}
        </div>
      </div>

      <CoursesTable
        courses={courses}
        onSelect={setSelectedCourse}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default App;
