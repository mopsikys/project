import { mount } from "@vue/test-utils";
import { describe,it,expect } from "vitest";
import AdminConsole from "../src/pages/AdminConsole.vue";

describe("AdminConsole",()=>{

  it("админ панель отображается",()=>{
    const wrapper = mount(AdminConsole);

    expect(wrapper.exists()).toBe(true);
  });

  it("есть форма добавления товара",()=>{
    const wrapper = mount(AdminConsole);

    expect(wrapper.find("form").exists()).toBe(true);
  });

  it("есть кнопка добавить",()=>{
    const wrapper = mount(AdminConsole);

    expect(wrapper.text()).toContain("Добавить");
  });

});