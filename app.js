const express = require("express");
const app = require("express");
app.use(express.json());

const userRouter = require("./routes/userRoutes");

// app.post('/', (req,res)=>{
//   res.send('hello ')
// })

const getAllUsers = (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      tours,
    },
  });
};
const getUser = (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      tours,
    },
  });
};
// app.get('/api/users',getAllUsers);
// app.post('/api/users/:id',getUser);

// app
// .route('/api/v1/users')
// .get(getAllUsers)
// app
// .route('api/v1/users/:id')
// .post(getUser)
// app.use("/api/v1/users", userRouter);

app.listen(3000, () => {
  console.log(`App running on port 3000...`);
});
module.exports = app;
