import { cookies } from "next/dist/client/components/headers";

class AppConfig {
  readonly apiBaseUrl: string;
  readonly idToken: string = "localhost";

  constructor() {
    this.apiBaseUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}`;
    if (process.browser) {
      const cookies = document.cookie.split(";");
      const idToken = this.extractIdTokenFromCookies(cookies);
      this.idToken = idToken !== undefined ? idToken : this.idToken;
    }
  }

  private extractIdTokenFromCookies(cookies: string[]): string | undefined {
    const idToken = cookies
      .map((cookie) => cookie.trim().split("="))
      .find(
        ([name]) =>
          name.startsWith("CognitoIdentityServiceProvider.") &&
          name.endsWith(".idToken")
      )?.[1];

    return idToken;
  }
}

const appConfig = new AppConfig();
export default appConfig;
