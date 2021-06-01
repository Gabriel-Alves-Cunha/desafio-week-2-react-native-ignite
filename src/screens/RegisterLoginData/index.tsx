import React from "react";
import { Keyboard, KeyboardAvoidingView, Platform } from "react-native";
import { yupResolver } from "@hookform/resolvers/yup";
import { RFValue } from "react-native-responsive-fontsize";
import { useForm } from "react-hook-form";
import uuid from "react-native-uuid";
import * as Yup from "yup";
import {
	ScrollView,
	TouchableWithoutFeedback,
} from "react-native-gesture-handler";

import { LoginData, useStorageData, myFormData } from "../../hooks/storageData";
import { Container, HeaderTitle, Form } from "./styles";
import { Button } from "../../components/Form/Button";
import { Input } from "../../components/Form/Input";

const schema = Yup.object().shape({
	title: Yup.string().required("Título é obrigatório!"),
	email: Yup.string()
		.email("Não é um email válido")
		.required("Email é obrigatório!"),
	password: Yup.string().required("Senha é obrigatória!"),
});

export function RegisterLoginData() {
	const { storageThisLoginData } = useStorageData();
	const {
		control,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm({ resolver: yupResolver(schema) });

	async function handleRegister(formData: myFormData) {
		const newLoginData: LoginData = {
			id: String(uuid.v4()),
			...formData,
		};

		await storageThisLoginData(newLoginData);

		reset();
	}

	return (
		<KeyboardAvoidingView
			style={{ flex: 1 }}
			behavior={Platform.OS === "ios" ? "padding" : undefined}
		>
			<ScrollView showsVerticalScrollIndicator={false}>
				<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
					<Container>
						<HeaderTitle>Salve o login de algum serviço!</HeaderTitle>

						<Form>
							<Input
								title="Título"
								name="title"
								error={errors.title && errors.title.message}
								control={control}
								placeholder="Escreva o título aqui"
								autoCapitalize="sentences"
								autoCorrect
							/>
							<Input
								title="Email"
								name="email"
								error={errors.email && errors.email.message}
								control={control}
								placeholder="Escreva o Email aqui"
								autoCorrect={false}
								autoCapitalize="none"
								keyboardType="email-address"
							/>
							<Input
								title="Senha"
								name="password"
								error={errors.password && errors.password.message}
								control={control}
								secureTextEntry
								placeholder="Escreva a senha aqui"
							/>
							<Button
								style={{
									marginTop: RFValue(26),
									marginBottom: RFValue(40),
								}}
								title="Salvar"
								onPress={handleSubmit(handleRegister)}
							/>
						</Form>
					</Container>
				</TouchableWithoutFeedback>
			</ScrollView>
		</KeyboardAvoidingView>
	);
}
