import React from "react";
import { useStorageData, StorageData } from "./src/hooks/storageData";
import { NavigationContainer } from "@react-navigation/native";
import { ThemeProvider } from "styled-components";
import { AppRoutes } from "./src/routes/app.routes";
import { StatusBar } from "react-native";
import {
	useFonts,
	Poppins_400Regular,
	Poppins_500Medium,
} from "@expo-google-fonts/poppins";

import AppLoading from "expo-app-loading";

import { theme } from "./src/global/styles";

export default function App() {
	const [fontsLoaded, error] = useFonts({
		Poppins_400Regular,
		Poppins_500Medium,
	});
	const { isLoadingStoragedLoginsData } = useStorageData();

	if (!fontsLoaded || isLoadingStoragedLoginsData) {
		if (error) console.error(error);
		if (isLoadingStoragedLoginsData)
			console.info("Loading storaged logins data.");

		return <AppLoading />;
	}

	return (
		<NavigationContainer>
			<ThemeProvider theme={theme}>
				<StatusBar backgroundColor="#ccc" barStyle="light-content" />

				<StorageData>
					<AppRoutes />
				</StorageData>
			</ThemeProvider>
		</NavigationContainer>
	);
}
