const expect = require('expect');
const supertest = require('supertest');
const {ObjectID}=require('mongodb');

const {app}=require('./../server/server1.js');
const {todo}=require('./../server/models/todo-model.js')
const {User}=require('./../server/models/user-model.js');

todo_data=[{
  _id:new ObjectID() ,  //creating id  manually
  text:'study nodejs'
},
{
  _id:new ObjectID(),
  text:'watcing movie'
}];
//deleting every data before testing for todo
beforeEach((done)=>{
  User.remove({}).then(()=>done());

});
//deleting every data before testing for todo
beforeEach((done)=>{
  todo.remove({}).then(()=>{

   return todo.insertMany(todo_data);
 }).then(()=>done());
});



describe('/post test',()=>{

   it('sholud add data to users',(done)=>{

    //  var text= 'Akash is my friend';
    //  var dummy_age=33;
    var namea='golu';
          supertest(app)
          .post('/User')
          .send({namea})
          .expect(200)
          .expect((res)=>{
            expect(res.body.name).toBe(namea);
            // expect(res.body.age).teBe(dummy_age);

          })
          .end((err,res)=>{
            if(err)
            {
              return done(err);
            }
             User.find({}).then((todos)=>{
                 expect(todos.length).toBe(1);
                expect(todos[0].name).toBe(namea);
                done();
             }).catch((e)=>done(e));
          });
   });

    it('should add data to todo',(done)=>{
       var textdata = 'i love my life';
      supertest(app)
      .post('/about')
      .send({textdata})
      .expect(200)
      .expect((res)=>{
        expect(res.body.text).toBe(textdata);
      })
      .end((err,res)=>{
        if(err){
          return done(err);
        }
        todo.find({text:textdata}).then((todo)=>{
          expect(todo.length).toBe(1);
          expect(todo[0].text).toBe(textdata);
          done();
        }).catch((e)=>done(e));

      });


    });

    it('can\'t add an invalid data',(done)=>{

        supertest(app)
        .post('/about')
        .send({})
        .expect(400)
        .end((err,res)=>{
          if (err) {
            done(err);
          }
          todo.find({}).then((todo)=>{
            expect(todo.length).toBe(2);
            done();
          }).catch((e)=>done(e))
        });

    });



});



describe('/Get Routes',()=>{

  it('should get all data from todos',(done)=>{
      supertest(app)
      .get('/about')
      .expect(200)
      .expect((res)=>{
      todo.find().then((todos)=>{
        // console.log(todos);
        expect(res.body.todo.length).toBe(2);
      });
      })
      .end(done);

  });//end it



}); //end describe


describe('GET todo/:id tests',()=>{

  it('should check  id and return the correct one from database ',(done)=>{

      //  since we need an id ,for that we  will create an custom id with the help of the ObjectID as in mongodb id is
      //  created automatically
      supertest(app)
      .get(`/about/${todo_data[0]._id.toHexString()}`)
      .expect(200)
      .expect((res)=>{
         expect(res.body.tododata.text).toBe(todo_data[0].text);  //tododata is what we sended back which is defined in the server routes  of server file
      })
      .end(done);
  });//end it

  it('should return 404 for id which is not present in the db',(done)=>{

       var Hexid = new ObjectID().toHexString();

       supertest(app)
      .get(`/about/${Hexid}`)
      .expect(404)
      .end(done);
  });//end it

  it('should retrun 404 for invalid url',(done)=>{

        supertest(app)
        .get(`/about/1234`)
        .expect(404)
        .end(done);
  });//end it
});//end describe
