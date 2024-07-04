<script setup lang="ts">
  import { reactive, ref } from 'vue';
  import axios from "axios";
  const singupForm = reactive({
    isPassenger: false,
    isDriver: false,
    name: "",
    email: "",
    cpf: "",
    password: "",
    confirmPassword: "",
    step: 1,
    error: "",
    success: ""
  });

  function calculateProgress() {
    let progress = 0;
    if (singupForm.isPassenger) {
      progress += 25;
    }
    if (singupForm.name) {
      progress += 15;
    }
    if (singupForm.email) {
      progress += 15;
    }
    if (singupForm.cpf) {
      progress += 15;
    }
    if (singupForm.password) {
      progress += 15;
    }
    if (singupForm.confirmPassword) {
      progress += 15;
    }
    return progress;
  }

  function valdiate() {
    singupForm.error = "";
    if (singupForm.step === 1) {
      if (!singupForm.isPassenger && !singupForm.isDriver) {
        singupForm.error = "Seleciona um tipo de conta: passageiro ou motorista ou ambos";
        return false;
      }
    }
    if (singupForm.step === 2) {
      if (!singupForm.name) {
        singupForm.error = "Digite o nome";
        return false;
      }
      if (!singupForm.email) {
        singupForm.error = "Digite o email";
        return false;
      }
      if (!singupForm.cpf) {
        singupForm.error = "Digite o cpf";
        return false;
      }
    }
    if (singupForm.step === 3) {
      if (!singupForm.password) {
        singupForm.error = "A senha não pode ser vazia";
        return false;
      }
      if (singupForm.password !== singupForm.confirmPassword) {
        singupForm.error = "A senha e a confirmação de senha precisam ser iguais";
        return false;
      }
    }

    return true;
  }

  function next() {
    if (valdiate())
      singupForm.step++;
  }

  function showNext() {
    return singupForm.step < 3;
  }

  async function submit() {
    if (valdiate()) {
      const input = {
        isPassenger: singupForm.isPassenger,
        name: singupForm.name,
        email: singupForm.email,
        cpf: singupForm.cpf
      };
      const response = await axios.post("http://localhost:3001/signup", input);
      const output = response.data;
      singupForm.success = "Conta criada com sucesso!";
    }
  }

  function showSubmit() {
    return singupForm.step === 3;
  }

  function setDate(){
    singupForm.cpf = "97456321558"
  }
</script>

<template>
  <span class="step" @click="setData()">Passo {{singupForm.step}}</span>
  <br>
  <span class="progress">{{ calculateProgress() }}%</span>
  <br>
  <span class="error">{{singupForm.error}}</span>
  <br>
  <span class="success">{{singupForm.success}}</span>
  <br>
  <div v-if="singupForm.step == 1">
    <input class="input-is-passenger" type="checkbox" v-model="singupForm.isPassenger"> Passenger
    <br>
  </div>
  <div v-if="singupForm.step == 2">
    <input class="input-name" type="text" v-model="singupForm.name" placeholder="Nome">
    <br>
    <input class="input-email" type="text" v-model="singupForm.email" placeholder="Email">
    <br>
    <input class="input-cpf" type="text" v-model="singupForm.cpf" placeholder="CPF">
    <br>
  </div>
  <br>
  <div v-if="singupForm.step === 3">
    <input class="input-password" type="text" v-model="singupForm.password" placeholder="Password">
    <br>
    <input class="input-confirm-password" type="text" v-model="singupForm.confirmPassword"
      placeholder="Confirm Password">
    <br>
  </div>
  <button v-if="showNext()" class="button-next" @click="next()">Próximo</button>
  <button v-if="showSubmit()" class="button-submit" @click="submit()">Confirmar</button>
</template>

<style scoped>
</style>