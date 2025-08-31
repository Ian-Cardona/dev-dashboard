interface SaveApiKeyMessage {
  type: 'saveApiKey';
  apiKey: string;
}

export type WebviewMessage = SaveApiKeyMessage;
