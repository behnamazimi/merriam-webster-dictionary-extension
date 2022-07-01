'use strict';

const globalActions = {
  INIT: "INIT",
  POPUP_INIT: "POPUP_INIT",
  SET_OPTIONS: "SET_OPTIONS",
  LINK_TO_POPUP: "GET_SELECTED_TEXT",
  ON_POPUP_CLOSE: "ON_POPUP_CLOSE",
  ADD_TO_HISTORY: "ADD_TO_HISTORY",
  CLEAR_HISTORY: "CLEAR_HISTORY",
  GET_PUBLIC_API_USAGE: "GET_PUBLIC_API_USAGE",
  COUNT_UP_PUBLIC_API_USAGE: "COUNT_UP_PUBLIC_API_USAGE",
}

const playIcon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAeGVYSWZNTQAqAAAACAAFARIAAwAAAAEAAQAAARoABQAAAAEAAABKARsABQAAAAEAAABSASgAAwAAAAEAAgAAh2kABAAAAAEAAABaAAAAAAAAAEgAAAABAAAASAAAAAEAAqACAAQAAAABAAAAEKADAAQAAAABAAAAEAAAAACIp5RDAAAACXBIWXMAAAsTAAALEwEAmpwYAAABWWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNi4wLjAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyI+CiAgICAgICAgIDx0aWZmOk9yaWVudGF0aW9uPjE8L3RpZmY6T3JpZW50YXRpb24+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgoZXuEHAAACWUlEQVQ4EYVTS2sUQRCu6pmJ+8gGFTEKgmJOYQmIRj24B68KetEVvAh6EyU/QFAGPSeCiAcF8eqKoJBcRFhlVw06a0Qz8SAKAZ+rHrLPITvTZdUkHSci+g1DV1dXff1VdTfAP+D7fl+pVLJMCBGhsc1oGyM5ep7nNJtNyufzi+J/M/1h8Ed3/icihkLCoGQ8uK6rVjmWJ96zuZ21in+zVvV7tcrsdXG7REr+ZPyKLEPkVf0CJ91/+WSOfO89zb+tExPVkkmGREqgybsPDiOoCR3pzsPJit3nOMOpVBparSYEQdBWqLKA0BICt0wbtm6D1knEQEhiKaTVoU2Dm4eUpUZSa1LDYRhSo7Eg9UqtNoMHjGMxA2c/1qkakyHq2KkQ2k3eLdJRpxsEkUQz4iy2nU63A4u93o6p21NnPllwGRQOXZymU0KypABJWRafFoGNCMvHZhpNSmvN50f96zduuXqiNj4S2HDNUnRwhUCMP2HSV/zcaiINSJ2IIliHRB1ZE5nsRB2FoZhStyiwkLu2BK6TwWKbC9/ejT0dPa+zAKe5JftlPS5BE2RzuQHpViadzsQlMJEwEn+9TDoDjmO/OnD8yC0ngn0s5Mq5Pfi4WCJrSYGie1++fi5oIu5hYPdn+0eY0G63WxBFYdQTdczouqQu7MUJ2Vlw5xho0Sn/qpKfP5rdbdk4xs6j6VQ6NZDLQf17vbarkB+VxBLvXCxysrnS5gbKYhIvKq+38228xDez4VVnb8iaxLIY06Bk+G+7XCZbHpTxzJRn1srLlPl/k02SjEKSJPpb8i+NWx6qPxmr5wAAAABJRU5ErkJggg=='
const searchIcon = `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 48 48" enable-background="new 0 0 48 48" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><g fill="#616161"><rect x="34.6" y="28.1" transform="matrix(.707 -.707 .707 .707 -15.154 36.586)" width="4" height="17"></rect><circle cx="20" cy="20" r="16"></circle></g><rect x="36.2" y="32.1" transform="matrix(.707 -.707 .707 .707 -15.839 38.239)" fill="#37474F" width="4" height="12.3"></rect><circle fill="#64B5F6" cx="20" cy="20" r="13"></circle><path fill="#BBDEFB" d="M26.9,14.2c-1.7-2-4.2-3.2-6.9-3.2s-5.2,1.2-6.9,3.2c-0.4,0.4-0.3,1.1,0.1,1.4c0.4,0.4,1.1,0.3,1.4-0.1 C16,13.9,17.9,13,20,13s4,0.9,5.4,2.5c0.2,0.2,0.5,0.4,0.8,0.4c0.2,0,0.5-0.1,0.6-0.2C27.2,15.3,27.2,14.6,26.9,14.2z"></path></svg>`;
const publicApiDetails = {
  key: "6b3a80cc-9d9f-4007-9ee5-52a24ab7eb31",
  type: "sd3",
  usageLimitPerInstall: 20
}


const messages = {
  apiKeyIsMissing: "API key missing, you need to put it in options first.",
  publicOptionsLimitReached: "You've reached the limit of using public options! You need to add you FREE personal API key to continue using this extension!\n" +
    "Read the instructions on the Options page to get more info, please!",
  limitReminderAlert: "Don't forget to add your personal options!",
  unexpectedError: `Unexpected error on data fetch! \n ` +
    `Make sure your API key is valid and the API type you choose is the same as the one you chose when you registered.`,
  offline: "It seems you are offline!",
}