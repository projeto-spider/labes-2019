<template>
  <section class="container has-text-centered">
    <img src="../assets/images/UFPA.png" width="300" height="300" />
    <p class="title">Implementado pela Turma de 2016</p>
    <br />
    <p class="subtitle">Equipe de Implementação</p>
    <p>URIEL FERREIRA CAMPOS</p>
    <p>JOÃO DE DEUS FERREIRA FILHO</p>
    <p>LUCAS GABRIEL DE SOUZA</p>
    <p>GUILHERME SMETHURST ALBUQUERQUE</p>
    <p>DANIEL SANTOS SANTANA</p>
    <p>JAIRO NASCIMENTO DE SOUSA FILHO</p>
    <p>TEOIAN GIOVANE COSTA QUARESMA</p>
    <p>ANDRÉ MIRANDA PINHEIRO</p>
    <br />
    <p class="subtitle">Equipe de Gerência</p>
    <p>GABRIEL BELTRAO DE ABREU</p>
    <p>JOÃO PEDRO MOREIRA MORAES</p>
    <p>KELLY DO SOCORRO SILVA DA COSTA</p>
    <br />
    <p class="subtitle">Equipe de Arquitetura</p>
    <p>ABNER CARDOSO DA SILVA</p>
    <p>ANDRE MIRANDA PINHEIRO</p>
    <p>ERLON FONSECA PINHEIRO</p>
    <p>FELIPE GUSMAO ARAUJO</p>
    <p>JOSIANE DE OLIVEIRA COELHO</p>
    <br />
    <p class="subtitle">Equipe de Análise de requisitos</p>
    <p>AUGUSTO FARIAS CRAVO</p>
    <p>CAIO SHIMADA RABELLO</p>
    <p>DANIELA KARINE MARAVALHO AVELAR</p>
    <p>IAN CAMPOS BEZERRA REGO</p>
    <p>JAIRO NASCIMENTO DE SOUSA FILHO</p>
    <p>JOÃO MARCELO SILVA DE OLIVEIRA</p>
    <br />
    <p class="subtitle">Equipe de Teste</p>
    <p>RAFAEL NASCIMENTO DE SOUSA</p>
    <p>ANA ISABELA MANITO RAMOS</p>
    <p>LUCAS FELIPE FERRARO CARDOSO</p>
    <p>CARLOS HENRIQUE RIBEIRO CARDOSO</p>
  </section>
</template>

<script>
export default {
  middleware: 'auth',
  head() {
    return {
      title: 'Home'
    }
  }
}
</script>

<style scoped>
.title {
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
