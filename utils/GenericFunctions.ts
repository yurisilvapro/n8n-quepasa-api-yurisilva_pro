import {
  IExecuteFunctions,
  IHttpRequestMethods,
  IHttpRequestOptions,
  IDataObject,
} from 'n8n-workflow';
import { AxiosError } from 'axios';

/**
 * Faz requisição HTTP para API QuePasa
 */
export async function quePasaApiRequest(
  this: IExecuteFunctions,
  method: IHttpRequestMethods,
  endpoint: string,
  body: IDataObject = {},
  qs: IDataObject = {},
  option: IDataObject = {}
): Promise<any> {
  const credentials = await this.getCredentials('quePasaApi');
  
  const options: IHttpRequestOptions = {
    method,
    body,
    qs,
    url: `${credentials.serverUrl}${endpoint}`,
    json: true,
    ...option,
  };

  // Adicionar token do header
  const accounts = credentials.accounts as any;
  if (accounts?.account?.[0]?.token) {
    options.headers = {
      ...options.headers,
      'X-QUEPASA-TOKEN': accounts.account[0].token as string,
    };
  }

  try {
    return await this.helpers.httpRequest(options);
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        `QuePasa API Error [${error.response?.status}]: ${
          error.response?.data?.message || error.message
        }`
      );
    }
    throw error;
  }
}

/**
 * Formata número de telefone para formato WhatsApp
 */
export function formatPhoneNumber(phone: string, isGroup: boolean = false): string {
  // Remove caracteres não numéricos
  const cleaned = phone.replace(/\D/g, '');
  
  // Adiciona sufixo apropriado
  const suffix = isGroup ? '@g.us' : '@s.whatsapp.net';
  
  // Se já tem sufixo, retorna como está
  if (phone.includes('@')) {
    return phone;
  }
  
  return `${cleaned}${suffix}`;
}

/**
 * Valida formato de Chat ID
 */
export function validateChatId(chatId: string): void {
  if (!chatId || chatId.trim().length === 0) {
    throw new Error('Chat ID is required');
  }
  
  if (!chatId.includes('@')) {
    throw new Error(
      'Invalid Chat ID format. Should be like: 5511999999999@s.whatsapp.net or 123456@g.us'
    );
  }
}

/**
 * Extrai dados binários do n8n
 */
export async function getBinaryData(
  this: IExecuteFunctions,
  itemIndex: number,
  propertyName: string
): Promise<Buffer> {
  this.helpers.assertBinaryData(itemIndex, propertyName);
  return await this.helpers.getBinaryDataBuffer(itemIndex, propertyName);
}

/**
 * Converte Buffer para base64
 */
export function bufferToBase64(buffer: Buffer, mimetype: string): string {
  return `data:${mimetype};base64,${buffer.toString('base64')}`;
}
