import type { ServiceAccount } from "firebase-admin/app";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

const activeApps = getApps();

const serviceAccount = {
  type: "service_account",
  project_id: "samuel-freret-portfolio",
  private_key_id: "367987db2af469e8af0a1f79b78135f55047f939",
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDX8F5fb/TXtmYA\nHQPN757mCnNzJUzIjfK2vv7KCllI8Y1w1H7o+vAObI/hBx3wiBuGmth2xM1s9fTu\nMnCfIl1nUuq8Ly1VyCL/cIel/UqaIKKCq8C+o0J/nJx7up35VWH/ZjdvxLBGI1Y4\nhY19LYCoDVPLo4asrl0WU9dz6lp+bR0ptwuRxaDFSM+v7WZpsCDJ5rqGQf6Bm24V\nuBGK47CRx234Gm3Sx0sklcm7sXz6Sgv0cHiwKGJ5eBwBus2n9KUbFBYp+SRjunY5\nAyfV+Iz6oA3kjeDdrUzcEIbzu9Ya35ydLqyR6sSEZIRDTje/7ILg60FJWmNiMCrc\nduGlTmrDAgMBAAECggEAF2VDDEsId4CbD4MVQPAnwpu6Q2z0ozwB4nvSBhjV8Jm/\nLczQDTT24lEvy30maMOOW+iV8FRFP3tsdIxBeHRUM1gf95CS9FrRM+TAxaKqPQWx\nJcAvC1iL4WCZ8avX5sYx7mZoNjNUt9ynQEtz926BJHQBMqx+cGIZ0sv1qWjoMg80\nQu7I9CPDMJxS/FXm7Ku8jr38+iZFt/bNVmRdRTlOuRHhFyO5JsNup7UR+nuLSVCv\nxBl6wFfrkfH/vzOHruY6eUIl7FqtxRvZZVAHArdXWwn8IZXZ58O6Ijav+nHspcQI\ntiYQ0wCJd//2y9oUFsR9P+U2PbeCqJf2EblxRMzWOQKBgQD97FIY2zq3oHK+5O5u\nJDziPOWKXhOF3KFHhQQf2TASkJXOFhodI4E4FWsGBFQdDtNbrfnVLvv5Ee09prJO\nO0raR6/KFmYv3qtBQnQM+I6dfhe6qPJMj7LrqrBg/hhOtMlYoE3FmXjFNQm9gg2R\nbB3AJp8Gbd5L3qBjVMS/KMU1WQKBgQDZtIOwJHZ+DPfTlfugHfvFl1B7BIiJ1WWL\nRkfUuMPu98e18nLPwbryHntWiyA8W5eH2T9kQSv7cfo/9ssspcHz8hG1mxi6cdtA\n0akkZHDNGG9Vbfm78QtrMy9J2KewlVjSW5BXSyz9y10zB/VjuTljnzkGvoGmDIH3\nBjVMdl3xewKBgGlPFU1RvqxhUrVw5KGxTb7WWqxkD9y4f/rVY7yBqrpIVJi/+dyT\n2QeVemloaioS9/1RzgdoEQBfOvESrWhcltKoYHODjqXTx1qtYMvwWdVfch/r6XFv\nN1kd1UCkoRgjSk4DTb3hxIClWoDJ6y6glEYYvmNANa1pi0Mm6OIO2pshAoGAWx9C\na2ynqBT3ejlxy9Ag/NBb4FHCcKbATO5KzI/VeuV9Uvu68JivDf6SM2QiRwEzSKo2\n7ViV9zX6v+Elo3dx2hB9Nx1G2WskkVnwSQo9aKsMlp5khDTdSa5v4aHsdm3ccpfe\nr5sIpuYDCYQQQwBZNAiGDvuYOo9LqsCPeISmx5cCgYAcJcBs0TY+NOJHZHh4Xg6c\n+DVwkq2fgoyfxUi/NsSnaEdM+OLB44OUEC7aRivO+XJGYHceq7TEFNKcVCMZcVVC\nYr5A7ZvbQcveFJ7GZs1XvSc9R1RqdH6sScg5DPdABevGRefDKEWMhhH0uurAs3F7\nETWtGYbEeLraRuQk+U+T/g==\n-----END PRIVATE KEY-----\n",
  client_email:
    "firebase-adminsdk-5z1np@samuel-freret-portfolio.iam.gserviceaccount.com",
  client_id: "105282311399713723316",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-5z1np%40samuel-freret-portfolio.iam.gserviceaccount.com",
  universe_domain: "googleapis.com",
};

export const app =
  activeApps.length === 0
    ? initializeApp({
        credential: cert(serviceAccount as ServiceAccount),
      })
    : activeApps[0];

export const adminAuth = getAuth(app);
export const adminFirestore = getFirestore(app);
