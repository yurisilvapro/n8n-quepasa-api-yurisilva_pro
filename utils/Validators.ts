/**
 * Validadores para o QuePasa Node
 */

export class MessageValidator {
  static validateText(text: string): void {
    if (!text || text.trim().length === 0) {
      throw new Error('Message text is required');
    }
    if (text.length > 4096) {
      throw new Error('Message too long (max 4096 characters)');
    }
  }

  static validateChatId(chatId: string): string {
    let cleaned = chatId.replace(/[^\d@.]/g, '');
    
    if (!cleaned.includes('@')) {
      cleaned = `${cleaned}@s.whatsapp.net`;
    }
    
    return cleaned;
  }
}

export class MediaValidator {
  static readonly LIMITS = {
    image: { maxSize: 5 * 1024 * 1024, types: ['image/jpeg', 'image/png', 'image/gif'] },
    video: { maxSize: 16 * 1024 * 1024, types: ['video/mp4', 'video/3gpp'] },
    audio: { maxSize: 16 * 1024 * 1024, types: ['audio/mpeg', 'audio/ogg'] },
    document: { maxSize: 100 * 1024 * 1024, types: ['application/pdf'] },
  };

  static validateMedia(type: string, mimetype: string, size: number): void {
    const limit = this.LIMITS[type as keyof typeof this.LIMITS];
    
    if (!limit) {
      throw new Error(`Invalid media type: ${type}`);
    }
    
    if (size > limit.maxSize) {
      throw new Error(
        `File too large. Max size for ${type}: ${this.formatBytes(limit.maxSize)}`
      );
    }
  }

  static formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }
}

export class GroupValidator {
  static validateGroupName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new Error('Group name is required');
    }
    if (name.length > 100) {
      throw new Error('Group name too long (max 100 characters)');
    }
  }

  static validateParticipants(participants: string[]): void {
    if (!participants || participants.length === 0) {
      throw new Error('At least one participant is required');
    }
    if (participants.length > 256) {
      throw new Error('Too many participants (max 256)');
    }
  }

  static validateGroupId(groupId: string): string {
    if (!groupId.endsWith('@g.us')) {
      return `${groupId}@g.us`;
    }
    return groupId;
  }
}
