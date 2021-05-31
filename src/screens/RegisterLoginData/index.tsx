import React from "react";
import { Alert, Keyboard, KeyboardAvoidingView, Platform } from "react-native";
import { yupResolver } from "@hookform/resolvers/yup";
import { RFValue } from "react-native-responsive-fontsize";
import { useForm } from "react-hook-form";
import AsyncStorage from "@react-native-async-storage/async-storage";
import uuid from "react-native-uuid";
import * as Yup from "yup";
import {
	ScrollView,
	TouchableWithoutFeedback,
} from "react-native-gesture-handler";

import { Button } from "../../components/Form/Button";
import { Input } from "../../components/Form/Input";
import { loginKey } from "../Home";

import { Container, HeaderTitle, Form } from "./styles";

interface FormData {
  title: string;
  email: string;
  password: string;
}

const schema = Yup.object().shape({
	title: Yup.string().required("Título é obrigatório!"),
	email: Yup.string()
		.email("Não é um email válido")
		.required("Email é obrigatório!"),
	password: Yup.string().required("Senha é obrigatória!"),
});

async function clearDataFromAsyncStorage(key: string) {
	const data = await AsyncStorage.removeItem(key);
	console.log("Cleared transaction data:", data);
}

export function RegisterLoginData() {
	const clearAllTransactionData = false;
	if (clearAllTransactionData) clearDataFromAsyncStorage(loginKey);
  const {
    control,
    handleSubmit,
    reset,
		formState: { errors },
	} = useForm({ resolver: yupResolver(schema) });

  async function handleRegister(formData: FormData) {
    const newLoginData = {
      id: String(uuid.v4()),
			...formData,
		};

		try {
			const res = await AsyncStorage.getItem(loginKey);
			const oldData: FormData[] = res ? JSON.parse(res) : [];
			const newData = [...oldData, newLoginData];

			await AsyncStorage.setItem(loginKey, JSON.stringify(newData));

			reset();
		} catch (error) {
			console.error(error);
			Alert.alert("Não foi possível armazenar no seu dispositivo!");
		}
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
