var express =   require('express')
    router =    express.Router();
var passport = require('passport');

//========get======//
//========authentication======//

router.get('/login', function(req, res){
    res.render('login');
})
router.get('/register', function(req, res){
    res.render('register');
})
router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
})

//========post======//

router.post('/register', function(req, res){
    var userDetails = req.body.user;
    User.register(new User({name: userDetails.name, username: userDetails.email}), userDetails.password, function(err, user){
        if(err){
            return res.render('register');
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/posts");
            console.log(user)
        })
    })
})

// //using passport.authenticate as middleware
router.post('/login', passport.authenticate("local",{
    successRedirect: '/posts',
    failureRedirect: '/login'
}),function(req, res){

})

module.exports = router;
