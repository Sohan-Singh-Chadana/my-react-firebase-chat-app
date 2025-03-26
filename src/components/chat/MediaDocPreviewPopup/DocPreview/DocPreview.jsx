import { AiFillFileZip } from "react-icons/ai";
import { BsFiletypePpt, BsFiletypeXlsx } from "react-icons/bs";
import { GoFileZip } from "react-icons/go";
import { GrDocumentText } from "react-icons/gr";
import { MdInsertDriveFile, MdOutlinePictureAsPdf } from "react-icons/md";
import { SiGoogledocs } from "react-icons/si";
import "./DocPreview.css";

const DocPreview = ({ document }) => {
  const getFileIcon = (fileName) => {
    if (!fileName) return <MdInsertDriveFile />;

    const ext = fileName.split(".").pop().toLowerCase();

    const fileIcons = {
      zip: <AiFillFileZip />,
      rar: <GoFileZip />,
      txt: <GrDocumentText />,
      csv: <GrDocumentText />,
      pdf: <MdOutlinePictureAsPdf />,
      doc: <SiGoogledocs />,
      docx: <SiGoogledocs />,
      xls: <BsFiletypeXlsx />,
      xlsx: <BsFiletypeXlsx />,
      ppt: <BsFiletypePpt />,
      pptx: <BsFiletypePpt />,
    };

    return fileIcons[ext] || <MdInsertDriveFile />;
  };
  return (
    <div className="doc-preview-container">
      <p className="doc-name">{document.file?.name || "Document"}</p>
      <div className="doc-preview">
        {/* ✅ Get Correct File Icon */}
        <div className="doc-icon">{getFileIcon(document.file?.name)}</div>
        <div className="doc-info">
          <p className="doc-no-text">No preview available.</p>
          <div className="doc-metadata">
            {/* ✅ Show File Size in MB or KB */}
            <p className="doc-size">
              {document.file.size >= 1024 * 1024
                ? `${Math.round(document.file.size / (1024 * 1024))} MB`
                : `${Math.round(document.file.size / 1024)} KB`}
            </p>
            {" - "}
            {/* ✅ Show File Extension */}
            <p>
              {document.file?.name
                ? document.file.name.split(".").pop().toUpperCase()
                : "Unknown"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocPreview;
