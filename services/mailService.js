const fetch = require('node-fetch');

exports.sendThresholdNotification = async (email, translationsCount) => {
  const url = 'https://mail-sender-api1.p.rapidapi.com/';
  const options = {
    method: 'POST',
    headers: {
      'x-rapidapi-key': 'ea86ec0756msh17e532df1e1c9c9p170c20jsnebad0933d91c',
      'x-rapidapi-host': 'mail-sender-api1.p.rapidapi.com',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      sendto: email,  
      name: 'Translation Quota Alert',
      replyTo: 'sb1974660@gmail.com', 
      ishtml: 'false',
      title: `Translation Quota Reached: ${translationsCount}`,  
      body: `You have reached ${translationsCount} translations. Please top up your account to continue using the service.`
    })
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`Failed to send email: ${response.statusText}`);
    }
    const result = await response.text();
    console.log(`Email sent successfully: ${result}`);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};
