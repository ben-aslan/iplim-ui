'use client'
import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { setUserLimit } from './limitAction'
import { logout } from "./login/action";


interface Option {
  id: number;
  value: string;
}

export default function Home() {
  // const [currentPage, setCurrentPage] = useState(1)
  // const currentPageRef = useRef(currentPage)
  // const [pageSize, setPageSize] = useState(100)


  const [options, setOptions] = useState<Option[]>([]);
  const [selectedValue, setSelectedValue] = useState("");
  const [limit, setLimit] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [state, limitAction] = useActionState(setUserLimit, undefined)

  useEffect(() => {
    fetch('/api/user?limit=' + 100 + '&startIndex=' + (1 - 1))
      .then((res) => res.json())
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((data) => { console.log(data); return setOptions(data.items.map((x: any) => { return { id: x.id, value: x.username } })) })
      .catch((err) => console.error("Error fetching data:", err));
  }, []);

  return (
    <div className='container'>
      <div className="login">
        <form action={limitAction} className="flex max-w-[300px] flex-col gap-2">
          <select value={selectedValue} onChange={(e) => setSelectedValue(e.target.value)} className="input">
            <option value="">Select an option</option>
            {options.map((option) => (
              <option key={option.id} value={option.value}>
                {option.value}
              </option>
            ))}
          </select>
          <input type="hidden" value={selectedValue} name="username" />
          <p>Selected: {selectedValue}</p>
          <br />
          <input
            type="number"
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
            placeholder="limit..."
            className='input'
            name='limit'
          />
          {state?.success ? <p className="text-green-500">user limited successfully</p> : ''}
          <SubmitButton />
        </form>
        <br />
        <br />
        <br />
        <div className="flex max-w-[300px] flex-col gap-2">
          <LogoutButton />
        </div>
      </div>
    </div >
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button disabled={pending} type="submit" className='loginButton'>
      Set user limit
    </button>
  );
}

function LogoutButton() {
  return (
    <button onClick={() => { logout() }} className='logoutButton'>
      Logout
    </button>
  )
}