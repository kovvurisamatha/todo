const express = require('express')
const app = express()
app.use(express.json())
const path = require('path')
const dbpath = path.join(__dirname, 'todoApplication.db')
let db = null
const sqlite3 = require('sqlite3')
const {open} = require('sqlite')
const initializeserver = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('server running at http://localhost:3000/')
    })
  } catch (e) {
    console.log(`dberror:${e.message}`)
    process.exit(1)
  }
}
initializeserver()
module.exports=app;
//api1
const haspriorityandstatus = requestQuery => {
  return (
    requestQuery.priority !== undefined && requestQuery.status !== undefined
  )
}
const haspriority = requestQuery => {
  return requestQuery.priority !== undefined
}
const hasstatus = requestQuery => {
  return requestQuery.status !== undefined
}
app.get('/todos/', async (request, response) => {
  const {search_q = '', priority, status} = request.query
  let data = null
  let dataquery = ''
  switch (true) {
    case haspriorityandstatus(request.query):
      dataquery = `select * from todo where 
    todo like '%${search_q}%' and
    priority='${priority}' and
    status='${status}'`
      break
    case haspriority(request.query):
      dataquery = `select * from todo where
    todo like '%${search_q}%' and priority='${priority}'`
      break
    case hasstatus(request.query):
      dataquery = `select * from todo where
    todo like '%${search_q}%' and status='${status}'`
      break
    default:
      dataquery = `select * from todo where
    todo like '%${search_q}'`
  }
  dbresponse = await db.all(dataquery)
  response.send(dbresponse)
})
//api2
