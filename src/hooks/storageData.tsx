import React, {
	useContext,
	createContext,
	useState,
	useEffect,
	ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

import AppInfo from "../../app.json";

interface StorageDataProps {
	children: ReactNode;
}

export interface myFormData {
	title: string;
	email: string;
	password: string;
}

export interface LoginData extends myFormData {
	id: string;
}

interface IStorageData {
	storageThisLoginData(loginData: LoginData): Promise<void>;
	isLoadingStoragedLoginsData: boolean;
	clearAllLoginData(): Promise<void>;
	allLoginsData: LoginData[];
}

const StorageDataContext = createContext({} as IStorageData);
const loginDataKey = "@" + AppInfo.name + ":" + "logins";

function StorageData({ children }: StorageDataProps) {
	const [allLoginsData, setAllLoginsData] = useState<LoginData[]>(
		[] as LoginData[]
	);
	const [isLoadingStoragedLoginsData, setIsLoadingStoragedLoginsData] =
		useState(true);

	async function clearAllLoginData() {
		try {
			await AsyncStorage.removeItem(loginDataKey);
			setAllLoginsData((_oldValue) => []);
			console.info("Cleared all login data!");
		} catch (error) {
			console.error(error);
			Alert.alert("Erro: incapaz de apagar os dados do dispositivo!");
		}
	}

	async function storageThisLoginData(loginData: LoginData) {
		// Assuming loginData is already valid
		try {
			//console.log("allLoginsData", allLoginsData);
			const newData = [...allLoginsData, loginData];
			await AsyncStorage.setItem(loginDataKey, JSON.stringify(newData));
			setAllLoginsData(newData);
			//console.log(newData);
		} catch (error) {
			console.error(error);
		}
	}

	useEffect(() => {
		(async function loadAllStoragedLoginData() {
			try {
				const result = await AsyncStorage.getItem(loginDataKey);
				const data: LoginData[] = result ? JSON.parse(result) : [];

				setAllLoginsData((_oldValue) => data);
				//console.log("Peguei todos os dados armaxenados:", data);
			} catch (error) {
				console.error(error);
				Alert.alert("Erro: incapaz de pegar os dados do dispositivo!");
			}

			setIsLoadingStoragedLoginsData((_oldValue) => false);
		})();
	}, []);

	return (
		<StorageDataContext.Provider
			value={{
				isLoadingStoragedLoginsData,
				storageThisLoginData,
				clearAllLoginData,
				allLoginsData,
			}}
		>
			{children}
		</StorageDataContext.Provider>
	);
}

function useStorageData() {
	return useContext(StorageDataContext);
}

export { useStorageData, StorageData };
