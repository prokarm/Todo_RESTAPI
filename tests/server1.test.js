const expect = require('expect');
const supertest = require('supertest');

const {app}=require('./../server/server1.js');
const {todo}=require('./../server/models/todo-model.js')
const {User}=require('./../server/models/user-model.js');

beforeEach((done)=>{
  User.remove({}).then(()=>done());

});
beforeEach((done)=>{
  todo.remove({}).then(()=>done());
});

describe('/post test',()=>{
   it('sholud perform post well',(done)=>{

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

    it('should add data to todo collection correctly',(done)=>{
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
        todo.find({}).then((todo)=>{
          expect(todo.length).toBe(1);
          expect(todo[0].text).toBe(textdata);
          done();
        }).catch((e)=>done(e))
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
            expect(todo.length).toBe(0);
            done();
          }).catch((e)=>done(e))
        });
        
    });

});
