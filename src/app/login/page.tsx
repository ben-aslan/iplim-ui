'use client'
import { useActionState, useState } from 'react';
import styles from './page.module.css'
import { useFormStatus } from 'react-dom';
import { login } from './action';

export default function Login() {
    const [text, setText] = useState("");
    const [password, setPassword] = useState("");
    const [state, loginAction] = useActionState(login, undefined)

    return (
        <div className={styles.container}>
            <div className={styles.login}>
                <form action={loginAction} className="flex max-w-[300px] flex-col gap-2">
                    <h1>username</h1>
                    <input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="username..."
                        className={styles.input}
                        name='username'
                    />
                    {state?.errors?.username && (
                        <p className="text-red-500">{state.errors.username}</p>
                    )}
                    <h1>password</h1>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="password..."
                        className={styles.input}
                        name='password'
                    />
                    {state?.errors?.password && (
                        <p className="text-red-500">{state.errors.password}</p>
                    )}
                    <br />
                    <SubmitButton />
                </form>
            </div>
        </div>
    )
}

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <button disabled={pending} type="submit" className={styles.loginButton}>
            Login
        </button>
    );
}