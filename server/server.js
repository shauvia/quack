const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');


const app = express();
app.use(cors());
app.use(bodyParser.urlencoded( {extended: false} ));
// strict:false is needed to accept raw string
app.use(bodyParser.json({strict:false}));
app.use(express.static('build'));

const port = process.env.PORT || 3001 // default is port 3000 (locally) but if there a different environment then use port that is default for the environment (np. strona serwowana z azurowego dysku bedzie miala domyslny port uzyty w srodowisku azura)

function listening(){
    console.log('server runnning');
    console.log(`runnning on localhost ${port}`);
  }

  app.get('/api', (req, res) => {
    console.log('server runnning');
    res.send('Hello from Jasna Cholera!');
  });

  const server = app.listen(port, listening);