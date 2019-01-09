var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
var firebase = require("firebase");
var staticmeg;
var bodyParser = require('body-parser')
var namearray = [];
var config = {
    apiKey: "AIzaSyASI6EIy_6vriuqARTXgYVdCQDrCScXtO8",
    authDomain: "myweb-80e96.firebaseapp.com",
    databaseURL: "https://myweb-80e96.firebaseio.com",
    projectId: "myweb-80e96",
    storageBucket: "myweb-80e96.appspot.com",
    messagingSenderId: "127912984026"
};
firebase.initializeApp(config);
const db = firebase.database();
app.get('/', function(req, res){
    res.sendFile(__dirname + '/login.html');
});
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/index',(req,res)=>{
    res.sendFile(__dirname + '/index.html');
})
app.get('/signup',(req,res)=>{
    res.sendFile(__dirname + '/signup.html');
})
app.get('/login',(req,res)=>{
    res.sendFile(__dirname + '/login.html');
})
app.get('/first',(req,res)=>{
    res.sendFile(__dirname + '/first.html');
})
app.get('/signcheck',(req,res)=>{
    var account = req.query.username
    var password = req.query.password
    var aret = ""
    var ref = db.ref("/users/");
    var tf = false
    console.log(account)
    if(account != '' && password != ''){
        ref.once("value", function(snapshot){
            if(snapshot.child(account).exists()){
                console.log(1)
                aret = "帳號已被使用"
                tf = false
            }
            else{
                console.log(2)
                var post = {
                    password : password
                };
                tf = true
                ref.child(account).set(post)
            }
        });
    }else{
        aret = "請輸入完整帳密"
    }
    setTimeout(function(){res.send({a: aret,b:tf})},300);

})
app.get('/compare', async(req,res)=>{
    var aret = ""
    var tf = false
    var account = req.query.username
    var password = req.query.password
    console.log(account)
    const ref = db.ref("/users/");
    ref.child(account).on("value", function(snapshot){
        aret = ""
        if(account != ''){
            if(snapshot.exists()){
                if(password == snapshot.val().password){
                    tf = true
                    console.log(1)
                }
                else{
                    tf = false
                    aret = '密碼錯誤'
                    console.log(4)
                }
            }else{
                aret = '無此帳號'
                tf = false
                console.log(2)
            }
        }
        else{
            aret = "請輸入完整帳號密碼"
            tf = false
            console.log(3)
        }
    });
    setTimeout(function(){res.send({a: aret, b:tf})},300);
});

io.on('connection', function(socket){
    socket.on('room', function(msg){
        staticmeg = msg;
    });
});
io.on('connection', function(socket){
    socket.on('nickname', function(name){
        socket.on('room', function(data){

            namearray.push(name);
            io.emit('severmessage'+data, '系统'+'歡迎'+name+'進入了房間' );
            io.emit('namearr',namearray)

        });
    });
});
io.on('connection', function(socket){
    socket.on('nickname', function(name){
        socket.on(staticmeg, function(data){
            io.emit('whosmes'+staticmeg,name);
            io.emit('message'+staticmeg, name+":"+data);
        });
    });
});
http.listen(port, function(){
    console.log('listening on *:' + port);
});
io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
});
//io.on('connection', function(socket){
//
//  socket.on(url3[1], function(msg){
//    console.log('message: ' + msg);
//  });
//});
//io.on('connection', function(socket){
//    socket.on('room', function(msg){
//        socket.emit('chat',msg);
//        console.log("mes:"+msg);
//    });
//});



