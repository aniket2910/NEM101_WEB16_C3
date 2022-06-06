const express = require("express");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");

const PORT = process.env.PORT || 8080;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World");
});

// To create User
app.post("/user/create", (req, res) => {
  fs.readFile("./db.json", { encoding: "utf-8" }, (err, data) => {
    let parsed = JSON.parse(data);
    // if(req.body)
    // console.log(req.body.role);
    // if (req.body.role === "voter") {
    let id = uuidv4();
    parsed.users = [...parsed.users, { ...req.body, id: id }];
    fs.writeFile("./db.json", JSON.stringify(parsed), (err, data) => {
      res.status(201).end(JSON.stringify({ status: "user created", id }));
    });
    // }
    // else if (req.body.role === "candidate") {
    //   parsed.users = [...parsed.users, { ...req.body, id: uuidv4() }];
    //   fs.writeFile("./db.json", JSON.stringify(parsed), (err, data) => {
    //     res.status(201).end(JSON.stringify({status: "user created",  }));
    //   });
    // }
  });
});

// For Login User
app.post("/user/login", (req, res) => {
  if (req.body.username == undefined || req.body.password == undefined) {
    res
      .status(400)
      .end(JSON.stringify({ status: "please provide username and password" }));
    return;
  }
  fs.readFile("./db.json", { encoding: "utf-8" }, (err, data) => {
    let parsed = JSON.parse(data);
    let user = parsed.users.filter((item) => {
      return (
        item.username == req.body.username &&
        item.password === req.body.password
      );
    });
    if (user.length == 1) {
      let mapped = parsed.users.map((item) => {
        return item.username == req.body.username &&
          item.password === req.body.password
          ? { ...item, token: "qwertyuiop" }
          : item;
      });
      parsed.users = [...mapped];
      fs.writeFile("./db.json", JSON.stringify(parsed), (err, data) => {
        res.end(
          JSON.stringify({ status: "Login Successful", token: "qwertyuiop" })
        );
      });
    } else {
      res.status(401).end(JSON.stringify({ status: "Invalid Credentials" }));
    }
  });
});

// To Logout
app.post("/user/logout", (req, res) => {
  fs.readFile("./db.json", { encoding: "utf-8" }, (err, data) => {
    let parsed = JSON.parse(data);
    let user = parsed.users.map((item) => {
      return item.token != undefined
        ? {
            name: item.name,
            age: item.age,
            role: item.role,
            username: item.username,
            password: item.password,
            id: item.id,
          }
        : item;
    });
    parsed.users = [...user];
    fs.writeFile("./db.json", JSON.stringify(parsed), (err, data) => {
      res.end(JSON.stringify({ status: "user logged out successfully" }));
    });
  });
});

// List all candidate by party
app.get("/votes/party/:party", (req, res) => {
  fs.readFile("./db.json", { encoding: "utf-8" }, (err, data) => {
    let parsed = JSON.parse(data);
    let user = parsed.users.filter((item) => {
      return item.party == req.params.party && item;
    });
    // console.log(user);
    res.end(JSON.stringify(user));
  });
});

// List of All voters
app.get("/votes/voters", (req, res) => {
  fs.readFile("./db.json", { encoding: "utf-8" }, (err, data) => {
    let parsed = JSON.parse(data);
    let user = parsed.users.filter((item) => {
      return item.role == "voter";
    });
    // console.log(user);
    res.end(JSON.stringify(user));
  });
});

// Vote a candidate
app.post("/votes/vote/:user", (req, res) => {
  fs.readFile("./db.json", { encoding: "utf-8" }, (err, data) => {
    let parsed = JSON.parse(data);
    let user = parsed.users.map((item) => {
      return item.name == req.params.user
        ? { ...item, votes: item.votes + 1 }
        : item;
    });
    parsed.users = [...user];
    fs.writeFile("./db.json", JSON.stringify(parsed), (err, data) => {
      res.end(JSON.stringify({ status: "Voted Succesfully" }));
    });
  });
});

// Total count of candidate
app.get("/votes/count/:user", (req, res) => {
  fs.readFile("./db.json", { encoding: "utf-8" }, (err, data) => {
    let parsed = JSON.parse(data);
    let user = parsed.users.filter((item) => {
      return item.name == req.params.user;
    });
    if (user.length == 1) {
      res.end(JSON.stringify({ status: user[0].votes }));
    } else {
      res.end(JSON.stringify({ status: "cannot find user" }));
    }
  });
});

// List the DB
app.get("/db", (req, res) => {
  fs.readFile("./db.json", { encoding: "utf-8" }, (err, data) => {
    res.end(data);
  });
});

//Create data in DB
app.post("/db", (req, res) => {
  fs.readFile("./db.json", { encoding: "utf-8" }, (err, data) => {
    let parsed = JSON.parse(data);
    let id = uuidv4();
    parsed.users = [...parsed.users, { ...req.body, id: id }];
    fs.writeFile("./db.json", JSON.stringify(parsed), (err, data) => {
      res.status(201).end(JSON.stringify({ status: "user created", id }));
    });
  });
});
app.listen(PORT, () => {
  console.log("Server is running on http://localhost:8080");
});
