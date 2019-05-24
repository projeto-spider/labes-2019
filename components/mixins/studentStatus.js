export const stuStatus = {
  methods: {
    getStatus(isActive, isConcluding, isGraduating, isForming, isFit) {
      if (isConcluding) return 'Concluinte'
      if (isForming) return 'Formando'
      if (isGraduating) return isFit ? 'Graduando Apto' : 'Graduando Não Apto'
      return isActive ? 'Ativo' : 'Desconhecido'
    }
  }
}
