var PORT =  process.env.PORT || 3000,
    IP =    process.env.IP,
    express =               require('express'),
    bodyParser =            require('body-parser'),
    mongoose =              require('mongoose'),
    passport =              require('passport'),
    LocalStrategy =         require('passport-local'),
    passportLocalMongoose = require('passport-local-mongoose'),
    router =                require('./controllers/route'),
    auth =                  require('./controllers/auth'),
    User =                  require('./models/userModels.')

    mongoose.set('useCreateIndex', true);
    mongoose.connect("mongodb://localhost/mysocialapp", { useNewUrlParser:true }).catch()

var app = express();
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(require('express-session')({
    secret: "i love coding",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(router);
app.use(auth);

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.listen(PORT, IP, function(req, res){
    console.log('Server started on port '+ PORT);
})

