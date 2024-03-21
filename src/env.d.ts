interface ImportMetaEnv {
    readonly PUBLIC_IMGIX_URL: string;
    readonly PUCLIC_FIREBASE_APIKEY: string;
    readonly PUBLIC_FIREBASE_AUTHDOMAIN: string;
    readonly PUBLIC_FIREBASE_PROJECTID: string;
    readonly PUBLIC_FIREBASE_STORAGEBUCKET: string;
    readonly PUBLIC_FIREBASE_MESSAGINGSENDERID: string;
    readonly PUBLIC_FIREBASE_APPID: string;
    readonly PUBLIC_FIREBASE_MEASUREMENTID: string;
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }