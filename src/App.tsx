import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { FolderOpen, ZoomIn, ZoomOut, ChevronLeft, ChevronRight } from "lucide-react";
import PDFViewer from "./components/PDFViewer";
import "./App.css";

function App() {
  const [pdfBuffer, setPdfBuffer] = useState<Uint8Array | null>(null);
  const [scale, setScale] = useState(1.0);
  const [currentPage, setCurrentPage] = useState(1);
  const [numPages, setNumPages] = useState(0);

  async function openPdf() {
    try {
      // The Rust backend handles the file dialog to ensure the frontend remains sandboxed.
      const buffer: number[] = await invoke("open_pdf");
      setPdfBuffer(new Uint8Array(buffer));
      setCurrentPage(1);
      setScale(1.0);
    } catch (error) {
      if (error !== "No file selected") {
        console.error("Failed to open PDF:", error);
        alert("Failed to open PDF.");
      }
    }
  }

  const handleZoomIn = () => setScale(s => Math.min(s + 0.25, 3.0));
  const handleZoomOut = () => setScale(s => Math.max(s - 0.25, 0.5));
  
  const handlePrevPage = () => setCurrentPage(p => Math.max(p - 1, 1));
  const handleNextPage = () => setCurrentPage(p => Math.min(p + 1, numPages));

  return (
    <div className="app-container">
      <header className="toolbar shadow">
        <div className="toolbar-group">
          <button onClick={openPdf} className="btn" title="Open PDF">
            <FolderOpen size={20} />
            <span>Open</span>
          </button>
        </div>

        {pdfBuffer && (
          <>
            <div className="toolbar-group">
              <button onClick={handlePrevPage} disabled={currentPage <= 1} className="btn icon-only" title="Previous Page">
                <ChevronLeft size={20} />
              </button>
              <span className="page-info">
                Page {currentPage} of {numPages}
              </span>
              <button onClick={handleNextPage} disabled={currentPage >= numPages} className="btn icon-only" title="Next Page">
                <ChevronRight size={20} />
              </button>
            </div>

            <div className="toolbar-group">
              <button onClick={handleZoomOut} disabled={scale <= 0.5} className="btn icon-only" title="Zoom Out">
                <ZoomOut size={20} />
              </button>
              <span className="zoom-info">{Math.round(scale * 100)}%</span>
              <button onClick={handleZoomIn} disabled={scale >= 3.0} className="btn icon-only" title="Zoom In">
                <ZoomIn size={20} />
              </button>
            </div>
          </>
        )}
      </header>

      <main className="viewer-area">
        {pdfBuffer ? (
          <PDFViewer 
            buffer={pdfBuffer} 
            scale={scale} 
            currentPage={currentPage} 
            onNumPagesChange={setNumPages} 
          />
        ) : (
          <div className="empty-state">
            <div className="empty-content">
              <FolderOpen size={48} className="empty-icon" />
              <h2>Welcome to LionPDF</h2>
              <p>A secure, privacy-focused PDF reader.</p>
              <button onClick={openPdf} className="btn primary-btn">
                Open a PDF Document
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
