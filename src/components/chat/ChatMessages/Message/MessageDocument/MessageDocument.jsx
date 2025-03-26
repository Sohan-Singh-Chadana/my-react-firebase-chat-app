import { useEffect, useState } from "react";
import { MdDownload, MdInsertDriveFile } from "react-icons/md";
import {
  FaFileExcel,
  FaFileImage,
  FaFilePdf,
  FaFilePowerpoint,
  FaFileVideo,
  FaFileWord,
} from "react-icons/fa";
import { AiFillFileZip } from "react-icons/ai";
import { GoFileZip } from "react-icons/go";
import "./MessageDocument.css";
import { FiFileText } from "react-icons/fi";

const MessageDocument = ({ message, isOwnMessage }) => {
  const [isDownloaded, setIsDownloaded] = useState(false);

  // ✅ Check download status from localStorage on initial render
  useEffect(() => {
    const isAlreadyDownloaded = localStorage.getItem(
      `downloaded_${message.docUrl}`
    );
    if (isAlreadyDownloaded === "true") {
      setIsDownloaded(true);
    }
  }, [message.docUrl]);

  // document download Handler
  const downloadDocument = async () => {
    try {
      // ✅ Fetch the file as a blob
      const response = await fetch(message.docUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch the file!");
      }
      const blob = await response.blob();

      // ✅ Create a blob URL and trigger download
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = message.docName; // ✅ Set custom file name
      document.body.appendChild(link);
      link.click();

      // ✅ Cleanup after download
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);

      // ✅ Hide the download icon after successful download
      setIsDownloaded(true);
      // ✅ Mark as downloaded and save to localStorage
      localStorage.setItem(`downloaded_${message.docUrl}`, "true");
    } catch (error) {
      console.error("❌ Error downloading file:", error);
    }
  };

  // document type icon
  const getFileIcon = (docType) => {
    if (!docType) return <MdInsertDriveFile className="doc-icon" />;

    const fileIcons = {
      pdf: <FaFilePdf className="doc-icon pdf" />,
      png: <FaFileImage className="doc-icon image" />,
      jpg: <FaFileImage className="doc-icon image" />,
      jpeg: <FaFileImage className="doc-icon image" />,
      webp: <FaFileImage className="doc-icon image" />,
      gif: <FaFileImage className="doc-icon image" />,
      mp4: <FaFileVideo className="doc-icon video" />,
      avi: <FaFileVideo className="doc-icon video" />,
      mov: <FaFileVideo className="doc-icon video" />,
      doc: <FaFileWord className="doc-icon doc" />,
      docx: <FaFileWord className="doc-icon doc" />,
      txt: <FiFileText className="doc-icon text" />,
      zip: <AiFillFileZip className="doc-icon zip" />,
      rar: <GoFileZip className="doc-icon zip" />,
      xls: <FaFileExcel className="doc-icon xls" />,
      xlsx: <FaFileExcel className="doc-icon xls" />,
      ppt: <FaFilePowerpoint className="doc-icon ppt" />,
      pptx: <FaFilePowerpoint className="doc-icon ppt" />,
    };

    return (
      fileIcons[docType.toLowerCase()] || (
        <MdInsertDriveFile className="doc-icon" />
      )
    );
  };

  return (
    <div
      className={`doc-content ${isOwnMessage ? "outgoing" : "incoming"}`}
      onClick={downloadDocument}
    >
      <div className="docInfo">
        {/* ✅ Dynamic Icon */}
        {getFileIcon(message.docType)}
        <div className="docText">
          <span className="docName">{message.docName}</span>
          <div className="docSizeTypeInfo">
            <span className="docType">{message.docType}</span>
            <span className="dot">.</span>
            <span className="docSize">{message.docSize}</span>
          </div>
        </div>
      </div>

      {/* ✅ Show Download Icon Only if Not Downloaded */}
      {!isDownloaded && (
        <button
          className="docDownloadIcon"
          onClick={(e) => {
            e.stopPropagation();
            downloadDocument();
          }}
        >
          <MdDownload />
        </button>
      )}
    </div>
  );
};

export default MessageDocument;
