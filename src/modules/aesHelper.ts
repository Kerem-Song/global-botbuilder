import CryptoJS from 'crypto-js';

export const aesHelper = {
  decode: <T>(hash: string) => {
    const key = CryptoJS.enc.Utf8.parse('MIGJAoGBAM9wt+Vv0IvxHEQVuTwPCSwH');
    const iv = CryptoJS.enc.Utf8.parse('MIGJAoGBAM9wt+Vv');

    const bytes = CryptoJS.AES.decrypt(hash, key, {
      iv: iv,
    });

    const result: T = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    console.log(result);
    return result;
  },
} as const;
