import React from 'react';
import { useLocation } from 'react-router-dom';

const Confirmation = () => {
  const location = useLocation();
  const emailSent = location.state?.emailSent ?? true;

  return (
    <div>
      <h1>Thank you for your submission!</h1>
      <p>Your data has been successfully saved.</p>
      {!emailSent && (
        <p>There was an issue sending the confirmation email. Please check your submission details on your account page.</p>
      )}
    </div>
  );
};

export default Confirmation;