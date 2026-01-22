import { formatPhoneNumber, validateChatId } from '../utils/GenericFunctions';

describe('GenericFunctions', () => {
  describe('formatPhoneNumber', () => {
    it('should format phone number correctly', () => {
      const result = formatPhoneNumber('5511999999999');
      expect(result).toBe('5511999999999@s.whatsapp.net');
    });

    it('should format group ID correctly', () => {
      const result = formatPhoneNumber('123456789', true);
      expect(result).toBe('123456789@g.us');
    });

    it('should not modify already formatted number', () => {
      const input = '5511999999999@s.whatsapp.net';
      const result = formatPhoneNumber(input);
      expect(result).toBe(input);
    });

    it('should remove non-numeric characters', () => {
      const result = formatPhoneNumber('(55) 11 99999-9999');
      expect(result).toBe('5511999999999@s.whatsapp.net');
    });
  });

  describe('validateChatId', () => {
    it('should throw error for empty chat ID', () => {
      expect(() => validateChatId('')).toThrow('Chat ID is required');
    });

    it('should throw error for invalid format', () => {
      expect(() => validateChatId('5511999999999')).toThrow('Invalid Chat ID format');
    });

    it('should pass for valid chat ID', () => {
      expect(() => validateChatId('5511999999999@s.whatsapp.net')).not.toThrow();
    });

    it('should pass for valid group ID', () => {
      expect(() => validateChatId('123456789@g.us')).not.toThrow();
    });
  });
});
