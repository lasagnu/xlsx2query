import XLSX from 'xlsx'
import fs from 'fs'
import logger from '../core/logger/app-logger'

const alphabet = "abcdefghijklmnopqrstuvwxyz";

function splitCellIdent(text) {
    let letter = text.substring(0, 1);
    let number = text.substring(1);
    return [letter, number];
}

function fetchCellValue(charIndex, number, worksheet){
  let cell = alphabet.charAt(charIndex).toUpperCase() + number;
  let desiredCell = worksheet[cell];
  let desiredValue = desiredCell ? desiredCell.v : '#####';

  let regex = /^\d+$/gm;

  if(regex.test(desiredValue) || desiredValue == 'NULL'){
	   return desiredValue;
  }
  else{
    return "'" + desiredValue + "'";
  }
}

export function readCell( file_path, cell ) {

    let workbook = XLSX.readFile(file_path);
    let firstSheetName = workbook.SheetNames[0];
    let worksheet = workbook.Sheets[firstSheetName];
    let desiredCell = worksheet[cell];
    let desiredValue = desiredCell ? desiredCell.v : '#####';

    return desiredValue;
}

export async function readCells( file_path, range ) {

    let workbook = await XLSX.readFile(file_path);
    let firstSheetName = workbook.SheetNames[0];
    let worksheet = workbook.Sheets[firstSheetName];
    let output = '';


    let valueRangeArray = range.split(':');

    let beginRange = splitCellIdent(valueRangeArray[0]);

    let endRange = splitCellIdent(valueRangeArray[1]);

    let beginLetterIndex = alphabet.indexOf(beginRange[0].toLowerCase());
    let beginIndex = beginRange[1];
    let endLetterIndex = alphabet.indexOf(endRange[0].toLowerCase());
    let endIndex = endRange[1];

    if (beginLetterIndex < endLetterIndex){
        if(beginIndex < endIndex){
          for(let i = beginLetterIndex; i <= endLetterIndex; i++){
            for(let y = beginIndex; y <= endIndex; y++){
              let desiredValue = fetchCellValue(i, y, worksheet);
              output += desiredValue + ', ';
            }
          }
        }
        else if(beginIndex > endIndex){
          for(let i = beginLetterIndex; i <= endLetterIndex; i++){
            for(let y = endIndex; y <= beginIndex; y++){
              let desiredValue = fetchCellValue(i, y, worksheet);
              output += desiredValue + ', ';
            }
          }
        }
        else{
          for(let i = beginLetterIndex; i <= endLetterIndex; i++){
            let desiredValue = fetchCellValue(i, beginIndex, worksheet);
            output += desiredValue + ', ';
          }
        }
    }
    else if (beginLetterIndex > endLetterIndex){
      if(beginIndex < endIndex){
        for(let i = endLetterIndex; i <= beginLetterIndex; i++){
          for(let y = beginIndex; y <= endIndex; y++){
            let desiredValue = fetchCellValue(i, y, worksheet);
            output += desiredValue + ', ';
          }
        }
      }
      else if(beginIndex > endIndex){
        for(let i = endLetterIndex; i <= beginLetterIndex; i++){
          for(let y = endIndex; y <= beginIndex; y++){
            let desiredValue = fetchCellValue(i, y, worksheet);
            output += desiredValue + ', ';
          }
        }
      }
      else{
        for(let i = endLetterIndex; i <= beginLetterIndex; i++){
          let desiredValue = fetchCellValue(i, beginIndex, worksheet);
          output += desiredValue + ', ';
        }
      }
    }
    else{ // beginLetterIndex = endLetterIndex
      if(beginIndex < endIndex){
          for(let y = beginIndex; y <= endIndex; y++){
            let desiredValue = fetchCellValue(beginLetterIndex, y, worksheet);
            output += desiredValue + ', ';
          }
        }
        else if(beginIndex > endIndex){
            for(let y = endIndex; y <= beginIndex; y++){
              let desiredValue = fetchCellValue(beginLetterIndex, y, worksheet);
              output += desiredValue + ', ';
            }
        }
        else{
          let desiredValue = fetchCellValue(beginLetterIndex, beginIndex, worksheet);
          output += desiredValue + ', ';
        }
    }

    // delete unnecessary coma at the end of response
    if(output.slice(-2) == ', '){
      output = output.substring(0, output.length - 2);
    }

    return output;
}
