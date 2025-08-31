import * as vscode from 'vscode';
import * as fs from 'fs';
import z from 'zod';
import { WebviewMessage } from './onboarding.type';
import { verifyApiKey } from '../../services/validate-api-key';

export class OnboardingProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = 'devDashboardOnboarding';

  constructor(private context: vscode.ExtensionContext) {}

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    context: vscode.WebviewViewResolveContext,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _token: vscode.CancellationToken
  ) {
    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this.context.extensionUri],
    };

    webviewView.webview.html = this.getWelcomeHtml();

    webviewView.webview.onDidReceiveMessage(async (message: WebviewMessage) => {
      console.log('Received message from webview:', message);
      switch (message.type) {
        case 'saveApiKey':
          await this.handleApiKeySave(message.apiKey, webviewView);
          break;
      }
    });
  }

  private async handleApiKeySave(
    apiKey: string,
    webviewView: vscode.WebviewView
  ) {
    try {
      webviewView.webview.postMessage({
        type: 'statusUpdate',
        text: 'Validating API key...',
        status: 'loading',
      });

      const isValid = await this.validateApiKey(apiKey);

      if (isValid) {
        webviewView.webview.postMessage({
          type: 'statusUpdate',
          text: 'Success! Reloading...',
          status: 'success',
        });

        setTimeout(() => {
          vscode.commands.executeCommand('vscode-extension.showTodos');
        }, 1000);
      } else {
        webviewView.webview.postMessage({
          type: 'statusUpdate',
          text: 'Invalid API key. Please try again.',
          status: 'error',
        });
      }
    } catch (error) {
      console.log(error);
      webviewView.webview.postMessage({
        type: 'statusUpdate',
        text: 'Error validating API key.',
        status: 'error',
      });
    }
  }

  private async validateApiKey(apiKey: string): Promise<boolean> {
    try {
      const result = z.string().min(1, 'API key is required').safeParse(apiKey);

      if (!result.success) {
        console.log('API Key validation errors:', result.error.issues);
        return false;
      }

      const data = await verifyApiKey(apiKey, this.context);

      if (data) {
        return true;
      }
    } catch (error) {
      console.error('Error setting API key:', error);
    }
    return false;
  }

  private getWelcomeHtml(): string {
    const htmlPath = vscode.Uri.joinPath(
      this.context.extensionUri,
      'src',
      'webviews',
      'onboarding',
      'onboarding.html'
    );

    try {
      return fs.readFileSync(htmlPath.fsPath, 'utf8');
    } catch (error) {
      console.error('Error reading HTML file:', error);
      return '<html><body><h1>Error loading onboarding view</h1></body></html>';
    }
  }
}
