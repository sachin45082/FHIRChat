const express = require('express');
const cors = require('cors');
const app = express();
const { ChatOpenAI  } = require('@langchain/openai');
require('dotenv').config()
const PORT = process.env.PORT || 3001;
const openAIApiKey = 'Key';

const chatModel = new ChatOpenAI({
    openAIApiKey,
  });
app.use(cors());
app.use(express.json());
app.listen(PORT, () => console.log(`Server started on https://healthgptvercel-server.vercel.app`));

async function sendTextToOpenAI(text) {
    try {

        const response = await chatModel.invoke(text);
        console.log(response.content);
        return response.content

    } catch (error) {
        console.error("Error:", error.response ? error.response.data : error.message);
        throw error;
    }
}   

app.post('/api/chatbot', async (req, res) => {
    try {
        const response = await sendTextToOpenAI(JSON.stringify(req.body.patientInfo));
        res.json({ reply: response });
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: err });
    }
});
