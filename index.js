
const { Telegraf, Markup } = require('telegraf')
// const { message } = require('telegraf/filters')
//redis config
const redis = require('redis')
const client = redis.createClient();
client.connect();
//axios config 
const axios = require('axios')
 
const bot = new Telegraf('7435906858:AAFJz1ZOcfcWRTVmwpcDy6LPJTNFMh7yw4I')

bot.start((ctx)=> 
{
    console.log(ctx.message.chat)
    ctx.reply("welcome to GPT",
        Markup.inlineKeyboard([
            [
                Markup.button.callback('GPT3.5 Turbo','gpt3.5-turbo'),Markup.button.callback('GPT4-turbo','gpt4-turbo')

            ]
            ,
            [
                Markup.button.callback('Microsoft Copilot','copilot') , Markup.button.callback('GPT4-o' ,'gpt4o')
            ]
        ])
    )
})

bot.action('gpt3.5-turbo' ,(ctx)=>
{
      client.set(`user:${ctx.chat.id}:engine`,"gpt3.5-turbo")
      ctx.editMessageText("hi how can i help you?")
})
bot.action('gpt4-turbo' ,(ctx)=>
    {
          client.set(`user:${ctx.chat.id}:engine`,"gpt4-turbo")
          ctx.editMessageText("hi how can i help you?")
    })
    bot.action('gpt4o' ,(ctx)=>
{
      client.set(`user:${ctx.chat.id}:engine`,"gpt4o")
      ctx.editMessageText("hi how can i help you?")
})

bot.action('copilot' ,(ctx)=>
    {
          client.set(`user:${ctx.chat.id}:engine`,"copilot")
          ctx.editMessageText('choose one',
            Markup.inlineKeyboard([
                [
                    Markup.button.callback('precise','precise') ,Markup.button.callback('creative','creative')
                ],
                [
                    Markup.button.callback('Balanced','Balanced')
                ]
            ])
          )
    }) 
bot.action('precise' ,(ctx)=>
{
      client.set(`user:${ctx.chat.id}:tones`,"precise")
      ctx.editMessageText("hi how can i help you?")
})
bot.action('creative' ,(ctx)=>
    {
          client.set(`user:${ctx.chat.id}:tones`,"creative")
          ctx.editMessageText("hi  how can i help you?")
    })
    bot.action('Balanced' ,(ctx)=>
{
      client.set(`user:${ctx.chat.id}:tones`,"balanced")
      ctx.editMessageText("hi how can i help you?")
})

bot.on('text' ,async (ctx)=>
{   
    const Usertext = ctx.text
    const engine = await client.get(`user:${ctx.chat.id}:engine`)
    const tones = await client.get(`user:${ctx.chat.id}:tones`)
    console.log(engine)
    if(engine == 'gpt3.5-turbo' || engine=='gpt4-turbo' || engine =='gpt4o')
    {
        console.log("C")
         const res = await axios.get(`https://one-api.ir/chatgpt/?token=891910:644252b4a52d3&action=${engine}&q=`+ encodeURIComponent(Usertext))
         console.log(res)
         ctx.reply(res.data.result)
    }
    else if(engine =='copilot')
    {
        
        const res = await axios.get(`https://one-api.ir/chatgpt/?token=891910:644252b4a52d3&action=${engine}&q=`+ encodeURIComponent(Usertext)+ `&tones=${tones}`)
        ctx.reply(res.data.result[0].message)


    }


})
bot.launch()