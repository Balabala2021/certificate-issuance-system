import React, { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const fields = [
  "candidateName",
  "courseName",
  "courseId",
  "tenure",
  "description",
  "qrCode",
];

const PdfEditor = ({ pdfFile, courseData }) => {
  const [positions, setPositions] = useState({});

  useEffect(() => {
    const saved = localStorage.getItem("fieldPositions");
    if (saved) setPositions(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("fieldPositions", JSON.stringify(positions));
  }, [positions]);

  const handleUpdate = (fieldId, pos) => {
    setPositions((prev) => ({ ...prev, [fieldId]: pos }));
  };

  const generateFieldContent = (id) => {
    switch (id) {
      case "tenure":
        return `${courseData?.startDate} - ${courseData?.endDate}`;
      default:
        return courseData?.[id] || id;
    }
  };

  return (
    <div
      style={{
        border: "1px solid #ccc",
        display: "inline-block",
        position: "relative",
      }}
    >
      <Document file={pdfFile}>
        <Page pageNumber={1} width={600} />
      </Document>
    </div>
  );
};

export default PdfEditor;
