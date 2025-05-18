let token = localStorage.getItem("token") || "";
let joinedCouple = false;

window.onload = () => {
  if (token) {
    document.getElementById("auth-section").style.display = "none";
    document.getElementById("couple-section").style.display = "block";
  }
};

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("joinedCoupleId");
  token = "";
  joinedCouple = false;
  document.getElementById("auth-section").style.display = "block";
  document.getElementById("couple-section").style.display = "none";
  document.getElementById("list-section").style.display = "none";
}

function register() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  fetch("http://localhost:5000/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  })
  .then(res => res.json())
  .then(data => {
    alert(data.message || JSON.stringify(data));
  });
}

function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  fetch("http://localhost:5000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  })
  .then(res => res.json())
  .then(data => {
    if (data.token) {
      token = data.token;
      localStorage.setItem("token", token);
      document.getElementById("auth-section").style.display = "none";
      document.getElementById("couple-section").style.display = "block";
    } else {
      alert("Login failed");
    }
  });
}

function createCouple() {
  fetch("http://localhost:5000/api/couple/create", {
    method: "POST",
    headers: { Authorization: "Bearer " + token }
  })
  .then(res => res.json())
  .then(data => {
    alert("Your Couple ID: " + data.coupleId);
    joinedCouple = true;
    localStorage.setItem("joinedCoupleId", data.coupleId);
  });
}

function joinCouple() {
  const coupleId = document.getElementById("joinId").value.trim();
  if (!coupleId) {
    alert("Please enter a valid couple ID.");
    return;
  }

  fetch("http://localhost:5000/api/couple/join", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token
    },
    body: JSON.stringify({ coupleId })
  })
  .then(res => res.json())
  .then(data => {
    alert(data.message || JSON.stringify(data));
    if (data.message === "Joined couple list") {
      joinedCouple = true;
      localStorage.setItem("joinedCoupleId", coupleId);
    } else {
      joinedCouple = false;
      localStorage.removeItem("joinedCoupleId");
    }
  });
}

function getList() {
  const storedCoupleId = localStorage.getItem("joinedCoupleId");
  if (!joinedCouple && !storedCoupleId) {
    alert("Please join a couple first.");
    return;
  }

  fetch("http://localhost:5000/api/list", {
    headers: { Authorization: "Bearer " + token }
  })
  .then(res => {
    if (!res.ok) {
      return res.json().then(data => { throw new Error(data.message || "Failed to load list"); });
    }
    return res.json();
  })
  .then(data => {
    if (!Array.isArray(data)) {
      alert("List data is not an array");
      console.log("List response:", data);
      return;
    }

    document.getElementById("couple-section").style.display = "none";
    document.getElementById("list-section").style.display = "block";

    const ul = document.getElementById("shoppingList");
    ul.innerHTML = "";

    data.forEach(item => {
      const li = document.createElement("li");
      li.textContent = item;

      const btn = document.createElement("button");
      btn.textContent = "×";
      btn.className = "remove-btn";
      btn.onclick = (e) => {
        e.stopPropagation();
        removeItem(item);
      };

      li.appendChild(btn);
      ul.appendChild(li);
    });
  })
  .catch(err => {
    alert(err.message);
    console.error(err);
  });
}

function addItem() {
  const item = document.getElementById("itemInput").value.trim();
  if (!item) {
    alert("Please enter an item.");
    return;
  }

  fetch("http://localhost:5000/api/list", {
    method: "POST",
    headers: {
      "Authorization": "Bearer " + token,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ item })
  })
  .then(res => res.json())
  .then(() => {
    document.getElementById("itemInput").value = "";
    getList();
  })
  .catch(err => {
    alert("Failed to add item");
    console.error(err);
  });
}

function removeItem(item) {
  fetch("http://localhost:5000/api/list/" + encodeURIComponent(item), {
    method: "DELETE",
    headers: { Authorization: "Bearer " + token }
  })
  .then(res => res.json())
  .then(() => getList())
  .catch(err => {
    alert("Failed to remove item");
    console.error(err);
  });
}

function clearList() {
  if (!confirm("Are you sure you want to clear the entire list?")) return;

  fetch("http://localhost:5000/api/list", {
    method: "DELETE",
    headers: { Authorization: "Bearer " + token }
  })
  .then(res => {
    if (!res.ok) throw new Error("Failed to clear list");
    return res.json();
  })
  .then(() => getList())
  .catch(err => alert(err.message));
}

// Allow pressing Enter in input to add item
document.getElementById("itemInput").addEventListener("keydown", function(e) {
  if (e.key === "Enter") addItem();
});
