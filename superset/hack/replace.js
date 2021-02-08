const fs = require('fs')

const file = __dirname + '/core.py'
const source = 'Response(csv, mimetype="text/csv")'
const dest = `Response(u'\uFEFF'.encode('utf-8') + csv.encode('utf-8'), mimetype="text/csv")`

const content = fs.readFileSync(file, 'utf-8')
const newContent = content.replace(source, dest)

fs.writeFileSync(file, newContent)
