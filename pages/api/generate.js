import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);


const basePromptPrefix =
`
Explain what this data structure is and an example of it:


`

const generateAction = async (req, res) => {
  console.log(`API: ${basePromptPrefix}${req.body.userInput}`)

  const baseCompletion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `${basePromptPrefix}${req.body.userInput}`,
    temperature: 0.4,
    max_tokens: 250,
  });
  
  const basePromptOutput = baseCompletion.data.choices.pop();

  const secondPrompt = 
  //${req.body.userInput}
  // Explain further on the information given from : ${basePromptOutput.text}
  `

   Give an example of the most popular leetcode question relating to: ${req.body.userInput}

  `
  
  const secondPromptCompletion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `${secondPrompt}`,
    temperature: 0.5,
    max_tokens: 1250,
  });
  
  const secondPromptOutput = secondPromptCompletion.data.choices.pop();

  res.status(200).json({ output: basePromptOutput, secondPromptOutput });
  //res.status(200).json({ output: secondPromptOutput });

};

export default generateAction;

