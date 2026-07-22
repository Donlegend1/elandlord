// resources/js/bootstrap.js
import './bootstrap';

import axios from 'axios';
// import { setCookie } from 'harmony-cookie';
import { Inertia } from '@inertiajs/inertia';

// Set Axios headers
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// Add a request interceptor to send the CSRF token
axios.interceptors.request.use(config => {
    const token = document.head.querySelector('meta[name="csrf-token"]');
    if (token) {
        config.headers['X-CSRF-TOKEN'] = token.content;
    }
    return config;
});

// Make Inertia globally available (optional)
window.Inertia = Inertia;
