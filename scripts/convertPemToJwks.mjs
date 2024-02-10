// we have public and private in pem format inside certs folder. So, we have to host public key in jwk format.
// for convert we used one library called : npm i rsa-pem-to-jwk
import fs from 'fs';
import rsaPemToJwk from 'rsa-pem-to-jwk';

const privateKey = fs.readFileSync('./certs/private.pem');

// use:sig --> jwk used for verify the signature.
//JWK will contain both the public and private portions of the RSA key.
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
rsaPemToJwk(privateKey, { use: 'sig' }, 'public');
