"use client";
import { useEffect, useState, useRef } from "react";
import * as pdfjs from "pdfjs-dist";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

type PdfSource = string | { data: Uint8Array } | undefined;

type PdfViewerProps =
  | {
      blob?: undefined;
      url?: undefined;
      fileName: string;
      base64: string;
    }
  | {
      blob: Blob;
      fileName: string;
      base64?: undefined;
      url?: undefined;
    }
  | {
      url: string;
      fileName: string;
      blob?: undefined;
      base64?: undefined;
    };

interface PageData {
  canvas: HTMLCanvasElement;
  canvasWrapper: HTMLDivElement;
  pageNumber: number;
}

const PdfViewer = ({ blob, fileName, base64, url }: PdfViewerProps) => {
  const [pdfSource, setPdfSource] = useState<PdfSource>();
  const [pdfDoc, setPdfDoc] = useState<any | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1.5);
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [pageInput, setPageInput] = useState("1");
  const pageRefs = useRef<{ [key: number]: PageData }>({});

  // Set sumber PDF
  useEffect(() => {
    const setSource = async () => {
      try {
        setError("");
        setLoading(true);

        if (url) {
          setPdfSource(url);
        } else if (blob) {
          const arrayBuffer = await blob.arrayBuffer();
          const uint8Array = new Uint8Array(arrayBuffer);
          setPdfSource({ data: uint8Array });
        } else if (base64) {
          const byteCharacters = atob(base64);
          const uint8Array = new Uint8Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            uint8Array[i] = byteCharacters.charCodeAt(i);
          }
          setPdfSource({ data: uint8Array });
        } else {
          setPdfSource(undefined);
          setLoading(false);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error memproses sumber PDF";
        setError(errorMessage);
        console.error("Error mengatur sumber PDF:", err);
        setLoading(false);
      }
    };

    setSource();
  }, [blob, base64, url]);

  // Load dokumen PDF
  useEffect(() => {
    const loadPdfDocument = async (source: PdfSource) => {
      setLoading(true);
      setError("");
      setPdfDoc(null);
      setCurrentPage(1);
      setPageInput("1");
      try {
        const pdf = await pdfjs.getDocument(source).promise;
        setPdfDoc(pdf);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error memuat PDF";
        setError(errorMessage);
        console.error("Error memuat PDF:", err);
        setLoading(false);
      }
    };

    if (pdfSource) {
      loadPdfDocument(pdfSource);
    } else {
      setLoading(false);
      setPdfDoc(null);
    }
  }, [pdfSource]);

  // Render halaman dengan TextLayer class
  const renderPage = async (pageNum: number) => {
    if (!pdfDoc || pageNum < 1 || pageNum > pdfDoc.numPages) return;

    try {
      const page = await pdfDoc.getPage(pageNum);
      const pageData = pageRefs.current[pageNum];
      if (!pageData) return;

      const { canvas, canvasWrapper } = pageData;
      const viewport = page.getViewport({ scale: scale });

      // ========== RENDER CANVAS ==========
      const context = canvas.getContext("2d");
      if (!context) return;

      canvas.height = viewport.height;
      canvas.width = viewport.width;
      canvas.style.width = Math.floor(viewport.width) + "px";
      canvas.style.height = Math.floor(viewport.height) + "px";

      // Set wrapper size
      canvasWrapper.style.width = `${viewport.width}px`;
      canvasWrapper.style.height = `${viewport.height}px`;

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
        intent: "print",
      };

      await page.render(renderContext).promise;
    } catch (err) {
      console.error(`Error merender halaman ${pageNum}:`, err);
    }
  };

  // Render semua halaman
  useEffect(() => {
    if (!pdfDoc) {
      setLoading(false);
      return;
    }

    setLoading(true);

    if (containerRef.current) {
      containerRef.current.innerHTML = "";
      pageRefs.current = {};
    }

    const renderAllPages = async () => {
      try {
        for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
          const pageWrapper = document.createElement("div");
          pageWrapper.className = "page";
          pageWrapper.setAttribute("data-page-number", pageNum.toString());
          pageWrapper.style.cssText = `
            position: relative;
            margin: 0 auto 20px;
            box-shadow: 0 0 5px rgba(0,0,0,0.1);
            width: fit-content;
            display: inline-block;
          `;

          const canvasWrapper = document.createElement("div");
          canvasWrapper.className = "canvasWrapper";
          canvasWrapper.style.cssText = `
            position: relative;
            display: inline-block;
          `;

          const canvas = document.createElement("canvas");
          canvas.id = `page${pageNum}`;
          canvas.style.cssText = `
            display: block;
            border: 1px solid #ddd;
          `;

          canvasWrapper.appendChild(canvas);
          pageWrapper.appendChild(canvasWrapper);
          containerRef.current?.appendChild(pageWrapper);

          pageRefs.current[pageNum] = {
            canvas,
            canvasWrapper,
            pageNumber: pageNum,
          };

          await renderPage(pageNum);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error merender PDF";
        setError(errorMessage);
        console.error("Error merender PDF:", err);
      } finally {
        setLoading(false);
      }
    };

    renderAllPages();
  }, [pdfDoc, scale]);

  // Navigasi halaman
  const goToPreviousPage = () => {
    const newPage = Math.max(1, currentPage - 1);
    setCurrentPage(newPage);
    setPageInput(newPage.toString());
    scrollToPage(newPage);
  };

  const goToNextPage = () => {
    if (!pdfDoc) return;
    const newPage = Math.min(pdfDoc.numPages, currentPage + 1);
    setCurrentPage(newPage);
    setPageInput(newPage.toString());
    scrollToPage(newPage);
  };

  const scrollToPage = (pageNum: number) => {
    const pageWrapper = document.querySelector(
      `[data-page-number="${pageNum}"]`,
    );
    if (pageWrapper) {
      pageWrapper.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleGoToPage = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const pageNum = parseInt(pageInput, 10);
      if (pdfDoc && pageNum >= 1 && pageNum <= pdfDoc.numPages) {
        setCurrentPage(pageNum);
        scrollToPage(pageNum);
      } else {
        setPageInput(currentPage.toString());
      }
    }
  };

  // Zoom
  const handleZoomIn = () => {
    setScale((prevScale) => Math.min(prevScale + 0.25, 3.0));
  };

  const handleZoomOut = () => {
    setScale((prevScale) => Math.max(prevScale - 0.25, 0.5));
  };

  const handleZoomSelect = (value: string) => {
    if (value === "auto") {
      setScale(1.5);
    } else if (value === "page-fit") {
      setScale(1.0);
    } else if (value === "page-width") {
      setScale(1.2);
    } else if (value === "page-actual") {
      setScale(1.0);
    } else {
      setScale(parseFloat(value));
    }
  };

  // Download
  const handleDownload = () => {
    const a = document.createElement("a");
    a.download = fileName || "download.pdf";

    let objectUrl: string | undefined;

    try {
      if (url) {
        a.href = url;
      } else if (blob) {
        objectUrl = URL.createObjectURL(blob);
        a.href = objectUrl;
      } else if (base64) {
        const byteCharacters = atob(base64);
        const byteArrays: Uint8Array[] = [];
        for (let offset = 0; offset < byteCharacters.length; offset += 512) {
          const slice = byteCharacters.slice(offset, offset + 512);
          const byteNumbers = new Array(slice.length);
          for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          byteArrays.push(byteArray);
        }
        const blobFromBase64 = new Blob(byteArrays as BlobPart[], {
          type: "application/pdf",
        });
        objectUrl = URL.createObjectURL(blobFromBase64);
        a.href = objectUrl;
      } else {
        setError("Tidak ada sumber file untuk diunduh.");
        return;
      }

      document.body.appendChild(a);
      a.click();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Gagal mengunduh file";
      setError(errorMessage);
    } finally {
      document.body.removeChild(a);
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center p-8 text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="flex h-full bg-accent-50">
      <div className="grid h-full w-full grid-rows-[auto_1fr]">
        {/* Toolbar */}
        <div className="sticky top-0 z-10 border-b border-accent-300 bg-accent-100 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4 px-4 py-3">
            {/* Navigation */}
            <div className="flex items-center gap-2">
              <button
                onClick={goToPreviousPage}
                disabled={currentPage <= 1}
                className="rounded bg-accent-300 px-3 py-2 text-sm text-accent-content hover:bg-accent-400 disabled:opacity-50"
                title="Previous"
              >
                ← Prev
              </button>

              <input
                type="number"
                min="1"
                max={pdfDoc?.numPages || 1}
                value={pageInput}
                onChange={(e) => setPageInput(e.target.value)}
                onKeyDown={handleGoToPage}
                className="w-12 rounded border border-accent-300 px-2 py-2 text-center text-sm text-accent-content"
              />

              <span className="text-sm font-medium text-accent-content">
                of {pdfDoc?.numPages || 0}
              </span>

              <button
                onClick={goToNextPage}
                disabled={!pdfDoc || currentPage >= pdfDoc.numPages}
                className="rounded bg-accent-300 px-3 py-2 text-sm text-accent-content hover:bg-accent-400 disabled:opacity-50"
                title="Next"
              >
                Next →
              </button>
            </div>

            {/* Zoom */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleZoomOut}
                className="rounded bg-accent-300 px-2 py-2 text-sm text-accent-content hover:bg-accent-400"
              >
                −
              </button>

              <select
                value={Math.round(scale * 100) / 100}
                onChange={(e) => handleZoomSelect(e.target.value)}
                className="rounded border border-accent-300 px-2 py-1 text-sm text-accent-content"
              >
                <option value="auto">Auto</option>
                <option value="page-fit">Fit Page</option>
                <option value="page-width">Page Width</option>
                <option value="0.5">50%</option>
                <option value="0.75">75%</option>
                <option value="1">100%</option>
                <option value="1.25">125%</option>
                <option value="1.5">150%</option>
                <option value="2">200%</option>
                <option value="3">300%</option>
              </select>

              <button
                onClick={handleZoomIn}
                className="rounded bg-accent-300 px-2 py-2 text-sm text-accent-content hover:bg-accent-400"
              >
                +
              </button>
            </div>

            {/* Download */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleDownload}
                className="rounded bg-primary-500 px-4 py-2 text-sm font-medium text-primary-content hover:bg-primary-600"
              >
                ⬇ Download
              </button>
            </div>
          </div>
        </div>

        {/* PDF Container */}
        <div className="relative flex-1 overflow-auto bg-accent-50">
          {loading && (
            <div className="bg-opacity-75 absolute inset-0 z-20 flex items-center justify-center bg-white/20">
              <div className="text-center">
                <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-accent-300 border-t-blue-500"></div>
                <p className="mt-4 font-medium text-accent-700">
                  Memuat PDF...
                </p>
              </div>
            </div>
          )}
          <div
            ref={containerRef}
            className="flex flex-col items-center gap-4 py-4"
          />
        </div>
      </div>
    </div>
  );
};

export default PdfViewer;
