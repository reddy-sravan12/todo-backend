const app=require('./app');
const config=require('./config/index')

const { connectToMongo } = require('./utils/mongoConnection');


require('dotenv').config();



connectToMongo().then(()=>{
  app.listen(config.PORT, () => {
    console.log(`Server is running on port ${config.PORT}`);
  });
})
