<div align="center">

<h1>🤖 WhatsApp Bot con Baileys</h1>

<img src="./bot.png" alt="WhatsApp Bot" width="280">

<p>
  Bot de WhatsApp desarrollado en <b>Node.js</b> usando
  <b>@whiskeysockets/baileys</b>, con conexión mediante
  <b>código de vinculación de 8 dígitos</b>.
</p>

<p>
  <img src="https://img.shields.io/badge/Node.js-v18+-green">
  <img src="https://img.shields.io/badge/Baileys-Latest-blue">
  <img src="https://img.shields.io/badge/Status-Activo-success">
  <img src="https://img.shields.io/badge/License-Educational-lightgrey">
</p>

</div>

<hr>

<h2>📖 Descripción</h2>
<p>
Este proyecto es un bot de WhatsApp ligero y modular, ideal para
automatizar respuestas, mostrar menús, crear stickers y gestionar
comandos personalizados.  
Compatible con <b>Termux</b>, <b>Linux</b> y <b>Windows</b>.
</p>

<hr>

<h2>✨ Características</h2>
<ul>
  <li>🔗 Vinculación por código de 8 dígitos (sin QR)</li>
  <li>⚡ Conexión rápida y estable</li>
  <li>🧩 Arquitectura modular</li>
  <li>🎨 Creación de stickers</li>
  <li>📜 Menú interactivo</li>
  <li>🛠️ Fácil de personalizar</li>
</ul>

<hr>

<h2>📦 Requisitos</h2>
<ul>
  <li>Node.js <b>v18 o superior</b></li>
  <li>npm</li>
  <li>Número de WhatsApp activo</li>
</ul>

<pre>
node -v
npm -v
</pre>

<hr>

<h2>🚀 Instalación</h2>

<h3>1️⃣ Clonar el repositorio</h3>
<pre>
git https://github.com/jafeth-modder/Massi-Bot
cd Massi-Bot
</pre>

<h3>2️⃣ Instalar dependencias</h3>
<pre>
npm install
</pre>

<h3>3️⃣ Instalar Baileys</h3>
<pre>
npm install @whiskeysockets/baileys
</pre>

<h3>4️⃣ Iniciar el bot</h3>
<pre>
node index.js
</pre>

<hr>

<h2>🔑 Vincular WhatsApp</h2>
<ol>
  <li>Introduce tu número en formato internacional</li>
  <li>Ejemplo: <b>50761234567</b></li>
  <li>El bot generará un <b>código de 8 dígitos</b></li>
  <li>En WhatsApp:
    <ul>
      <li>Ajustes</li>
      <li>Dispositivos vinculados</li>
      <li>Vincular dispositivo</li>
      <li>Ingresar código</li>
    </ul>
  </li>
</ol>

<p><b>⚠️ Nota:</b> si el código expira, reinicia el bot y genera uno nuevo.</p>

<hr>

<h2>⌨️ Comandos</h2>

<table border="1" cellpadding="10" cellspacing="0">
  <tr>
    <th>Comando</th>
    <th>Descripción</th>
  </tr>
  <tr>
    <td><code>/menu</code></td>
    <td>Muestra el menú principal</td>
  </tr>
  <tr>
    <td><code>/ping</code></td>
    <td>Comprueba el estado del bot</td>
  </tr>
  <tr>
    <td><code>/sticker</code></td>
    <td>Convierte imagen o video en sticker</td>
  </tr>
  <tr>
    <td><code>/info</code></td>
    <td>Información del bot</td>
  </tr>
  <tr>
    <td><code>/help</code></td>
    <td>Lista de ayuda</td>
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

<h2>🛠️ Tecnologías usadas</h2>
<ul>
  <li>Node.js</li>
  <li>@whiskeysockets/baileys</li>
  <li>Pino (logs)</li>
  <li>QRCode-terminal</li>
</ul>

<hr>

<h2>🐞 Solución de problemas</h2>
<ul>
  <li><b>No vincula:</b> revisa el número y genera un nuevo código</li>
  <li><b>Error require:</b> el proyecto usa ES Modules (<code>import</code>)</li>
  <li><b>Se queda cargando:</b> elimina la carpeta <code>auth_info</code> y reinicia</li>
</ul>

<hr>

<h2>📜 Licencia</h2>
<p>
Proyecto con fines educativos.  
No afiliado ni respaldado por WhatsApp Inc.
</p>

<hr>

<h2>👤 Autor</h2>
<p>
<b>Jafeth Silva</b><br>
💬 WhatsApp Bot Developer<br>
⭐ Si te gustó el proyecto, apóyalo con una estrella en GitHub
</p>
