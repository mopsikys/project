import { mount } from "@vue/test-utils";
import { describe,it,expect } from "vitest";
import Products from "../src/pages/Products.vue";

describe("Products",()=>{

  it("страница существует",()=>{
    const wrapper = mount(Products);

    expect(wrapper.exists()).toBe(true);
  });

  it("отображается заголовок",()=>{
    const wrapper = mount(Products);

    expect(wrapper.text().length).toBeGreaterThan(0);
  });

  it("отображается список товаров",()=>{
    const wrapper = mount(Products);

    expect(wrapper.html()).toContain("product");
  });

});