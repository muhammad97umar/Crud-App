const API_URL = "http://localhost:5000/api/users";

const readResponse = async (res) => {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "The request could not be completed.");
  return data;
};

export const getUsers = async () => {
  const res = await fetch(API_URL);
  return readResponse(res);
};

export const createUser = async (user) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });

  return readResponse(res);
};

export const updateUser = async (id, user) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });

  return readResponse(res);
};

export const deleteUser = async (id) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  return readResponse(res);
};
