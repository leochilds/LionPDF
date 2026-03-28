import { useEffect, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.mjs?url";

// Set the worker source for pdfjs
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

interface PDFViewerProps {
  buffer: Uint8Array;
  scale: number;
  currentPage: number;
  onNumPagesChange: (pages: number) => void;
}

export default function PDFViewer({ buffer, scale, currentPage, onNumPagesChange }: PDFViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pdfDoc, setPdfDoc] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const renderTaskRef = useRef<pdfjsLib.RenderTask | null>(null);

  useEffect(() => {
    let active = true;
    const loadPdf = async () => {
      try {
        const loadingTask = pdfjsLib.getDocument({ data: buffer });
        const doc = await loadingTask.promise;
        if (active) {
          setPdfDoc(doc);
          onNumPagesChange(doc.numPages);
        }
      } catch (e) {
        console.error("Error loading PDF:", e);
      }
    };
    loadPdf();

    return () => {
      active = false;
      if (pdfDoc) {
        pdfDoc.destroy();
      }
    };
  }, [buffer]);

  useEffect(() => {
    if (!pdfDoc || !canvasRef.current) return;

    let active = true;

    const renderPage = async () => {
      try {
        const page = await pdfDoc.getPage(currentPage);
        if (!active) return;

        const viewport = page.getViewport({ scale });
        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext("2d");
        if (!context) return;

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        // Cancel previous render task if still running
        if (renderTaskRef.current) {
          renderTaskRef.current.cancel();
        }

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        const renderTask = page.render(renderContext as any);
        renderTaskRef.current = renderTask;
        
        await renderTask.promise;
      } catch (err: any) {
        // Ignore rendering cancellation errors
        if (err.name !== 'RenderingCancelledException') {
          console.error("Render error:", err);
        }
      }
    };

    renderPage();

    return () => {
      active = false;
    };
  }, [pdfDoc, currentPage, scale]);

  return (
    <div className="pdf-page-container">
      <canvas ref={canvasRef} className="pdf-canvas shadow" />
    </div>
  );
}