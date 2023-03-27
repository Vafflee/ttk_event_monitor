const { TableManager } = require("./components/tableManager");

export class App {

  constructor() {
    this.input = document.getElementById('url');
    this.connectBtn = document.getElementById('connectBtn');
    this.statusLabel = document.getElementById('status');
    this.table = document.getElementById('table');

    this.ws = undefined;

    this.tableManager = new TableManager(table);

    this.setStatus({
      connected: false,
      error: null
    })

    this.connectBtn.addEventListener('click', (e) => {
      e.preventDefault();
      this.connect(this.input.value);
    });
  }

  setStatus(status) {
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

  connect(url) {
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