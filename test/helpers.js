export const forCondition = async (condition, wrapper) => {
  while (!condition()) {
    await new Promise(resolve => setTimeout(resolve, 1))
    wrapper.update()
  }
}
