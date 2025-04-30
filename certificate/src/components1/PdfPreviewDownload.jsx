import { useDrop } from "react-dnd";
import DraggableField from "./DraggableField";
import { useRef, useState, useEffect } from "react";
import { Page, pdfjs, Document } from "react-pdf";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import QRCode from "react-qr-code";
import "../styles/PdfPreviewDownload.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PdfPreviewDownload = ({ pdfFile, courseData, readOnly = false }) => {
  const wrapperRef = useRef();
  const canvasRef = useRef();
  const [positions, setPositions] = useState(
    JSON.parse(localStorage.getItem("fieldPositions") || "{}")
  );
  const [pdfWidth, setPdfWidth] = useState(600);
  const [canvasHeight, setCanvasHeight] = useState(600);

  const fields = [
    "candidateName",
    "courseName",
    "courseId",
    "tenure",
    "description",
    "qrCode",
  ];

  useEffect(() => {
    localStorage.setItem("fieldPositions", JSON.stringify(positions));
  }, [positions]);

  const [, drop] = useDrop({
    accept: "FIELD",
    drop(item, monitor) {
      const delta = monitor.getDifferenceFromInitialOffset();
      if (!delta) return;

      const newX = (positions[item.id]?.x || 0) + delta.x;
      const newY = (positions[item.id]?.y || 0) + delta.y;

      setPositions((prev) => ({
        ...prev,
        [item.id]: { x: newX, y: newY },
      }));
    },
  });

  const generateFieldContent = (id) => {
    switch (id) {
      case "tenure":
        return `${courseData?.startDate || "DD-MM-YYYY"} - ${
          courseData?.endDate || "DD-MM-YYYY"
        }`;
      default:
        return courseData?.[id] || id;
    }
  };

  // Resize logic
  useEffect(() => {
    const updateWidth = () => {
      setPdfWidth(window.innerWidth < 768 ? window.innerWidth : 600);
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  // Render PDF first page to canvas
  useEffect(() => {
    const renderPDF = async () => {
      if (!pdfFile || !canvasRef.current) return;

      const loadingTask = pdfjs.getDocument(pdfFile);
      const pdf = await loadingTask.promise;
      const page = await pdf.getPage(1);

      const viewport = page.getViewport({
        scale: pdfWidth / page.getViewport({ scale: 1 }).width,
      });

      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      setCanvasHeight(viewport.height);

      const renderContext = {
        canvasContext: context,
        viewport,
      };

      await page.render(renderContext).promise;
    };

    renderPDF();
  }, [pdfFile, pdfWidth]);

  const handleDownload = async () => {
    const canvas = await html2canvas(wrapperRef.current, {
      scale: 2,
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "px",
      format: [canvas.width, canvas.height],
    });
    pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
    pdf.save(`${courseData?.candidateName || "certificate"}.pdf`);
  };

  return (
    <>
      <div className="preview-container">
        <div
          ref={wrapperRef}
          className="pdf-wrapper"
          style={{
            width: pdfWidth,
            height: "auto",
            position: "relative",
          }}
        >
          <Document file={pdfFile}>
            <Page
              pageNumber={1}
              width={pdfWidth}
              renderAnnotationLayer={false}
              renderTextLayer={false}
            />
          </Document>

          <div
            ref={drop}
            className="overlay"
            style={{
              width: pdfWidth,
              height: "100%",
              position: "absolute",
              top: 0,
              left: 0,
            }}
          >
            {fields.map((field) => {
              const pos = positions[field] || { x: 50, y: 50 };
              const content = generateFieldContent(field);

              return (
                <DraggableField key={field} id={field} left={pos.x} top={pos.y}>
                  {field === "qrCode" ? (
                    <div style={{ background: "white", padding: 4 }}>
                      <QRCode
                        value={JSON.stringify(courseData)}
                        size={80}
                        level="H"
                      />
                    </div>
                  ) : (
                    content
                  )}
                </DraggableField>
              );
            })}
          </div>
        </div>
      </div>
      <button className="download-btn" onClick={handleDownload}>
        Download Certificate
      </button>
    </>
  );
};

export default PdfPreviewDownload;
