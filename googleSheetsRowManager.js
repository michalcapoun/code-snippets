/*
Google Apps Script for Google Sheets.

This script triggers on edit events in a Google Sheet. It performs the following tasks:
1. Monitors edits in the first three columns (A, B, and C).
2. If all cells in a row (except for the checkbox column) are filled:
   - Inserts a checkbox in column D of the same row.
   - If the row is the second row, inserts a new row above it.
3. Removes checkboxes if any cell in the monitored columns is empty.
4. Clears the format of filled rows when a new row is inserted.
 */

function onEdit(e) {
  const range = e.range;
  const sheet = range.getSheet();
  const editedRow = range.getRow();
  const editedCol = range.getColumn();

  if (editedRow > 1 && editedCol <= 3) {
    setCheckboxBasedOnRowValues(sheet, editedRow);
    createNewRowIfFilled(sheet, editedRow);
  }
}

function setCheckboxBasedOnRowValues(sheet, editedRow) {
  const allFilled = isRowFilled(sheet, editedRow);

  if (allFilled) {
    sheet.getRange(editedRow, 4).insertCheckboxes();
  } else {
    sheet.getRange(editedRow, 4).removeCheckboxes();
  }
}

function createNewRowIfFilled(sheet, editedRow) {
  const allFilled = isRowFilled(sheet, editedRow);

  if (editedRow == 2 && allFilled) {
    formatFilledRow(sheet, editedRow);
    sheet.insertRowBefore(2);
    // New row starts automatically with checkbox
    sheet.getRange(editedRow, 4).removeCheckboxes();
  }
}

function isRowFilled(sheet, row) {
  const rowValues = sheet.getRange(row, 1, 1, 3).getValues()[0];
  return rowValues.every(function (cell) {
    return cell !== "";
  });
}

function formatFilledRow(sheet, row) {
  sheet.getRange(row, 1, 1, 3).clearFormat();
}
