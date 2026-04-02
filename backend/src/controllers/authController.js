export const adminLogin = (req, res) => {
  const { email, password } = req.body;

  // simple hardcoded login
  if (email === "admin@gmail.com" && password === "123456") {
    return res.json({
      success: true,
      token: "dummy-token"
    });
  }

  res.status(401).json({
    success: false,
    message: "Invalid credentials"
  });
};