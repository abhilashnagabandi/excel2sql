var path = require('path');
var express = require('express');
var router = express.Router();
var fs = require('fs');
if(typeof require !== 'undefined') XLSX = require('xlsx');

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
  console.log(new Date().toString(), 'API been called');
  next();
});

var xlsxContents = {
  title : 'xlsx_list',
  selectBy : 'undefined',
  tableName : 'undefined',
  idLength: 0,
  idList: []
};

var selectSql;
var deleteSql;

var selectPath = (path.join(__dirname, '../public/sql/select.sql'));
var deletePath = (path.join(__dirname, '../public/sql/delete.sql'));
var excelFolder = (path.join(__dirname, '../public/excel/'));

router.use(function(req, res, next){
  xlsxContents.idList=[];
  var files = fs.readdirSync(excelFolder);
  for(var i = 0 ; i < files.length ; i++){
    var workbook = XLSX.readFile(path.join(excelFolder, files[i]));
    console.log("File read successfully: " + files[i]);
    var firstSheetName = workbook.SheetNames[0];
    var worksheet = workbook.Sheets[firstSheetName];
    for(var cell in worksheet){
      if(cell == "A1"){
        if(!worksheet.hasOwnProperty(cell)){
          console.error("No column to select");
          res.status(500).send('Please write the column you want to select by in A1 cell');
        }else{
          xlsxContents.selectBy = worksheet[cell].v;
        }
      }else if(cell == "B1"){
        if(!worksheet.hasOwnProperty(cell)){
          console.error("No table to select");
          res.status(500).send('Please write the table you want to select from in B1 cell');
        }else{
          xlsxContents.tableName = worksheet[cell].v;
        }
      }else if(worksheet.hasOwnProperty(cell) && worksheet[cell].v){
        var value = worksheet[cell].v;
        // console.log(cell, value);
        if(xlsxContents.idList.indexOf(value) == -1){
          xlsxContents.idList.push(value);
        }
      }
    }
  }
  xlsxContents.idLength = xlsxContents.idList.length;
  if(xlsxContents.idLength === 0){
    console.error("No id to select");
    res.status(500).send('Please write the value you want to select in A2~ area');
  }

  selectSql = '--Confirm data\n' +
  'SELECT COUNT(1) FROM ' + xlsxContents.tableName + '\n' +
  'WHERE ' + xlsxContents.selectBy + ' = \'' + xlsxContents.idList.join('\'\n   OR ' + xlsxContents.selectBy + ' = \'') + '\';\n' +
  '-- Result should be '+ xlsxContents.idLength;

  fs.writeFileSync(selectPath, selectSql);
  console.log(selectPath + ' saved successfully.');

  deleteSql = '--Delete data\n' +
  'DELETE FROM ' + xlsxContents.tableName + '\n' +
  'WHERE ' + xlsxContents.selectBy + ' = \'' + xlsxContents.idList.join('\'\n   OR ' + xlsxContents.selectBy + ' = \'') + '\';';

  fs.writeFileSync(deletePath, deleteSql);
  console.log(deletePath + ' saved successfully.');

  next();
});

router.get('/', function (req, res) {
  res.jsonp(xlsxContents);
});

router.get('/select', function (req, res) {
  res.download(selectPath);
  // res.send("Will start downloading select.sql soon.");
});

router.get('/delete', function (req, res) {
  res.download(deletePath);
  // res.send("Will start downloading delte.sql soon.");
});

module.exports = router;
