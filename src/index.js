import { formatValue } from "./helpers/formatValue";

document.addEventListener("DOMContentLoaded", () => {
  console.log('App started')

  let connectionStatus = 'closed';

  let ws = null;
  let tableDataFormat = {};
  const input = document.getElementById('url');
  const connectBtn = document.getElementById('connectBtn');
  const statusLabel = document.getElementById('status');
  const table = document.getElementById('table');

  function setStatus(status) {
    statusLabel.innerText = status;
    connectionStatus = status;
    if (status === 'closed') {
      statusLabel.classList.add('disconnected');
      connectBtn.innerText = 'Connect';
    } else {
      statusLabel.classList.remove('disconnected');
      connectBtn.innerText = 'Disconnect';
    }
  }

  function clearTable() {
    table.innerHTML = '';
  }

  function createTable(dataFormat) {
    clearTable();
    tableDataFormat = dataFormat
    const keys = Object.keys(dataFormat);
    const headerCols = keys.map(key => {
      const headerCol = document.createElement('th');
      headerCol.innerText = key;
      return headerCol;
    })
    const headerRow = document.createElement('tr');
    headerCols.forEach((col) => {
      headerRow.appendChild(col);
    })

    table.appendChild(headerRow);
  }

  function addEventToTable(data) {
    const keys = Object.keys(data);
    const cols = keys.map(key => {
      const col = document.createElement('td');

      let value;
      if (tableDataFormat[key] === 'date') {
        value = new Date(data[key]).toLocaleString();
      } else {
        value = data[key];
      }

      col.innerText = value;
      return col;
    })
    const row = document.createElement('tr');
    cols.forEach((col) => {
      row.appendChild(col);
    })

    table.appendChild(row);
  }

  setStatus('closed');

  connectBtn.addEventListener('click', () => {
    if (connectionStatus === 'connected' && ws) {
      setStatus('closed');
      ws.close();
      return;
    }

    try {
      ws = new WebSocket(input.value);

      ws.addEventListener('open', () => {
        console.log('Connection established');
        setStatus('connected');
        ws.send('Hello from client');
      })

      ws.addEventListener('message', function message(event) {
        console.log('Received: %s', event.data);
        const { type, payload } = JSON.parse(event.data);

        if (type === 'init') {
          createTable(payload.dataFormat);
        }
        else if (type === 'event') {
          addEventToTable(payload.data);
        }

      });

      ws.addEventListener('close', () => {
        console.log('Connection closed');
        setStatus('closed')
      });

    } catch (error) {
      alert(error.message);
    }
  });
  
})