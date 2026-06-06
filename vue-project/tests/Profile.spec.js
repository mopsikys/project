import { mount } from "@vue/test-utils";
import { describe,it,expect } from "vitest";
import Profile from "../src/pages/Profile.vue";

describe("Profile",()=>{

  it("страница загружается",()=>{
    const wrapper = mount(Profile);

    expect(wrapper.exists()).toBe(true);
  });

  it("форма профиля отображается",()=>{
    const wrapper = mount(Profile);

    expect(wrapper.find("form").exists()).toBe(true);
  });

  it("есть кнопка сохранения",()=>{
    const wrapper = mount(Profile);

    expect(wrapper.text()).toContain("Сохранить");
  });

});