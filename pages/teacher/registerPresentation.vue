<template>
  <div class="container">
    <section class="section">
      <h1 class="title">Formulario para defesa de TCC</h1>
      <div class="box">
        <h2 class="subtitle">Dados da defesa:</h2>
        <div class="field">
          <label class="label">Curso</label>
          <div class="control">
            <input class="input" type="text" />
          </div>
        </div>
        <label class="label">Matricula</label>
        <div class="field has-addons">
          <div class="control is-expanded">
            <input class="input" type="text" />
          </div>
          <div class="control">
            <button class="button is-primary">Adicionar</button>
          </div>
        </div>
        <label class="label">Aluno</label>
        <div class="field has-addons">
          <div class="control is-expanded">
            <input class="input" type="text" />
          </div>
          <div class="control">
            <button class="button is-primary">Adicionar</button>
          </div>
        </div>
        <div class="field">
          <label class="label">Local</label>
          <div class="control">
            <input class="input" type="text" />
          </div>
        </div>
        <div class="field">
          <label class="label">Data</label>
          <div class="control">
            <input class="input" type="date" />
          </div>
        </div>
        <div class="field">
          <label class="label">Curso</label>
          <div class="control">
            <input class="input" type="text" />
          </div>
        </div>
        <div class="field">
          <label class="label">Hora de inicio</label>
          <div class="control">
            <input class="input" type="text" />
          </div>
        </div>
        <div class="field">
          <label class="label">Palavras-chave</label>
          <div class="control">
            <input class="input" type="text" />
          </div>
        </div>
        <div class="field">
          <label class="label">Resumo</label>
          <div class="control">
            <textarea
              class="textarea"
              placeholder="e.g. Hello world"
            ></textarea>
          </div>
        </div>
        <h2 class="subtitle">Banco examinadora:</h2>
        <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label class="label">Orientador(a)</label>
          </div>
          <div class="field-body">
            <div class="field">
              <div class="control">
                <input class="input" type="text" />
              </div>
            </div>
            <div class="field">
              <div class="control">
                <div class="select">
                  <select>
                    <option selected disabled>Selecione Titulo</option>
                    <option>Doutor</option>
                    <option>Mestre</option>
                  </select>
                </div>
                <div class="select">
                  <select>
                    <option selected disabled>Selecione tipo</option>
                    <option>Membro Externo</option>
                    <option>Membro Interno</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label class="label">Coorientador(a)</label>
          </div>
          <div class="field-body">
            <div class="field">
              <div class="control">
                <input class="input" type="text" />
              </div>
            </div>
            <div class="field">
              <div class="control">
                <div class="select">
                  <select>
                    <option selected disabled>Selecione Titulo</option>
                    <option>Doutor</option>
                    <option>Mestre</option>
                  </select>
                </div>
                <div class="select">
                  <select>
                    <option selected disabled>Selecione tipo</option>
                    <option>Membro Externo</option>
                    <option>Membro Interno</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label class="label">Avaliador 1</label>
          </div>
          <div class="field-body">
            <div class="field">
              <div class="control">
                <input class="input" type="text" />
              </div>
            </div>
            <div class="field">
              <div class="control">
                <div class="select">
                  <select>
                    <option selected disabled>Selecione Titulo</option>
                    <option>Doutor</option>
                    <option>Mestre</option>
                  </select>
                </div>
                <div class="select">
                  <select>
                    <option selected disabled>Selecione tipo</option>
                    <option>Membro Externo</option>
                    <option>Membro Interno</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label class="label">Avaliador 2</label>
          </div>
          <div class="field-body">
            <div class="field">
              <div class="control">
                <input class="input" type="text" />
              </div>
            </div>
            <div class="field">
              <div class="control">
                <div class="select">
                  <select>
                    <option selected disabled>Selecione Titulo</option>
                    <option>Doutor</option>
                    <option>Mestre</option>
                  </select>
                </div>
                <div class="select">
                  <select>
                    <option selected disabled>Selecione tipo</option>
                    <option>Membro Externo</option>
                    <option>Membro Interno</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label class="label">Avaliador 3</label>
          </div>
          <div class="field-body">
            <div class="field">
              <div class="control">
                <input class="input" type="text" />
              </div>
            </div>
            <div class="field">
              <div class="control">
                <div class="select">
                  <select>
                    <option selected disabled>Selecione Titulo</option>
                    <option>Doutor</option>
                    <option>Mestre</option>
                  </select>
                </div>
                <div class="select">
                  <select>
                    <option selected disabled>Selecione tipo</option>
                    <option>Membro Externo</option>
                    <option>Membro Interno</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="control">
          <button class="button is-primary">Enviar</button>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'RegisterPresentation',
  layout: 'defaultTeacher',
  middleware: ['course']
}
</script>

<style>
.container {
  height: 100vh;
}
</style>
