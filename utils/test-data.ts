// Test data constants
export const TEST_USERS = {
    valid: {
      email: 'testuser@pixelsuite.com',
      password: 'Test@1234',
      name: 'Test User'
    },
    invalid: {
      email: 'fake@nowhere.com',
      password: 'wrongpassword'
    }
  };
  
  export const URLS = {
    homepage: '/',
    login: '/login',
    signup: '/signup',
    pricing: '/pricing',
    checkout: '/checkout',
    forgotPassword: '/forgot-password',
    imageResize: '/image-resize',
    contact: '/contact'
  };
  
  export const TEST_FILES = {
    image: 'test-image.jpg',
    pdf: 'test-document.pdf',
    exe: 'malware.exe'
  };
  
  export const PROMO_CODES = {
    valid: 'SAVE20',
    invalid: 'INVALIDCODE'
  };