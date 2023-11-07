const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express()
const port = process.env.PORT || 5000

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0jdghld.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// req.queary
//client side
// const formattedDate = format(date, 'PP');
// fetch(`https://secret-atoll-02673.herokuapp.com/available?date=${formattedDate}`

// server side 
// app.get('/available', async (req, res) => {
//     const date = req.query.date;
// }
// req.queary

//req.peram
// client side
// const url = `http://localhost:5000/${hallName}/onRoom/${roomNo}`;
//server side
// app.get('/bHall/onRoom/:roomNo', async (req, res) => {
//     const roomNo = req.params.roomNo;
// } 
//req.peram

function verifyJWT(req, res, next) {

    //authHeader er value ta apatoto AllTeachers.js thake nisce
    //ei kaj korce
    // const { data: teachers, isLoading } = useQuery('teacher', () => fetch(url,{
    //     method: 'GET',
    //     headers: {
    //         'authorization': `Bearer ${localStorage.getItem('accessToken')}`  
    //     }
    // }).then(res => res.json()));
    //ei kaj korce
    const authHeader = req.headers.authorization;
    console.log('authorization', authHeader);

    if (!authHeader) {
        return res.status(401).send({ message: 'UnAuthorized access' })
    }

    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
        if (err) {
            return res.status(403).send({ message: 'Forbidden access' });
        }
        // decoded er modde login er email ta ase
        // email ta passe user er data jokhon mgdb te save kortece tar vitor jwt.sign() er vitor thake
        console.log('decoded', decoded);
        req.decoded = decoded;
        next();
    })
}

