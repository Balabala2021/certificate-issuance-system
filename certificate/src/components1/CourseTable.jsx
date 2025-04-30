import React from "react";
import "../styles/CourseTable.css";
import { FaEdit, FaTrash } from "react-icons/fa";
const CoursesTable = ({ courses, onDelete, onEdit }) => {
  return (
    <div className="table-container">
      <h3>Created Courses</h3>
      {courses?.length === 0 ? (
        <p>No courses created yet.</p>
      ) : (
        <table className="courses-table">
          <thead>
            <tr>
              <th className="table-cell">Candidate Name</th>
              <th className="table-cell">Course Name</th>
              <th className="table-cell">Course ID</th>
              <th className="table-cell">Tenure</th>
              <th className="table-cell">Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses?.map((course, index) => (
              <tr key={index}>
                <td className="table-cell">{course.candidateName}</td>
                <td className="table-cell">{course.courseName}</td>
                <td className="table-cell">{course.courseId}</td>
                <td className="table-cell">
                  {course.startDate} - {course.endDate}
                </td>
                <td className="table-cell">
                  <FaEdit
                    onClick={() => onEdit(index)}
                    style={{ color: "blue", marginRight: "10px" }}
                  />

                  <FaTrash
                    onClick={() => onDelete(index)}
                    title="Delete"
                    style={{ color: "red" }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CoursesTable;
