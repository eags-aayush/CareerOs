
import React, { useState } from 'react';
import { XCircleIcon } from './icons/XCircleIcon';

interface SkillInputProps {
  skills: string[];
  setSkills: (skills: string[]) => void;
  placeholder: string;
}

const SkillInput: React.FC<SkillInputProps> = ({ skills, setSkills, placeholder }) => {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      const newSkill = inputValue.trim();
      if (!skills.find(skill => skill.toLowerCase() === newSkill.toLowerCase())) {
        setSkills([...skills, newSkill]);
      }
      setInputValue('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 p-2 mt-1 min-h-[42px] bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm">
        {skills.map((skill) => (
          <div
            key={skill}
            className="flex items-center gap-1.5 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-sm font-medium px-2 py-1 rounded-md"
          >
            <span>{skill}</span>
            <button
              type="button"
              onClick={() => removeSkill(skill)}
              className="text-indigo-500 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-200"
            >
              <XCircleIcon className="h-4 w-4" />
            </button>
          </div>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={skills.length === 0 ? placeholder : ''}
          className="flex-grow bg-transparent p-1 focus:outline-none placeholder-slate-400 dark:placeholder-slate-500 sm:text-sm text-slate-800 dark:text-slate-200"
        />
      </div>
    </div>
  );
};

export default SkillInput;
