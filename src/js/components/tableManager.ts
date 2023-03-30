import { formatValue } from '../helpers/formatValue';

type IEvent = {
  id: number,
  payload: any
}

export class TableManager {

  tableElement: HTMLTableElement;
  events: IEvent[];
  dataFormat: any;

  constructor(tableElement: HTMLTableElement) {
    this.tableElement = tableElement;
    this.events = [];
    this.tableElement.innerHTML = '';

    this.dataFormat = undefined;
  }

  clearTable() {
    this.tableElement.innerHTML = '';
  }

  setFormat(dataFormat: any) {

    this.clearTable();

    this.dataFormat = dataFormat;
    const headerCols = Object.keys(dataFormat).map(key => {
      const headerCol = document.createElement('th');
      headerCol.innerText = key;
      return headerCol;
    })

    const headerRow = document.createElement('tr');
    headerCols.forEach((col) => {
      headerRow.appendChild(col);
    })

    this.tableElement.appendChild(headerRow);
  }

  deleteEvent(eventId: number) {
    this.events.splice(this.events.findIndex(e => e.id === eventId));
    document.getElementById('event-' + eventId).remove();
  }

  addEvent(eventData: any) {

    if (!this.dataFormat) throw new Error('You need to set dataFormat before adding an event');
    const eventId = this.events.length;

    const keys = Object.keys(eventData);
    const cols = keys.map(key => {
      const col = document.createElement('td');
      col.innerText = formatValue(eventData[key], this.dataFormat[key]);
      return col;
    })
    const row = document.createElement('tr');
    
    
    cols.forEach((col) => {
      row.appendChild(col);
    })
    
    const closeBtn = document.createElement('button');
    closeBtn.className = 'closeBtn';
    closeBtn.addEventListener('click', () => this.deleteEvent(eventId));
    
    row.querySelector('*:last-child').appendChild(closeBtn);
    
    this.events.push({...eventData, id: eventId});
    row.id = 'event-' + eventId;
    this.tableElement.appendChild(row);
  }
}