import browser from "webextension-polyfill";
import { IframeContext } from "../types";

interface IFrameManager {
  createIfNotExists(): HTMLIFrameElement;

  show(iframeDimension: {
    width: number;
    height: number;
  }): void;

  remove(): void;

  doesExist(): boolean;

  getElement(): HTMLIFrameElement | null;
}

class IFrameFactory {
  public static readonly contentIframeClass: string = "mwd-content-iframe";

  static createIFrame(id: string, src: string, context?: string): HTMLIFrameElement {
    const iframe = document.createElement("iframe");
    iframe.id = id;
    iframe.classList.add(id);
    iframe.classList.add(IFrameFactory.contentIframeClass);
    iframe.src = src;
    // add data context to the iframe name
    iframe.name = context || "";
    return iframe;
  }

  static createStyles(): HTMLStyleElement {
    const style = document.createElement("style");
    style.innerHTML = `
      .${IFrameFactory.contentIframeClass} {
        position: fixed;
        top: 50%;
        left: 50%;
        width: 0px;
        height: 0px;
        min-height: 0px;
        border: none;
        background-color: white;
        z-index: 9999999999999;
        visibility: hidden;
        opacity: 0;
        border-radius: 8px;
        transform: translate(-50%, -50%);
        margin: 0;
        padding: 0;
      }
      
      .mwd-lookup-result-iframe {
        width: 300px;
        height: auto;
      }
      
      .mwd-review-iframe {
        top: unset;
        left: 0;
        bottom: 0;
        min-width: 200px;
        max-width: 80vw;
        overflow: hidden;
        overflow-x: auto;
        height: 32px;
        max-height: 32px;
        transform: translate(0%, 0%);
      }      
      
      .review-promote-iframe {
        width: 450px;
        max-width: 75vw;
        height: auto;
        min-height: 250px;
      }
      
      .${IFrameFactory.contentIframeClass}.visible {
        animation: iframeShow 0.25s forwards;
      }
  
      @keyframes iframeShow {
        from {
          opacity: 0;
          visibility: hidden;
        }
        to {
          opacity: 1;
          visibility: visible;
        }
      }
      
      @keyframes iframeHide {
        from {
          opacity: 1;
          visibility: visible;
        }
        to {
          opacity: 0;
          visibility: hidden;
        }
      }
    `;
    return style;
  }
}

class ContentIFrameManager implements IFrameManager {
  private iframe: HTMLIFrameElement | null = null;
  private readonly iframeId: string;

  constructor(iframeId: string) {
    this.iframeId = iframeId;
    this.initStyles();
  }

  // Creates and appends the iframe to the DOM if it doesn't exist
  public createIfNotExists(context: IframeContext = {}): HTMLIFrameElement {
    // TODO: Use doesExist method
    if (this.iframe && document.getElementById(this.iframeId)) {
      return this.iframe;
    }

    // Stringify the context object before passing it to the iframe
    const contextString = JSON.stringify(context);
    this.iframe = IFrameFactory.createIFrame(this.iframeId, browser.runtime.getURL("/src/ui/entrypoints/content-iframe.html"), contextString);
    document.body.appendChild(this.iframe);
    return this.iframe;
  }

  public show(iframeDimension: { width: number; height: number }, base: DOMRect | null = null): void {
    if (this.iframe) {
      if (iframeDimension.width) {
        this.iframe.style.width = `${iframeDimension.width}px`;
      }
      if (iframeDimension.height) {
        this.iframe.style.height = `${iframeDimension.height}px`;
      }
      if (base) {
        this.setPosition(base, iframeDimension);
      }
      this.iframe.classList.add("visible");
    }
  }

  // Removes the iframe from the DOM
  public remove(): void {
    this.iframe?.remove();
    this.iframe = null;
  }

  public doesExist(): boolean {
    return !!this.iframe && !!document.getElementById(this.iframeId);
  }

  public getElement(): HTMLIFrameElement | null {
    return this.iframe;
  }

  // Initializes the styles for the iframe using a factory
  private initStyles(): void {
    const style = IFrameFactory.createStyles();
    document.head.appendChild(style);
  }

  // Sets the iframe position on the page
  private setPosition(base: DOMRect, iframeDimension: {
    width: number;
    height: number;
  }): void {
    if (!this.iframe) {
      return;
    }
    const iframeWidth = iframeDimension.width;
    const iframeHeight = iframeDimension.height;

    // Calculate available space around the selected text
    const spaceAbove = base.top;
    const spaceBelow = window.innerHeight - base.bottom;
    const spaceLeft = base.left;
    const spaceRight = window.innerWidth - base.right;

    let iframeTop = base.top - iframeHeight - 10; // Default to above the selected text
    let iframeLeft = base.left;

    // Adjust position based on available space
    if (spaceAbove >= iframeHeight) {
      // Place above the selected text
      iframeTop = base.top - iframeHeight - 10;
      // check if the iframe is going out of the window from right
      if (iframeLeft + iframeWidth > window.innerWidth) {
        iframeLeft = window.innerWidth - iframeWidth - 10;
      }
    }
    else if (spaceBelow >= iframeHeight) {
      // Place below the selected text
      iframeTop = base.bottom + 10;
      // check if the iframe is going out of the window from right
      if (iframeLeft + iframeWidth > window.innerWidth) {
        iframeLeft = window.innerWidth - iframeWidth - 10;
      }
    }
    else if (spaceRight >= iframeWidth) {
      // Place to the right of the selected text
      iframeTop = base.top;
      iframeLeft = base.right + 10;
    }
    else if (spaceLeft >= iframeWidth) {
      // Place to the left of the selected text
      iframeTop = base.top;
      iframeLeft = base.left - iframeWidth - 10;
    }
    else {
      // Default to placing below the selected text if no space is sufficient
      iframeTop = base.bottom + 10;
    }

    this.iframe.style.top = iframeTop + "px";
    this.iframe.style.left = iframeLeft + "px";
    this.iframe.style.transform = `translate(0%, 0%)`;
  }
}

export default ContentIFrameManager;
