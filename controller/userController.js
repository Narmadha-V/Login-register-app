exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This user is not yet defined!'
  });
};