import { playFx } from "@/lib/sound";

const RESUME_PDF_PATH = "/resume.pdf";
const RESUME_FILENAME = "resume.pdf";

/**
 * Initiates direct download of the ATS-compliant resume PDF.
 */
export function downloadResume(): void {
  playFx("click");
  const link = document.createElement("a");
  link.href = RESUME_PDF_PATH;
  link.download = RESUME_FILENAME;
  link.rel = "noopener noreferrer";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Opens the resume PDF in a new browser tab.
 */
export function openResumeInNewTab(): void {
  playFx("click");
  window.open(RESUME_PDF_PATH, "_blank", "noopener,noreferrer");
}

/**
 * Triggers printing of the resume PDF.
 * Uses a hidden iframe for seamless PDF printing, falling back to window.print() or opening PDF.
 */
export function printResume(): void {
  playFx("click");

  if (typeof window === "undefined") return;

  const existingIframe = document.getElementById("resume-print-iframe") as HTMLIFrameElement | null;
  if (existingIframe) {
    try {
      existingIframe.contentWindow?.focus();
      existingIframe.contentWindow?.print();
      return;
    } catch {
      existingIframe.remove();
    }
  }

  const iframe = document.createElement("iframe");
  iframe.id = "resume-print-iframe";
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "0";
  iframe.style.visibility = "hidden";
  iframe.src = RESUME_PDF_PATH;

  iframe.onload = () => {
    try {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    } catch {
      window.open(RESUME_PDF_PATH, "_blank", "noopener,noreferrer");
    }
  };

  iframe.onerror = () => {
    window.open(RESUME_PDF_PATH, "_blank", "noopener,noreferrer");
  };

  document.body.appendChild(iframe);
}