async function run() {
    try {
        await client.connect();
        console.log('Database connect')
        const bijoyHallTeachersCollection = client.db('b_hall').collection('teachers');
        const sdHallTeachersCollection = client.db('sd_hall').collection('teachers');
        const srHallTeachersCollection = client.db('sr_hall').collection('teachers');

        const bijoyHallOfficeMembersCollection = client.db('b_hall').collection('officeMembers');
        const sdHallOfficeMembersCollection = client.db('sd_hall').collection('officeMembers');
        const srHallOfficeMembersCollection = client.db('sr_hall').collection('officeMembers');

        const bijoyHallallStudentsCollection = client.db('b_hall').collection('allStudents');
        const sdHallallStudentsCollection = client.db('sd_hall').collection('allStudents');
        const srHallallStudentsCollection = client.db('sr_hall').collection('allStudents');

        const sdHallallStudentsApplicationCollection = client.db('sd_hall').collection('studentsApplication');
        const bijoyHallallStudentsApplicationCollection = client.db('b_hall').collection('studentsApplication');
        const srHallallStudentsApplicationCollection = client.db('sr_hall').collection('studentsApplication');


        const bijoyHallallRoomsCollection = client.db('b_hall').collection('allRooms');
        const sdHallallRoomsCollection = client.db('sd_hall').collection('allRooms');
        const srHallallRoomsCollection = client.db('sr_hall').collection('allRooms');

        const bijoyHallUsersCollection = client.db('b_hall').collection('users');
        const sdHallUsersCollection = client.db('sd_hall').collection('users');
        const srHallUsersCollection = client.db('sr_hall').collection('users');

        /** 
         * API Naming Convention
         * app.get('/booking') //get all bookings in this collection or get more than one or by filter
         * app.get('/booking/:id') //get a specific booking
         * app.post('/booking') // add a new booking
         * app.patch('/booking/:id') //patch a specific booking update
         * app.put('/booking/:id') //upsert ==> update (if exists data) or insert (if doesnot exist)
         * app.delete('/booking/:id') //patch a specific booking delete
        */

        //check admin
        const bjVerifyAdmin = async (req, res, next) => {
            const requester = req.decoded.email; //jtw decoded er maddome email ta astese
            const requesterAccount = await bijoyHallUsersCollection.findOne({ email: requester });
            if (requesterAccount.role === 'admin') {
                next();
            }
            else {
                res.status(403).send({ message: 'Forbidden access' });
            }
        }
        const sdVerifyAdmin = async (req, res, next) => {
            const requester = req.decoded.email; //jtw decoded er maddome email ta astese
            // console.log(requester)
            const requesterAccount = await sdHallUsersCollection.findOne({ email: requester });
            console.log(requesterAccount)
            if (requesterAccount.role === 'admin') {
                next();
                console.log('admin');
            }
            else {
                res.status(403).send({ message: 'Forbidden access' });
            }
        }
        const srVerifyAdmin = async (req, res, next) => {
            const requester = req.decoded.email; //jtw decoded er maddome email ta astese
            const requesterAccount = await srHallUsersCollection.findOne({ email: requester });
            if (requesterAccount.role === 'admin') {
                next();
            }
            else {
                res.status(403).send({ message: 'Forbidden access' });
            }
        }
        //check admin

        //All Teacher get 
        // amader ,env er token r localStorage er vitore je token ase ei 2 ta milasce == verifyJWT er maddome
        app.get('/sdHall/teachers', verifyJWT, async (req, res) => {
            const query = {}
            const cursor = sdHallTeachersCollection.find(query)
            const teachers = await cursor.toArray();
            res.send(teachers);
        })
        app.get('/bHall/teachers', verifyJWT, async (req, res) => {
            const query = {}
            const cursor = bijoyHallTeachersCollection.find(query)
            const teachers = await cursor.toArray();
            res.send(teachers);
        })
        app.get('/srHall/teachers', verifyJWT, async (req, res) => {
            const query = {}
            const cursor = srHallTeachersCollection.find(query)
            const teachers = await cursor.toArray();
            res.send(teachers);
        })
        //All Teacher get 

        //All Office Member get
        // amader ,env er token r localStorage er vitore je token ase ei 2 ta milasce == verifyJWT er maddome
        app.get('/sdHall/officeMembers', verifyJWT, async (req, res) => {
            const query = {}
            const cursor = bijoyHallOfficeMembersCollection.find(query)
            const offMem = await cursor.toArray();
            res.send(offMem);
        })
        app.get('/bHall/officeMembers', verifyJWT, async (req, res) => {
            const query = {}
            const cursor = sdHallOfficeMembersCollection.find(query)
            const offMem = await cursor.toArray();
            res.send(offMem);
        })
        app.get('/srHall/officeMembers', verifyJWT, async (req, res) => {
            const query = {}
            const cursor = srHallOfficeMembersCollection.find(query)
            const offMem = await cursor.toArray();
            res.send(offMem);
        })
        //All Office Member get



        //AllRooms get
        app.get('/sdHall/allRooms', async (req, res) => {
            const query = {}
            const cursor =  sdHallallRoomsCollection.find(query)
            const allRooms = await cursor.toArray();
            res.send(allRooms);
        })
        app.get('/bHall/allRooms', async (req, res) => {
            const query = {}
            const cursor = bijoyHallallRoomsCollection.find(query)
            const allRooms = await cursor.toArray();
            res.send(allRooms);
        })
        app.get('/srHall/allRooms', async (req, res) => {
            const query = {}
            const cursor = srHallallRoomsCollection.find(query)
            const allRooms = await cursor.toArray();
            res.send(allRooms);
        })

        //AllRooms get

        //for eatch room get students
        //Client site e (req.params.roomNo) er jonno
        //prodhan kaj req.params er jonno
        // const url = `http://localhost:5000/${hallName}/onRoom/${roomNo}`;
        //prodhan kaj req.params er jonno
        // useEffect(() => {
        //     fetch(url)
        //         .then(res => res.json())
        //         .then(data => {
        //             console.log(data);
        //             setOnRoom(data)
        //         })
        // }, [roomNo])
        //Client site e (req.params.roomNo) er jonno 

        app.get('/bHall/onRoom/:roomNo', async (req, res) => {
            const roomNo = req.params.roomNo; //req.params er maan jekhan thake astese `http://localhost:5000/${hallName}/onRoom/${roomNo}
            console.log(roomNo);
            const filter = { roomNum: roomNo }
            const student = await bijoyHallallStudentsCollection.find(filter).toArray();

            res.send(student);
        })
        app.get('/sdHall/onRoom/:roomNo', async (req, res) => {
            const roomNo = req.params.roomNo;
            console.log(roomNo);
            const filter = { roomNum: roomNo }
            const student = await sdHallallStudentsCollection.find(filter).toArray();

            res.send(student);
        })
        app.get('/srHall/onRoom/:roomNo', async (req, res) => {
            const roomNo = req.params.roomNo;
            console.log(roomNo);
            const filter = { roomNum: roomNo }
            const student = await srHallallStudentsCollection.find(filter).toArray();

            res.send(student);
        })
        //for eatch room get students


        //user data (email & name) save on mgdb

        //req.body er jonno client site e
        // const userInfo = {
        //     email : data.email,
        //     name : data.displayName,
        // }
        // console.log("userInfo",userInfo)

        // fetch('http://localhost:5000/userInfo',{
        //     method : 'POST',
        //     headers: {'Content-Type': 'application/json'},
        //     body: JSON.stringify(userInfo)
        // })
        // .then(res => res.json())
        // .then(data => {
        //     console.log('insert success')
        //req.body er jonno client site e
        //post korle eki user bar bar mgdb e save hoye jasse tai put bebohar korbo
        // app.post('/userInfo', async (req, res) => {
        //     const user = req.body;
        //     const result = await sdHallUsersCollection.insertOne(user)
        //     res.send(result);
        // })


        //user data base e save kortece users collection e jate user duplicate na hoy sei jonno post na kore put korlam 

        //client site e hook er vitore useToken.js e link ta fetch kortece
        app.put('/bHall/user/:email', async (req, res) => {
            const email = req.params.email;
            const user = req.body;
            const filter = { email: email };
            //option er kaj holo
            //user ta mgdb te already ase kina seta check korbe
            //jothy thake tahole upsate: false hobe r na thakle upsate ture thakbe
            const options = { upsert: true };
            const updateDoc = {
                $set: user,
            }
            const result = await bijoyHallUsersCollection.updateOne(filter, updateDoc, options);
            const token = jwt.sign({ email: email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' })
            console.log(token);
            res.send({ result, token });
        });
        app.put('/sdHall/user/:email', async (req, res) => {
            const email = req.params.email;
            const user = req.body;
            const filter = { email: email };
            const options = { upsert: true };
            const updateDoc = {
                $set: user,
            }
            const result = await sdHallUsersCollection.updateOne(filter, updateDoc, options);
            //nicher email ta upore verifyJWT function er vitore req.decoded = decoded er maddome oykhane passe
            const token = jwt.sign({ email: email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' })
            console.log(token);
            res.send({ result, token });
        });

        app.put('/srHall/user/:email', async (req, res) => {
            const email = req.params.email;
            const user = req.body;
            const filter = { email: email };
            const options = { upsert: true };
            const updateDoc = {
                $set: user,
            }
            const result = await srHallUsersCollection.updateOne(filter, updateDoc, options);
            const token = jwt.sign({ email: email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' })
            console.log(token);
            res.send({ result, token });
        });

        //user data (email & name) save on mgdb

        //All users payor jonno
        app.get('/bHall/users', verifyJWT, async (req, res) => {
            const query = {}
            const cursor = bijoyHallUsersCollection.find(query)
            const allUsers = await cursor.toArray();
            res.send(allUsers);
        });
        app.get('/sdHall/users', verifyJWT, async (req, res) => {
            const query = {}
            const cursor = sdHallUsersCollection.find(query)
            const allUsers = await cursor.toArray();
            res.send(allUsers);
        });
        app.get('/srHall/users', verifyJWT, async (req, res) => {
            const query = {}
            const cursor = srHallUsersCollection.find(query)
            const allUsers = await cursor.toArray();
            res.send(allUsers);
        });
        // All users payor jonno


        //user make admin and save (roll:'admin') data mgdb

        app.put('/bHall/user/admin/:email', verifyJWT, bjVerifyAdmin, async (req, res) => {
            const email = req.params.email; //ei email ta hosse kake admin kortece seita (admin button er maddome)

            //bjVerifyAdmin torir age
            //email ta pasce verifyJWT er thake.
            // r verifyJWT passe user er data jokhon mgdb te save kortece tar vitor jwt.sign() er vitor thake
            // const requester = req.decoded.email; //ei email ta hosse akhon je user ta login hoye ase sei email ta
            // const requesterAccount = await bijoyHallUsersCollection.findOne({ email: requester });
            // console.log(requesterAccount);
            // if (requesterAccount.roll === 'admin') {
            //     const filter = { email: email };
            //     const updateDoc = {
            //         $set: { roll: 'admin' },
            //     }
            //     const result = await bijoyHallUsersCollection.updateOne(filter, updateDoc);
            //     res.send(result);
            // }
            // else {
            //     res.status(403).send({ message: 'forbidden' })
            // }
            //bjVerifyAdmin torir age

            const filter = { email: email };
            const updateDoc = {
                $set: { roll: 'admin' },
            }
            const result = await bijoyHallUsersCollection.updateOne(filter, updateDoc);
            res.send(result);

        });

        app.put('/sdHall/user/admin/:email', verifyJWT, sdVerifyAdmin, async (req, res) => {
            const email = req.params.email;

            // const requester = req.decoded.email; //ei email ta hosse akhon je user ta login hoye ase sei email ta
            // const requesterAccount = await sdHallUsersCollection.findOne({ email: requester });
            // if (requesterAccount.roll === 'admin') {
            //     const filter = { email: email };
            //     const updateDoc = {
            //         $set: { roll: 'admin' },
            //     }
            //     const result = await sdHallUsersCollection.updateOne(filter, updateDoc);
            //     res.send(result);
            // }
            // else {
            //     res.status(403).send({ message: 'forbidden' })
            // }

            const filter = { email: email };
            const updateDoc = {
                $set: { roll: 'admin' },
            }
            const result = await sdHallUsersCollection.updateOne(filter, updateDoc);
            res.send(result);

        });

        app.put('/srHall/user/admin/:email', verifyJWT, srVerifyAdmin, async (req, res) => {
            const email = req.params.email;

            // const requester = req.decoded.email; //ei email ta hosse akhon je user ta login hoye ase sei email ta
            // const requesterAccount = await srHallUsersCollection.findOne({ email: requester });
            // if (requesterAccount.roll === 'admin') {
            //     const filter = { email: email };
            //     const updateDoc = {
            //         $set: { roll: 'admin' },
            //     }
            //     const result = await srHallUsersCollection.updateOne(filter, updateDoc);
            //     res.send(result);
            // }
            // else {
            //     res.status(403).send({ message: 'forbidden' })
            // }

            const filter = { email: email };
            const updateDoc = {
                $set: { roll: 'admin' },
            }
            const result = await srHallUsersCollection.updateOne(filter, updateDoc);
            res.send(result);

        });

        //user make admin and save data mgdb

        // check admin roll 

        app.get('/bHall/admin/:email', async (req, res) => {
            const email = req.params.email;
            const user = await bijoyHallUsersCollection.findOne({ email: email });
            const isAdmin = user?.roll === 'admin';
            res.send({ admin: isAdmin })
        })
        app.get('/sdHall/admin/:email', async (req, res) => {
            const email = req.params.email;
            const user = await sdHallUsersCollection.findOne({ email: email });
            const isAdmin = user.roll === 'admin';
            res.send({ admin: isAdmin })
        })
        app.get('/srHall/admin/:email', async (req, res) => {
            const email = req.params.email;
            const user = await srHallUsersCollection.findOne({ email: email });
            const isAdmin = user.roll === 'admin';
            res.send({ admin: isAdmin })
        })

        // check admin roll


        //allStudent info data set/save mgdb
        app.post('/sdHall/addStudent', verifyJWT, async (req, res) => {
            const student = req.body;
            const query = { rollNumber: student.rollNumber }
            const exists = await sdHallallStudentsCollection.findOne(query);
            if (exists) {
                return res.send({ success: false, student: exists })
            }
            const result = await sdHallallStudentsCollection.insertOne(student); //obossoy await korte hobe
            return res.send({ success: true, result });
        })

        app.post('/bHall/addStudent',verifyJWT,  async (req, res) => {
            const student = req.body;
            const query = { rollNumber: student.rollNumber }
            const exists = await bijoyHallallStudentsCollection.findOne(query);
            if (exists) {
                return res.send({ success: false, student: exists })
            }
            const result = await bijoyHallallStudentsCollection.insertOne(student); //obossoy await korte hobe
            return res.send({ success: true, result });
        })

        app.post('/srHall/addStudent', verifyJWT, srVerifyAdmin, async (req, res) => {
            const student = req.body;
            const query = { rollNumber: student.rollNumber }
            const exists = await srHallallStudentsCollection.findOne(query);
            if (exists) {
                return res.send({ success: false, student: exists })
            }
            const result = await srHallallStudentsCollection.insertOne(student); //obossoy await korte hobe
            return res.send({ success: true, result });
        })
        //student info data send mgdb

        //All Students get
        app.get('/sdHall/allStudents', async (req, res) => {
            const query = {}
            const cursor = sdHallallStudentsCollection.find(query)
            const allStudents = await cursor.toArray();
            res.send(allStudents);
        })
        app.get('/bHall/allStudents', async (req, res) => {
            const query = {}
            const cursor = bijoyHallallStudentsCollection.find(query)
            const allStudents = await cursor.toArray();
            res.send(allStudents);
        })
        app.get('/srHall/allStudents', async (req, res) => {
            const query = {}
            const cursor = srHallallStudentsCollection.find(query)
            const allStudents = await cursor.toArray();
            res.send(allStudents);
        })
        //All Students get


        //update ta korte giye problem hosse onek vabe try korce hosse na
        //ei khane somossa hosce ami sudu id ta niye tarpor check kortecelam (use peram er maddome)
        //kintu ami puro student er information nite partecelam kintu nei ni bole pblm hoscelo
        //ami chascelam id diye milaye information nite tai parini
        //
        //Update er jonno student khuja id sahajje mgdb thake
        // app.get('/bHall/student/:id', async (req, res) => {
        //     var id = req.params.id;
        //     console.log(id);
        //     var filter = { _id: ObjectId(id) }
        //     var student = await bijoyHallallStudentsCollection.findOne(filter);
        //     // const studentInfo = await student.toArray();
        //     console.log(student);
        //     res.send({student});

        // })
        //Update er jonno student khuja id sahajje mgdb thake

        //save data update student Information
        app.patch('/sdHall/updateStudent/:rollNumber', async (req, res) => {
            const studentRoll = req.params.rollNumber;
            const studentInfo = req.body
            console.log(studentInfo)
            const filter = {rollNumber: studentInfo.rollNumber}
            const updatedDoc = {
                $set:{
                    name: studentInfo.name,
                    dept: studentInfo.dept,
                    rollNumber: studentInfo.rollNumber,
                    bedNum: studentInfo.bedNum
  
                }
            }
            const updatedStudent = await sdHallallStudentsCollection.updateOne(filter, updatedDoc);
            res.send(updatedStudent)
        })
        app.patch('/bHall/updateStudent/:rollNumber', async (req, res) => {
            const studentRoll = req.params.rollNumber;
            const studentInfo = req.body
            console.log(studentInfo)
            const filter = {rollNumber: studentInfo.rollNumber}
            const updatedDoc = {
                $set:{
                    name: studentInfo.name,
                    dept: studentInfo.dept,
                    rollNumber: studentInfo.rollNumber,
                    bedNum: studentInfo.bedNum
  
                }
            }
            const updatedStudent = await bijoyHallallStudentsCollection.updateOne(filter, updatedDoc);
            res.send(updatedStudent)
        })
        app.patch('/srHall/updateStudent/:rollNumber', async (req, res) => {
            const studentRoll = req.params.rollNumber;
            const studentInfo = req.body
            console.log(studentInfo)
            const filter = {rollNumber: studentInfo.rollNumber}
            const updatedDoc = {
                $set:{
                    name: studentInfo.name,
                    dept: studentInfo.dept,
                    rollNumber: studentInfo.rollNumber,
                    bedNum: studentInfo.bedNum
  
                }
            }
            const updatedStudent = await srHallallStudentsCollection.updateOne(filter, updatedDoc);
            res.send(updatedStudent)
        })
        //save data update student Information


        // delete Student

        app.delete('/sdHall/student/:rollNumber', verifyJWT, async (req, res) => {
            const rollNumber = req.params.rollNumber;
            const filter = {rollNumber: rollNumber};
            const result = await sdHallallStudentsCollection.deleteOne(filter);
            res.send(result);
          })

        app.delete('/bHall/student/:rollNumber', verifyJWT, async (req, res) => {
           const rollNumber = req.params.rollNumber;
           const filter = {rollNumber: rollNumber};
           const result = await bijoyHallallStudentsCollection.deleteOne(filter);
           res.send(result);
         })
        app.delete('/srHall/student/:rollNumber', verifyJWT, async (req, res) => {
           const rollNumber = req.params.rollNumber;
           const filter = {rollNumber: rollNumber};
           const result = await srHallallStudentsCollection.deleteOne(filter);
           res.send(result);
         })

        // delete Student

        //AllAplication Post
        app.post('/sdHall/studentApplication', async (req, res) => {
            const studentApplication = req.body;
            console.log("studentApplication", studentApplication);
            // const query = { rollNumber: student.rollNumber }
            // const exists = await sdHallallStudentsCollection.findOne(query);
            // if (exists) {
            //     return res.send({ success: false, student: exists })
            // }
            const result = await sdHallallStudentsApplicationCollection.insertOne(studentApplication); //obossoy await korte hobe
            return res.send({ success: true, result });
        })
        app.post('/bHall/studentApplication', async (req, res) => {
            const studentApplication = req.body;
            console.log("studentApplication", studentApplication);
            // const query = { rollNumber: student.rollNumber }
            // const exists = await sdHallallStudentsCollection.findOne(query);
            // if (exists) {
            //     return res.send({ success: false, student: exists })
            // }
            const result = await bijoyHallallStudentsApplicationCollection.insertOne(studentApplication); //obossoy await korte hobe
            return res.send({ success: true, result });
        })
        app.post('/srHall/studentApplication', async (req, res) => {
            const studentApplication = req.body;
            console.log("studentApplication", studentApplication);
            // const query = { rollNumber: student.rollNumber }
            // const exists = await sdHallallStudentsCollection.findOne(query);
            // if (exists) {
            //     return res.send({ success: false, student: exists })
            // }
            const result = await srHallallStudentsApplicationCollection.insertOne(studentApplication); //obossoy await korte hobe
            return res.send({ success: true, result });
        })
        //AllAplication Post


        //AllAplication Get
        app.get('/sdHall/studentApplication', async (req, res) => {
            const query = {}
            const cursor = sdHallallStudentsApplicationCollection.find(query)
            const allAplication = await cursor.toArray();
            res.send(allAplication);
        })
        app.get('/bHall/studentApplication', async (req, res) => {
            const query = {}
            const cursor = bijoyHallallStudentsApplicationCollection.find(query)
            const allAplication = await cursor.toArray();
            res.send(allAplication);
        })
        app.get('/srHall/studentApplication', async (req, res) => {
            const query = {}
            const cursor = srHallallStudentsApplicationCollection.find(query)
            const allAplication = await cursor.toArray();
            res.send(allAplication);
        })
        //AllAplication Get


        //Search Student
        app.get('/sdHall/student/:search', async (req, res) => {
            const rollNumber = req.params.search;
            console.log(rollNumber);
                        
            res.send(rollNumber)
          })
        //Search Student


    }
    finally {

    }
}

run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Hello From Hall Management!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})