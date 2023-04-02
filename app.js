//   *******  CONNECTION  ********

const express = require('express')
const app = express()
app.set('view engine', 'ejs')
app.set('views', './views')

var mongoose = require('mongoose')
var bodyparser = require('body-parser')
app.use(bodyparser.json())
app.use(express.static('views'))
app.use(bodyparser.urlencoded({
  extended: true
}))

mongoose.connect("mongodb://localhost:27017/sivaDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

var db = mongoose.connection
db.on('error', () => console.log('connection error'))
db.once('open', () => {
  console.log("connected to db")
})


//   ********  staffPortal  ********

const staffPortalSchema = new mongoose.Schema({
  userid: String,
  password: String
})

const StaffPortal = mongoose.model("StaffPortal", staffPortalSchema);

const staff1 = new StaffPortal({
  userid: "Denver",
  password: "coming"

});
// staff1.save();




// const personSchema = new mongoose.Schema({
//   userid: String,
//   password: String
// })

// const Person = mongoose.model("Person", personSchema);

// const staff2 = new Person({
//   userid: "Denver",
//   password: "coming"

// });
// staff1.save();



//   ********  studentPortal  ********

const studentPortalSchema = new mongoose.Schema({
  regno: Number,
  stuname: String,
  dob: String,
  gender: String,
  citizen: String,
  mothertongue: String,
  fathername: String,
  mothername: String,
  rollno: String,
  stuphno: Number,
  parentphno: Number,
  email:String,
  abstotaldays:Number,
  cgpa:Number,
  arrear:Number,
  favstu:String

})



const StudentPortal = mongoose.model("StudentPortal", studentPortalSchema);

const student2 = new StudentPortal({
  regno: 312320205989,
  stuname: "Hasini",
  dob: "10-10-2002",
  gender: "FEMALE",
  citizen: "INDIAN",
  mothertongue: "TAMIL",
  fathername: "DENVER",
  mothername: "HERMONI",
  rollno: "20IT989",
  stuphno: 123456789,
  parentphno: 123456789,
  email:"hasini@gamil.com",
  abstotaldays:3,
  cgpa:9.8,
  arrear:0,
  favstu:"yes"

});
// student2.save();


//   ********  LEAVE  ********
const leaveSchema = new mongoose.Schema({
  mail: String,
  firstName: String,
  lastName: String,
  rollNo: String,
  ug_pg: String,
  course: String,
  year: Number,
  branch: String,
  section: String,
  totalDays: Number,
  lwlDays: Number,
  mlDays: Number,
  aDays: Number,
  plDays: Number,
  reason: String,
  proof: String,
  needDays: Number,
  fromDate: String,
  toDate: String
})

const Leave = mongoose.model("Leave", leaveSchema);


// <---- LEAVE INSERT ---->

app.post('/leaveform', (req, res) => {
  const leavet = new Leave({
    mail: req.body.gmail,
    firstName: req.body.fName,
    lastName: req.body.lName,
    rollNo: req.body.rollNo,
    ug_pg: req.body.ug,
    course: req.body.course,
    year: req.body.year,
    branch: req.body.branch,
    section: req.body.section,
    totalDays: req.body.totalDays,
    lwlDays: req.body.lwlDays,
    mlDays: req.body.mlDays,
    aDays: req.body.aDays,
    plDays: req.body.plDays,
    reason: req.body.reason,
    proof: req.body.file,
    needDays: req.body.need,
    fromDate: req.body.fromDate,
    toDate: req.body.toDate
  });
  Leave.insertMany([leavet])
    .then(function () {
      console.log("Successfully saved defult items to DB");
    })
    .catch(function (err) {
      console.log(err);
    });
  res.render('success', {})

});


// <---- LEAVE DISPLAY ---->

app.post('/leaverequest', async (req, res) => {
  try {
    var a = req.body.department;
    const leaves = await Leave.find({ branch: a });
    res.render('leaveDisplay', { leaves });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
});



// <---- ACCEPT,VERIFY,DELETE ---->

app.post('/hey33', async (req, res) => {
  var a = req.body.k1;
  var b = req.body.k2;
  var c = req.body.k3;
  var h = req.body.rolex;
  var r = req.body.dilli;



  if (a === "Verify") {
    try {
      
      const studentportals = await StudentPortal.find({ rollno: h });
      res.render('studentDisplay', { studentportals });
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal server error');
    }
  }

  if (b === "Reject") {
    try {
      const leaves = await Leave.find({ rollNo: h });
      res.render('rejection', { leaves });
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal server error');
    }



    // Leave.deleteOne({ rollNo: h })
    //   .then(result => {
    //     console.log("deleted successfully!!!");
    //   })
    //   .catch(err => {
    //     console.log(err);
    //   })


   
  }

  if (c === "Accept") {

    // <---- DAYS UPDATION ---->

    StudentPortal.find()
      .then((students) => {

        students.forEach(function (student) {
          if (student.rollno === h) {
   
            // console.log(parseInt(r) + parseInt(student.totaldays));
            StudentPortal.updateOne({ rollno: h }, { $set: { abstotaldays: parseInt(r) + parseInt(student.abstotaldays) } })
              .then(result => {
                console.log("updated successfully!!!");
              })
              .catch(err => {
                console.log(err);
              })

          }
        })
      })
      .catch((err) => {
        console.log(err);
      });



    // <---- FINAL PDF ---->

    try {
      const leaves = await Leave.find({ rollNo: h });
      res.render('final', { leaves });
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal server error');
    }




    // Leave.deleteOne({ rollNo: h })
    // .then(result => {
    //   console.log("deleted successfully!!!");
    // })
    // .catch(err => {
    //   console.log(err);
    // })
    


  }

});


// <---- STAFF VERIFICATION ---->

app.post('/staff_sign_up', (req, res) => {
  var a = req.body.sname;
  var b = req.body.pass;
  StaffPortal.find()
    .then((staffs) => {
      staffs.forEach(function (staff) {
        if (staff.userid === a && staff.password === b) {
          res.render('leaveRequest', {})
        }
      })
      var siva=true;
      res.render('staffLoginForm', {siva});
    })
    .catch((err) => {
      console.log(err);
    });
});


// <---- STUDENT VERIFICATION ---->

app.post('/student_sign_up', (req, res) => {
  var a = req.body.sname;
  var b = req.body.pass;

  StudentPortal.find()
    .then((students) => {

      students.forEach(function (student) {
   
        if (student.rollno === a && student.dob === b) {

          res.render('leaveForm', {})
        }

      })
      var siva=true;
      res.render('studentLoginForm', {siva});
    })

    .catch((err) => {
      console.log(err);

    });

});

// <---- STAFF CALL ---->
app.get('/staff', (req, res) => {
  error = 0;
  res.render('staffLoginForm', {})
})

// <---- STUDENT CALL ---->
app.get('/student', (req, res) => {
  error = 0;
  res.render('studentLoginForm', {})
})

//   ********  LOCAL SERVER  ********
app.listen(3001, function () {
  console.log("Server started on port 3001");
});