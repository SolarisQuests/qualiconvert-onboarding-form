import React, { useState, useEffect } from 'react';
import { Button } from "./ui/Button";
import { Label } from "./ui/Label";
import { Input } from "./ui/Input";
import { useNavigate } from 'react-router-dom';

const FinalStep = ({ formData, updateFormData, nextStep, prevStep }) => {
  const [agreed, setAgreed] = useState(false);
  const [agreed2, setAgreed2] = useState(false);
  const [mathProblem, setMathProblem] = useState({ num1: 0, num2: 0, answer: '' });
  const [userAnswer, setUserAnswer] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (agreed) {
      generateMathProblem();
    }
  }, [agreed]);

  const generateMathProblem = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    setMathProblem({ num1, num2, answer: (num1 + num2).toString() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    let emailSent = true;
    try {
      // Save data to the database
      await saveDataToDatabase();

      // Attempt to send email, but don't wait for it
      await sendEmail();

      // Navigate to the confirmation page
      navigate('/confirmation', { state: { emailSent } });
    } catch (error) {
      console.error('Error:', error);
      if (error.message.includes('email')) {
        emailSent = false;
      } else {
        setError('An error occurred while saving your data. Please try again.');
        return;
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-4 font-display">Review & Submit</h2>
      <p className="mb-8 text-gray-600">
        Thank you for completing your Onboarding Form. Our team will review and be in touch on
        next steps. We are excited to have you join the Qualiconvert family.
      </p>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="terms"
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300"
              required
            />
          </div>
          <Label htmlFor="terms" className="ml-2 text-sm">
            By electronically executing this agreement, you agree to all of the above{' '}
            <a href="https://onboarding.qualiconvert.com/terms" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              terms and conditions
            </a>
          </Label>
        </div>
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="privacy"
              type="checkbox"
              checked={agreed2}
              onChange={(e) => setAgreed2(e.target.checked)}
              className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300"
              required
            />
          </div>
          <Label htmlFor="privacy" className="ml-2 text-sm">
            By electronically executing this agreement, you agree to all of the above{' '}
            <a href="https://onboarding.qualiconvert.com/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
             Privacy Policy
            </a>
          </Label>
        </div>
        {agreed&&agreed2 && (
          <div>
            <Label htmlFor="mathProblem">Please confirm you're not a bot by answering this question:</Label>
            <p className="mb-2">{mathProblem.num1} + {mathProblem.num2} = ?</p>
            <Input
              id="mathProblem"
              type="number"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Enter your answer"
              required
            />
          </div>
        )}
        {error && <p className="text-red-500">{error}</p>}
        <div className="flex justify-between pt-4">
          <Button type="button" onClick={prevStep} variant="outline">Prev</Button>
          <Button type="submit" disabled={!agreed}>Submit</Button>
        </div>
      </form>
    </div>
  );
};

export default FinalStep;
