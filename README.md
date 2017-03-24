# Excel to SQL Converter
An application for converting excel files to excutable sql files.

## Usage
Read data from excel files in /public/excel/, and output sql files into /public/sql/

## Getting Started

### Prerequisites
Node js installation

### Preparation
1. Clone this repository

2. Write data into excel files, as the following style:

| Cell | Contents                           |
|------|------------------------------------|
| A1   | Column name you want to select by  |
| B1   | Table name you want to select from |
| A2~  | Values you want to select          |

3. Put the excel file into /public/excel/


### Execution

```
npm i
npm start
```

Open http://localhost:3000/xlsx/

Download files by following link:</br>
http://localhost:3000/sql/select.sql </br>
http://localhost:3000/sql/delete.sql

## Others
Still working on HTML.</br>
Other planned features:</br>
excel uploading</br>
Updating and inserting sqls

## License
MIT
