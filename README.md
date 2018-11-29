## Prerequisites

MongoDB - https://docs.mongodb.com/manual/installation/

Connection details such as host, port and password are placed in `config.dev.js` file.

## Installation

Clone the repository and run `npm install`

```
git clone https://github.com/lasagnu/xlsx2query.git
npm install
```

## Starting the server

```
npm start
```

Set babel-node executable as the node interpreter.
Pass node parameters of --preset=babel-preset-es2015

The server will run on port 3000 by default.

## Uploading the .xlsx file
 
```
localhost:3000/file
```

## Usage

Data is being fetched by passing cells range, such as: ``A1:A2, b1:b12, a1:b12`` in the input string. Each of the values taken from cells specified in range will be separated with , (comma) and escaped with '' (except numbers).

Example input:

```
insert into database values (A1:B2);
```

