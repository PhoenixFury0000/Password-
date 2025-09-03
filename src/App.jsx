import { useState, useEffect } from "react";
import { Clipboard, Check, Sun, Moon } from "lucide-react";
import Mascot from "./components/Mascot";
import { PasswordStrength, calculateStrength } from "./components/PasswordStrength";

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
      <h1 className="text-3xl font-bold mb-6">Next-Level Password Generator</h1>

      <div className={`${darkMode ? "bg-gray-800" : "bg-white"} p-6 rounded-2xl shadow-lg w-full max-w-md transition-colors duration-500`}>
        <div className="mb-4 relative">
          <Mascot strength={strength} />
          <input
            type="text"
            value={password}
            readOnly
            className="w-full p-2 border rounded font-mono text-center text-lg"
          />
          <button
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
            onClick={copyToClipboard}
          >
            {copied ? <Check className="w-5 h-5 text-green-500" /> : <Clipboard className="w-5 h-5" />}
          </button>
          <PasswordStrength password={password} />
        </div>

        <div className="flex flex-col space-y-2 mb-4 text-sm">
          <label><input type="checkbox" checked={upper} onChange={() => setUpper(!upper)} /> Include Uppercase</label>
          <label><input type="checkbox" checked={lower} onChange={() => setLower(!lower)} /> Include Lowercase</label>
          <label><input type="checkbox" checked={numbers} onChange={() => setNumbers(!numbers)} /> Include Numbers</label>
          <label><input type="checkbox" checked={symbols} onChange={() => setSymbols(!symbols)} /> Include Symbols</label>
          <label className="flex items-center">
            Length:
            <input type="number" min="8" max="32" value={length} onChange={(e) => setLength(Number(e.target.value))} className="w-16 border rounded p-1 ml-2"/>
          </label>
        </div>

        <div className="flex space-x-2">
          <button onClick={generate} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">Generate</button>
        </div>

        {history.length > 0 && (
          <div className="mt-4">
            <h2 className="font-semibold mb-2">History</h2>
            <ul className="text-sm font-mono space-y-1 max-h-40 overflow-auto">
              {history.map((h, i) => <li key={i}>{h}</li>)}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}