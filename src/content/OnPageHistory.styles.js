const styles = `
  @import "https://fonts.googleapis.com/css?family=Roboto";

  .OnPageHistory {
    --bg-color: #090d23;
    --bg-secondary-color: #151e34ff;
    --color-primary: #1f7ea7ff;
    --color-primaryLight: #12468e;
    --font-color: #c5c5c5;
    --color-grey: #a8a8a8;
    --color-darkGrey: #7b8087;
    --color-error: #d43939;
    --color-success: #4fa445;
    --color-successLight: #5efba6;
    --font-family-mono: Roboto, "Consolas", "Lucida Console", monospace;

    font-family: 'Roboto', Arial, sans-serif;
    font-size: 16px;
    line-height: 1.35;
    box-sizing: border-box;
    border-radius: 4px;
    overflow: auto;
    border: var(--bg-secondary-color);
    box-shadow: 1px 1px 1px 0 #00000014;
    color: var(--font-color);
  }

  .OnPageHistory.loaded {
    visibility: visible;
  }
  
  .OnPageHistoryPromotion {
    visibility: visible;
    background: var(--bg-color);
    border-radius: 5px;
    box-shadow: 0px 0px 22px 4px rgb(1 8 46 / 15%);
    padding: 22px;
    line-height: 1.5;
  }
  
  .OnPageHistoryPromotion .details {
    padding-right: 85px
  }
  
  .OnPageHistoryPromotion .title {
    color: var(--color-success);
    display: flex;
    gap: 20px;
    align-items: flex-start;
    justify-content: space-between;
    margin-top: 0;
  }
  
  .OnPageHistoryPromotion .logo {
    border: ۲px solid var(--bg-secondary-color);
    border-radius: 3px;
    width: 70px;
    position: absolute;
    right: 22px;
    top: 22px;
  }
  
  .OnPageHistoryPromotion .message {
    margin: 0 0 12px
  }

  .OnPageHistoryPromotion .actions {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    margin-top: 22px
  }
  
  .OnPageHistoryPromotion button {
    padding: 12px 32px;
    border-radius: 33px;
    outline: none;
    border: none;
    background: var(--color-success);
    color: white;
    font-size: 16px;
    cursor: pointer;
    transition: all ease-in 0.1s;
  }

  .OnPageHistoryPromotion button:hover{
    box-shadow: 0px 0px 10px 3px #ffffff36;
  }
  
  .OnPageHistoryPromotion button.close {
    border: 1px solid var(--font-color); 
    background: transparent;
    color: var(--font-color);
  }

  a {
    text-decoration: none;
    color: var(--font-color);
  }
  
  .OnPageHistoryBar {
    font-size: 14px;
    padding: 8px 8px 8px 32px;
    background-color: var(--bg-color);
    position: fixed;
    left: 0;
    bottom: 0;
    white-space: nowrap;
    max-width: 100%;
    overflow-x: auto; 
  }
  
  .OnPageHistoryBar .disable {
    font-size: 18px;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    border: none;
    padding: 0;
    background: #2e2e2e;
    color: white;
    position: absolute;
    left: 6px;
    top: 9px;
  }
  
  .OnPageHistoryBar .disable svg {
    pointer-events: none;
  }
  
  .OnPageHistoryBar .word {
    display: inline-block;
    text-transform: lowercase;
    margin-left: 10px;
    cursor: pointer;
  }
  
  .OnPageHistoryBar .word:hover {
    text-decoration: underline;
  }

`

export default styles