document
  .getElementById("loginForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, senha: password }),
    })
      .then((response) => response.json())
      .then((data) => {
        alert(data.message);
      })
      .catch((error) => {
        console.error("Erro:", error);
      });
  });

document
  .getElementById("cadastroForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    fetch("/cadastro", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nome, email, senha: password }),
    })
      .then((response) => response.json())
      .then((data) => {
        alert(data.message);
        fetchUsuarios();
      })
      .catch((error) => {
        console.error("Erro:", error);
      });
  });

// Função para buscar e exibir usuários
function fetchUsuarios() {
  fetch("/usuarios")
    .then((response) => response.json())
    .then((usuarios) => {
      const usuariosList = document.getElementById("usuariosList");
      usuariosList.innerHTML = "";

      usuarios.forEach((usuario) => {
        const li = document.createElement("li");
        li.textContent = `Nome: ${usuario.nome}, Email: ${usuario.email}`;
        usuariosList.appendChild(li);
      });
    })
    .catch((error) => {
      console.error("Erro:", error);
    });
}

// Buscar usuários ao carregar a página de cadastro
if (window.location.pathname === "/cadastro.html") {
  fetchUsuarios();
}
