import '@testing-library/jest-dom'

// Mock Web APIs for Next.js
class MockRequest {
  constructor(url, init = {}) {
    this.url = url;
    this.method = init.method || 'GET';
    this.headers = new Map(Object.entries(init.headers || {}));
    this._body = init.body;
  }
  async json() {
    return typeof this._body === 'string' ? JSON.parse(this._body) : this._body;
  }
}

class MockResponse {
  constructor(body, init = {}) {
    this._body = body;
    this.status = init.status || 200;
    this.statusText = init.statusText || 'OK';
    this.ok = this.status >= 200 && this.status < 300;
    this.headers = new Map(Object.entries(init.headers || {}));
  }
  async json() {
    return typeof this._body === 'string' ? JSON.parse(this._body) : this._body;
  }
  static json(data, init = {}) {
    return new MockResponse(data, {
      ...init,
      headers: { 'Content-Type': 'application/json', ...(init.headers || {}) },
    });
  }
}

global.Request = MockRequest;
global.Response = MockResponse;

// Mock Next.js server
jest.mock('next/server', () => ({
  NextRequest: MockRequest,
  NextResponse: MockResponse,
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    }
  },
  usePathname() {
    return '/'
  },
  useSearchParams() {
    return new URLSearchParams()
  },
}))

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: 'div',
    button: 'button',
    span: 'span',
    p: 'p',
    h1: 'h1',
    h2: 'h2',
    h3: 'h3',
  },
  AnimatePresence: ({ children }) => children,
  useInView: () => true,
}))
