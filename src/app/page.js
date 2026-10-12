"use client";

import { useEffect, useMemo, useState } from "react";
import Form from "../../components/Form";
import Update from "../../components/Update";

const API_URL = "http://localhost:5000/api/users";

function initials(name = "") {
  return name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "U";
}

export default function Home() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Could not load the user directory.");
      setUsers(await response.json());
      setError("");
    } catch (err) {
      setError(err.message || "Something went wrong while loading users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const filteredUsers = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return users;
    return users.filter((user) => [user.name, user.email, String(user.age)].some((value) => value?.toLowerCase().includes(term)));
  }, [query, users]);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Could not delete this user.");
      await fetchUsers();
    } catch (err) {
      setError(err.message || "Could not delete this user.");
    }
  };

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#top" aria-label="People directory home"><span className="brand-mark">P</span><span>people<span className="brand-dot">.</span></span></a>
        <div className="sidebar-label">WORKSPACE</div>
        <a className="nav-link nav-link-active" href="#directory"><span className="nav-icon">▦</span> Directory <span className="nav-count">{users.length}</span></a>
        <div className="sidebar-bottom"><div className="workspace-avatar">PD</div><div><strong>People desk</strong><span>Team workspace</span></div><span className="more-icon">···</span></div>
      </aside>

      <section className="main-area" id="top">
        <header className="topbar"><div className="breadcrumbs">Workspace <span>/</span> <strong>Directory</strong></div><div className="topbar-right"><span className="status-dot" /> All changes synced <div className="profile-avatar">JD</div></div></header>
        <div className="content-wrap" id="directory">
          <div className="page-eyebrow"><span className="eyebrow-line" /> PEOPLE &amp; ACCESS</div>
          <div className="page-heading"><div><h1>Your people, <span>in one place.</span></h1><p>A clear view of everyone in your workspace.</p></div><button className="primary-button" onClick={() => { setSelectedUser(null); setShowCreate(true); }}><span>＋</span> Add a person</button></div>

          <div className="summary-grid">
            <article className="summary-card"><div className="summary-top"><span>Total people</span><span className="summary-icon purple">♙</span></div><div className="summary-value">{users.length.toString().padStart(2, "0")}</div><div className="summary-note">In your directory</div></article>
            <article className="summary-card"><div className="summary-top"><span>Recently added</span><span className="summary-icon mint">✳</span></div><div className="summary-value">{users.length ? "Active" : "—"}</div><div className="summary-note">Your workspace is up to date</div></article>
            <article className="summary-card summary-card-accent"><div className="summary-top"><span>Quick tip</span><span className="summary-icon gold">✦</span></div><div className="tip-title">Keep your team close.</div><div className="summary-note">Add contact details so everyone is easy to find.</div></article>
          </div>

          <section className="directory-card">
            <div className="directory-header"><div><h2>Directory</h2><p>Manage the people in your workspace.</p></div><label className="search-box"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search people..." aria-label="Search people" /><kbd>⌘ K</kbd></label></div>
            {error && <div className="notice notice-error" role="alert">{error} <button onClick={fetchUsers}>Try again</button></div>}
            <div className="table-scroll"><table className="people-table"><thead><tr><th>PERSON</th><th>EMAIL ADDRESS</th><th>AGE</th><th><span className="sr-only">Actions</span></th></tr></thead><tbody>
              {loading ? <tr><td className="table-message" colSpan="4"><span className="loading-dot" /> Loading your directory...</td></tr> : filteredUsers.length ? filteredUsers.map((user, index) => <tr key={user._id}><td><div className="person-cell"><span className={`person-avatar avatar-${index % 5}`}>{initials(user.name)}</span><span><strong>{user.name}</strong><small>Workspace member</small></span></div></td><td className="email-cell">{user.email}</td><td><span className="age-pill">{user.age} years</span></td><td className="row-actions"><button className="text-action" onClick={() => { setShowCreate(false); setSelectedUser(user); }}>Edit</button><button className="icon-action delete-action" onClick={() => handleDelete(user._id)} aria-label={`Delete ${user.name}`} title="Delete person">×</button></td></tr>) : <tr><td className="table-message" colSpan="4"><span className="empty-icon">♙</span><strong>{query ? "No people found" : "Your directory is ready"}</strong><span>{query ? "Try a different name or email." : "Add your first person to get started."}</span>{!query && <button className="text-action" onClick={() => setShowCreate(true)}>Add a person →</button>}</td></tr>}
            </tbody></table></div>
            <div className="directory-footer"><span>Showing <strong>{filteredUsers.length ? `1–${filteredUsers.length}` : 0}</strong> of <strong>{users.length}</strong> people</span><span className="footer-live"><span className="status-dot" /> Live directory</span></div>
          </section>
          <footer className="page-footer"><span>Made for better teamwork.</span><span>PEOPLE DESK <b>·</b> 2025</span></footer>
        </div>
      </section>

      {(showCreate || selectedUser) && <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) { setShowCreate(false); setSelectedUser(null); } }}><section className="form-modal" role="dialog" aria-modal="true" aria-labelledby="form-title"><button className="modal-close" onClick={() => { setShowCreate(false); setSelectedUser(null); }} aria-label="Close">×</button>{showCreate ? <Form refreshUsers={fetchUsers} setShowCreate={setShowCreate} /> : <Update user={selectedUser} refreshUsers={fetchUsers} setSelectedUser={setSelectedUser} />}</section></div>}
    </main>
  );
}
