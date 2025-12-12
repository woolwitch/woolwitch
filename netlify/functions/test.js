exports.handler = async (event, context) => {
  console.log('Function called');
  
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
      message: 'Hello World!',
      time: new Date().toISOString()
    })
  };
};