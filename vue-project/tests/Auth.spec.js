import { mount } from '@vue/test-utils'
import { describe,it,expect } from 'vitest'
import Auth from '../src/components/Auth.vue'

describe('Auth', () => {

  it('компонент отображается', () => {
    const wrapper = mount(Auth)
    expect(wrapper.exists()).toBe(true)
  })

  it('есть email', () => {
    const wrapper = mount(Auth)
    expect(
      wrapper.find('input[type="email"]').exists()
    ).toBe(true)
  })

  it('есть пароль', () => {
    const wrapper = mount(Auth)
    expect(
      wrapper.find('input[type="password"]').exists()
    ).toBe(true)
  })

  it('есть кнопка входа', () => {
    const wrapper = mount(Auth)
    expect(wrapper.text()).toContain('Войти')
  })

  it('есть google вход', () => {
    const wrapper = mount(Auth)
    expect(wrapper.text()).toContain('Google')
  })

})