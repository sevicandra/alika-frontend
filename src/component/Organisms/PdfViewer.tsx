"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import * as pdfjs from "pdfjs-dist";
import "./pdf_viewer.css";
import {
  LuChevronLeft,
  LuChevronRight,
  LuZoomIn,
  LuZoomOut,
  LuDownload,
  LuLoader,
} from "react-icons/lu";

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
  textLayerDiv: HTMLDivElement;
  annotationLayerDiv: HTMLDivElement;
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
  const renderPage = useCallback(
    async (pageNum: number) => {
      if (!pdfDoc || pageNum < 1 || pageNum > pdfDoc.numPages) return;

      try {
        const page = await pdfDoc.getPage(pageNum);
        const pageData = pageRefs.current[pageNum];
        if (!pageData) return;

        const { canvas, canvasWrapper, textLayerDiv, annotationLayerDiv } =
          pageData;
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

        // Set page wrapper size for correct absolute positioning of children layers
        const pageWrapper = canvasWrapper.parentElement;
        if (pageWrapper) {
          pageWrapper.style.width = `${viewport.width}px`;
          pageWrapper.style.height = `${viewport.height}px`;
          // PDF.js variable for text overlay scale
          pageWrapper.style.setProperty(
            "--scale-factor",
            viewport.scale.toString(),
          );
        }

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
          intent: "print",
        };

        await page.render(renderContext).promise;

        // ========== RENDER TEXT LAYER ==========
        // width and height are inherited from CSS 100% or explicitly via pdf_viewer.css
        textLayerDiv.innerHTML = ""; // Clear existing

        const textContent = await page.getTextContent();

        const textLayer = new pdfjs.TextLayer({
          textContentSource: textContent,
          container: textLayerDiv,
          viewport: viewport,
        });
        await textLayer.render();

        // ========== RENDER ANNOTATION LAYER ==========
        // size handled by css
        annotationLayerDiv.innerHTML = ""; // Clear existing

        const annotations = await page.getAnnotations();
        const annotationLayer = new pdfjs.AnnotationLayer({
          div: annotationLayerDiv,
          page: page,
          viewport: viewport,
          accessibilityManager: null,
          annotationCanvasMap: null,
          annotationEditorUIManager: null,
          structTreeLayer: null,
          commentManager: null,
          linkService: {} as any,
          annotationStorage: null,
        });

        await annotationLayer.render({
          annotations: annotations,
          div: annotationLayerDiv,
          page: page,
          viewport: viewport,
          linkService: {} as any, // minimal dummy linkService
          renderForms: false,
        });
      } catch (err) {
        console.error(`Error merender halaman ${pageNum}:`, err);
      }
    },
    [pdfDoc, scale],
  );

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
            margin: 0 auto 24px;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
            background-color: white;
            border-radius: 8px;
            /* PDF.js standard viewer properties */
            background-clip: content-box;
          `;

          const canvasWrapper = document.createElement("div");
          canvasWrapper.className = "canvasWrapper";
          canvasWrapper.style.cssText = `
            overflow: hidden;
            width: 100%;
            height: 100%;
            z-index: 1;
            border-radius: 8px;
          `;

          const canvas = document.createElement("canvas");
          canvas.id = `page${pageNum}`;
          canvas.style.cssText = `
            display: block;
          `;

          const textLayerDiv = document.createElement("div");
          textLayerDiv.className = "textLayer";

          const annotationLayerDiv = document.createElement("div");
          annotationLayerDiv.className = "annotationLayer";

          canvasWrapper.appendChild(canvas);

          pageWrapper.appendChild(canvasWrapper);
          pageWrapper.appendChild(textLayerDiv);
          pageWrapper.appendChild(annotationLayerDiv);

          containerRef.current?.appendChild(pageWrapper);

          pageRefs.current[pageNum] = {
            canvas,
            canvasWrapper,
            textLayerDiv,
            annotationLayerDiv,
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
  }, [pdfDoc, scale, renderPage]);

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
    <div className="relative flex h-full flex-col bg-slate-50/50 dark:bg-slate-900/50">
      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-sm dark:bg-slate-900/60">
          <div className="flex flex-col items-center justify-center rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-800">
            <LuLoader className="h-10 w-10 animate-spin text-primary-500" />
            <p className="mt-4 font-medium text-slate-700 dark:text-slate-200">
              Memuat Dokumen...
            </p>
          </div>
        </div>
      )}

      {/* Floating Toolbar */}
      <div className="absolute bottom-6 left-1/2 z-40 flex -translate-x-1/2 items-center gap-1 rounded-full border border-slate-200/50 bg-white/80 p-1.5 shadow-lg backdrop-blur-md opacity-50 transition-opacity duration-300 hover:opacity-100 dark:border-slate-700/50 dark:bg-slate-800/80">
        {/* Pagination Controls */}
        <div className="flex items-center gap-1 rounded-full bg-slate-100/50 px-2 py-1 dark:bg-slate-700/50">
          <button
            onClick={goToPreviousPage}
            disabled={currentPage <= 1 || !pdfDoc}
            className="flex h-8 w-8 items-center justify-center rounded-full text-slate-600 transition-colors hover:cursor-pointer hover:bg-white hover:text-slate-900 hover:shadow-sm disabled:opacity-40 disabled:hover:bg-transparent dark:text-slate-300 dark:hover:bg-slate-600 dark:hover:text-white"
            title="Halaman Sebelumnya"
          >
            <LuChevronLeft className="h-5 w-5" />
          </button>

          <div className="flex items-center px-2 text-sm font-medium text-slate-700 dark:text-slate-300">
            <input
              type="text"
              value={pageInput}
              onChange={(e) => setPageInput(e.target.value)}
              onKeyDown={handleGoToPage}
              className="w-10 bg-transparent text-center font-semibold outline-none focus:ring-0"
            />
            <span className="opacity-60">/ {pdfDoc?.numPages || 0}</span>
          </div>

          <button
            onClick={goToNextPage}
            disabled={!pdfDoc || currentPage >= pdfDoc.numPages}
            className="flex h-8 w-8 items-center justify-center rounded-full text-slate-600 transition-colors hover:cursor-pointer hover:bg-white hover:text-slate-900 hover:shadow-sm disabled:opacity-40 disabled:hover:bg-transparent dark:text-slate-300 dark:hover:bg-slate-600 dark:hover:text-white"
            title="Halaman Selanjutnya"
          >
            <LuChevronRight className="h-5 w-5" />
          </button>
        </div>

        <div className="mx-1 h-6 w-px bg-slate-200 dark:bg-slate-600"></div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1 rounded-full bg-slate-100/50 px-2 py-1 dark:bg-slate-700/50">
          <button
            onClick={handleZoomOut}
            className="flex h-8 w-8 items-center justify-center rounded-full text-slate-600 transition-colors hover:cursor-pointer hover:bg-white hover:text-slate-900 hover:shadow-sm dark:text-slate-300 dark:hover:bg-slate-600 dark:hover:text-white"
            title="Zoom Out"
          >
            <LuZoomOut className="h-4 w-4" />
          </button>

          <select
            value={Math.round(scale * 100) / 100}
            onChange={(e) => handleZoomSelect(e.target.value)}
            className="appearance-none bg-transparent px-2 py-1 text-center text-sm font-medium text-slate-700 outline-none hover:cursor-pointer focus:ring-0 dark:text-slate-300"
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
            className="flex h-8 w-8 items-center justify-center rounded-full text-slate-600 transition-colors hover:cursor-pointer hover:bg-white hover:text-slate-900 hover:shadow-sm dark:text-slate-300 dark:hover:bg-slate-600 dark:hover:text-white"
            title="Zoom In"
          >
            <LuZoomIn className="h-4 w-4" />
          </button>
        </div>

        <div className="mx-1 h-6 w-px bg-slate-200 dark:bg-slate-600"></div>

        {/* Action Controls */}
        <button
          onClick={handleDownload}
          className="flex h-10 items-center justify-center gap-2 rounded-full bg-primary-500 px-4 text-sm font-medium text-white shadow-sm transition-colors hover:cursor-pointer hover:bg-primary-600 hover:shadow-md"
          title="Unduh PDF"
        >
          <LuDownload className="h-4 w-4" />
          <span className="hidden sm:inline">Unduh</span>
        </button>
      </div>

      {/* PDF Canvas Container */}
      <div className="flex-1 overflow-auto p-4 md:p-8">
        <div ref={containerRef} className="flex flex-col items-center gap-6" />
      </div>
    </div>
  );
};

export default PdfViewer;
