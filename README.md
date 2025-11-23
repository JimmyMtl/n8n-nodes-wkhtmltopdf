# n8n-nodes-wkhtmltopdf

A custom **n8n node** for converting HTML or a webpage URL into a **PDF** using `wkhtmltopdf`.
This package is a **maintained fork** of the original community node, including multiple fixes, improved error handling, and better compatibility across environments (Linux, macOS, Windows, Docker).

## Quick installation on n8n

```bash
npm i n8n-nodes-wkhtmltopdf
```

---

## ✨ Features

* Convert **raw HTML** into a PDF
* Convert **URL/webpage** into a PDF
* Output to **Base64**, **Binary**, or **File Path**
* Supports **custom wkhtmltopdf options**
* Configurable:

  * Page size (A4, A3, Letter…)
  * Orientation (Portrait / Landscape)
  * Margins
  * JavaScript execution
* Detects wkhtmltopdf path automatically on most systems
* Works in **self-hosted n8n**, including Docker (see notes below)

---

## 📦 Requirements

This node requires a working installation of **wkhtmltopdf**.

The node will try the most common system paths:

| OS      | Default Path Checked                               |
| ------- | -------------------------------------------------- |
| Windows | `C:\Program Files\wkhtmltopdf\bin\wkhtmltopdf.exe` |
| Linux   | `/usr/bin/wkhtmltopdf`                             |
| macOS   | `/usr/local/bin/wkhtmltopdf`                       |

If the binary is not found, you can manually set a custom path inside the node options.

---

## 🛠 Installation of wkhtmltopdf

### **Windows**

Download the official installer:
[https://wkhtmltopdf.org/downloads.html](https://wkhtmltopdf.org/downloads.html)

### **macOS**

```bash
brew install wkhtmltopdf
```

### **Ubuntu/Debian**

```bash
sudo apt-get update
sudo apt-get install wkhtmltopdf
```

### **CentOS / RHEL / Fedora**

```bash
sudo yum install wkhtmltopdf
# or
sudo dnf install wkhtmltopdf
```

---

## 🐳 Using inside Docker (important)

Most lightweight Linux images (Alpine, Debian Slim, n8n official images) **do NOT ship wkhtmltopdf** and do not provide it in default repos.

If you run n8n in Docker, you must:

1. Use a Debian-based image
2. Install dependencies
3. Install wkhtmltopdf manually

Example `Dockerfile` section (Debian):

```dockerfile
RUN apt-get update && \
    apt-get install -y wkhtmltopdf xfonts-base fontconfig && \
    apt-get clean
```

⚠️ **wkhtmltopdf is not available on Alpine** → you must use a Debian or Ubuntu-based image.

---

## 📥 Node Installation

Clone the repo:

```bash
git clone https://github.com/your-user/n8n-nodes-wkhtmltopdf.git
```

Install dependencies:

```bash
npm install
```

Build the package:

```bash
npm run build
```

Copy the compiled folder into your n8n custom nodes directory:

```
~/.n8n/custom/
```

Or mount it in Docker:

```yaml
volumes:
  - ./n8n-nodes-wkhtmltopdf:/home/node/.n8n/custom/n8n-nodes-wkhtmltopdf
```

Restart n8n → the node appears in the editor.

---

## 🚀 Usage

1. Add **HTML to PDF (wkhtmltopdf)** node to your workflow
2. Choose whether to convert:

   * **Raw HTML**
   * **URL**
3. Configure:

   * Output format (Base64, Binary, File Path)
   * Page size
   * Orientation
   * Margins
   * JavaScript enable/disable
   * Custom wkhtmltopdf options
4. Execute the workflow

---

## ⚙️ Configuration Options

### Input

* **HTML Content** — raw HTML to convert
* **HTML URL** — webpage to convert

### Output

* **Base64**
* **Binary (n8n binary property)**
* **Local File Path**

### PDF Options

* Page size: `A4`, `A3`, `A5`, `Letter`, `Legal`
* Orientation: `Portrait` / `Landscape`
* Margins: top, right, bottom, left
* Enable JavaScript: true/false
* Timeout & delay options
* Custom CLI options forwarded directly to wkhtmltopdf

### Advanced

* **Custom wkhtmltopdf binary path**
* **Disable smart shrinking**
* **Overwrite existing files** (when writing to disk)

---

## 🐞 Troubleshooting

### “wkhtmltopdf: command not found”

wkhtmltopdf is not installed or not in PATH.
Check with:

```bash
which wkhtmltopdf
```

If using Docker: install wkhtmltopdf inside the container.

---

### “Exit code 127 / 139”

This usually means missing system libraries.

Install fonts + X11 deps:

```bash
apt-get install -y xfonts-base fontconfig libxrender1 libxext6
```

---

### PDF is blank or styles missing

wkhtmltopdf sometimes needs:

* `--enable-local-file-access`
* Full absolute paths for local assets
* `--javascript-delay 2000` for JS-powered pages

---

## 📄 License

MIT

---
