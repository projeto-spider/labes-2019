import { mount } from '@vue/test-utils'
import Login from '@/pages/Login.vue'

describe('ImportStudents', () => {
  test('is a Vue instance', () => {
    const wrapper = mount(Login)
    expect(wrapper.isVueInstance()).toBeTruthy()
  })
})
