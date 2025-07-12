// Error Response Helper
const errorResponse = (res, message, statusCode = 500) => {
  return res.status(statusCode).json({
    success: false,
    message: message
  });
};

// Success Response Helper
const successResponse = (res, message, data = null, statusCode = 200) => {
  const response = {
    success: true,
    message: message
  };
  
  if (data !== null) {
    response.data = data;
  }
  
  return res.status(statusCode).json(response);
};

module.exports = {
  errorResponse,
  successResponse
}; 