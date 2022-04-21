const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors');
const { default: axios } = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.post('/events', async (req, res) => {
  const { type, data } = req.body
  console.log(`receiving ${type} event`);
  
  switch(type) {
    case 'CommentCreated':
      await handleCommentCreatedEvent(data);
      break;
  }
  res.send({});
})

const handleCommentCreatedEvent = async (data) => {
  const newStatus = data.content.indexOf('bad') >= 0 ? 'rejected' : 'approved';
  await axios.post('http://localhost:4005/events', { 
    type:'CommentModerated', 
    data: { 
      postId: data.postId,
      id: data.id, 
      status: newStatus
    }
  });
}

const port = 4003
app.listen(port, () => {
  console.log(`Listening on ${port}`);
});