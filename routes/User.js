const express = require('express');
const app = express();
const ListUsers = require('../model/user');
const ListProducts = require('../model/product');
const alert = require('alert'); 
const multer = require("multer");
const { engine } = require('express-handlebars');
const jwt = require('jsonwebtoken');
var cookieParser = require('cookie-parser');
const { data } = require('jquery');

app.use(cookieParser());
require('dotenv/config');
app.get('/login',(req,res)=>{

  res.render('home.handlebars') 
})
// User
app.get('/signup', (req, res) => {
  res.render('users/signup.handlebars')
});

app.get('/addoredit', (req, res) => {
  res.render('users/addoredit.handlebars',{titleuser: "Thêm Người Dùng"})
});



    
app.get('/list', (req, res) => {
  var token = req.headers.cookie.split("=")[1];
  console.log(token);
  var ketqua = jwt.verify(token,'mk');
     ListUsers.find({_id:ketqua._id}).then(data =>{

      if(data.length == 0){
        return res.redirect('/login');
      }else{
        if(data[0].role=='Admin'){
          ListUsers.find({}).then(user =>{
            res.render('users/ListUse.hbs',{
                user:user.map(user => user.toJSON())
            });
        })
        }
         if(data[0].role=='User'){
        
          alert("bạn không có quyền xem ")
        }
      }
     })
   
 
});
app.get('/home', (req, res) => {
  ListUsers.find({}).then(user =>{

      res.render('users/manhinhchin.hbs',{
       
          user:user.map(user => user.toJSON())
      });
  })

});

app.get('/huydk', (req, res) => {
  res.render('home.handlebars') 
});

app.get('/huyadduser', (req, res) => {
  res.redirect('/list') 
});
app.get('/huyaddproduct', (req, res) => {
  res.redirect('/listproduct');
});
app.post('/add',(req, res) =>{
  const data={
    fullname: req.body.fullname,
    email: req.body.email,
    password: req.body.password,
    files: req.body.files,
    role: req.body.role,
    
  }
  ListUsers.insertMany([data]) 
  res.render('home.handlebars');
  alert("Đăng Ký Thành Công")

});

app.post('/addoredit', (req, res) => {
  console.log(req.body);
  if(req.body.id ==''){
     addRecord(req, res);
    res.redirect('/list');
  }else{
updateRecord(req, res);
res.redirect('/list');
  }


    });
function addRecord(req, res)
{
  const data={
    fullname: req.body.fullname,
    email: req.body.email,
    password: req.body.password,
    files: req.body.files,
    role: req.body.role,
  
    
  }
  ListUsers.insertMany([data]) 
  alert("Thêm mới Thành Công")
  res.redirect('/list');

}
function updateRecord(req, res) {
  ListUsers.findOneAndUpdate({_id:req.body.id},req.body,{new:true}).then(err=>{
    if(!err){
   
      console.log(err);
      res.render('users/signup.handlebars')
    }else{
      res.redirect('/list');
       
    }
  }
  )
}
app.get("/edit/:id", (req, res) => {
  ListUsers.findById(req.params.id).then((user) => {
    
          res.render('users/addoredit.handlebars', {
               titleuser:"Sửa Người Dùng",
              user:user.toJSON()
            });
      
    
  })
 
 
})


app.get("/del/:id",async (req, res) => {
  try{
      const user = await ListUsers.findByIdAndDelete(req.params.id,req.body);
      if(!user) res.status(404).send("không tìm thấy item xóa");
      else{
          res.redirect("/list");
      }
      res.status(200).send();

  }catch(error) {
      res.status(500).send(error);
  }
  });

/// xác thực

  app.post('/login', function(req, res, next) {

    var email = req.body.email
    var password = req.body.password
    ListUsers.findOne({
       email: email,
        password: password
    })
    .then(data => {
    
       if(data){
       
        var token = jwt.sign({
          _id: data._id
        },'mk')
        return res.json({
          message :'thành công',
          token: token
        });
       }
       else{
      
        return res.json("thất bại")
       }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json('loi server');;
    })

  });

  app.get('/private', (req, res, next) => {
            res.status(201).render('users/manhinhchin.hbs', {

           
             
              naming: `${req.body.password}+${req.body.email}` })

  })

//   app.post('/login', async (req, res) => {
// console.log(req.body);
//     try {
//         const check = await ListUsers.findOne({ email: req.body.email })

//         if (check.password === req.body.password) {
//           var token = jwt.sign({
//             _id : req.body._id
//           },'mk')

        
//         }
//         else {
//           alert("Sai Password");
//         }
//     } catch (e) {
    
//     alert("Email bạn vừa nhập chưa được đăng ký!?");
        

//     }
// });




//Product

app.get('/themsanpham', (req, res) => {
  res.render('product/addproduct.handlebars',{titlesanpham:"Thêm Sản Phẩm"})
});

    
// app.get('/listproduct', (req, res) => {
//     ListProducts.find({}).then(product =>{
//         res.render('product/ListProduct.hbs',{
//             product:product.map(product => product.toJSON())
//         });
//     })
 
// });
app.get('/listproduct', (req, res) => {
  ListProducts.find({}).then(user =>{
      res.render('product/ListProduct.hbs',{
        titlepage: "Danh Sách Sản Phẩm",
          user:user.map(user => user.toJSON())
      });
  })

});

app.post('/add1', (req, res) => {
  console.log(req.body);
  if(req.body.id ==''){
     addRecord1(req, res);
    //  res.redirect('/listproduct');
  }else{
updateRecord1(req, res);
  }


    });
function addRecord1(req, res)
{
  const data={
    masp: req.body.masp,
   tensp: req.body.tensp,
   dongia: req.body.dongia,
   mausac: req.body.mausac,
   loaisp: req.body.loaisp,
   hinhanh:req.body.hinhanh,
    
  }
  ListProducts.insertMany([data]) 
  res.redirect('/listproduct');
  alert("thêm sản phẩm thành công")
}
function updateRecord1(req, res) {
  ListProducts.findOneAndUpdate({_id:req.body.id},req.body,{new:true}).then(err=>{
    if(!err){
     
      console.log(err);
      res.render('product/addproduct.handlebars',{
          viewtitle: 'update User thất bại'
        })
    }else{
     
        res.redirect('/listproduct'),
        alert("sửa sản phẩm thành công")
       
    }

  }
  )
}
app.get("/edit1/:id", (req, res) => {
  ListProducts.findById(req.params.id).then((user) => {
    
          res.render('product/addproduct.handlebars', {
           
              titlesanpham:"Sửa Sản Phẩm",
              user:user.toJSON()
            });
      
    
  })
 
 
})


app.get("/del1/:id",async (req, res) => {
  try{
      const user = await ListProducts.findByIdAndDelete(req.params.id,req.body);
      if(!user) res.status(404).send("không tìm thấy item xóa");
      else{
        
          res.redirect("/listproduct");
      }
      res.status(200).send();

  }catch(error) {
      res.status(500).send(error);
  }
  });









module.exports = app;
