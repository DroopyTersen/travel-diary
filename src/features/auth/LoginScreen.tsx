import React, { useState } from "react";
import { useActions } from "global/overmind";
import { AppBackground } from "global/components";
import { Card } from "core/components";

export function LoginScreen() {
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");

  let actions = useActions();
  const onSubmit = (e) => {
    e.preventDefault();
    if (email && password) {
      actions.auth.submitLogin({ email, password });
    }
  };
  return (
    <>
      <AppBackground />
      <div className="home content centered login">
        <h1 className="app-title">Wanderlog</h1>
        <h3 className="tagline">Lust less. Remember more.</h3>
        <Card>
          <form
            className="login-form"
            autoComplete="new-password"
            aria-autocomplete="none"
            onSubmit={onSubmit}
          >
            <label htmlFor="email">
              Email
              <input
                name="email"
                type="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <label htmlFor="password">
              Password
              <input
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
            <button className="gold" disabled={!email || !password}>
              Login
            </button>
          </form>
        </Card>
      </div>
    </>
  );
}
