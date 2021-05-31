import React, { useState, useCallback, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { LoginDataItem } from "../../components/LoginDataItem";
import { SearchBar } from "../../components/SearchBar";

import AppInfo from "../../../app.json";

import {
	Container,
	LoginList,
	EmptyListContainer,
	EmptyListMessage,
} from "./styles";

interface LoginDataProps {
	id: string;
	title: string;
	email: string;
	password: string;
}

type LoginListDataProps = LoginDataProps[];

export const key = "@" + AppInfo.name + ":";
export const loginKey = key + "logins";

export function Home() {
	const [searchListData, setSearchListData] = useState<LoginListDataProps>([]);
	const [data, setData] = useState<LoginListDataProps>([]);

	async function loadData() {
		const result = await AsyncStorage.getItem(loginKey);
		const data: LoginListDataProps = result ? JSON.parse(result) : [];

		setSearchListData(data);
		setData(data);
	}

	useFocusEffect(
		useCallback(() => {
			loadData();
		}, [])
	);

	function handleFilterLoginData(search: string) {
		//console.log("handleFilterLoginData |> data:", data);
		if (data.length) {
			const match = new RegExp(search, "gi");
			const res = data.filter((loginData) => loginData.title.match(match));
			//console.log("Found results:", res);

			setSearchListData(res);
		}
	}

	return (
		<Container>
			<SearchBar
				placeholder="Pesquise pelo nome do serviço"
				onChangeText={(value) => handleFilterLoginData(value)}
			/>

			<LoginList
				keyExtractor={(item) => item.id}
				data={searchListData}
				ListEmptyComponent={
					<EmptyListContainer>
						<EmptyListMessage>Nenhum item a ser mostrado</EmptyListMessage>
					</EmptyListContainer>
				}
				renderItem={({ item: loginData }) => {
					return (
						<LoginDataItem
							title={loginData.title}
							email={loginData.email}
							password={loginData.password}
						/>
					);
				}}
			/>
		</Container>
	);
}
