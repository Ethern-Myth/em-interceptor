import axios, {
	AxiosRequestConfig,
	AxiosError,
	AxiosResponse,
	InternalAxiosRequestConfig,
} from "axios";

interface InterceptorOptions {
	storageType: "localStorage" | "sessionStorage" | "cookies";
	tokenKey: string;
}

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
	_retry?: boolean;
}

const getToken = (options: InterceptorOptions): string | null => {
	const { storageType, tokenKey } = options;
	if (storageType === "cookies") {
		// Retrieve token from cookies
		return getCookie(tokenKey);
	} else {
		// Retrieve token from localStorage or sessionStorage
		const storage = globalThis.window[storageType];
		return storage.getItem(tokenKey);
	}
};

const refreshToken = async (
	refreshToken: string,
	refreshUrl: string = "/auth/token"
): Promise<string> => {
	try {
		const response = await axios.post(refreshUrl, {
			refresh_token: refreshToken,
		});
		if (response.status === 201) {
			return response.data.token; // Assuming token is returned in the response data
		}
		throw new Error("Failed to refresh token");
	} catch (error) {
		throw new Error("Failed to refresh token");
	}
};

const getCookie = (name: string): string | null => {
	const value = `; ${document.cookie}`;
	const parts = value.split(`; ${name}=`);
	if (parts.length === 2) {
		return parts.pop()?.split(";").shift() || null;
	}
	return null;
};

type RequestInterceptor = (
	config: InternalAxiosRequestConfig<any>
) => InternalAxiosRequestConfig<any> | Promise<InternalAxiosRequestConfig<any>>;

type ResponseInterceptor = (
	error: AxiosError<any>
) => Promise<AxiosResponse<any>>;

export default function Interceptor(options: InterceptorOptions) {
	// Request interceptor
	const requestInterceptor: RequestInterceptor = async (
		config: InternalAxiosRequestConfig<any>
	) => {
		const token = getToken(options);
		if (token) {
			config.headers["Authorization"] = `Bearer ${token}`;
		} else {
			config.headers["Content-Type"] = "application/json";
		}
		return Promise.resolve(config);
	};

	// Response interceptor
	const responseInterceptor: ResponseInterceptor = async (error) => {
		const originalRequest = error.config as CustomAxiosRequestConfig;

		if (
			error.response?.status === 401 &&
			originalRequest?.url === "/auth/token"
		) {
			// Avoid infinite loop by redirecting to unauthorized route
			return Promise.reject(error);
		}

		if (error.response?.status === 401 && !originalRequest?._retry) {
			// Refresh the auth token
			originalRequest._retry = true;
			const refreshTokenKey = "xxxxxxx"; // Replace with actual refresh token key
			const refreshTokenValue = getToken({
				...options,
				tokenKey: refreshTokenKey,
			});

			if (refreshTokenValue) {
				try {
					const newToken = await refreshToken(refreshTokenValue);
					const storage =
						globalThis.window[options.storageType as keyof WindowLocalStorage];
					storage.setItem(options.tokenKey, newToken);
					return axios(originalRequest);
				} catch (refreshError) {
					return Promise.reject(refreshError);
				}
			} else {
				// No refresh token available
				return Promise.reject(error);
			}
		}

		return Promise.reject(error);
	};

	// Add interceptors
	axios.interceptors.request.use(requestInterceptor);
	axios.interceptors.response.use(undefined, responseInterceptor);
}
