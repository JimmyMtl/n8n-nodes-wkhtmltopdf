import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
	NodeConnectionType,
} from 'n8n-workflow';

const wkhtmltopdf = require('wkhtmltopdf');
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

// Configure wkhtmltopdf path based on platform
if (os.platform() === 'win32') {
	wkhtmltopdf.command = 'C:\\Program Files\\wkhtmltopdf\\bin\\wkhtmltopdf.exe';
} else if (os.platform() === 'linux') {
	wkhtmltopdf.command = '/usr/bin/wkhtmltopdf';
} else if (os.platform() === 'darwin') {
	// macOS - try common installation paths
	wkhtmltopdf.command = '/usr/local/bin/wkhtmltopdf';
}

export class HtmlToPdf implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'HTML to PDF',
		name: 'htmlToPdf',
		icon: 'file:htmlToPdf.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Convert HTML content to PDF using wkhtmltopdf',
		defaults: {
			name: 'HTML to PDF',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		properties: [
			{
				displayName: 'HTML Content',
				name: 'htmlContent',
				type: 'string',
				typeOptions: {
					rows: 10,
				},
				default: '',
				placeholder: 'Enter HTML content here...',
				description: 'The HTML content to convert to PDF',
			},
			{
				displayName: 'HTML URL',
				name: 'htmlUrl',
				type: 'string',
				default: '',
				placeholder: 'https://example.com',
				description: 'URL of the HTML page to convert to PDF',
			},
			{
				displayName: 'Output Format',
				name: 'outputFormat',
				type: 'options',
				options: [
					{
						name: 'Binary File',
						value: 'binary',
						description: 'Return PDF as binary file (recommended)',
					},
					{
						name: 'Base64 String',
						value: 'base64',
						description: 'Return PDF as base64 string',
					},
					{
						name: 'File Path',
						value: 'filepath',
						description: 'Save PDF to file and return path',
					},
				],
				default: 'binary',
				description: 'How to return the generated PDF',
			},
			{
				displayName: 'Output Filename',
				name: 'outputFilename',
				type: 'string',
				default: '',
				placeholder: 'document.pdf',
				description: 'Custom filename for the PDF (without extension). If empty, auto-generated name will be used.',
				displayOptions: {
					show: {
						outputFormat: ['binary', 'filepath'],
					},
				},
			},
			{
				displayName: 'Page Size',
				name: 'pageSize',
				type: 'options',
				options: [
					{
						name: 'A4',
						value: 'A4',
					},
					{
						name: 'A3',
						value: 'A3',
					},
					{
						name: 'A5',
						value: 'A5',
					},
					{
						name: 'Letter',
						value: 'Letter',
					},
					{
						name: 'Legal',
						value: 'Legal',
					},
				],
				default: 'A4',
				description: 'Page size for the PDF',
			},
			{
				displayName: 'Orientation',
				name: 'orientation',
				type: 'options',
				options: [
					{
						name: 'Portrait',
						value: 'Portrait',
					},
					{
						name: 'Landscape',
						value: 'Landscape',
					},
				],
				default: 'Portrait',
				description: 'Page orientation',
			},
			{
				displayName: 'Margin Top',
				name: 'marginTop',
				type: 'string',
				default: '10mm',
				description: 'Top margin (e.g., 10mm, 1in, 20px)',
			},
			{
				displayName: 'Margin Right',
				name: 'marginRight',
				type: 'string',
				default: '10mm',
				description: 'Right margin (e.g., 10mm, 1in, 20px)',
			},
			{
				displayName: 'Margin Bottom',
				name: 'marginBottom',
				type: 'string',
				default: '10mm',
				description: 'Bottom margin (e.g., 10mm, 1in, 20px)',
			},
			{
				displayName: 'Margin Left',
				name: 'marginLeft',
				type: 'string',
				default: '10mm',
				description: 'Left margin (e.g., 10mm, 1in, 20px)',
			},
			{
				displayName: 'Enable JavaScript',
				name: 'enableJavaScript',
				type: 'boolean',
				default: false,
				description: 'Whether to enable JavaScript execution',
			},
			{
				displayName: 'Custom Options',
				name: 'customOptions',
				type: 'string',
				typeOptions: {
					rows: 3,
				},
				default: '',
				placeholder: '--disable-smart-shrinking --print-media-type',
				description: 'Additional wkhtmltopdf options (space-separated)',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const htmlContent = this.getNodeParameter('htmlContent', i) as string;
				const htmlUrl = this.getNodeParameter('htmlUrl', i) as string;
				const outputFormat = this.getNodeParameter('outputFormat', i) as string;
				const outputFilename = this.getNodeParameter('outputFilename', i) as string;
				const pageSize = this.getNodeParameter('pageSize', i) as string;
				const orientation = this.getNodeParameter('orientation', i) as string;
				const marginTop = this.getNodeParameter('marginTop', i) as string;
				const marginRight = this.getNodeParameter('marginRight', i) as string;
				const marginBottom = this.getNodeParameter('marginBottom', i) as string;
				const marginLeft = this.getNodeParameter('marginLeft', i) as string;
				const enableJavaScript = this.getNodeParameter('enableJavaScript', i) as boolean;
				const customOptions = this.getNodeParameter('customOptions', i) as string;

				// Validate input
				if (!htmlContent && !htmlUrl) {
					throw new NodeOperationError(this.getNode(), 'Either HTML Content or HTML URL must be provided');
				}

				// Prepare wkhtmltopdf options
				const options: any = {
					pageSize: pageSize,
					orientation: orientation,
					marginTop: marginTop,
					marginRight: marginRight,
					marginBottom: marginBottom,
					marginLeft: marginLeft,
					enableLocalFileAccess: true,
					javascript: enableJavaScript,
				};

				// Add custom options if provided
				if (customOptions) {
					const customOpts = customOptions.split(' ').filter(opt => opt.trim());
					customOpts.forEach(opt => {
						if (opt.startsWith('--')) {
							const key = opt.substring(2);
							options[key] = true;
						} else if (opt.includes('=')) {
							const [key, value] = opt.split('=');
							options[key] = value;
						}
					});
				}

				let pdfBuffer: Buffer;

				if (htmlUrl) {
					// Convert from URL
					pdfBuffer = await new Promise<Buffer>((resolve, reject) => {
						wkhtmltopdf(htmlUrl, options, (err: any, stream: any) => {
							if (err) {
								reject(err);
							} else {
								const chunks: Buffer[] = [];
								stream.on('data', (chunk: Buffer) => chunks.push(chunk));
								stream.on('end', () => resolve(Buffer.concat(chunks)));
								stream.on('error', reject);
							}
						});
					});
				} else {
					// Convert from HTML content
					pdfBuffer = await new Promise<Buffer>((resolve, reject) => {
						wkhtmltopdf(htmlContent, options, (err: any, stream: any) => {
							if (err) {
								reject(err);
							} else {
								const chunks: Buffer[] = [];
								stream.on('data', (chunk: Buffer) => chunks.push(chunk));
								stream.on('end', () => resolve(Buffer.concat(chunks)));
								stream.on('error', reject);
							}
						});
					});
				}

				// Generate filename
				const timestamp = Date.now();
				const defaultFileName = `html_to_pdf_${timestamp}.pdf`;
				const finalFileName = outputFilename ? 
					(outputFilename.endsWith('.pdf') ? outputFilename : `${outputFilename}.pdf`) : 
					defaultFileName;

				let result: any = {};

				switch (outputFormat) {
					case 'base64':
						result = {
							json: {
								pdf: pdfBuffer.toString('base64'),
								size: pdfBuffer.length,
								filename: finalFileName,
							},
						};
						break;

					case 'binary':
						result = {
							binary: {
								pdf: {
									data: pdfBuffer.toString('base64'),
									mimeType: 'application/pdf',
									fileName: finalFileName,
									fileExtension: 'pdf',
								},
							},
						};
						break;

					case 'filepath': {
						const tempDir = os.tmpdir();
						const filePath = path.join(tempDir, finalFileName);
						
						fs.writeFileSync(filePath, pdfBuffer);
						
						result = {
							json: {
								filePath: filePath,
								fileName: finalFileName,
								size: pdfBuffer.length,
							},
						};
						break;
					}

					default:
						throw new NodeOperationError(this.getNode(), `Unknown output format: ${outputFormat}`);
				}

				returnData.push({
					...items[i],
					...result,
				});

			} catch (error: any) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: error.message,
						},
					});
				} else {
					throw error;
				}
			}
		}

		return [returnData];
	}
}
