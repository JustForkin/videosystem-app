const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const config = require('./config/config')
const {sequelize} = require('./models')

// import VCalendar from 'v-calendar'
// import 'v-calendar/lib/v-calendar.min.css'

const app = express()

// const db = require('./db');

app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(cors())

// Use v-calendar, v-date-picker & v-popover components
// Vue.use(VCalendar, {
//   firstDayOfWeek: 2  // Monday
// })

// Vue.component('v-calendar', VCalendar);
// Vue.component('v-date-picker', VCalendar);

require('./routes')(app)

sequelize.sync({force: false})
  .then(() => {
    app.listen(process.env.PORT || config.port,
      () => console.log('>> SERVER START ON PORT ' + config.port))
  })

// test db query
/*db.any('SELECT * FROM "user"')
    .then(user => {
        for (var i = 0; i < user.length; i++){
          console.log('User ' + (i+1) + ' username: ' + user[i].username);
          console.log('User ' + (i+1) + ' password: ' + user[i].password);
          console.log('------------------------------------------------');
        }
    })
    .catch(error => {
        console.log(error); // print the error;
    })
*/
