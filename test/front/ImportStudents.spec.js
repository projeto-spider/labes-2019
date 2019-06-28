import { mount } from '@vue/test-utils'
import ImportStudents from '@/components/ImportStudents.vue'

describe('ImportStudents', () => {
  test('is a Vue instance', () => {
    const wrapper = mount(ImportStudents)
    expect(wrapper.isVueInstance()).toBeTruthy()
  })
})
