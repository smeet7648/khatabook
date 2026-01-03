import "./App.css";
import LoginPage from "./components/Login";
import SignupPage from "./components/Signup";
import { Link, Route, Routes } from "react-router-dom";

let selectedCustomerId = null;

function Dashboard() {

  if (!localStorage.getItem("token")) {
    window.location.href = "/login";
    return null;
  }

  function openAddCustomer() {
    document.getElementById("addModal").style.display = "block";
  }

  function closeAddCustomer() {
    document.getElementById("addModal").style.display = "none";
  }

  function openActionModal(id, name) {
    selectedCustomerId = id;
    document.getElementById("popupTitle").innerText = name;
    document.getElementById("actionAmount").value = "";
    document.getElementById("actionModal").style.display = "block";
  }

  function closeActionModal() {
    document.getElementById("actionModal").style.display = "none";
  }

  function addCustomer() {
    const name = document.getElementById("name").value;
    if (!name) return;

    fetch("http://localhost:5000/customer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("token")
      },
      body: JSON.stringify({ name })
    }).then(loadCustomers);

    document.getElementById("name").value = "";
    closeAddCustomer();
  }

  function submit(type) {
    const amount = Number(document.getElementById("actionAmount").value);
    if (!amount) return;

    fetch("http://localhost:5000/transaction", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("token")
      },
      body: JSON.stringify({
        id: selectedCustomerId,
        type,
        amount
      })
    }).then(() => {
      closeActionModal();
      loadCustomers();
    });
  }

  function loadCustomers() {
    fetch("http://localhost:5000/customers", {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token")
      }
    })
      .then(res => res.json())
      .then(data => {
        const list = document.getElementById("list");
        list.innerHTML = "";

        let receive = 0;
        let pay = 0;

        data.forEach(c => {
          const row = document.createElement("div");
          row.className = "entry";

          if (c.balance >= 0) receive += c.balance;
          else pay += Math.abs(c.balance);

          row.innerHTML = `
            <span>${c.name}</span>
            <strong class="${c.balance >= 0 ? "green" : "red"}">
              ₹ ${c.balance}
            </strong>
          `;

          row.onclick = () => openActionModal(c.id, c.name);
          list.appendChild(row);
        });

        document.getElementById("receive").innerText = "₹ " + receive;
        document.getElementById("pay").innerText = "₹ " + pay;
        document.getElementById("net").innerText = "₹ " + (receive - pay);
      });
  }

  setTimeout(loadCustomers, 300);

  return (
    <>
      <nav className="navbar">
        <div className="navbar-content">
          <div className="navbar-brand">
            <div className="navbar-logo">₹</div>
            <h1 className="navbar-title">KhataBook</h1>
          </div>

          <div className="navbar-actions">
            <Link to="/" className="navbar-link">Home</Link>
            <Link to="/login" className="navbar-btn">Login</Link>
          </div>
        </div>
      </nav>

      <div className="app">

        <aside className="sidebar">
          <div className="brand">
            <div className="logo">₹</div>
            <h2 id="tit">KhataBook</h2>
          </div>

          <button className="top-btn outline" onClick={openAddCustomer}>
            Add Customer
          </button>
        </aside>

        <main className="main">

          <section className="cards">
            <div className="card receive">
              <p>You'll Receive</p>
              <h2 id="receive">₹ 0</h2>
            </div>

            <div className="card pay">
              <p>You'll Pay</p>
              <h2 id="pay">₹ 0</h2>
            </div>

            <div className="card net">
              <p>Net Balance</p>
              <h2 id="net">₹ 0</h2>
            </div>
          </section>

          <section className="list">
            <h4>Customers</h4>
            <div id="list"></div>
          </section>
        </main>

        <div className="modal" id="addModal">
          <div className="modal-box">
            <h3>Add Customer</h3>
            <input id="name" placeholder="Customer Name" />
            <button className="top-btn outline" onClick={addCustomer}>Save</button>
            <button className="top-btn outline" onClick={closeAddCustomer}>Cancel</button>
          </div>
        </div>

        <div className="modal" id="actionModal">
          <div className="modal-box">
            <h3 id="popupTitle">Customer</h3>
            <input id="actionAmount" type="number" placeholder="Enter amount" />

            <button className="top-btn outline" onClick={() => submit("credit")}>
              Credit
            </button>

            <button className="top-btn outline" onClick={() => submit("debit")}>
              Debit
            </button>

            <button className="top-btn outline" onClick={closeActionModal}>
              Close
            </button>
          </div>
        </div>

      </div>
    </>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
    </Routes>
  );
}

export default App;
