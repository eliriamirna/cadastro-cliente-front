import React from 'react';

interface ButtonProps {
  text: string;
  bgColor: string;
  textColor: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

const Button: React.FC<ButtonProps> = ({ text, bgColor, textColor, onClick, type = 'button' }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`w-full py-2 rounded-md transition-colors ${bgColor} ${textColor} hover:opacity-80`}
    >
      {text}
    </button>
  );
};

export default Button;
