const sqlite = require('sqlite3').verbose()
const db = new sqlite.Database("./users.db", sqlite.OPEN_READWRITE, (err) => {
    if(err) return console.error(err);
})

const sql = `CREATE TABLE users(id INTEGER PRIMARY KEY AUTOINCREMENT, email, password)`
db.run(sql)