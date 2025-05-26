/**
 * Utility functions for secure cookie management
 */

interface CookieOptions {
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
  maxAge?: number; // in seconds
  path?: string;
}

export class CookieUtils {
  /**
   * Sets a cookie with security options
   * @param name Cookie name
   * @param value Cookie value
   * @param options Cookie security options
   */
  static setCookie(name: string, value: string, options: CookieOptions = {}): void {
    const {
      secure = window.location.protocol === 'https:',
      sameSite = 'strict',
      maxAge = 60 * 60 * 24, // 24 hours default
      path = '/'
    } = options;

    let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
    
    if (maxAge) {
      cookieString += `; Max-Age=${maxAge}`;
    }
    
    if (path) {
      cookieString += `; Path=${path}`;
    }
    
    if (secure) {
      cookieString += '; Secure';
    }
    
    cookieString += `; SameSite=${sameSite}`;

    document.cookie = cookieString;
  }

  /**
   * Gets a cookie value by name
   * @param name Cookie name
   * @returns Cookie value or null if not found
   */
  static getCookie(name: string): string | null {
    const encodedName = encodeURIComponent(name);
    const cookies = document.cookie.split(';');
    
    for (const cookie of cookies) {
      const [cookieName, cookieValue] = cookie.trim().split('=');
      if (cookieName === encodedName) {
        return decodeURIComponent(cookieValue);
      }
    }
    
    return null;
  }

  /**
   * Removes a cookie
   * @param name Cookie name
   * @param path Cookie path (should match the path used when setting)
   */
  static removeCookie(name: string, path: string = '/'): void {
    document.cookie = `${encodeURIComponent(name)}=; Max-Age=0; Path=${path}`;
  }

  /**
   * Checks if a cookie exists
   * @param name Cookie name
   * @returns True if cookie exists
   */
  static cookieExists(name: string): boolean {
    return this.getCookie(name) !== null;
  }
}

/**
 * Token-specific cookie utilities with security defaults
 */
export class TokenCookieUtils {
  private static readonly ACCESS_TOKEN_NAME = 'access_token';
  private static readonly REFRESH_TOKEN_NAME = 'refresh_token';
  private static readonly USER_ROLE_NAME = 'user_role';
  
  // Security settings for tokens
  private static readonly TOKEN_COOKIE_OPTIONS: CookieOptions = {
    secure: window.location.protocol === 'https:',
    sameSite: 'strict',
    path: '/',
  };

  /**
   * Sets the access token cookie with short expiration
   * @param token Access token
   */
  static setAccessToken(token: string): void {
    CookieUtils.setCookie(
      this.ACCESS_TOKEN_NAME, 
      token, 
      {
        ...this.TOKEN_COOKIE_OPTIONS,
        maxAge: 15 * 60 // 15 minutes
      }
    );
  }

  /**
   * Sets the refresh token cookie with longer expiration
   * @param token Refresh token
   */
  static setRefreshToken(token: string): void {
    CookieUtils.setCookie(
      this.REFRESH_TOKEN_NAME, 
      token, 
      {
        ...this.TOKEN_COOKIE_OPTIONS,
        maxAge: 7 * 24 * 60 * 60 // 7 days
      }
    );
  }

  /**
   * Sets the user role cookie
   * @param role User role
   */
  static setUserRole(role: string): void {
    CookieUtils.setCookie(
      this.USER_ROLE_NAME, 
      role, 
      {
        ...this.TOKEN_COOKIE_OPTIONS,
        maxAge: 7 * 24 * 60 * 60 // 7 days
      }
    );
  }

  /**
   * Gets the access token from cookies
   * @returns Access token or null
   */
  static getAccessToken(): string | null {
    return CookieUtils.getCookie(this.ACCESS_TOKEN_NAME);
  }

  /**
   * Gets the refresh token from cookies
   * @returns Refresh token or null
   */
  static getRefreshToken(): string | null {
    return CookieUtils.getCookie(this.REFRESH_TOKEN_NAME);
  }

  /**
   * Gets the user role from cookies
   * @returns User role or empty string
   */
  static getUserRole(): string {
    return CookieUtils.getCookie(this.USER_ROLE_NAME) || '';
  }

  /**
   * Removes both access and refresh tokens
   */
  static clearTokens(): void {
    CookieUtils.removeCookie(this.ACCESS_TOKEN_NAME);
    CookieUtils.removeCookie(this.REFRESH_TOKEN_NAME);
    CookieUtils.removeCookie(this.USER_ROLE_NAME);
  }

  /**
   * Checks if user has valid tokens
   * @returns True if both tokens exist
   */
  static hasValidTokens(): boolean {
    return CookieUtils.cookieExists(this.ACCESS_TOKEN_NAME) && 
           CookieUtils.cookieExists(this.REFRESH_TOKEN_NAME);
  }

  /**
   * Checks if access token exists
   * @returns True if access token exists
   */
  static hasAccessToken(): boolean {
    return CookieUtils.cookieExists(this.ACCESS_TOKEN_NAME);
  }
}
