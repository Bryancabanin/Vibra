import React from 'react';
import axios from 'axios';

const handleCallback = async () => {
  try {
    const response = await axios.get('http://localhost:8080/access-token', {
      withCredentials: true,
    });

    console.log(response.data.accessToken);
  } catch {
    console.error('Error fetching access token');
  }
};

const Dashboard: React.FC = () => {
  return (
    <div>
      <h1>Dashboard</h1>
      <button onClick={() => handleCallback()}>Get Access Token</button>
    </div>
  );
};
export default Dashboard;
