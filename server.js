const express = require('express');
const app = express();
const HTTP_PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

const crewMembers = [
  {
    id: 1,
    name: "Monkey D. Luffy",
    role: "Captain",
    bounty: 3000000000,
    devilFruit: "Hito Hito no Mi, Model: Nika",
    status: "active",
  },
  {
    id: 2,
    name: "Roronoa Zoro",
    role: "Swordsman",
    bounty: 1111000000,
    devilFruit: "None",
    status: "active",
  },
  {
    id: 3,
    name: "Nami",
    role: "Navigator",
    bounty: 366000000,
    devilFruit: "None",
    status: "active",
  },
  {
    id: 4,
    name: "Usopp",
    role: "Sniper",
    bounty: 500000000,
    devilFruit: "None",
    status: "active",
  },
  {
    id: 5,
    name: "Vinsmoke Sanji",
    role: "Cook",
    bounty: 1032000000,
    devilFruit: "None",
    status: "active",
  },
  {
    id: 6,
    name: "Tony Tony Chopper",
    role: "Doctor",
    bounty: 1000,
    devilFruit: "Hito Hito no Mi",
    status: "inactive",
  },
  {
    id: 7,
    name: "Nico Robin",
    role: "Archaeologist",
    bounty: 930000000,
    devilFruit: "Hana Hana no Mi",
    status: "active",
  },
  {
    id: 8,
    name: "Franky",
    role: "Shipwright",
    bounty: 394000000,
    devilFruit: "None",
    status: "active",
  },
  {
    id: 9,
    name: "Brook",
    role: "Musician",
    bounty: 383000000,
    devilFruit: "Yomi Yomi no Mi",
    status: "active",
  },
  {
    id: 10,
    name: "Jinbe",
    role: "Helmsman",
    bounty: 1100000000,
    devilFruit: "None",
    status: "active",
  },
];

app.use(express.static('public'));

app.use(express.urlencoded({ extended: true }));


// Task 2.1: Request Logger
app.use((req, res, next) => {
    const logString = `Request from: ${req.headers['user-agent']} at ${new Date().toLocaleString()}`;
    console.log(logString);
    req.log = logString;
    next();
});

// Task 2.2: Route-Restricting Middleware
const verifyBounty = (req, res, next) => {
    const pass = Math.floor(Math.random() * 2);
    if (pass === 1) {
        next();
    } else {
        res.status(403).send("403 - The Marines have blocked your path. Turn back.");
    }
};

// Task 2.4: Error-Handling Middleware 
const errorHandler = (err, req, res, next) => {
    res.status(500).send(`500 - Something went wrong on the Thousand Sunny: ${err.message}`);
};

// Task 3.2: Home Page: Crew Cards
app.get('/', (req, res) => {
    res.render('index', { crew: crewMembers, title: 'The Crew' });
});

// Task 3.3: Crew Table Page
app.get('/crew', (req, res) => {
    res.render('crew', { crew: crewMembers, title: 'Crew Roster' });
});

// Task 3.4: Recruit Application Form
app.get('/recruit', (req, res) => {
    res.render('recruit', { title: 'Join the Crew', errors: null, success: false });
});

app.post('/recruit', (req, res) => {
    const { applicantName, skill, role, message, sea, agreeTerms } = req.body;
    let errors = [];

    if (!applicantName || applicantName.trim() === "") errors.push("Name is required.");
    if (!skill || skill.trim() === "") errors.push("Skill is required.");
    if (!role || role === "Select a role") errors.push("Please select a valid role.");
    if (!message || message.trim() === "") errors.push("Message is required.");
    if (!sea) errors.push("Please select a sea.");
    if (!agreeTerms) errors.push("You must agree to the risks.");

    if (errors.length > 0) {
        return res.render('recruit', { title: 'Join the Crew', errors, success: false });
    }

    crewMembers.push({
        name: applicantName,
        role: role,
        bounty: 0,
        devilFruit: "Unknown",
        status: "pending"
    });

    res.render('recruit', { title: 'Join the Crew', errors: null, success: true });
});

// Task 3.5: Log Pose (Restricted Route)
app.get('/log-pose', verifyBounty, (req, res) => {
    res.render('logPose', { crew: crewMembers, log: req.log, title: 'Secret Log Pose' });
});

app.get('/error-test', (req, res) => {
    throw new Error("Engine malfunction!");
});

// Task 2.3: 404 Handler
app.use((req, res) => {
    res.status(404).render('404', { message: "404 - We couldn't find what you're looking for on the Grand Line.", title: 'Lost at Sea' });
});

app.use(errorHandler);


app.listen(HTTP_PORT, () => {
  console.log(`server listening on: ${HTTP_PORT}`);
});