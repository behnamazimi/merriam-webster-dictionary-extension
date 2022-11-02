const styles = `
  @import "https://fonts.googleapis.com/css?family=Roboto";

  .Bubble {
    --bg-color: #090d23;
    --bg-secondary-color: #151e34ff;
    --color-primary: #1f7ea7ff;
    --font-color: #c5c5c5;
    --color-grey: #a8a8a8;
    --color-darkGrey: #7b8087;
    --color-error: #d43939;
    --color-success: #28bd14;
    --font-family-mono: Roboto, "Consolas", "Lucida Console", monospace;

    font-family: 'Roboto', Arial, sans-serif;
    font-size: 16px;
    line-height: 1.35;
    box-sizing: border-box;
    border-radius: 4px;
    overflow: auto;
    border: var(--bg-secondary-color);
    background-color: var(--bg-color);
    padding: 8px;
    height: 100%;
    max-height: 200px;
    box-shadow: 1px 1px 1px 0 #00000014;
    visibility: hidden;
    color: var(--font-color);
  }

  .Bubble.loaded {
    visibility: visible;
  }

  a {
    text-decoration: none;
     color: var(--font-color);
 }

  .Bubble .message {
    font-size: 14px;
    line-height: 1.5;
    margin: 0.5rem 0 0;
    white-space: pre-line;
  }

  .BubbleResult {
    padding: 0;
    position: relative;
  }

  .BubbleResultItem {
    margin-bottom: 0.5rem;
    color: var(--font-color);
  }

  .BubbleResultItem .syn {
    margin: 0.5rem 0 0;
    line-height: 1.3;
  }

  .BubbleResultItem ul {
    padding-left: 1.5rem;
  }

  .BubbleResultItem li {
    margin-top: 5px;
  }

  .BubbleResultItem .syn {
    opacity: 0.7;
    font-size: 14px;
    white-space: break-spaces;
  }

  .BubbleResultItem .examples {
    list-style: none;
    padding-left: 1rem;
    white-space: break-spaces;
    font-size: 14px;
    color: var(--color-grey);
  }

  .Pron {
    cursor: pointer;
    display: flex;
    justify-content: flex-start;
    margin: 8px 12px;
    padding: 1px 3px;
    line-height: 1;
    opacity: 0.6;
  }

  .Pron:hover {
    font-weight: bold;
    opacity: 1;
  }

  .Pron span {
    display: inline-block;
    margin-right: 0.5rem;
  }

  .ResultItemTitle {
    padding: 5px;
    margin-bottom: 0.5rem;
    background: var(--bg-secondary-color);
    position: relative;
    cursor: pointer;
  }

  .ResultItemTitle span, .ResultItemTitle strong {
    margin-left: 0.5rem;
  }

  .ResultItemTitle small {
    display: inline-block;
    position: absolute;
    right: 0.5rem;
  }

  .BubbleSuggestionList {
    padding: 0.5rem;
    color: var(--color-darkGrey);
  }
  
  .BubbleSuggestionList ul {
    padding-left: 1.5rem;
    margin: 1rem 0 0 0;
  }

  .BubbleSuggestionList ul li {
    margin-bottom: 0.25rem
  }
  
  .BubbleSuggestionList ul a {
    cursor: pointer;
    color: var(--font-color)
  }
  
  .OpenInWebsite {
    position: sticky;
    top: 40px;
    font-size: 14px;
    display: inline-block;
    color: var(--color-primary);
    background: var(--bg-color);
    width: 100%;
    padding: 6px 0;
    z-index: 2;
    cursor: pointer
  }
  
  .OpenInWebsite.-no-sticky {
    position: static;
    top: unset;
  }
`

export default styles