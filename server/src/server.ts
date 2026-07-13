import  app from './app.js';
import { pool } from './config/db.js';
const port = 4000;

app.listen(port, ()=>{
      console.log("app is running in 4000");
      console.log(`${process.env.DB_NAME}`)
     pool.query("SELECT NOW();", (err, res) => {
       if (err) {
         console.error("Error executing query", err);
       } else {
         console.log("Database connection successful", res.rows[0]);
       }
     });
});
