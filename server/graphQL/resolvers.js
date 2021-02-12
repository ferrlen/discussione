const { r } = require("rethinkdb");


const getTopics = () => {
  console.log('getTopics');
  return r.table('topics').run(context.db, function(err, cursor) {
    if (err) throw err;
    cursor.toArray(function(err, result) {
        if (err) throw err;
        console.log(JSON.stringify(result, null, 2));
    });
  });
}
const test = async () => {
  const conn = await connectToDB();
  r.table('test').run(conn, function(err, cursor) {
    if (err) throw err;
    console.log(['cursor', cursor])
    cursor.toArray().then(res => {
      return res[0].title
    });
  });
}
const getTest = async (context) => {
  const t = await r.table('test').run(context.db).toArray()[0].title;
  return {title: t};
}
module.exports = { 
    // topics: async (obj, args, context, info) => await getTopics()
    // test: async (obj, args, context, info) => await getTest(context),
    t: (obj, args, context, info) => { return context.test; }
  // Test: {
  //   title: async ({title}) => title
  // }
  // Topic: {
  //   content
  // }
};
