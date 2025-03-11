'use client'
import { useActionState, useEffect, useState } from "react";
import { getUsers } from "./user";
import { getCookie, setCookie } from "cookies-next";

interface Option {
  id: number;
  value: string;
}

export default function Home() {
  const [options, setOptions] = useState<Option[]>([]);
  const [selectedValue, setSelectedValue] = useState("");

  useEffect(() => {
    fetch('/api/user')
    .then((res) => res.json())
    .then((data) => { console.log(data); return setOptions(data.items.map((x: any) => { return { id: x.id, value: x.username } })) })
    .catch((err) => console.error("Error fetching data:", err));
  }, []);

  return (
    <div className='container'>
      <div className="login">
        <select value={selectedValue} onChange={(e) => setSelectedValue(e.target.value)} className="input">
          <option value="">Select an option</option>
          {options.map((option) => (
            <option key={option.id} value={option.value}>
              {option.value}
            </option>
          ))}
        </select>
        <p>Selected: {selectedValue}</p>
        <br />
      </div>
    </div >
  );
}
