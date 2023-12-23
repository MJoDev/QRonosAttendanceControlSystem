const moongose = require('mongoose');


//mongodb+srv://mjdev:miB0FwKuWSmcrlhb@tesis.urbuzzw.mongodb.net/Users

moongose.connect('mongodb+srv://mjdev:miB0FwKuWSmcrlhb@tesis.urbuzzw.mongodb.net/Users', {

}).then(db => console.log("connected"))
  .catch(err => console.log(err));