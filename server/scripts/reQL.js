const config = require('../config'),
r = require('rethinkdb');
// Tables in this array will be automatically created if they do not exist.
const requiredTables = [
  'topics',
  'infos'
];
let rdbConn = null;
// DB Migration script --> Run to update local with latest model i.e - 
// Creates the necessary db and tables if none exist

const dbMigrate = () => {
  const connection = r.connect({
    host: config.DB_HOST,
    port: config.DB_PORT,
  })
  connection.then((conn, err) => {
    if (err) throw err;
    rdbConn = conn;
  })

  // Creates DB, as needed.
  connection.then(conn => {
    r.dbList().contains('discussione')
      .do((databaseExists) => {
        return r.branch(
          databaseExists,
          { dbs_created: 0 },
          r.dbCreate('discussione')
        );
      }).run(conn);
      conn.use('discussione');
    });

  // Create Required tables, as needed.
  connection.then(conn => {
      r.tableList().run(conn, (err, cursor) => {
        if (err) throw err;
        cursor.toArray((err, tables) => {
          if (err) throw err;
          for (let i = 0; i < requiredTables.length;i++) {
            if (!tables.includes(requiredTables[i])) {
              console.log(`Creating ${requiredTables[i]} table`);
              r.tableCreate(requiredTables[i]).run(conn, (conn, err) => {
                if (err) throw err;
                console.log(`${requiredTables[i]} successfully created!`)
              })
            }
          }
        });
        conn.close();
      });
  })
}
const rdbConnect = async function () {
  try {
    const conn = await r.connect({
      host: config.DB_HOST,
      port: config.DB_PORT,
      username: config.DB_USER,
      password: config.DB_PASS,
      db: config.DB_NAME,
    });
    // Handle close
    conn.on("close", function (e) {
      console.log("RDB connection closed: ", e);
      rdbConn = null;
    });

    console.log(`\nDB Server Connection successfully Established\nDetails:\n`);
    // console.log(conn)
    rdbConn = conn;
    return conn;
  } catch (err) {
    throw err;
  }
};
const connectToDB = async () => {
  console.log('run');
  if (rdbConn != null) {
    return rdbConn;
  }
  return await rdbConnect();
};
const test = async () => {
  const conn = await connectToDB();
  r.table('test').run(conn, function(err, cursor) {
    if (err) throw err;
    cursor.toArray().then((res) => {
      console.log(res[0])
    });
  });
}
exports.test = test;
exports.dbMigrate = dbMigrate;
exports.connectToDB = connectToDB;