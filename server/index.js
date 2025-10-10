import express, { json } from 'express'
import cors from 'cors'
import { connectBD } from './BD/database.js';
import auth from './routes/auth.js'; 
import folders from './routes/folders.js';
import topic from './routes/topics.js'
import card from './routes/cards.js'
const app = express();
const PORT=4000;

connectBD()

app.use(cors());

app.use(express.json());
app.use('/api', auth, folders, topic, card);


app.get('/api/test', (req, res)=>{
    res.json({message:'hello from express server:)'})
})

app.listen(PORT, ()=>{
    console.log(`server running on http://localhost:${PORT}`)
})