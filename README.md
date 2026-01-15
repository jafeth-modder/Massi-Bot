<h1 align="center">🤖 WhatsApp Bot con Baileys</h1>

<p align="center">
  <img src="./bot.png" alt="WhatsApp Bot" width="300">
</p>

<p align="center">
  Bot de WhatsApp desarrollado en <b>Node.js</b> usando la librería
  <b>@whiskeysockets/baileys</b>, con vinculación mediante código de 8 dígitos.
</p>

<hr>

<h2>📌 Características</h2>
<ul>
  <li>Conexión a WhatsApp con Baileys</li>
  <li>Vinculación por código de 8 dígitos</li>
  <li>Soporte para múltiples comandos</li>
  <li>Estructura modular</li>
  <li>Compatible con Termux, Linux y Windows</li>
</ul>

<hr>

<h2>📦 Requisitos</h2>
<ul>
  <li>Node.js v18 o superior</li>
  <li>npm</li>
  <li>Número de WhatsApp activo</li>
</ul>

<p>Verifica tu versión:</p>

<pre>
node -v
npm -v
</pre>

<hr>

<h2>🚀 Instalación</h2>

<h3>1️⃣ Clonar el repositorio</h3>
<pre>
git clone https://github.com/tuusuario/tu-bot.git
cd tu-bot
</pre>

<h3>2️⃣ Instalar dependencias</h3>
<pre>
npm install
</pre>

<h3>3️⃣ Instalar Baileys</h3>
<pre>
npm install @whiskeysockets/baileys
</pre>

<h3>4️⃣ Ejecutar el bot</h3>
<pre>
node index.js
</pre>

<hr>

<h2>🔗 Vincular WhatsApp</h2>
<ol>
  <li>Ingresa tu número en formato internacional</li>
  <li>Ejemplo: <b>50761234567</b></li>
  <li>Se generará un código de 8 dígitos</li>
  <li>En WhatsApp:
    <ul>
      <li>Ajustes</li>
      <li>Dispositivos vinculados</li>
      <li>Vincular dispositivo</li>
      <li>Ingresa el código</li>
    </ul>
  </li>
</ol>

<hr>

<h2>🧾 Comandos disponibles</h2>

<table border="1" cellpadding="8">
  <tr>
    <th>Comando</th>
    <th>Descripción</th>
  </tr>
  <tr>
    <td>/menu</td>
    <td>Muestra el menú de comandos</td>
  </tr>
  <tr>
    <td>/ping</td>
    <td>Comprueba si el bot está activo</td>
  </tr>
  <tr>
    <td>/sticker</td>
    <td>Crea un sticker desde imagen o video</td>
  </tr>
  <tr>
    <td>/info</td>
    <td>Información del bot</td>
  </tr>
  <tr>
    <td>/help</td>
    <td>Lista de comandos</td>
  </tr>
</table>

<hr>

<h2>📁 Estructura del proyecto</h2>

<pre>
📦 bot-whatsapp
 ┣ 📂 auth_info
 ┣ 📂 src
 ┃ ┣ 📜 index.js
 ┃ ┣ 📜 menu.js
 ┃ ┣ 📜 sticker.js
 ┣ 📜 bot.png
 ┣ 📜 package.json
 ┣ 📜 README.md
</pre>

<hr>

<h2>🛠️ Tecnologías</h2>
<ul>
  <li>Node.js</li>
  <li>@whiskeysockets/baileys</li>
  <li>Pino</li>
  <li>QRCode-terminal</li>
</ul>

<hr>

<h2>❗ Errores comunes</h2>
<ul>
  <li><b>Error de vinculación:</b> verifica el número y genera un nuevo código</li>
  <li><b>require no definido:</b> usa <code>import</code> (ES Modules)</li>
</ul>

<hr>

<h2>📄 Licencia</h2>
<p>
Proyecto de uso educativo. No afiliado oficialmente a WhatsApp.
</p>

<hr>

<h2>⭐ Autor</h2>
<p>
Desarrollado por <b>Jafeth Silva</b><br>
Si te sirve, ¡deja una ⭐ en el repositorio!
</p>
