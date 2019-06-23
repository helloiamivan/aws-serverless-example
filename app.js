const Telegraf = require('telegraf')
const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')
const btoa = require('btoa');

const bot = new Telegraf(BOT_API_KEY)

// Mongo DB initialization
var MongoClient = require('mongodb').MongoClient;

var url = "mongodb+srv://telegram_bot:3kFAYPtEWlT5c0Kf@frankfurt-jcg1n.mongodb.net/test";

bot.command('start', ({ reply }) => {
  return reply('Welcome to rewards bot. We are now commencing token reward bounties, please perform each bounty task and submit your details to get the airdrops.', Markup
    .keyboard([
      ['🌟Get 1 ETH: Join Telegram Chat🌟'],
      ['View Address', 'Add Address','Edit Address'],
      ['Check Referrals','Generate Referral Link']
    ])
    //.oneTime()
    .resize()
    .extra()
  )
})

bot.hears('Generate Referral Link', ctx =>{
  const encoded_user = btoa(ctx.message.from.username)
  ctx.reply('Your unique referal link is: '.concat('http://t.me/Banglaworker_bot/start?=').concat(encoded_user))
})

bot.hears('🌟Get 1 ETH: Join Telegram Chat🌟', ctx => {
  ctx.reply('Please join @xxxxx channel and stay at least till the end of the campaign to get your rewards')
})

bot.hears('🐥Get 1 ETH: Follow Twitter🐥', ctx => {
  ctx.reply('Please follow https://twitter.com/realDonaldTrump to qualify for your rewards')
})

bot.hears('Edit Address', ctx =>{
  ctx.reply('No updates are enabled now')
})

bot.hears('Check Referrals', ctx => {
  const user_name = ctx.message.from.username;
  MongoClient.connect(url, {useNewUrlParser:true}, function(err, db) {
    var dbo = db.db("frankfurt-jcg1n");
    dbo.collection("testproject").findOne({telegram_username:user_name}, function(err, result) {
      if (result != null) {
        ctx.reply('You currently have '.concat(result.referrals).concat(' referrals.'));
      }
      else{
        ctx.reply('Our records show that you have not added an address, please add an address before viewing.')
      }
      db.close();
    });
  }); 
})

bot.hears('View Address', ctx => {
  const user_name = ctx.message.from.username;
  MongoClient.connect(url, function(err, db) {
    var dbo = db.db("frankfurt-jcg1n");
    dbo.collection("testproject").findOne({telegram_username:user_name}, function(err, result) {
      if (result != null) {
        ctx.reply(result.address);
      }
      else{
        ctx.reply('Our records show that you have not added an address, please add an address before viewing.')
      }
      db.close();
    });
  });  
})

bot.hears('Add Address', ctx => {
  const user_name = ctx.message.from.username;
  MongoClient.connect(url, function(err, db) {
    var dbo = db.db("frankfurt-jcg1n");
    dbo.collection("testproject").findOne({telegram_username:user_name}, function(err, result) {
      if (result != null) {
        ctx.reply('You have already entered an ETH address, each user may only submit one address')
      }
      else{
        ctx.reply('Please enter your ETH address to participate in the airdrop')
      }
      db.close();
    });
  }); 
})

bot.command('cancel', ctx => {
  ctx.reply('Bot session terminated, press /start to use again')
})

bot.on('text', ctx => {
  const eth_address = ctx.message.text;

  if (1==1) {
    const user_name = ctx.message.from.username;
    MongoClient.connect(url, function(err, db) {
      var dbo = db.db("frankfurt-jcg1n");
      var myobj = { telegram_username: user_name, address: eth_address, referrals:0};
      dbo.collection("testproject").insertOne(myobj, function(err, res) {
        console.log(user_name.concat(" is inserted into database"));
        db.close();
      });
    });
    ctx.reply('Your address is successfully saved in the database') 
  }
  else {
    ctx.reply('Wrong address format, please enter again.') 
  }
})

//bot.startPolling()
const { PORT = 3000 } = process.env
bot.startWebhook('/',null, PORT)
console.log('Bot is now running!')
