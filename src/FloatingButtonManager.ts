import {searchIcon} from "./shared/utils/constants";
import UserTextManager from "./UserTextManager";

type ButtonClickCallback = (event: MouseEvent) => void;

interface IFloatingButtonManager {
  create(event: MouseEvent): HTMLButtonElement;

  remove(): void;

  doesExist(): boolean;

  getElement(): HTMLButtonElement | null;
}

class FloatingButtonManager implements IFloatingButtonManager {
  private static instance: FloatingButtonManager | null = null;
  private button: HTMLButtonElement | null = null;
  private readonly buttonId: string = "mw-dic-btn";
  private readonly buttonHeight: number = 28;
  private readonly offset: number = 6;
  private userTextManager: UserTextManager;
  private clickHandler: ButtonClickCallback | null = null; // Stores the click handler

  constructor() {
    this.userTextManager = UserTextManager.getInstance();
  }

  // Singleton instance getter
  public static getInstance(): FloatingButtonManager {
    if (!FloatingButtonManager.instance) {
      FloatingButtonManager.instance = new FloatingButtonManager();
    }
    return FloatingButtonManager.instance;
  }

  // Creates and positions the floating button based on the event
  public create(event: MouseEvent): HTMLButtonElement {
    // Remove any existing button before creating a new one
    this.remove();

    // Create button
    this.button = document.createElement("button");
    this.button.innerHTML = searchIcon;
    this.button.id = this.buttonId;
    this.button.style.position = "absolute";
    this.button.style.display = "inline-flex";

    // Position button
    this.setPosition(event);

    // Bind the current click handler, if defined
    if (this.clickHandler) {
      this.button.addEventListener("click", this.clickHandler);
    }

    // Append button to the DOM
    document.body.insertBefore(this.button, document.body.firstChild);
    return this.button;
  }

  public get onClick(): ButtonClickCallback | null {
    return this.clickHandler;
  }

  public set onClick(handler: ButtonClickCallback | null) {
    this.removeClickListenerIfExist();

    this.clickHandler = handler;

    // Attach the new handler if the button already exists
    if (this.button && this.clickHandler) {
      this.button.addEventListener("click", this.clickHandler);
    }
  }

  // Removes the button from the DOM if it exists
  public remove(): void {
    if (this.button && this.button.parentNode) {
      this.removeClickListenerIfExist();
      this.button.parentNode.removeChild(this.button);
    }
    this.button = null;
  }

  // Checks if the button exists
  public doesExist(): boolean {
    return !!this.button && !!document.getElementById(this.buttonId);
  }

  // Exposes the button element for direct access
  public getElement(): HTMLButtonElement | null {
    return this.button;
  }

  // Positions the button near the selected text based on the event
  public setPosition(event: MouseEvent): void {
    if (!this.button) return;

    const selectionRect = this.userTextManager.getBoundingClientRect();
    if (!selectionRect) return;
    let top = selectionRect.top + window.scrollY - this.buttonHeight;
    let left = event.pageX - (this.button.clientWidth / 2);

    // Adjust position if the click is below the middle of the selection
    if (event.clientY >= selectionRect.top + selectionRect.height / 2) {
      top = window.scrollY + selectionRect.top + selectionRect.height + this.offset;
    }

    this.button.style.left = `${left}px`;
    this.button.style.top = `${top}px`;
  }

  private removeClickListenerIfExist() {
    if (this.button && this.clickHandler) {
      this.button.removeEventListener("click", this.clickHandler);
    }
  }

}

export default FloatingButtonManager;
