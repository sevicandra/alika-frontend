"use client";
import { useEffect, useState } from "react";
import { Worker, Viewer, SpecialZoomLevel } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import {
  zoomPlugin,
  RenderZoomInProps,
  RenderZoomOutProps,
  RenderZoomProps,
} from "@react-pdf-viewer/zoom";
import "@react-pdf-viewer/zoom/lib/styles/index.css";
import { getFilePlugin, RenderDownloadProps } from "@react-pdf-viewer/get-file";
import {
  FiDownload as DownloadIcon,
  FiZoomIn as ZoomInIcon,
  FiZoomOut as ZoomOutIcon,
} from "react-icons/fi";
import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Transition,
} from "@headlessui/react";

const PdfViewer = ({
  blob,
  fileName,
  base64,
  url,
}:
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
    }) => {
  const [pdfUrl, setPdfUrl] = useState<string | undefined>();
  useEffect(() => {
    if (blob) {
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
      return () => {
        URL.revokeObjectURL(url);
      };
    }
    if (base64) {
      const byteCharacters = atob(base64);
      const byteArrays: Uint8Array[] = [];
      for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512);

        const byteNumbers: number[] = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }
      const blob = new Blob(byteArrays.map((array) => new Uint8Array(array)), { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
      return () => {
        URL.revokeObjectURL(url);
      };
    }
    if (url) {
      setPdfUrl(url);
    }
    setPdfUrl(undefined);
  }, [blob, base64, url]);

  const zoomPluginInstance = zoomPlugin({});
  const { ZoomIn, ZoomOut, CurrentScale, Zoom } = zoomPluginInstance;
  const getFilePluginInstance = getFilePlugin({
    fileNameGenerator: () => {
      return `${fileName}`;
    },
  });
  const { Download } = getFilePluginInstance;
  return (
    <div className="rounded-b-box border-neutral flex h-full w-full flex-col overflow-hidden border shadow-sm">
      <div className="bg-neutral flex-none">
        <div className="glass text-neutral-content relative flex">
          <div className="flex-1"></div>
          <div className="flex flex-none">
            <ZoomIn>
              {(props: RenderZoomInProps) => (
                <button
                  className="btn btn-xs btn-ghost h-full rounded-none"
                  onClick={props.onClick}
                >
                  <ZoomInIcon className="h-5 w-5" />
                </button>
              )}
            </ZoomIn>
            <Popover>
              <PopoverButton className="btn btn-xs btn-ghost h-full rounded-none">
                <CurrentScale />
              </PopoverButton>
              <Transition
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
              >
                <PopoverPanel
                  anchor="bottom"
                  className="divide-neutral bg-neutral text-neutral-content divide-y text-sm/6 [--anchor-gap:var(--spacing-5)]"
                >
                  <div className="py-3">
                    <Zoom>
                      {(props: RenderZoomProps) => (
                        <button
                          onClick={() =>
                            props.onZoom(SpecialZoomLevel.ActualSize)
                          }
                          className="hover:bg-neutral/[0.05] block rounded-lg px-3 transition"
                        >
                          Actual Size
                        </button>
                      )}
                    </Zoom>
                    <Zoom>
                      {(props: RenderZoomProps) => (
                        <button
                          onClick={() => props.onZoom(SpecialZoomLevel.PageFit)}
                          className="hover:bg-info/[0.05] block rounded-lg px-3 transition"
                        >
                          Page Fit
                        </button>
                      )}
                    </Zoom>
                    <Zoom>
                      {(props: RenderZoomProps) => (
                        <button
                          onClick={() =>
                            props.onZoom(SpecialZoomLevel.PageWidth)
                          }
                          className="hover:bg-info/[0.05] block rounded-lg px-3 transition"
                        >
                          Page Width
                        </button>
                      )}
                    </Zoom>
                    <div className="divider m-0"></div>
                    <Zoom>
                      {(props: RenderZoomProps) => (
                        <button
                          onClick={() => props.onZoom(0.4)}
                          className="hover:bg-info/[0.05] block rounded-lg px-3 transition"
                        >
                          40%
                        </button>
                      )}
                    </Zoom>
                    <Zoom>
                      {(props: RenderZoomProps) => (
                        <button
                          onClick={() => props.onZoom(0.8)}
                          className="hover:bg-info/[0.05] block rounded-lg px-3 transition"
                        >
                          80%
                        </button>
                      )}
                    </Zoom>
                    <Zoom>
                      {(props: RenderZoomProps) => (
                        <button
                          onClick={() => props.onZoom(1.2)}
                          className="hover:bg-info/[0.05] block rounded-lg px-3 transition"
                        >
                          120%
                        </button>
                      )}
                    </Zoom>
                    <Zoom>
                      {(props: RenderZoomProps) => (
                        <button
                          onClick={() => props.onZoom(1.6)}
                          className="hover:bg-info/[0.05] block rounded-lg px-3 transition"
                        >
                          160%
                        </button>
                      )}
                    </Zoom>
                  </div>
                </PopoverPanel>
              </Transition>
            </Popover>
            <ZoomOut>
              {(props: RenderZoomOutProps) => (
                <button
                  className="btn btn-xs btn-ghost h-full rounded-none"
                  onClick={props.onClick}
                >
                  <ZoomOutIcon className="h-5 w-5" />
                </button>
              )}
            </ZoomOut>
          </div>
          <div className="flex-1">
            <Download>
              {(props: RenderDownloadProps) => (
                <button
                  className="btn btn-xs btn-ghost h-full rounded-none"
                  onClick={props.onClick}
                >
                  <DownloadIcon className="h-5 w-5" />
                </button>
              )}
            </Download>
          </div>
        </div>
      </div>
      {pdfUrl && (
        <div className="bg-neutral flex-1 overflow-hidden">
          <Worker workerUrl="/pdf.worker.min.js">
            <Viewer
              fileUrl={pdfUrl}
              plugins={[zoomPluginInstance, getFilePluginInstance]}
            />
          </Worker>
        </div>
      )}
    </div>
  );
};

export default PdfViewer;
