interface ITextManager {
  getSelectedText(): string | null;
  getSelectedTextIfValid(): string | null;
  isValidForLookup(text: string): boolean;
  getBoundingClientRect(): DOMRect | null;
}

class UserTextManager implements ITextManager {
  private static instance: UserTextManager | null = null;

  // Singleton instance getter
  public static getInstance(): UserTextManager {
    if (!UserTextManager.instance) {
      UserTextManager.instance = new UserTextManager();
    }
    return UserTextManager.instance;
  }

  public getSelectedText(): string | null {
    const selection = window.getSelection();
    return selection ? selection.toString().trim() : null;
  }

  // Retrieves the current selected text
  public getSelectedTextIfValid(): string | null {
    const selectedText = this.getSelectedText();
    if (this.isValidForLookup()) {
      return selectedText || null;
    }
    return null;
  }

  // Validates the selected text for lookup purposes
  public isValidForLookup(): boolean {
    const text = this.getSelectedText();
    return !!text && text.split(" ").length < 3;
  }

  // Retrieves the bounding rectangle of the selected text
  public getBoundingClientRect(): DOMRect | null {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || !this.isValidForLookup()) return null;
    return selection.getRangeAt(0).getBoundingClientRect();
  }
}

export default UserTextManager;
