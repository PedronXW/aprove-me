export class LocalStorageAuthenticationManager {
  static setAuth(value: string) {
    localStorage.setItem('aprove-me-authentication-token', value)
  }

  static getAuth() {
    return localStorage.getItem('aprove-me-authentication-token')
  }

  static removeAuth() {
    localStorage.removeItem('aprove-me-authentication-token')
  }
}
