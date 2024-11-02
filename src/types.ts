type MessageAction = "GET_SELECTED_TEXT";

export type MessagePayload = {
  action: MessageAction;
  data?: string;
};

export type MessageResponseCallback = (_p: MessagePayload) => void;
