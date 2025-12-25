import { useState, useEffect } from 'react';
import { VoiceController } from '../../services/voiceController';
import './AppStyles.css';

interface Props {
  onClose: () => void;
  voiceController: VoiceController | null;
}

export default function CalculatorApp({ onClose, voiceController }: Props) {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [newNumber, setNewNumber] = useState(true);

  const handleNumber = (num: string) => {
    if (newNumber) {
      setDisplay(num);
      setNewNumber(false);
    } else {
      setDisplay(prev => prev === '0' ? num : prev + num);
    }
  };

  const handleOperator = (op: string) => {
    setEquation(prev => prev + display + ' ' + op + ' ');
    setNewNumber(true);
  };

  const handleDecimal = () => {
    if (!display.includes('.')) {
      setDisplay(prev => prev + '.');
      setNewNumber(false);
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setEquation('');
    setNewNumber(true);
  };

  const handleEquals = () => {
    try {
      const fullEquation = equation + display;
      const sanitized = fullEquation.replace(/×/g, '*').replace(/÷/g, '/');
      const result = eval(sanitized);
      const roundedResult = Math.round(result * 1000000) / 1000000;
      setDisplay(roundedResult.toString());
      setEquation('');
      setNewNumber(true);
      
      if (voiceController) {
        voiceController.speak(`The result is ${roundedResult}`);
      }
    } catch {
      setDisplay('Error');
      setNewNumber(true);
    }
  };

  const handleBackspace = () => {
    if (display.length > 1) {
      setDisplay(prev => prev.slice(0, -1));
    } else {
      setDisplay('0');
      setNewNumber(true);
    }
  };

  const handleVoiceInput = () => {
    if (!voiceController) return;
    
    if (isListening) {
      voiceController.stopListening();
      setIsListening(false);
    } else {
      setIsListening(true);
      const originalCallback = (voiceController as any).callback;
      (voiceController as any).callback = (text: string) => {
        parseVoiceCalculation(text);
        setIsListening(false);
        voiceController.stopListening();
        (voiceController as any).callback = originalCallback;
      };
      voiceController.startListening();
    }
  };

  const parseVoiceCalculation = (text: string) => {
    const lowerText = text.toLowerCase();
    
    const numbers: { [key: string]: string } = {
      'zero': '0', 'one': '1', 'two': '2', 'three': '3', 'four': '4',
      'five': '5', 'six': '6', 'seven': '7', 'eight': '8', 'nine': '9',
      'ten': '10', 'eleven': '11', 'twelve': '12', 'thirteen': '13',
      'fourteen': '14', 'fifteen': '15', 'sixteen': '16', 'seventeen': '17',
      'eighteen': '18', 'nineteen': '19', 'twenty': '20', 'thirty': '30',
      'forty': '40', 'fifty': '50', 'sixty': '60', 'seventy': '70',
      'eighty': '80', 'ninety': '90', 'hundred': '100'
    };

    let processed = lowerText;
    Object.entries(numbers).forEach(([word, digit]) => {
      processed = processed.replace(new RegExp(word, 'g'), digit);
    });

    processed = processed
      .replace(/plus|add|\+/g, '+')
      .replace(/minus|subtract|-/g, '-')
      .replace(/times|multiplied by|multiply|\*/g, '*')
      .replace(/divided by|divide|over|\//g, '/')
      .replace(/equals|equal|is/g, '=');

    const calcMatch = processed.match(/(\d+)\s*([+\-*/])\s*(\d+)/);
    if (calcMatch) {
      const [, num1, op, num2] = calcMatch;
      setEquation(num1 + ' ' + op + ' ');
      setDisplay(num2);
      setTimeout(handleEquals, 500);
    }
  };

  const buttons = [
    { label: 'C', action: handleClear, className: 'function' },
    { label: '⌫', action: handleBackspace, className: 'function' },
    { label: '%', action: () => setDisplay(prev => (parseFloat(prev) / 100).toString()), className: 'function' },
    { label: '÷', action: () => handleOperator('÷'), className: 'operator' },
    { label: '7', action: () => handleNumber('7'), className: 'number' },
    { label: '8', action: () => handleNumber('8'), className: 'number' },
    { label: '9', action: () => handleNumber('9'), className: 'number' },
    { label: '×', action: () => handleOperator('×'), className: 'operator' },
    { label: '4', action: () => handleNumber('4'), className: 'number' },
    { label: '5', action: () => handleNumber('5'), className: 'number' },
    { label: '6', action: () => handleNumber('6'), className: 'number' },
    { label: '−', action: () => handleOperator('-'), className: 'operator' },
    { label: '1', action: () => handleNumber('1'), className: 'number' },
    { label: '2', action: () => handleNumber('2'), className: 'number' },
    { label: '3', action: () => handleNumber('3'), className: 'number' },
    { label: '+', action: () => handleOperator('+'), className: 'operator' },
    { label: '0', action: () => handleNumber('0'), className: 'number zero' },
    { label: '.', action: handleDecimal, className: 'number' },
    { label: '=', action: handleEquals, className: 'operator equals' },
  ];

  return (
    <div className="app-window glass-panel calculator-app">
      <div className="app-header">
        <h2>Calculator</h2>
        <button className="close-button" onClick={onClose}>×</button>
      </div>
      
      <div className="calculator-content">
        <div className="calculator-display">
          <div className="equation">{equation}</div>
          <div className="current-value">{display}</div>
        </div>

        <div className="calculator-buttons">
          {buttons.map((btn, index) => (
            <button
              key={index}
              className={`calc-button ${btn.className}`}
              onClick={btn.action}
            >
              {btn.label}
            </button>
          ))}
        </div>

        <button 
          className={`voice-calc-button ${isListening ? 'listening' : ''}`}
          onClick={handleVoiceInput}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8" />
          </svg>
          <span>{isListening ? 'Listening...' : 'Voice Input'}</span>
        </button>
      </div>
    </div>
  );
}
