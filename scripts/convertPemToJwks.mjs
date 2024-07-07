// we have public and private in pem format inside certs folder. So, we have to host public key in jwk format.
// for convert we used one library called : npm i rsa-pem-to-jwk
import fs from 'fs';
import rsaPemToJwk from 'rsa-pem-to-jwk';

const privateKey = fs.readFileSync('./certs/private.pem', 'utf8');

// use:sig --> jwk used for verify the signature.
//JWK will contain both the public and private portions of the RSA key.
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unused-vars
const jwk = rsaPemToJwk(privateKey, { use: 'sig' });

// console.log(jwk);

//We are using private key for 2 purposes: 1. Sign jwt tokens 2. Generating jwks which is used for verifying that jwt signature
