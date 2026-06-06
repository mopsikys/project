import { mount } from '@vue/test-utils'
import { describe,it,expect } from 'vitest'
import Sidebar from '../src/components/Sidebar.vue'

describe('Sidebar', () => {

  it('отображается', () => {
    const wrapper = mount(Sidebar)
    expect(wrapper.exists()).toBe(true)
  })

  it('бургер существует', () => {
    const wrapper = mount(Sidebar)
    expect(
      wrapper.find('.sidebar__burger').exists()
    ).toBe(true)
  })

  it('меню открывается', async () => {
    const wrapper = mount(Sidebar)

    await wrapper.vm.toggle()

    expect(wrapper.vm.isOpen).toBe(true)
  })

})