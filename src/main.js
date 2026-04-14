import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import app from './index.js';

console.log('App starting...');

app().then(() => {
  console.log('✅ App initialized successfully');
}).catch((error) => {
  console.error('❌ App initialization failed:', error);
});