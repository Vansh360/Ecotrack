/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

function readSession() {
	const token = localStorage.getItem("token");
	const user = localStorage.getItem("user");

	if (!token) return { token: null, user: null };

	try {
		const encodedPayload = token.split(".")[1]
			.replace(/-/g, "+")
			.replace(/_/g, "/");
		const paddedPayload = encodedPayload.padEnd(
			encodedPayload.length + ((4 - (encodedPayload.length % 4)) % 4),
			"="
		);
		const payload = JSON.parse(atob(paddedPayload));
		if (payload.exp && payload.exp * 1000 <= Date.now()) {
			localStorage.removeItem("token");
			localStorage.removeItem("user");
			return { token: null, user: null };
		}
	} catch {
		localStorage.removeItem("token");
		localStorage.removeItem("user");
		return { token: null, user: null };
	}

	let parsedUser = null;
	try {
		parsedUser = user ? JSON.parse(user) : null;
	} catch {
		localStorage.removeItem("user");
	}

	return { token, user: parsedUser };
}

export function AuthProvider({ children }) {
	const [session, setSessionState] = useState(readSession);

	const setSession = (nextSession) => {
		const { token, user } = nextSession;
		if (!token) throw new Error("A valid session token is required.");

		localStorage.setItem("token", token);
		localStorage.setItem("user", JSON.stringify(user || {}));
		setSessionState({ token, user: user || {} });
		window.dispatchEvent(new Event("ecotrack:login"));
	};

	const logout = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("user");
		setSessionState({ token: null, user: null });
		window.dispatchEvent(new Event("ecotrack:logout"));
	};

	const value = useMemo(
		() => ({
			token: session.token,
			user: session.user,
			isAuthenticated: Boolean(session.token),
			setSession,
			logout,
		}),
		[session]
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (!context) throw new Error("useAuth must be used inside AuthProvider");
	return context;
}
