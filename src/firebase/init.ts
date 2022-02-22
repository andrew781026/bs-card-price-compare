// Use dotenv to read .env vars into Node
require('dotenv').config({path: '../../.env'});

const {initializeApp, applicationDefault, cert} = require('firebase-admin/app');
const {getFirestore, Timestamp, FieldValue} = require('firebase-admin/firestore');

const serviceAccount = {
    project_id: process.env.project_id,
    private_key: process.env.private_key.replace(/@/ig, '\n'),
    client_email: process.env.client_email
}

initializeApp({
    credential: cert(serviceAccount)
});

export const db = getFirestore();
