import http from 'k6/http';
import { check } from 'k6';

const file = open('./sample.pdf', 'b');
const auth = 'Basic ' + '<YOUR_BASE64_EMAIL_PASS>'; // Copy from Postman Authorization header

export const options = {
  vus: 20,        // 20 concurrent users
  iterations: 60, // 60 total uploads
};

export default function () {
  const res = http.post(
    'http://localhost:8080/api/documents/upload',
    { file: http.file(file, 'sample.pdf', 'application/pdf') },
    { headers: { Authorization: auth } }
  );
  check(res, { 'status is 200': (r) => r.status === 200 });
}