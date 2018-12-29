var express =   require('express')
    router =    express.Router(),
    Post =      require('../models/postModels');

//========other routes======//
router.get('/',  isLoggedIn, function(req, res){
    res.render('login');
})

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}

router.get('/newPost', isLoggedIn, function(req, res){
    res.redirect('posts');
})
router.get('/posts',  isLoggedIn, function(req, res){
    res.render('posts', {user: req.user.name});
    // Post.find({}, function(err, allPosts){
    //     if(err){
    //         console.log('An error occured '+ err);
    //         return;
    //     }
    //     res.render('posts', {allPosts: allPosts});
    // })
})

//Show Route
router.get('/posts/:id', function(req, res){
    var id = req.params.id;
    Post.findById(id, function(err, returnedPosts){
        if(err){
            res.redirect("/posts")
        }
        else{
            res.render("showPost", {returnedPosts: returnedPosts})
            
        }
    })
})


//Edit Route
router.get('/posts/:id/edit', function(req, res){
    var id = req.params.id;
    Post.findById(id, function(err, returnedPosts){
        if(err){
            res.redirect('/posts')
        }
        else{
            res.render('edit', {post: returnedPosts})
        }
    })
})

router.post('/newPost', function(req, res){
    var user = req.user,
        name = 'name',
        email = 'email';
    var data = req.body.post;
    data[name] = user.name;
    data[email] = user.username;
    Post.create(data, function(err, postCreated){
        if(err){
            console.log('An error occured '+ err);
            return;
        }
        res.redirect('posts');
        
        
    })
})

module.exports = router;