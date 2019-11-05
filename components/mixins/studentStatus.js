export const studentStatus = {
  methods: {
    getStatus({
      isActive,
      isConcluding,
      isGraduating,
      isForming,
      isFit,
      cancelled
    }) {
      if (isConcluding) return 'Concluinte'
      if (isForming) return 'Formando'
      if (isGraduating) return isFit ? 'Graduando Apto' : 'Graduando Não Apto'
      if (isActive) return 'Ativo'
      if (cancelled) return 'Cancelado'
      return 'Desconhecido'
    }
  }
}
