# HTML to PDF n8n Node

A custom n8n node for converting HTML content to PDF using wkhtmltopdf.

## Features

- Convert HTML content to PDF
- Convert HTML from URL to PDF
- Multiple output formats (Base64, Binary, File Path)
- Configurable page size and orientation
- Customizable margins
- JavaScript execution support
- Custom wkhtmltopdf options

## Prerequisites

This node requires wkhtmltopdf to be installed on your system. The node will automatically detect the correct path based on your operating system:

- **Windows**: `C:\Program Files\wkhtmltopdf\bin\wkhtmltopdf.exe`
- **Linux**: `/usr/bin/wkhtmltopdf`
- **macOS**: `/usr/local/bin/wkhtmltopdf`

### Windows
Download and install from: https://wkhtmltopdf.org/downloads.html

### macOS
```bash
brew install wkhtmltopdf
```

### Linux (Ubuntu/Debian)
```bash
sudo apt-get install wkhtmltopdf
```

### Linux (CentOS/RHEL/Fedora)
```bash
sudo yum install wkhtmltopdf
# or for newer versions:
sudo dnf install wkhtmltopdf
```

## Installation

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the node:
   ```bash
   npm run build
   ```
4. Install in your n8n instance

## Usage

1. Add the "HTML to PDF" node to your workflow
2. Configure the input (HTML content or URL)
3. Set your preferred output format and options
4. Execute the workflow

## Configuration Options

- **HTML Content**: Direct HTML content to convert
- **HTML URL**: URL of a webpage to convert
- **Output Format**: Choose between Base64, Binary, or File Path
- **Page Size**: A4, A3, A5, Letter, Legal
- **Orientation**: Portrait or Landscape
- **Margins**: Top, Right, Bottom, Left margins
- **Enable JavaScript**: Allow JavaScript execution
- **Custom Options**: Additional wkhtmltopdf command-line options

## License

MIT
