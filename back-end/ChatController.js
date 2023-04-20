const methods = {};
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: "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",
});
const openai = new OpenAIApi(configuration);
methods.getAnswer = (req) => {
    return new Promise(async(resolve, reject) => {
       try{
        openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            // model: "gpt-4",
            messages: [{role: 'user', content: req.body.question}],
          }).then((data)=>{
            resolve({status:200,message:data.data.choices[0].message.content});

          });

       }catch(e){
          reject(e);
       }
    })
}
module.exports = methods;