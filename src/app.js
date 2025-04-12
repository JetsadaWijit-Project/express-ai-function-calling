import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { deepSeekFunctionCall } from './ai.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/ask', async (req, res) => {
  const question = req.body.question;
  try {
    const response = await deepSeekFunctionCall(question);
    res.render('result', { question, response });
  } catch (error) {
    res.render('result', { question, response: "Error: " + error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
