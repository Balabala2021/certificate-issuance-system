import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "../styles/PdfUploader.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PdfUploader = ({ onFileLoaded }) => {
  const [pdfFile, setPdfFile] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setPdfFile(file);
      onFileLoaded(file);
    } else {
      alert("Please upload a valid PDF file.");
    }
  };

  return (
    <div className="pdf-upload-container">
      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        className="file-input"
      />
    </div>
  );
};

export default PdfUploader;
