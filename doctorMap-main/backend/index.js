
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const User = require('./models/User');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const path = require('path');
const session = require('express-session');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN
const geocoder = mbxGeocoding({accessToken: mapBoxToken});
const satelize = require('satelize');
const geoip = require('geoip-lite');



const { default: axios } = require('axios');

const port = process.env.PORT || 5000;
const dbUrl = process.env.DB_URL;

app.use((req, res, next)=>{
    res.locals.currentUser = req.user;
    next();
})


if(process.env.NODE_ENV === "production")
{
  
   app.use('/',express.static('client/build'));
   app.get('*' , (req , res)=>{

    res.sendFile(path.resolve(__dirname  , 'client/build/index.html'))

})
}

const sessionConfig = {
 
  name: 'session',
  secret: 'doctorMap',
  resave: false,
  saveUninitialized: true,
  cookie: {
      httpOnly: true,
      secure: true,
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
      maxAge: 1000 * 60 * 60 * 24 * 7
  }
}

app.use(session({secret:'doctorMap'}));

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());
app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());
// passport.use(User.authenticate());
passport.serializeUser(User.serializeUser()); // how do we store the user in the session
passport.deserializeUser(User.deserializeUser()) // how to get user out of the data



main().catch(err => console.log(err));

async function main() {
    console.log('database connected');
  
  await mongoose.connect(dbUrl,{

    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  
}
let cUser;
app.post('/', (req, res)=>{
   cUser = req.user;
   console.log('cUser', cUser);
   var geo = geoip.lookup(cUser.ip).ll;
   console.log('geo',geo);
  
res.send(req.user);
 
})

app.post('/ip', async(req, res)=>{
 
  const user = await User.find({});

  let all = [];
  for(let u of user)
  {
    if(u._id!==cUser._id)
    {
     all.push(geoip.lookup(u.ip).ll)
    }
  }

res.send(all);
  
})

app.post('/database',async(req,res)=>{
  const allUser = await User.find({});
  res.send(allUser);
} )



app.post('/logout', function(req, res, next){
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('http://localhost:3000/');
    });
  });


  app.post('/plogin',passport.authenticate('local'), async(req, res) => {

    try
    {
    
      res.send(req.user._id)
      
    }
    catch(err){
     
      res.send('not authorized')
     
    }
  })
 

app.post('/login',passport.authenticate('local'), async(req, res) => {

  try
  {
  
    res.send(req.user._id)
    
  }
  catch(err){
   
    res.send('not authorized')
   
  }
})
app.post('/pregister', async(req, res) => {
 

  

  let ip=0;

const data = await ( await axios.get('https://api.ipify.org/?format=json') ).data;

ip = '103.49.116.68';

console.log('ip', ip);
 





const { email, name, password, phone } = req.body;


const user = new User({ email, name, phone });
user.ip = ip;
user.isPatient = 1;




const registeredUser = await User.register(user, password);
await user.save();

req.login(registeredUser, err =>{
  if(err) {
      console.log('this is the error',err);
      return next(err);
  }
  else
  {
      // req.flash('sucess', 'Welcome ');
  // res.redirect('/');
  res.send('success');
  }
});

})


app.post('/register', async(req, res) => {
 
    console.log('req body', req.body);
    

//     let latGeo =0 , lngGeo =0;

// const data = await ( await axios.get('https://ipapi.co/json/') ).data;

// latGeo = data.latitude;
// lngGeo = data.longitude;

// const geoData = await geocoder.reverseGeocode({
//     query: [latGeo, lngGeo],
    
// }).send();



let ip=0;

const data = await ( await axios.get('https://api.ipify.org/?format=json') ).data;

ip = data.ip;





  const { email, name, password, phone, hospital } = req.body;
  

  const user = new User({ email, name, phone, hospital });
  user.ip = ip;
  // user.geometry ={type: 'Point', coordinates: [28.7197, 77.0661]};
  



  const registeredUser = await User.register(user, password);
  await user.save();
 
  req.login(registeredUser, err =>{
    if(err) {
        console.log('this is the error',err);
        return next(err);
    }
    else
    {
        // req.flash('sucess', 'Welcome ');
    // res.redirect('/');
    res.send('success');
    }
});
 
})


app.listen(port, ()=>{
    console.log(`listening to port ${port}`);
})