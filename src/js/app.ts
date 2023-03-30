import { TableManager } from "./components/tableManager";

type IConnectionStatus = {
  connected: boolean,
  error: string | null
}

export class App {

  input: HTMLInputElement;
  connectBtn: HTMLButtonElement;
  statusLabel: HTMLLabelElement;
  table: HTMLTableElement;
  ws: WebSocket | undefined;
  tableManager: TableManager;
  connectionStatus: IConnectionStatus

  constructor() {
    this.input = document.getElementById('url') as HTMLInputElement;
    this.connectBtn = document.getElementById('connectBtn') as HTMLButtonElement;
    this.statusLabel = document.getElementById('status') as HTMLLabelElement;
    this.table = document.getElementById('table') as HTMLTableElement;

    this.ws = undefined;

    this.tableManager = new TableManager(this.table);

    this.setStatus({
      connected: false,
      error: null
    })

    this.connectBtn.addEventListener('click', (e) => {
      e.preventDefault();
      this.connect(this.input.value);
    });
  }

  setStatus(status: IConnectionStatus) {
    this.statusLabel.innerText = status.connected ? 'Connected' : 'Disconnected';
    this.connectionStatus = status;

    if (!status.connected) {
      this.statusLabel.classList.add('disconnected');
      this.connectBtn.innerText = 'Connect';
    } else {
      this.statusLabel.classList.remove('disconnected');
      this.connectBtn.innerText = 'Disconnect';
    }
  }

  connect(url: string) {
    if (this.connectionStatus.connected && this.ws) {
      this.setStatus({
        connected: false,
        error: null
      });
      this.ws.close();
      this.ws = undefined;
      return;
    }

    try {
      this.ws = new WebSocket(url);

      // On connection opened
      this.ws.addEventListener('open', () => {
        console.log('Connection to ' + url + ' established successfully');
        this.setStatus({
          connected: true,
          error: null
        });
      })

      // On message
      this.ws.addEventListener('message', (event) => {
        console.log('Received: %s', event.data);
        const { type, payload } = JSON.parse(event.data);

        if (type === 'init') {
          this.tableManager.setFormat(payload.dataFormat);
        }
        else if (type === 'event') {
          this.tableManager.addEvent(payload.data);
        }

      });

      // On connection closed
      this.ws.addEventListener('close', () => {
        console.log('Connection closed');
        this.setStatus({
          connected: false,
          error: null
        })
      });

    } catch (error) {
      if (this.connectionStatus.connected) {
        this.setStatus({
          connected: false,
          error: error.message
        })
      }

      if (this.ws) {
        this.ws.close()
      }
      
      alert(error.message);
    }
  }

}