import React, { useEffect, useState } from "react";

import { LoginData, useStorageData } from "../../hooks/storageData";
import { LoginDataItem } from "../../components/LoginDataItem";
import { SearchBar } from "../../components/SearchBar";

import {
	Container,
	LoginList,
	EmptyListContainer,
	EmptyListMessage,
} from "./styles";

export function Home() {
	const { allLoginsData } = useStorageData();
	const [searchListData, setSearchListData] =
		useState<LoginData[]>(allLoginsData);

	function handleFilterLoginData(search: string) {
		if (allLoginsData.length && search.length) {
			//console.log("Here");
			const match = new RegExp(search, "gi");
			const res = allLoginsData.filter((loginData) =>
				loginData.title.match(match)
			);
			console.log("Found results:", res);

			setSearchListData((_oldValue) => res);
		} else {
			//console.log("out");
			setSearchListData((_oldValue) => allLoginsData);
		}
	}

	useEffect(() => {
		handleFilterLoginData("");
		// console.log("searchListData:", searchListData);
		// console.log("allLoginsData:", allLoginsData);
	}, []);

	return (
		<Container>
			<SearchBar
				placeholder="Pesquise pelo nome do serviço"
				onChangeText={(search) => handleFilterLoginData(search)}
			/>

			<LoginList
				keyExtractor={(item: LoginData) => item.id}
				data={searchListData}
				ListEmptyComponent={
					<EmptyListContainer>
						<EmptyListMessage>Nenhum item a ser mostrado</EmptyListMessage>
					</EmptyListContainer>
				}
				renderItem={({ item }) => (
					<LoginDataItem
						title={item.title}
						email={item.email}
						password={item.password}
					/>
				)}
			/>
		</Container>
	);
}
