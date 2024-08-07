import { mount } from "@vue/test-utils";
import { expect, test } from 'vitest'
import App from '../src/App.vue';

function sleep(time: number) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true)
        }, time);
    });
}

test("Deve criar a conta de um passgeiro por meio do wizard", async function () {
    const wrapper = mount(App, {});
    expect(wrapper.get(".step").text()).toBe("Passo 1");
    expect(wrapper.get(".progress").text()).toBe("0%");
    await wrapper.get('.input-is-passenger').setValue(true);
    expect(wrapper.find(".input-name").exists()).toBe(false);
    expect(wrapper.find(".input-email").exists()).toBe(false);
    expect(wrapper.find(".input-cpf").exists()).toBe(false);
    // não deveria exibir nome, email e cpf em tela
    expect(wrapper.get(".progress").text()).toBe("25%");
    await wrapper.get(".button-next").trigger("click");
    expect(wrapper.get(".step").text()).toBe("Passo 2");
    await wrapper.get(".input-name").setValue("John Doe");
    expect(wrapper.get(".progress").text()).toBe("40%");
    await wrapper.get(".input-email").setValue(`john.doe${Math.random()}@gmail.com`);
    expect(wrapper.get(".progress").text()).toBe("55%");
    await wrapper.get(".input-cpf").setValue(`97456321558`);
    expect(wrapper.get(".progress").text()).toBe("70%");
    expect(wrapper.find(".input-is-passenger").exists()).toBe(false);
    await wrapper.get(".button-next").trigger("click");
    expect(wrapper.get(".step").text()).toBe("Passo 3");
    expect(wrapper.find(".input-name").exists()).toBe(false);
    expect(wrapper.find(".input-email").exists()).toBe(false);
    expect(wrapper.find(".input-cpf").exists()).toBe(false);
    expect(wrapper.find(".input-is-passenger").exists()).toBe(false);
    await wrapper.get(".input-password").setValue("12345678");
    expect(wrapper.get(".progress").text()).toBe("85%");
    await wrapper.get(".input-confirm-password").setValue("12345678");
    expect(wrapper.get(".progress").text()).toBe("100%");
    expect(wrapper.find(".button-next").exists()).toBe(false);
    await wrapper.get(".button-submit").trigger("click");
    await sleep(200);
    expect(wrapper.get(".success").text()).toBe("Conta criada com sucesso!")
});

test("Deve mostrar uma mensagem de erro a tentar ir para o passo 2 caso nenhum tipo de conta tenha sido selecionado", async function () {
    const wrapper = mount(App, {});
    await wrapper.get(".button-next").trigger("click");
    expect(wrapper.get(".step").text()).toBe("Passo 1");
    expect(wrapper.get(".error").text()).toBe("Seleciona um tipo de conta: passageiro ou motorista ou ambos");
});

test("Deve uma mensagem de erro ao tentar ir para o passo 3 caso nome, email e cpf não sejam informados", async function () {
    const wrapper = mount(App, {});
    await wrapper.get('.input-is-passenger').setValue(true);
    await wrapper.get(".button-next").trigger("click");
    await wrapper.get(".button-next").trigger("click");
    expect(wrapper.get(".step").text()).toBe("Passo 2");
    expect(wrapper.get(".error").text()).toBe("Digite o nome");
    await wrapper.get(".input-name").setValue("John Doe");
    await wrapper.get(".button-next").trigger("click");
    expect(wrapper.get(".step").text()).toBe("Passo 2");
    await wrapper.get(".button-next").trigger("click");
    expect(wrapper.get(".error").text()).toBe("Digite o email");
    await wrapper.get(".input-email").setValue(`john.doe${Math.random()}@gmail.com`);
    await wrapper.get(".button-next").trigger("click");
    expect(wrapper.get(".error").text()).toBe("Digite o cpf");
});


test("Deve mostrar uma mensagem de error ao tentar submeter com a senha vazia", async function () {
    const wrapper = mount(App, {});
    await wrapper.get('.input-is-passenger').setValue(true);
    await wrapper.get(".button-next").trigger("click");
    await wrapper.get(".input-name").setValue("John Doe");
    await wrapper.get(".input-email").setValue(`john.doe${Math.random()}@gmail.com`);
    await wrapper.get(".input-cpf").setValue(`97456321558`);
    await wrapper.get(".button-next").trigger("click");
    await wrapper.get(".input-password").setValue("");
    await wrapper.get(".input-confirm-password").setValue("");
    await wrapper.get(".button-submit").trigger("click");
    expect(wrapper.get(".step").text()).toBe("Passo 3");
    expect(wrapper.get(".error").text()).toBe("A senha não pode ser vazia");
});

test("Deve mostrar uma mensagem de error ao tentar submeter sem que a senha esteja igual", async function () {
    const wrapper = mount(App, {});
    await wrapper.get('.input-is-passenger').setValue(true);
    await wrapper.get(".button-next").trigger("click");
    await wrapper.get(".input-name").setValue("John Doe");
    await wrapper.get(".input-email").setValue(`john.doe${Math.random()}@gmail.com`);
    await wrapper.get(".input-cpf").setValue(`97456321558`);
    await wrapper.get(".button-next").trigger("click");
    await wrapper.get(".input-password").setValue("12345678");
    await wrapper.get(".input-confirm-password").setValue("");
    await wrapper.get(".button-submit").trigger("click");
    expect(wrapper.get(".step").text()).toBe("Passo 3");
    expect(wrapper.get(".error").text()).toBe("A senha e a confirmação de senha precisam ser iguais");
});