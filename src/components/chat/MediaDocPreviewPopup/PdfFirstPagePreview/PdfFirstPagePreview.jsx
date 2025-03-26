import { useEffect, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.min?url";
import ImageLoader from "../../../common/ImageLoader";

import "./PdfFirstPagePreview.css";

// ✅ Set PDF.js Worker Correctly for Vite/React
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const PdfFirstPagePreview = ({ file }) => {
  const [pdfPreview, setPdfPreview] = useState(null);
  const [totalPages, setTotalPages] = useState(null);

  useEffect(() => {
    if (file) {
      renderPdfFirstPage(file, setPdfPreview, setTotalPages);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  // ✅ Function to Render PDF's First Page to Canvas
  const renderPdfFirstPage = async (pdfUrl, setPdfPreview, setTotalPages) => {
    try {
      let finalUrl = pdfUrl;

      // ✅ Create Object URL if file is Blob
      if (file instanceof Blob) {
        finalUrl = URL.createObjectURL(file);
      }

      // ✅ Load PDF
      const loadingTask = pdfjsLib.getDocument(finalUrl);
      const pdf = await loadingTask.promise;

      // ✅ Get Total Page Count
      setTotalPages(pdf.numPages);

      // ✅ Load the first page
      const page = await pdf.getPage(1);
      const scale = 1.5;
      const viewport = page.getViewport({ scale });

      // ✅ Create a canvas to render the PDF
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };

      // ✅ Render the first page on canvas
      await page.render(renderContext).promise;

      // ✅ Convert canvas to image URL
      setPdfPreview(canvas.toDataURL("image/png"));

      // ✅ Cleanup URL after rendering
      if (finalUrl.startsWith("blob:")) {
        URL.revokeObjectURL(finalUrl);
      }
    } catch (error) {
      console.error("❌ Error loading PDF preview:", error);
    }
  };

  // ✅ Show PDF First Page Preview or Loader
  return (
    <div className={`pdf-preview-container ${pdfPreview ? "" : "gapIncrease"}`}>
      {pdfPreview ? (
        <img
          src={pdfPreview}
          alt="PDF First Page"
          className="pdf-first-page-preview"
        />
      ) : (
        <ImageLoader
          width="150px"
          height="150px"
          spinnerSize="150px"
          className="bg-transparent"
          classNameSpinner="spinner_custom"
        />
      )}
      <div className="pdf-info">
        <p>{file?.name || "Document"}</p>

        {/* ✅ Show Total Pages */}
        {totalPages !== null && (
          <p className="pdf-pages">
            {totalPages === 1 ? "1 page" : `${totalPages} pages`}
          </p>
        )}
      </div>
      <div className="pdf-size">
        <p>
          {file.size >= 1024 * 1024
            ? `${Math.round(file.size / (1024 * 1024))} MB`
            : `${Math.round(file.size / 1024)} KB`}
        </p>{" "}
        - <p>PDF</p>
      </div>
    </div>
  );
};

export default PdfFirstPagePreview;
