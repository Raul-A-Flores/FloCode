import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);


const basePromptPrefix =
`
Explain and describe this Data Structure or Algorithm and give an example:


DATA_STRUCTURE/ALGORITHM:

`

const generateAction = async (req, res) => {
 // console.log(`API: ${basePromptPrefix}${req.body.userInput}`)

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
  Data Structure/Algorithm: ${req.body.userInput}  

  In numbered list format, give the steps required to create the data structure or algorithm from ${req.body.userInput} and a visual representation. Then give an explation based on the data structure/algorithm below:


  data structure/algorithm: ${basePromptOutput.text}

  `
  
  const secondPromptCompletion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `${secondPrompt}`,
    temperature: 0.5,
    max_tokens: 1300,
  });
  
  const secondPromptOutput = secondPromptCompletion.data.choices.pop();

  console.log('****BASE*****', `${basePromptOutput.text}`)
  console.log('****SECOND*****', `${secondPromptOutput.text}`)


  res.status(200).json({ output:  basePromptOutput});
  // Cannot output second prompt due to limitations on vercel
  //res.status(200).json({ output: secondPromptOutput });

};

export default generateAction;

