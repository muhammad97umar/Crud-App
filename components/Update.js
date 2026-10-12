"use client";

import { useState } from "react";
import { updateUser } from "../lib/api";

export default function Update({ user, refreshUsers, setSelectedUser }) {
  const [form, setForm] = useState({ name: user.name || "", email: user.email || "", age: user.age ?? "" });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const change = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      await updateUser(user._id, { ...form, age: Number(form.age) });
      await refreshUsers();
      setSelectedUser(null);
    } catch (err) {
      setError(err.message || "Could not save your changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return <div><h1 id="form-title">Edit person</h1><p className="form-intro">Update {user.name}&apos;s directory details.</p><form onSubmit={handleSubmit}>
    <div className="form-field"><label htmlFor="edit-name">Full name</label><input id="edit-name" name="name" value={form.name} onChange={change} required autoFocus /></div>
    <div className="form-field"><label htmlFor="edit-email">Email address</label><input id="edit-email" type="email" name="email" value={form.email} onChange={change} required /></div>
    <div className="form-field"><label htmlFor="edit-age">Age</label><input id="edit-age" type="number" name="age" value={form.age} onChange={change} min="1" max="120" required /></div>
    {error && <div className="form-error" role="alert">{error}</div>}
    <div className="form-actions"><button type="button" className="secondary-button" onClick={() => setSelectedUser(null)}>Cancel</button><button className="primary-button form-submit" disabled={saving}>{saving ? "Saving…" : "Save changes"}</button></div>
  </form></div>;
}
