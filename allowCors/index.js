exports.handler = async (event) => {
    const response = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "*",
      },
      body: JSON.stringify("OK"),
    };
    return response;
  };
  