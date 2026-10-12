"use client";

import { useState } from "react";
import { createUser } from "../lib/api";

export default function Form({ refreshUsers, setShowCreate }) {
  const [form, setForm] = useState({ name: "", email: "", age: "" });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const change = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      await createUser({ ...form, age: Number(form.age) });
      await refreshUsers();
      setShowCreate(false);
    } catch (err) {
      setError(err.message || "Could not add this person. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return <div><h1 id="form-title">Add a person</h1><p className="form-intro">Add someone new to your workspace directory.</p><form onSubmit={handleSubmit}>
    <div className="form-field"><label htmlFor="create-name">Full name</label><input id="create-name" name="name" value={form.name} onChange={change} placeholder="e.g. Alex Morgan" required autoFocus /></div>
    <div className="form-field"><label htmlFor="create-email">Email address</label><input id="create-email" type="email" name="email" value={form.email} onChange={change} placeholder="alex@company.com" required /></div>
    <div className="form-field"><label htmlFor="create-age">Age</label><input id="create-age" type="number" name="age" value={form.age} onChange={change} placeholder="Enter age" min="1" max="120" required /></div>
    {error && <div className="form-error" role="alert">{error}</div>}
    <div className="form-actions"><button type="button" className="secondary-button" onClick={() => setShowCreate(false)}>Cancel</button><button className="primary-button form-submit" disabled={saving}>{saving ? "Adding…" : "Add person"}</button></div>
  </form></div>;
}
