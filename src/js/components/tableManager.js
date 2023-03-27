import { formatValue } from '../helpers/formatValue';

export class TableManager {
  constructor(tableElement) {
    this.tableElement = tableElement;
    this.events = [];
    this.tableElement.innerHTML = '';

    this.dataFormat = undefined;
  }

  clearTable() {
    this.tableElement.innerHTML = '';
  }

  setFormat(dataFormat) {

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

  addEvent(eventData) {

    if (!this.dataFormat) throw new Error('You need to set dataFormat before adding an event');

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
    
    this.events.push({...eventData, id: this.events.length});
    row.id = 'event-' + this.events.length;
    this.tableElement.appendChild(row);
  }
}