const methods = {};
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: "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",
});
const openai = new OpenAIApi(configuration);
methods.getAnswer = (req) => {
    return new Promise(async(resolve, reject) => {
      try {
        openai.createChatCompletion({
          model: "gpt-3.5-turbo",
          // model: "text-davinci-003",
          // prompt: req.body.question,
          // temperature: 0.7,
          // max_tokens: 2096,
          messages: [{role: 'user', content: req.body.question}],
        }).then((data)=>{
          resolve({status:200,message:data.data.choices[0].message.content});
        }).catch((e) => {
          reject(e);
        });

      } catch(e){
        console.log("something went wrong");
        reject(e);
      }
    })
}
module.exports = methods;