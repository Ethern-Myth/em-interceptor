# Interceptor for Token Management

This module provides an Axios interceptor for handling authentication tokens in JavaScript and TypeScript applications. The interceptor automatically attaches authentication tokens to outgoing requests and refreshes them when necessary to ensure seamless user authentication.

## Features

- Automatically adds an Authorization header with a bearer token to outgoing requests.
- Handles token refresh logic to keep users authenticated, even if their token expires.
- Supports multiple storage options for tokens: localStorage, sessionStorage, and cookies.

## Installation

You can install the module via npm or yarn or pnpm:

```bash
npm install em-interceptor
```

or

```bash
yarn add em-interceptor
```

or

```bash
pnpm install em-interceptor
```

### InterceptorOptions API

```typescript
interface InterceptorOptions {
    storageType: "localStorage" | "sessionStorage" | "cookies";
    tokenKey: string;
}
```

- `storageType`: Specifies the type of storage to use for storing tokens. Options are "localStorage", "sessionStorage", or "cookies".
- `tokenKey`: Specifies the key under which the token is stored in the chosen storage type.

## Usage

1. Import the `Interceptor` function from the module `(typescript)`:

```typescript
import Interceptor, { InterceptorOptions } from "em-interceptor";
```

2. Configure the interceptor by passing an `InterceptorOptions` object:

```typescript
const options: InterceptorOptions = {
  storageType: "localStorage",
  tokenKey: "access_token",
};

Interceptor(options);
```

3. Use Axios as usual in your application. The interceptor will automatically handle token management for you.

## Configuration Options

- `storageType`: Specifies the type of storage to use for storing tokens. Options are "localStorage", "sessionStorage", or "cookies".
- `tokenKey`: Specifies the key under which the token is stored in the chosen storage type.

## Customization

You can customize the behavior of the interceptor by modifying the provided options or extending the interceptor functions (`requestInterceptor` and `responseInterceptor`).

### Issues and Contributions

Issues and contributions are welcome! Please feel free to open issues or submit pull requests to enhance the functionality or address any bugs.

## License

This module is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
