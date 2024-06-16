/*
Google Apps Script for Google Sheets.

This script triggers on edit events in a Google Sheet. It performs the following tasks:
1. Monitors edits in the first three columns (A, B, and C).
2. If first four cells in a first row are filled:
   - Inserts a '❓' symbol in column E of the same row.
   - If the row is the second row, inserts a new row above it.
4. Clears the format of filled rows when a new row is inserted.
 */

function onEdit(e) {
  const range = e.range;
  const sheet = range.getSheet();
  const editedRow = range.getRow();
  const editedCol = range.getColumn();

  if (editedRow === 2 && editedCol <= 4) {
    setDropdownBasedOnRowValues(sheet, editedRow);
    createNewRowIfFilled(sheet, editedRow);
  }
}

function setDropdownBasedOnRowValues(sheet, editedRow) {
  const allFilled = isRowFilled(sheet, editedRow);

  if (allFilled) {
    const dropdownRange = sheet.getRange(editedRow, 5);
    const rule = SpreadsheetApp.newDataValidation()
      .requireValueInList(["✔️", "❌", "❓"])
      .build();
    dropdownRange.setDataValidation(rule);
    dropdownRange.setValue("❓");
  } else {
    sheet.getRange(editedRow, 5).clearDataValidations().setValue("");
  }
}

function createNewRowIfFilled(sheet, editedRow) {
  const allFilled = isRowFilled(sheet, editedRow);

  if (allFilled) {
    formatFilledRow(sheet, editedRow);
    sheet.insertRowBefore(editedRow);
    // New row starts without dropdown menu
    const newRowRange = sheet.getRange(editedRow, 5);
    newRowRange.clearDataValidations().setValue("");
  }
}

function isRowFilled(sheet, row) {
  const rowValues = sheet.getRange(row, 1, 1, 4).getValues()[0];
  return rowValues.every(function (cell) {
    return cell !== "";
  });
}

function formatFilledRow(sheet, row) {
  sheet.getRange(row, 1, 1, 4).clearFormat();
}
