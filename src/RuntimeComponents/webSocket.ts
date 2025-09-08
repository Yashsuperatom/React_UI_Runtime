export interface WebSocketMessage {
  type: string;
}

export interface GetProdUIMessage extends WebSocketMessage {
  type: 'get_prod_ui';
  projectId: string;
  uiId: string;
  requestId: string;
  prodId?: string;
}

export interface ProdUIResponse extends WebSocketMessage {
  type: 'prod_ui_response';
  requestId: string;
  uiId: string;
  projectId: string;
  data?: any;
  error?: string;
  prodId?: string;
}

export class ProdWebSocketClient {
  private ws: WebSocket | null = null;
  // private reconnectTimeout: any;
  private connected = false;
  private prodUIResponseHandlers: ((res: ProdUIResponse) => void)[] = [];
  private pendingRequests = new Map<
    string,
    { resolve: (res: ProdUIResponse) => void; reject: (err: any) => void }
  >();

  private url: string;
  private projectId: string;

  constructor(baseUrl: string, projectId: string) {
    // append projectId as query param
    this.url = `${baseUrl}?projectId=${projectId}&type=prod`;
    this.projectId = projectId;
  }

  connect(uiId: string, requestId: string) {
    this.ws = new WebSocket(this.url);

    this.ws.onopen = () => {
      console.log("✅ Connected as PROD client");
      this.connected = true;

      // Send handshake
      this.send({ type: "hello", client: "prod" });

      // Request UI
      const msg: GetProdUIMessage = {
        type: "get_prod_ui",
        uiId,
        requestId,
        projectId: this.projectId,
      };

      this.send(msg);
      console.log("📤 Sent get_prod_ui (on connect):", msg);
    };

    // handle incoming messages
    this.ws.onmessage = (event) => {
      try {
        const msg: ProdUIResponse = JSON.parse(event.data);

        if (msg.type === "prod_ui_response") {
          const pending = this.pendingRequests.get(msg.requestId);
          if (pending) {
            pending.resolve(msg);
            this.pendingRequests.delete(msg.requestId);
          }

          this.prodUIResponseHandlers.forEach((h) => h(msg));
        } else {
          console.log("📩 Other message:", msg);
        }
      } catch (err) {
        console.warn("Non-JSON message:", event.data);
      }
    };

    this.ws.onclose = () => {
      console.warn("⚠️ Disconnected, retrying in 3s...");
      this.connected = false;
      // this.reconnectTimeout = setTimeout(() => this.connect(uiId, requestId), 3000);
    };

    this.ws.onerror = (err) => {
      console.error("❌ WebSocket error:", err);
      this.ws?.close();
    };
  }

  private send(msg: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(msg));
    } else {
      console.warn("⚠️ Tried to send but WebSocket not open:", msg);
    }
  }

  getProdUI(uiId: string, requestId: string) {
    const msg: GetProdUIMessage = {
      type: "get_prod_ui",
      uiId,
      requestId,
      projectId: this.projectId,
    };
    this.send(msg);
    console.log("📤 Sent get_prod_ui:", msg);
  }

  onProdUIResponse(handler: (res: ProdUIResponse) => void) {
    this.prodUIResponseHandlers.push(handler);
  }

  disconnect() {
    if (this.ws) this.ws.close();
    this.ws = null;
    // if (this.reconnectTimeout) clearTimeout(this.reconnectTimeout);
    this.connected = false;
  }

  isConnected() {
    return this.connected;
  }
}

