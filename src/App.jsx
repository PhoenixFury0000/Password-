import { useState, useEffect } from "react";
import { Clipboard, Check, Sun, Moon } from "lucide-react";
import Mascot from "./components/Mascot.jsx";
import { PasswordStrength, calculateStrength } from "./components/PasswordStrength.jsx";

const generatePassword = ({ length, upper, lower, numbers, symbols }) => {
  const upperChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowerChars = "abcdefghijklmnopqrstuvwxyz";
  const numberChars = "0123456789";
  const symbolChars = "!@#$%^&*()_+-={}[]|:;<>,.?/~`";

  let chars = "";
  if (upper) chars += upperChars;
  if (lower) chars += lowerChars;
  if (numbers) chars += numberChars;
  if (symbols) chars += symbolChars;

  if (!chars) return "";

  const array = new Uint32Array(length);
  window.crypto.getRandomValues(array);

  return Array.from(array, (num) => chars[num % chars.length]).join("");
};

export default function App() {
  const [length, setLength] = useState(16);
  const [upper, setUpper] = useState(true);
  const [lower, setLower] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [password, setPassword] = useState("");
  const [history, setHistory] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("passwordHistory")) || [];
    setHistory(saved);
  }, []);

  const generate = () => {
    const pass = generatePassword({ length, upper, lower, numbers, symbols });
    setPassword(pass);
    const newHistory = [pass, ...history].slice(0, 10);
    setHistory(newHistory);
    localStorage.setItem("passwordHistory", JSON.stringify(newHistory));
    setCopied(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const strength = calculateStrength(password);

  return (
    <div className={`${darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"} min-h-screen flex flex-col items-center justify-center p-4 transition-colors duration-500`}>
      <div className="absolute top-4 right-4 cursor-pointer" onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
      </div>

      <h1 className="text-4xl font-bold mb-8 text-center">Next-Level Password Generator</h1>

      <div className={`${darkMode ? "bg-gray-800" : "bg-white"} p-6 rounded-3xl shadow-2xl w-full max-w-lg transition-colors duration-500`}>
        <Mascot strength={strength} />

        <div className="mb-4 relative">
          <input
            type="text"
            value={password}
            readOnly
            className="w-full p-3 border rounded-xl font-mono text-center text-lg focus:ring-2 focus:ring-blue-400 transition-all duration-300"
          />
          <button
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
            onClick={copyToClipboard}
          >
            {copied ? <Check className="w-5 h-5 text-green-500" /> : <Clipboard className="w-5 h-5" />}
          </button>
          <PasswordStrength password={password} />
        </div>

        <div className="flex flex-col space-y-2 mb-4 text-sm">
          <label className="flex items-center space-x-2"><input type="checkbox" checked={upper} onChange={() => setUpper(!upper)} /> Uppercase</label>
          <label className="flex items-center space-x-2"><input type="checkbox" checked={lower} onChange={() => setLower(!lower)} /> Lowercase</label>
          <label className="flex items-center space-x-2"><input type="checkbox" checked={numbers} onChange={() => setNumbers(!numbers)} /> Numbers</label>
          <label className="flex items-center space-x-2"><input type="checkbox" checked={symbols} onChange={() => setSymbols(!symbols)} /> Symbols</label>

          <label className="flex items-center justify-between">
            Length: 
            <input type="range" min="8" max="32" value={length} onChange={(e) => setLength(Number(e.target.value))} className="w-2/3"/>
            <span>{length}</span>
          </label>
        </div>

        <div className="flex justify-center">
          <button
            onClick={generate}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-full shadow-lg hover:scale-105 transform transition-all duration-300"
          >
            Generate
          </button>
        </div>

        {history.length > 0 && (
          <div className="mt-6 max-h-48 overflow-auto">
            <h2 className="font-semibold mb-2 text-center">History</h2>
            <ul className="text-sm font-mono space-y-1">
              {history.map((h, i) => <li key={i} className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">{h}</li>)}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}