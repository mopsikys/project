import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import ProductCard from '../src/components/ProductCard.vue'

describe('ProductCard', () => {

  const product = {
    title: 'Кованый меч',
    description: 'Описание',
    material: 'Сталь',
    price: 50000,
    image: 'image.jpg'
  }

  it('компонент существует', () => {
    const wrapper = mount(ProductCard,{props:product})
    expect(wrapper.exists()).toBe(true)
  })

  it('отображает название', () => {
    const wrapper = mount(ProductCard,{props:product})
    expect(wrapper.text()).toContain('Кованый меч')
  })

  it('отображает описание', () => {
    const wrapper = mount(ProductCard,{props:product})
    expect(wrapper.text()).toContain('Описание')
  })

  it('отображает материал', () => {
    const wrapper = mount(ProductCard,{props:product})
    expect(wrapper.text()).toContain('Сталь')
  })

  it('отображает цену', () => {
    const wrapper = mount(ProductCard,{props:product})
    expect(wrapper.text()).toContain('50000')
  })

  it('есть изображение', () => {
    const wrapper = mount(ProductCard,{props:product})
    expect(wrapper.find('img').exists()).toBe(true)
  })

  it('кнопка заказа работает', async () => {
    const wrapper = mount(ProductCard,{props:product})

    const button = wrapper.find('button')

    await button.trigger('click')

    expect(wrapper.emitted()).toHaveProperty('order')
  })

})