var express =   require('express')
    router =    express.Router(),
    Post =      require('../models/postModels');

//========other routes======//
router.get('/', function(req, res){
    res.render('index');
})
router.get('/index', function(req, res){
    res.redirect('/');
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
    Post.find({}, function(err, allPosts){
        if(err){
            console.log('An error occured '+ err);
            return;
        }
        res.render('posts', {user: req.user.name, allPosts: allPosts});
        // console.log(req.body.action)
    })
})

//Show Route
router.get('/posts/:id', isLoggedIn, function(req, res){
    var id = req.params.id;
    Post.findById(id, function(err, returnedPost){
        if(err){
            res.redirect("/posts");
            return;
        } 
        var username = req.user.username,
            retrievedUser = returnedPost.email;
            if(username === retrievedUser){
                res.render("showPost", {user: req.user.name, returnedPost: returnedPost, edit:'1'});
            }
            else{
                res.render("showPost", {user: req.user.name, returnedPost: returnedPost, edit: '0'});
            }  
    })
})


//Edit Route
router.get('/posts/:id/edit', isLoggedIn, function(req, res){
    var id = req.params.id;
    Post.findById(id, function(err, returnedPost){
        if(err){
            res.redirect('/posts')
        }
        else{
            res.render('edit', {user: req.user.name, post: returnedPost})
        }
    })
})

//Update Route
router.put('/posts/:id', isLoggedIn, function(req, res){
    var id = req.params.id,
        data = req.body.post;
    Post.findByIdAndUpdate(id, data, function(err, reupdatedPost){
        if(err){
            console.log(err)
            res.redirect('posts');
        }else{
            res.redirect(id);
        }
        
    })
})

router.delete('/posts/:id', isLoggedIn, function(req, res){
    var id = req.params.id;
    Post.findByIdAndRemove(id, function(err){
        if(err){
            console.log(err)
            res.redirect(id);
            return
        }
        res.redirect('posts');
    })
})

// Show the post of a particular user
router.get('/posts/:id/user', isLoggedIn, function(req, res){
    var id = req.params.id;
    Post.findById(id, function(err, foundPost){
        if(err){
            console.log(err);
            res.redirect('posts');
            return;
        }
        var email = foundPost.email;
        Post.find({email: email}, function(err, next){
            if(err){
                console.log(err)
                return;
            }
            res.render('user', {allPosts: next, user: req.user});
        })
    })
});


//Adding route for liking post
// router.post('/posts/:id/act', (req, res, next) => {
//     const action = req.body.action;
//     const counter = action === 'Like' ? 1 : -1;
//     Post.update({_id: req.params.id}, {$inc: {likes_count: counter}}, {}, (err, numberAffected) => {
//         res.send('');
//     });
// });


//New Post Route
router.post('/newPost', isLoggedIn, function(req, res){
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