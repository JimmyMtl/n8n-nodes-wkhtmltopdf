# n8n-nodes-wkhtmltopdf

[![npm version](https://img.shields.io/npm/v/n8n-nodes-wkhtmltopdf.svg)](https://www.npmjs.com/package/n8n-nodes-wkhtmltopdf)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)

An **n8n community node** for converting **HTML** or **webpage URLs** to **PDF** using [`wkhtmltopdf`](https://wkhtmltopdf.org/).

This package is a maintained fork of an original HTML → PDF node, with fixes and improvements for:
- Better error handling
- Improved compatibility (Linux, macOS, Windows, Docker)
- More configuration and output options

## Quick n8n installation

```bash
npm i n8n-nodes-wkhtmltopdf
```

---

## ✨ Features

- Convert **raw HTML** to PDF  
- Convert **URL/webpage** to PDF  
- Output formats:
  - **Base64**
  - **Binary (n8n binary property)**
  - **File path on disk**
- Configurable:
  - Page size (A4, A3, A5, Letter, Legal)
  - Orientation (Portrait / Landscape)
  - Margins
  - JavaScript execution
  - Custom `wkhtmltopdf` options (CLI flags)
- Supports self-hosted **n8n** (including Docker)

---

## 📦 Installation

### As an n8n community node (npm)

From your n8n installation directory:

```bash
npm install n8n-nodes-wkhtmltopdf
````

n8n will automatically pick it up as a community node on restart (for recent versions with community nodes support enabled).

### Local / custom nodes folder

If you manage custom nodes manually:

```bash
git clone https://github.com/<your-user>/n8n-nodes-wkhtmltopdf.git
cd n8n-nodes-wkhtmltopdf
npm install
npm run build
```

Then copy or mount this folder into your n8n custom nodes directory, for example:

```text
~/.n8n/custom/n8n-nodes-wkhtmltopdf
```

Restart n8n and the node should appear in the editor.

---

## 🛠 wkhtmltopdf Requirement

This node **requires `wkhtmltopdf` to be installed** and reachable from n8n.

The node will try common default paths:

| OS      | Default Path Checked                                   |
| ------- | ------------------------------------------------------ |
| Windows | `C:\\Program Files\\wkhtmltopdf\\bin\\wkhtmltopdf.exe` |
| Linux   | `/usr/bin/wkhtmltopdf`                                 |
| macOS   | `/usr/local/bin/wkhtmltopdf`                           |

You can also configure a **custom path** in the node options if your installation is elsewhere.

### Install on macOS

```bash
brew install wkhtmltopdf
```

### Install on Ubuntu/Debian

```bash
sudo apt-get update
sudo apt-get install wkhtmltopdf
```

### Install on CentOS / RHEL / Fedora

```bash
sudo yum install wkhtmltopdf
# or
sudo dnf install wkhtmltopdf
```

### Install on Windows

Download and install from:
[https://wkhtmltopdf.org/downloads.html](https://wkhtmltopdf.org/downloads.html)

---

## 🐳 Using in Docker

If you are running n8n in Docker, most images **do not include `wkhtmltopdf`** by default.

Example for a Debian-based image:

```dockerfile
FROM n8nio/n8n:latest

USER root

RUN apt-get update && \
    apt-get install -y wkhtmltopdf xfonts-base fontconfig libxrender1 libxext6 && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

USER node
```

And mount the node:

```yaml
services:
  n8n:
    image: your-n8n-image-with-wkhtmltopdf
    volumes:
      - ./n8n-nodes-wkhtmltopdf:/home/node/.n8n/custom/n8n-nodes-wkhtmltopdf
```

---

## 🚀 Usage

1. In the n8n editor, search for **“HTML to PDF (wkhtmltopdf)”**.
2. Select **Input Type**:

   * **HTML Content** → paste or map raw HTML
   * **URL** → provide a web address
3. Choose **Output Format**:

   * `Base64` → returns a Base64 string
   * `Binary` → attaches PDF to an n8n binary property
   * `File Path` → write to disk in the container/host
4. Configure PDF options:

   * **Page size**, **orientation**, **margins**
   * **Enable JavaScript**
   * Optional **custom wkhtmltopdf flags**
5. Execute the workflow and use the PDF in downstream nodes.

---

## ⚙️ Configuration Options

### Input

* **HTML Content**
  Direct HTML string to convert.

* **HTML URL**
  URL of a webpage to convert. The node will pass the URL to `wkhtmltopdf`.

### Output

* **Base64**
  Returns the PDF as a Base64-encoded string.

* **Binary**
  Exposes the PDF via a binary property (for use with other n8n nodes like Email, FTP, etc.).

* **File Path**
  Saves the PDF to the local filesystem. Useful in Docker with a mounted volume.

### PDF Settings

* **Page Size**: `A4`, `A3`, `A5`, `Letter`, `Legal`, etc.
* **Orientation**: `Portrait` / `Landscape`
* **Margins**: `Top`, `Right`, `Bottom`, `Left`
* **Enable JavaScript**: Enable or disable JS execution for the page.
* **Custom Options**: Raw CLI flags passed directly to `wkhtmltopdf`.

---

## 🐞 Troubleshooting

### `wkhtmltopdf: command not found`

`wkhtmltopdf` is not installed or not in `PATH`.

* Check: `which wkhtmltopdf`
* Install it inside your host / container
* Configure a custom path in the node if required

### Exit code `127` / `139` or blank PDF

Often due to missing system libraries or fonts. On Debian/Ubuntu, try:

```bash
apt-get install -y xfonts-base fontconfig libxrender1 libxext6
```

Also, for dynamic/JS-heavy pages:

* Add `--javascript-delay 2000`
* Add `--enable-local-file-access` if you load local resources

---

## 🧩 Development

Clone and install:

```bash
git clone https://github.com/<your-user>/n8n-nodes-wkhtmltopdf.git
cd n8n-nodes-wkhtmltopdf
npm install
npm run build
```

You can then symlink or mount the repo into your n8n custom nodes folder for live development.

---

## 📄 License

[MIT](./LICENSE)
